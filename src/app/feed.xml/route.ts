import type { MetadataRoute } from "next";
import { projects } from "@/data/projects";
import { profile } from "@/data/profile";
import { absoluteUrl, siteUrl } from "@/lib/site";

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export const dynamic = "force-static";

/**
 * Case studies as an RSS feed. Useful for feed readers, but primarily it gives
 * crawlers a dated, ordered index of every write-up.
 */
export function GET() {
  const items = projects
    .map((project) => {
      const url = absoluteUrl(`/work/${project.slug}`);
      return `    <item>
      <title>${escapeXml(`${project.title} — ${project.subtitle}`)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${new Date(`${project.year}-03-01T09:00:00Z`).toUTCString()}</pubDate>
      <category>${escapeXml(project.categoryLabel)}</category>
      <description>${escapeXml(project.description)}</description>
    </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(`${profile.name} — Case Studies`)}</title>
    <link>${absoluteUrl("/#work")}</link>
    <description>${escapeXml(profile.meta.description)}</description>
    <language>en</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${absoluteUrl("/feed.xml")}" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
    },
  });
}
