import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "./fonts.css";
import "./globals.css";
import { AccentProvider, accentBootstrapScript } from "@/components/providers/AccentProvider";
import { CustomCursor } from "@/components/site/CustomCursor";
import { Navigation } from "@/components/site/Navigation";
import { Footer } from "@/components/site/Footer";
import { CommandPalette } from "@/components/site/CommandPalette";
import { ScrollProgress } from "@/components/ui/Motion";
import { profile } from "@/data/profile";
import { basePath, siteUrl } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(`${siteUrl}${basePath}`),
  title: {
    default: `${profile.name} — ${profile.role}`,
    template: `%s — ${profile.name}`,
  },
  description: profile.meta.description,
  applicationName: `${profile.name} — Portfolio`,
  keywords: [
    "full-stack developer",
    "Next.js developer",
    "TypeScript",
    "React",
    "portfolio",
    "Bangladesh developer",
  ],
  authors: [{ name: profile.name, url: siteUrl }],
  creator: profile.name,
  publisher: profile.name,
  category: "technology",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    title: `${profile.name} — ${profile.role}`,
    description: profile.meta.description,
    url: siteUrl,
    siteName: `${profile.name} — Portfolio`,
    locale: "en_US",
    images: [
      {
        url: "/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: `${profile.name} — ${profile.role}. ${profile.tagline}.`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${profile.name} — ${profile.role}`,
    description: `${profile.tagline}. ${profile.hero.intro.slice(0, 100)}…`,
    images: ["/opengraph-image.png"],
  },
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
    apple: [{ url: "/apple-icon.png" }],
  },
  robots: { index: true, follow: true },
  formatDetection: { email: false, address: false, telephone: false },
};

export const viewport: Viewport = {
  themeColor: "#08090C",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: profile.name,
  jobTitle: profile.role,
  description: profile.meta.description,
  email: `mailto:${profile.email}`,
  url: siteUrl,
  sameAs: [profile.socials.github, profile.socials.linkedin, profile.socials.x].filter(Boolean),
  knowsAbout: ["TypeScript", "React", "Next.js", "Node.js", "PostgreSQL", "UI Engineering"],
  knowsLanguage: ["en", "bn"],
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" data-accent="blue" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: accentBootstrapScript }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
        />
      </head>
      <body className="min-h-screen bg-ink text-bone antialiased">
        <AccentProvider>
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[120] focus:border focus:border-accent focus:bg-ink focus:px-4 focus:py-2 focus:font-mono focus:text-[10px] focus:uppercase focus:tracking-widest focus:text-accent"
          >
            Skip to main content
          </a>
          <ScrollProgress />
          <CustomCursor />
          <Navigation />
          <main id="main">{children}</main>
          <Footer />
          <CommandPalette />
        </AccentProvider>
      </body>
    </html>
  );
}
