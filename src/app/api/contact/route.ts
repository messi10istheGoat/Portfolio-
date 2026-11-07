import { contactMessages } from "@/db/schema";
import { desc, sql } from "drizzle-orm";
import { profile } from "@/data/profile";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

interface Payload {
  name?: unknown;
  email?: unknown;
  subject?: unknown;
  message?: unknown;
  /** Honeypot field — real visitors never see or fill this. */
  website?: unknown;
  /** Milliseconds the form spent on screen before submission. */
  elapsed?: unknown;
}

type StorageMode = "database" | "webhook" | "unconfigured";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** How a submission is persisted, decided at request time (never at build time). */
function storageMode(): StorageMode {
  if (process.env.DATABASE_URL) return "database";
  if (process.env.CONTACT_WEBHOOK_URL) return "webhook";
  return "unconfigured";
}

/* ------------------------------------------------------------------ */
/* Rate limiting                                                       */
/* ------------------------------------------------------------------ */
/* A small in-memory sliding window. Good enough for a portfolio on a   */
/* single instance; a shared store (Redis/Upstash) can be dropped in    */
/* behind the same function signature.                                  */

const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 5;
const MAX_KEYS = 5_000;
const buckets = new Map<string, { count: number; reset: number }>();

function prune(now: number) {
  if (buckets.size < MAX_KEYS) return;
  for (const [key, bucket] of buckets) {
    if (now > bucket.reset) buckets.delete(key);
  }
  // Still oversized (traffic spike): drop the oldest entries.
  if (buckets.size >= MAX_KEYS) {
    const overflow = buckets.size - MAX_KEYS + 1;
    let removed = 0;
    for (const key of buckets.keys()) {
      buckets.delete(key);
      if (++removed >= overflow) break;
    }
  }
}

function rateLimited(key: string): boolean {
  const now = Date.now();
  prune(now);

  const bucket = buckets.get(key);
  if (!bucket || now > bucket.reset) {
    buckets.set(key, { count: 1, reset: now + WINDOW_MS });
    return false;
  }
  bucket.count += 1;
  return bucket.count > MAX_PER_WINDOW;
}

function clientKey(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  const real = request.headers.get("x-real-ip");
  const candidate = forwarded?.split(",")[0]?.trim() || real?.trim();
  return candidate && candidate.length <= 64 ? candidate : "unknown";
}

/* ------------------------------------------------------------------ */
/* Validation                                                          */
/* ------------------------------------------------------------------ */

function clean(value: unknown, max: number): string {
  if (typeof value !== "string") return "";
  return value
    .replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g, "")
    .replace(/\r\n/g, "\n")
    .trim()
    .slice(0, max);
}

