import { db } from "@/db";
import { contactMessages } from "@/db/schema";
import { desc, sql } from "drizzle-orm";

export const dynamic = "force-dynamic";

interface Payload {
  name?: unknown;
  email?: unknown;
  subject?: unknown;
  message?: unknown;
}

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const buckets = new Map<string, { count: number; reset: number }>();

function rateLimited(key: string): boolean {
  const now = Date.now();
  const bucket = buckets.get(key);
  if (!bucket || now > bucket.reset) {
    buckets.set(key, { count: 1, reset: now + 60_000 });
    return false;
  }
  bucket.count += 1;
  return bucket.count > 5;
}

function clean(value: unknown, max: number): string {
  if (typeof value !== "string") return "";
  return value.replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/g, "").trim().slice(0, max);
}

export async function POST(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for") ?? "local";
  const key = forwarded.split(",")[0]?.trim() || "local";
  if (rateLimited(key)) {
    return Response.json(
      { ok: false, message: "Too many messages. Please try again in a minute." },
      { status: 429 },
    );
  }

  let payload: Payload;
  try {
    payload = (await request.json()) as Payload;
  } catch {
    return Response.json({ ok: false, message: "Invalid request body." }, { status: 400 });
  }

  const name = clean(payload.name, 120);
  const email = clean(payload.email, 200).toLowerCase();
  const subject = clean(payload.subject, 180);
  const message = clean(payload.message, 5000);

  const errors: Record<string, string> = {};
  if (name.length < 2) errors.name = "Please enter your name (at least 2 characters).";
  if (!EMAIL.test(email)) errors.email = "Please enter a valid email address.";
  if (subject.length < 3) errors.subject = "Add a subject line (at least 3 characters).";
  if (message.length < 12) errors.message = "Tell me a little more — at least 12 characters.";

  if (Object.keys(errors).length > 0) {
    return Response.json({ ok: false, message: "Please fix the highlighted fields.", errors }, { status: 422 });
  }

  try {
    const [row] = await db
      .insert(contactMessages)
      .values({
        name,
        email,
        subject,
        message,
        source: "portfolio",
        userAgent: clean(request.headers.get("user-agent"), 400) || null,
      })
      .returning({ id: contactMessages.id, createdAt: contactMessages.createdAt });

    return Response.json(
      {
        ok: true,
        message: "Message received. I'll reply within two working days.",
        reference: `MSG-${String(row.id).padStart(5, "0")}`,
        receivedAt: row.createdAt,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("[contact] failed to persist message", error);
    return Response.json(
      { ok: false, message: "The message could not be saved right now. Email me directly instead." },
      { status: 500 },
    );
  }
}

export async function GET() {
  try {
    const [row] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(contactMessages);
    const recent = await db
      .select({ id: contactMessages.id, subject: contactMessages.subject, createdAt: contactMessages.createdAt })
      .from(contactMessages)
      .orderBy(desc(contactMessages.createdAt))
      .limit(1);

    return Response.json({
      ok: true,
      totalMessages: row?.count ?? 0,
      lastReceivedAt: recent[0]?.createdAt ?? null,
    });
  } catch {
    return Response.json({ ok: false }, { status: 500 });
  }
}
