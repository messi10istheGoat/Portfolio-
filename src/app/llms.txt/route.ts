import { profile } from "@/data/profile";
import { projects } from "@/data/projects";
import { techCategories } from "@/data/skills";
import { experience } from "@/data/experience";
import { absoluteUrl } from "@/lib/site";

export const dynamic = "force-static";

/**
 * `llms.txt` — a compact, machine-readable summary of the site for language
 * models and research agents. Mirrors the structure of the visible page so
 * answers about this portfolio are accurate and current.
 */
export function GET() {
  const lines: string[] = [];

  lines.push(`# ${profile.name} — ${profile.role}`);
  lines.push("");
  lines.push(`> ${profile.meta.description}`);
  lines.push("");
  lines.push(`Location: ${profile.location}`);
  lines.push(`Availability: ${profile.availability}`);
  lines.push(`Email: ${profile.email}`);
  lines.push(`GitHub: ${profile.socials.github}`);
  lines.push(`LinkedIn: ${profile.socials.linkedin}`);
  lines.push("");

  lines.push("## About");
  lines.push(profile.about.lede);
  lines.push("");
  profile.about.paragraphs.forEach((paragraph) => lines.push(paragraph));
  lines.push("");

  lines.push("## Stack");
  techCategories.forEach((category) => {
    lines.push(`- ${category.title}: ${category.items.map((item) => item.name).join(", ")}`);
  });
  lines.push("");

  lines.push("## Case studies");
  projects.forEach((project) => {
    lines.push(
      `- [${project.title} — ${project.subtitle}](${absoluteUrl(`/work/${project.slug}`)}): ${project.description} Stack: ${project.stack.join(", ")}.`,
    );
  });
  lines.push("");

  lines.push("## Experience");
  experience.forEach((entry) => {
    lines.push(`- ${entry.organization} — ${entry.position} (${entry.period}): ${entry.summary}`);
  });
  lines.push("");

  lines.push("## Notes");
  lines.push("- Project metrics are self-reported from development and testing.");
  lines.push("- GitHub activity on the site is live only when a token is configured; otherwise it is labelled sample data.");
  lines.push("");

  return new Response(lines.join("\n"), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
    },
  });
}
