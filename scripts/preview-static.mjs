#!/usr/bin/env node
/**
 * Zero-dependency static preview server for the exported `out/` folder.
 * Mirrors how GitHub Pages resolves clean URLs (`/work/ledgerly` ->
 * `/work/ledgerly/index.html`) so link checks are trustworthy.
 *
 * Usage: node scripts/preview-static.mjs [port] [basePath]
 */

import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { extname, join, normalize, resolve } from "node:path";

const port = Number(process.argv[2] ?? 4173);
const basePath = (process.argv[3] ?? "").replace(/\/$/, "");
const rootDir = resolve(import.meta.dirname, "../out");

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".woff2": "font/woff2",
  ".pdf": "application/pdf",
  ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml; charset=utf-8",
  ".webmanifest": "application/manifest+json",
};

async function tryFile(path) {
  try {
    const info = await stat(path);
    if (info.isDirectory()) return tryFile(join(path, "index.html"));
    return path;
  } catch {
    return null;
  }
}

createServer(async (request, response) => {
  const url = new URL(request.url ?? "/", `http://${request.headers.host}`);
  let pathname = decodeURIComponent(url.pathname);

  if (basePath && pathname.startsWith(basePath)) {
    pathname = pathname.slice(basePath.length) || "/";
  }

  const safe = normalize(pathname).replace(/^(\.\.[/\\])+/, "");
  let file = await tryFile(join(rootDir, safe));

  if (!file && !extname(safe)) file = await tryFile(join(rootDir, safe, "index.html"));
  if (!file) file = await tryFile(join(rootDir, "404.html"));

  if (!file) {
    response.writeHead(404, { "Content-Type": "text/plain" });
    response.end("Not found");
    return;
  }

  const body = await readFile(file);
  response.writeHead(safe.endsWith("/") || !extname(safe) ? 200 : 200, {
    "Content-Type": MIME[extname(file)] ?? "application/octet-stream",
    "Cache-Control": "no-cache",
  });
  response.end(body);
}).listen(port, "0.0.0.0", () => {
  console.log(`static preview → http://0.0.0.0:${port}${basePath}/`);
});
