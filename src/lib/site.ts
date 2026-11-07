/**
 * Single source of truth for the public site URL.
 *
 * Resolution order:
 *   1. NEXT_PUBLIC_SITE_URL       — explicit override (custom domain, Vercel, …)
 *   2. VERCEL_PROJECT_PRODUCTION_URL — set automatically by Vercel
 *   3. GITHUB_PAGES origin        — used by the static-export deploy workflow
 *   4. localhost during development
 *
 * Every consumer (metadata, robots, sitemap, structured data, résumé) reads
 * from here so canonical URLs can never drift apart.
 */

function withProtocol(value: string): string {
  return /^https?:\/\//.test(value) ? value : `https://${value}`;
}

function resolve(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (explicit) return withProtocol(explicit).replace(/\/$/, "");

  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim();
  if (vercel) return withProtocol(vercel).replace(/\/$/, "");

  const pagesOrigin = process.env.NEXT_PUBLIC_PAGES_ORIGIN?.trim();
  if (pagesOrigin) return withProtocol(pagesOrigin).replace(/\/$/, "");

  if (process.env.NODE_ENV === "development") return "http://localhost:3000";

  return "https://messi10isthegoat.github.io/Portfolio-";
}

export const siteUrl = resolve();

/**
 * Path the app is served from (GitHub Pages project sites use `/<repo>`).
 * Kept separate from `siteUrl` so links can be prefixed consistently.
 */
export const basePath =
  process.env.NEXT_BASE_PATH?.trim() || process.env.NEXT_PUBLIC_BASE_PATH?.trim() || "";

/**
 * Prefix a root-relative asset path with the deployment base path.
 * Next.js does this for <Link>/<Image>, but plain <a href> and window.open
 * targets need it explicitly.
 */
export function withBasePath(path: string): string {
  if (!basePath) return path;
  if (/^(?:[a-z]+:|\/\/|#)/i.test(path)) return path;
  return `${basePath}${path.startsWith("/") ? path : `/${path}`}`;
}

/** Absolute URL helper that respects the deployment base path. */
export function absoluteUrl(path = "/"): string {
  const clean = path.startsWith("/") ? path : `/${path}`;
  const withBase = `${basePath}${clean === "/" ? "" : clean}`;
  return `${siteUrl}${withBase}`;
}
