import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { profile } from "@/data/profile";

export const dynamic = "force-static";

/**
 * Serves the hand-authored CV at `public/resume.pdf`.
 *
 * This used to generate a PDF from the site data. It now streams the real
 * document instead: the CV is written by its author, so the website serves it
 * verbatim rather than approximating it. There is exactly one source file, and
 * the static export ships the same bytes at `/<base>/resume.pdf`.
 */
export async function GET() {
  let pdf: Buffer;
  try {
    pdf = await readFile(join(process.cwd(), "public", "resume.pdf"));
  } catch {
    return new Response("Résumé not found", { status: 404 });
  }

  return new Response(new Uint8Array(pdf), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${profile.meta.slug}-cv.pdf"`,
      "Content-Length": String(pdf.byteLength),
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
    },
  });
}
