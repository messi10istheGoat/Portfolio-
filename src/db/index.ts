import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

/**
 * Lazily-created database pool.
 *
 * The connection is only opened on first use, and a missing DATABASE_URL no
 * longer throws at import time — that used to crash the entire deployment
 * (including statically rendered pages) whenever a database was not
 * provisioned. Callers check `isDatabaseConfigured()` first.
 */

const databaseUrl = process.env.DATABASE_URL;

const globalForDb = globalThis as typeof globalThis & {
  __portfolioPool?: Pool;
};

export function isDatabaseConfigured(): boolean {
  return Boolean(databaseUrl);
}

export const pool =
  globalForDb.__portfolioPool ??
  (databaseUrl
    ? new Pool({
        connectionString: databaseUrl,
        max: Number(process.env.DATABASE_POOL_MAX ?? 10),
        idleTimeoutMillis: 30_000,
        connectionTimeoutMillis: 8_000,
        allowExitOnIdle: true,
      })
    : undefined);

if (process.env.NODE_ENV !== "production" && pool) {
  globalForDb.__portfolioPool = pool;
}

if (pool) {
  // Prevent an unhandled pool error from taking the process down.
  pool.on("error", (error) => {
    console.error("[db] idle client error", error);
  });
}

export const db = pool ? drizzle(pool) : (undefined as never);
