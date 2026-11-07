import { profile } from "@/data/profile";
import { techCategories } from "@/data/skills";
import { projects } from "@/data/projects";
import { experience } from "@/data/experience";

export const dynamic = "force-static";

/** Minimal, dependency-free PDF writer for a one-page A4 résumé. */
function escapePdf(text: string): string {
  return text.replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");
}

function wrap(text: string, max: number): string[] {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let current = "";
  for (const word of words) {
    if ((current + " " + word).trim().length > max) {
      if (current) lines.push(current.trim());
      current = word;
    } else {
      current += ` ${word}`;
    }
  }
  if (current.trim()) lines.push(current.trim());
  return lines;
}

function buildPdf(): string {
  type Op = { font: "F1" | "F2"; size: number; x: number; y: number; text: string; gray?: number };
  const ops: Op[] = [];
  let y = 798;

  const push = (text: string, size: number, font: "F1" | "F2", gap = 15, x = 56, gray = 0) => {
    if (y < 44) return;
    ops.push({ font, size, x, y, text, gray });
    y -= gap;
  };

  push("ARIF RAHMAN", 30, "F2", 22);
  push("FULL-STACK DEVELOPER  /  DESIGN x ENGINEERING", 9.5, "F1", 16);
  push(
    `${profile.email}  ·  ${profile.socials.github}  ·  ${profile.location}`,
    9,
    "F1",
    20,
  );
  push("PLACEHOLDER RESUME — replace with verified details before publishing.", 8, "F1", 24);

  const section = (label: string) => {
    y -= 8;
    ops.push({ font: "F2", size: 10, x: 56, y, text: label });
    y -= 6;
    ops.push({ font: "F1", size: 10, x: 56, y, text: "____________________________________________________________" });
    y -= 16;
  };

  section("PROFILE");
  wrap(profile.hero.intro, 96).forEach((line) => push(line, 9.5, "F1", 13));

  section("TECHNICAL STACK");
  techCategories.forEach((category) => {
    const line = `${category.title}: ${category.items.map((item) => item.name).join(", ")}`;
    wrap(line, 98).forEach((part) => push(part, 9, "F1", 13));
  });

  section("SELECTED PROJECTS");
  projects.slice(0, 3).forEach((project) => {
    push(`${project.number}  ${project.title} — ${project.subtitle}  (${project.year})`, 9.5, "F2", 13);
    wrap(project.description, 100).forEach((line) => push(line, 9, "F1", 12.5));
    push(`Stack: ${project.stack.join(", ")}`, 8.5, "F1", 15);
  });

  section("EXPERIENCE (DRAFT PLACEHOLDER)");
  experience.slice(0, 2).forEach((entry) => {
    push(`${entry.organization} — ${entry.position}`, 9.5, "F2", 13);
    push(`${entry.period}  ·  ${entry.location}`, 8.5, "F1", 13);
    wrap(entry.summary, 100).forEach((line) => push(line, 9, "F1", 12.5));
    y -= 4;
  });

  section("LINKS");
  push(`GitHub: ${profile.socials.github}`, 9, "F1", 13);
  push(`LinkedIn: ${profile.socials.linkedin}`, 9, "F1", 13);
  push(`Portfolio: ${process.env.NEXT_PUBLIC_SITE_URL ?? "https://arifrahman.dev"}`, 9, "F1", 13);

  const content = ops
    .map(
      (op) =>
        `BT /${op.font} ${op.size} Tf ${op.gray ? `${op.gray} g` : "0 g"} 1 0 0 1 ${op.x} ${op.y} Tm (${escapePdf(
          op.text,
        )}) Tj ET`,
    )
    .join("\n");

  const objects = [
    "<< /Type /Catalog /Pages 2 0 R >>",
    "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
    "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 4 0 R /F2 5 0 R >> >> /Contents 6 0 R >>",
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>",
    `<< /Length ${content.length} >>\nstream\n${content}\nendstream`,
  ];

  let pdf = "%PDF-1.4\n";
  const offsets: number[] = [];
  objects.forEach((body, index) => {
    offsets.push(pdf.length);
    pdf += `${index + 1} 0 obj\n${body}\nendobj\n`;
  });

  const xrefStart = pdf.length;
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  offsets.forEach((offset) => {
    pdf += `${String(offset).padStart(10, "0")} 00000 n \n`;
  });
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefStart}\n%%EOF`;

  return pdf;
}

export function GET() {
  const pdf = buildPdf();
  return new Response(pdf, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": 'attachment; filename="arif-rahman-resume.pdf"',
      "Cache-Control": "public, max-age=3600",
    },
  });
}
