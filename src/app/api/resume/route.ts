import { generateResumePdf } from "@/lib/resume";

export const dynamic = "force-static";

/**
 * Server-side résumé endpoint. The exact same generator also runs at build
 * time (`scripts/generate-resume.mjs`) so static exports ship the identical
 * file at `public/resume.pdf`.
 */
export function GET() {
  const pdf = generateResumePdf();
  return new Response(pdf as BodyInit, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": 'attachment; filename="arif-rahman-resume.pdf"',
      "Content-Length": String(pdf.byteLength),
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
    },
  });
}