export async function POST(request: Request) {
  const key = clientKey(request);
  if (rateLimited(key)) {
    return Response.json(
      { ok: false, message: "Too many messages from this connection. Try again in a minute." },
      { status: 429, headers: { "Retry-After": "60" } },
    );
  }

  const contentType = request.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) {
    return Response.json(
      { ok: false, message: "Expected a JSON body." },
      { status: 415 },
    );
  }

  let payload: Payload;
  try {
    const raw = await request.text();
    if (raw.length > 20_000) {
      return Response.json({ ok: false, message: "Payload too large." }, { status: 413 });
    }
    payload = JSON.parse(raw) as Payload;
  } catch {
    return Response.json({ ok: false, message: "Invalid request body." }, { status: 400 });
  }

  if (typeof payload !== "object" || payload === null) {
    return Response.json({ ok: false, message: "Invalid request body." }, { status: 400 });
  }

  // Honeypot + timing check: silently accept obvious bots so they do not retry.
  const honeypot = clean(payload.website, 200);
  const elapsed = typeof payload.elapsed === "number" ? payload.elapsed : Number(payload.elapsed);
  const tooFast = Number.isFinite(elapsed) && elapsed >= 0 && elapsed < 900;
  if (honeypot || tooFast) {
    return Response.json({ ok: true, message: "Message received.", reference: "MSG-00000" }, { status: 201 });
  }

  const name = clean(payload.name, 120);
  const email = clean(payload.email, 200).toLowerCase();
  const subject = clean(payload.subject, 180);
  const message = clean(payload.message, 5000);

  const errors: Record<string, string> = {};
  if (name.length < 2) errors.name = "Please enter your name (at least 2 characters).";
  if (name.length > 120) errors.name = "That name is longer than 120 characters.";
  if (!EMAIL.test(email)) errors.email = "Please enter a valid email address.";
  if (subject.length < 3) errors.subject = "Add a subject line (at least 3 characters).";
  if (message.length < 12) errors.message = "Tell me a little more — at least 12 characters.";

  if (Object.keys(errors).length > 0) {
    return Response.json(
      { ok: false, message: "Please fix the highlighted fields.", errors },
      { status: 422 },
    );
  }

  const mode = storageMode();
  const userAgent = clean(request.headers.get("user-agent"), 400) || null;

  if (mode === "unconfigured") {
    // Never pretend a message was stored when there is nowhere to store it.
    console.warn("[contact] received a message but no inbox is configured", { subject });
    return Response.json(
      {
        ok: false,
        code: "NO_INBOX",
        message: "This deployment has no inbox connected yet. Please email me directly instead.",
        fallbackEmail: profile.email,
      },
      { status: 503 },
    );
  }

  try {
    if (mode === "webhook") {
      const endpoint = process.env.CONTACT_WEBHOOK_URL as string;
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          subject,
          message,
          source: "portfolio",
          userAgent,
          receivedAt: new Date().toISOString(),
        }),
        signal: AbortSignal.timeout(8000),
      });
      if (!response.ok) throw new Error(`webhook responded ${response.status}`);

      return Response.json(
        {
          ok: true,
          message: "Message delivered. I'll reply within two working days.",
          reference: `MSG-${Date.now().toString(36).toUpperCase()}`,
          storage: "webhook",
        },
        { status: 201 },
      );
    }

    const { db } = await import("@/db");
    const [row] = await db
      .insert(contactMessages)
      .values({ name, email, subject, message, source: "portfolio", userAgent })
      .returning({ id: contactMessages.id, createdAt: contactMessages.createdAt });

    return Response.json(
      {
        ok: true,
        message: "Message received. I'll reply within two working days.",
        reference: `MSG-${String(row.id).padStart(5, "0")}`,
        receivedAt: row.createdAt,
        storage: "database",
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("[contact] failed to persist message", error);
    return Response.json(
      {
        ok: false,
        message: "The message could not be saved right now. Email me directly instead.",
        fallbackEmail: profile.email,
      },
      { status: 500 },
    );
  }
}

/**
 * Lightweight, privacy-safe status probe. It reports whether the endpoint is
 * accepting messages — never message contents or counts.
 */
export async function GET() {
  const mode = storageMode();
  return Response.json({
    ok: mode !== "unconfigured",
    accepting: mode !== "unconfigured",
    storage: mode,
  });
}

/**
 * Admin-only inbox summary. Guarded by CONTACT_ADMIN_TOKEN so visitor
 * metadata is never exposed publicly.
 */
export async function HEAD(request: Request) {
  const token = process.env.CONTACT_ADMIN_TOKEN;
  const provided = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  if (!token || provided !== token) return new Response(null, { status: 401 });

  try {
    const { db } = await import("@/db");
    const [row] = await db.select({ count: sql<number>`count(*)::int` }).from(contactMessages);
    const recent = await db
      .select({ id: contactMessages.id, createdAt: contactMessages.createdAt })
      .from(contactMessages)
      .orderBy(desc(contactMessages.createdAt))
      .limit(1);

    return new Response(null, {
      status: 200,
      headers: {
        "X-Message-Count": String(row?.count ?? 0),
        "X-Last-Received": recent[0]?.createdAt?.toISOString() ?? "never",
      },
    });
  } catch {
    return new Response(null, { status: 500 });
  }
}
