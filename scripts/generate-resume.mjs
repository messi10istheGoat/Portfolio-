#!/usr/bin/env node
/**
 * Pre-generate the résumé PDF into `public/resume.pdf`.
 *
 * The /api/resume route is dynamic-only in a static export, so the deploy
 * pipeline runs this script first. It bundles the generator with esbuild (the
 * data layer is TypeScript) and evaluates it — no Next.js runtime needed.
 *
 * Usage: node scripts/generate-resume.mjs
 */

import { build } from "esbuild";
import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const outfile = resolve(root, "public/resume.pdf");

const result = await build({
  entryPoints: [resolve(root, "src/lib/resume.ts")],
  bundle: true,
  format: "esm",
  platform: "node",
  target: "node20",
  write: false,
  logLevel: "warning",
  // The pdf generator has zero runtime dependencies; `pg` and friends never
  // get pulled in because nothing in this module imports them.
  external: ["pg"],
  alias: { "@": resolve(root, "src") },
});

const code = result.outputFiles[0].text;
const dataUrl = `data:text/javascript;base64,${Buffer.from(code).toString("base64")}`;
const mod = await import(dataUrl);

const pdf = mod.generateResumePdf();

try {
  // Import-time date stamp keeps the build deterministic within a day.
  await mkdir(dirname(outfile), { recursive: true });
  await writeFile(outfile, pdf);
  console.log(`✓ public/resume.pdf (${(pdf.byteLength / 1024).toFixed(1)} KB)`);
} catch (error) {
  console.error("✗ failed to write public/resume.pdf", error);
  process.exit(1);
}
