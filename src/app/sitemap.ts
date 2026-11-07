import type { MetadataRoute } from "next";

// Required for `output: "export"` (GitHub Pages) builds as well as normal ones.
export const dynamic = "force-static";
import { projects } from "@/data/projects";
import { absoluteUrl } from "@/lib/site";

/**
 * A single, stable "content changed" date keeps the sitemap honest: search
 * engines ignore `lastModified` that changes on every deploy.
 */
const CONTENT_UPDATED = new Date("2026-01-15T00:00:00.000Z");

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: absoluteUrl("/"),
      lastModified: CONTENT_UPDATED,
      changeFrequency: "monthly",
      priority: 1,
      images: [absoluteUrl("/opengraph-image.png")],
    },
    ...projects.map((project) => ({
      url: absoluteUrl(`/work/${project.slug}`),
      lastModified: new Date(`${project.year}-03-01T00:00:00.000Z`),
      changeFrequency: "yearly" as const,
      priority: 0.7,
      images: [absoluteUrl("/opengraph-image.png")],
    })),
  ];
}
