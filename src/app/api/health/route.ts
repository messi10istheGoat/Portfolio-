import { sql } from "drizzle-orm";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/**
 * Health probe.
 *
 * Reports the database state without ever failing the whole deployment when a
 * database has not been provisioned (a static marketing site is still healthy).
 * Returns 200 when the mode is acceptable, 503 only when a database is
 * configured but unreachable.
 */
export async function GET() {
  const started = Date.now();

  if (!process.env.DATABASE_URL) {
    return Response.json(
      {
        ok: true,
        status: "degraded",
        database: "not-configured",
        message: "Running without a database. Contact form falls back to direct email.",
        uptimeMs: Math.round(process.uptime() * 1000),
      },
      { status: 200, headers: { "Cache-Control": "no-store" } },
    );
  }

  try {
    const { db } = await import("@/db");
    await db.execute(sql`select 1`);
    return Response.json(
      {
        ok: true,
        status: "healthy",
        database: "connected",
        latencyMs: Date.now() - started,
        uptimeMs: Math.round(process.uptime() * 1000),
      },
      { status: 200, headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    console.error("[health] database unreachable", error);
    return Response.json(
      { ok: false, status: "unhealthy", database: "unreachable" },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  }
}
