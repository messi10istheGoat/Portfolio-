import type { MetadataRoute } from "next";
import { profile } from "@/data/profile";

// Required so `output: "export"` (GitHub Pages) can prerender this file.
export const dynamic = "force-static";

/**
 * Web app manifest — lets the portfolio install to a home screen with the
 * right name, colours and icons instead of a generic browser bookmark.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${profile.name} — ${profile.role}`,
    short_name: profile.name,
    description: profile.meta.description,
    start_url: "/",
    display: "standalone",
    background_color: "#08090c",
    theme_color: "#08090c",
    orientation: "portrait-primary",
    categories: ["portfolio", "developer", "technology"],
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" },
      { src: "/apple-icon.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
