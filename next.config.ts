import type { NextConfig } from "next";

/**
 * Two supported deployment shapes:
 *
 *  1. Node / Vercel (default) — full hybrid build: server-rendered APIs, the
 *     contact form writes to Postgres or a webhook, health checks, headers.
 *  2. Static export (GitHub Pages, S3, any CDN) — `NEXT_STATIC_EXPORT=1`
 *     produces a hashed `out/` folder. API routes are excluded by the deploy
 *     workflow and the contact form falls back to a mailto composer.
 */
const isStaticExport = process.env.NEXT_STATIC_EXPORT === "1";
// GitHub Pages project sites live under /<repo>; user sites need no base path.
const basePath = process.env.NEXT_BASE_PATH?.trim() || "";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,

  ...(isStaticExport ? { output: "export", trailingSlash: true } : {}),
  ...(basePath ? { basePath, assetPrefix: basePath } : {}),

  images: {
    // No remote images are used today; add hostnames here if that changes.
    remotePatterns: [],
  },

  experimental: {
    optimizePackageImports: ["lucide-react", "framer-motion"],
  },

  async headers() {
    if (isStaticExport) return [];
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-DNS-Prefetch-Control", value: "on" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
          },
        ],
      },
      {
        source: "/api/:path*",
        headers: [{ key: "Cache-Control", value: "no-store, max-age=0" }],
      },
    ];
  },
};

export default nextConfig;
