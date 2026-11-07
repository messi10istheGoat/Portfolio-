import { profile } from "@/data/profile";
import { techCategories } from "@/data/skills";
import { projects } from "@/data/projects";
import { experience } from "@/data/experience";
import { siteUrl } from "@/lib/site";

/**
 * Minimal, dependency-free PDF writer for a one-page A4 résumé.
 *
 * Everything is derived from the data layer, so the PDF can never drift from
 * the website. Text is sanitised to printable ASCII before it reaches the
 * content stream — the standard Helvetica fonts are not Unicode fonts, and
 * unsanitised input produces corrupt files.
 *
 * This module is plain TypeScript with no Node-only imports, so it can run in
 * an API route *or* at build time (see scripts/generate-resume.mjs).
 */

const PAGE_WIDTH = 595;
const PAGE_HEIGHT = 842;
const MARGIN = 52;
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN * 2;

function escapePdf(text: string): string {
  return text.replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");
}

/** Helvetica/WinAnsi-safe approximation: strip anything outside ASCII. */
function toAscii(value: string): string {
  return value
    .replace(/[—–]/g, "-")
    .replace(/[’‘]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/[×]/g, "x")
    .replace(/·/g, "·")
    .replace(/[^\x20-\x7E]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function wrap(text: string, maxChars: number): string[] {
  const words = toAscii(text).split(" ").filter(Boolean);
  const lines: string[] = [];
  let current = "";
  for (const word of words) {
    if ((current ? `${current} ${word}` : word).length > maxChars) {
      if (current) lines.push(current);
      current = word;
    } else {
      current = current ? `${current} ${word}` : word;
    }
  }
  if (current) lines.push(current);
  return lines;
}

interface Op {
  font: "F1" | "F2";
  size: number;
  x: number;
  y: number;
  text: string;
}

export function generateResumePdf(): Uint8Array {
  const ops: Op[] = [];
  let y = PAGE_HEIGHT - MARGIN;

  const place = (text: string, size: number, font: "F1" | "F2", gap: number, x = MARGIN) => {
    if (y < MARGIN) return;
    ops.push({ font, size, x, y, text: toAscii(text) });
    y -= gap;
  };

  const rule = () => {
    if (y < MARGIN) return;
    ops.push({
      font: "F1",
      size: 8,
      x: MARGIN,
      y,
      // Helvetica's underscore advances 0.556em: 8pt * 0.556 = 4.45pt per glyph.
      text: "_".repeat(Math.floor(CONTENT_WIDTH / 4.45)),
    });
    y -= 14;
  };

  const section = (label: string) => {
    y -= 10;
    place(label, 10, "F2", 4);
    rule();
    y -= 2;
  };

  /* ---------------- header ---------------- */
  place(profile.name.toUpperCase(), 26, "F2", 20);
  place(`${profile.role.toUpperCase()}  /  ${profile.tagline.toUpperCase()}`, 9.5, "F1", 14);
  place(`${profile.email}  -  ${profile.location}`, 8.5, "F1", 11);
  place(`${profile.socials.github}  -  ${profile.socials.linkedin}`, 8, "F1", 11);
  place(profile.availability.toUpperCase(), 8, "F1", 6);

  /* ---------------- profile ---------------- */
  section("PROFILE");
  wrap(profile.hero.intro, 100).forEach((line) => place(line, 9, "F1", 12.5));

  /* ---------------- stack ---------------- */
  section("TECHNICAL STACK");
  techCategories.forEach((category) => {
    const line = `${category.title}: ${category.items.map((item) => item.name).join(", ")}`;
    wrap(line, 104).forEach((part) => place(part, 9, "F1", 12));
  });

  /* ---------------- projects ---------------- */
  section("SELECTED PROJECTS");
  projects.slice(0, 3).forEach((project) => {
    place(`${project.number}  ${toAscii(project.title)} - ${toAscii(project.subtitle)}  (${project.year})`, 9.5, "F2", 12);
    wrap(project.description, 104).forEach((line) => place(line, 8.5, "F1", 11.5));
    place(`Stack: ${project.stack.join(", ")}`, 8, "F1", 13);
  });

  /* ---------------- experience ---------------- */
  section("EXPERIENCE");
  experience.slice(0, 2).forEach((entry) => {
    place(`${toAscii(entry.organization)} - ${toAscii(entry.position)}`, 9.5, "F2", 12);
    place(`${toAscii(entry.period)}  |  ${toAscii(entry.location)}`, 8, "F1", 12);
    wrap(entry.summary, 104).forEach((line) => place(line, 8.5, "F1", 11.5));
    y -= 3;
  });

  /* ---------------- links ---------------- */
  section("LINKS");
  place(`GitHub: ${profile.socials.github}`, 8.5, "F1", 12);
  place(`LinkedIn: ${profile.socials.linkedin}`, 8.5, "F1", 12);
  place(`Portfolio: ${siteUrl}`, 8.5, "F1", 12);

  /* ---------------- footer note ---------------- */
  y = Math.min(y, MARGIN + 10);
  place(
    `Generated ${new Date().toISOString().slice(0, 10)} from ${siteUrl.replace(/^https?:\/\//, "")}`,
    7,
    "F1",
    8,
  );

  const content = ops
    .map((op) => `BT /${op.font} ${op.size} Tf 0 g 1 0 0 1 ${op.x} ${op.y} Tm (${escapePdf(op.text)}) Tj ET`)
    .join("\n");

  const objects = [
    "<< /Type /Catalog /Pages 2 0 R >>",
    "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
    `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${PAGE_WIDTH} ${PAGE_HEIGHT}] /Resources << /Font << /F1 4 0 R /F2 5 0 R >> >> /Contents 6 0 R >>`,
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>",
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>",
    `<< /Length ${new TextEncoder().encode(content).length} >>\nstream\n${content}\nendstream`,
    `<< /Title (${escapePdf(toAscii(`${profile.name} - ${profile.role}`))}) /Author (${escapePdf(
      toAscii(profile.name),
    )}) /Subject (Resume) /Creator (Portfolio resume generator) /Producer (Portfolio resume generator) >>`,
  ];

  let pdf = "%PDF-1.4\n%\xE2\xE3\xCF\xD3\n";
  const offsets: number[] = [];
  objects.forEach((body, index) => {
    offsets.push(new TextEncoder().encode(pdf).length);
    pdf += `${index + 1} 0 obj\n${body}\nendobj\n`;
  });

  const xrefStart = new TextEncoder().encode(pdf).length;
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  offsets.forEach((offset) => {
    pdf += `${String(offset).padStart(10, "0")} 00000 n \n`;
  });
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R /Info ${objects.length} 0 R >>\nstartxref\n${xrefStart}\n%%EOF\n`;

  return new TextEncoder().encode(pdf);
}
