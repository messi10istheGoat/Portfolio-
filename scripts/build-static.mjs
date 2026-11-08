#!/usr/bin/env node
/**
 * Static export pipeline (GitHub Pages, S3, any CDN).
 *
 * 1. Move server-only API routes aside — `output: "export"` cannot render them.
 * 2. Pre-render the résumé PDF into public/resume.pdf.
 * 3. Run `next build` with NEXT_STATIC_EXPORT + NEXT_PUBLIC_STATIC_MODE set.
 * 4. Restore the API routes, whatever happens.
 * 5. Add a .nojekyll file so GitHub Pages serves hashed asset folders verbatim.
 *
 * Usage: node scripts/build-static.mjs
 */

import { execFileSync } from "node:child_process";
import { copyFileSync, existsSync, renameSync, rmSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const apiDir = resolve(root, "src/app/api");
const stash = resolve(root, ".static-export-stash");

function stashApiRoutes() {
  if (!existsSync(apiDir)) return false;
  rmSync(stash, { recursive: true, force: true });
  renameSync(apiDir, stash);
  return true;
}

function restoreApiRoutes() {
  if (existsSync(stash)) {
    rmSync(apiDir, { recursive: true, force: true });
    renameSync(stash, apiDir);
  }
}

let stashed = false;

try {
  stashed = stashApiRoutes();
  if (stashed) console.log("• API routes moved aside for static export");

  // The résumé at public/resume.pdf is a hand-authored CV and is committed
  // as-is. It is deliberately NOT generated during the build: a generator
  // here would silently overwrite the author's own document on every deploy.

  execFileSync(resolve(root, "node_modules/.bin/next"), ["build"], {
    cwd: root,
    stdio: "inherit",
    env: {
      ...process.env,
      NEXT_STATIC_EXPORT: "1",
      NEXT_PUBLIC_STATIC_MODE: "1",
    },
  });

  const outDir = resolve(root, "out");
  writeFileSync(resolve(outDir, ".nojekyll"), "");

  // GitHub Pages serves 404.html for unknown paths. Reuse the generated
  // not-found page so deep links to a missing case study still look designed.
  const notFound = resolve(outDir, "404/index.html");
  if (existsSync(notFound)) {
    copyFileSync(notFound, resolve(outDir, "404.html"));
  }

  console.log("✓ static export ready in ./out");
} catch (error) {
  console.error("✗ static export failed", error?.message ?? error);
  process.exitCode = 1;
} finally {
  restoreApiRoutes();
  if (stashed) console.log("• API routes restored");
}
