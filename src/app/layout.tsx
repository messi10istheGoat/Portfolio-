import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Inter, JetBrains_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { AccentProvider, accentBootstrapScript } from "@/components/providers/AccentProvider";
import { CustomCursor } from "@/components/site/CustomCursor";
import { Navigation } from "@/components/site/Navigation";
import { Footer } from "@/components/site/Footer";
import { CommandPalette } from "@/components/site/CommandPalette";
import { ScrollProgress } from "@/components/ui/Motion";
import { profile } from "@/data/profile";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-jetbrains",
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://arifrahman.dev";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${profile.name} — Full-Stack Developer`,
    template: `%s — ${profile.name}`,
  },
  description:
    "Portfolio of Arif Rahman, a full-stack developer engineering scalable applications and designing interfaces at the intersection of raw structure and refined execution.",
  keywords: [
    "full-stack developer",
    "Next.js developer",
    "TypeScript",
    "React",
    "portfolio",
    "Bangladesh developer",
  ],
  authors: [{ name: profile.name }],
  creator: profile.name,
  openGraph: {
    type: "website",
    title: `${profile.name} — Full-Stack Developer`,
    description:
      "Building beyond the ordinary. Full-stack engineering, interface systems, and digital products.",
    url: siteUrl,
    siteName: `${profile.name} — Portfolio`,
  },
  twitter: {
    card: "summary_large_image",
    title: `${profile.name} — Full-Stack Developer`,
    description: "Building beyond the ordinary. Full-stack engineering & interface systems.",
  },
  robots: { index: true, follow: true },
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
  email: profile.email,
  url: siteUrl,
  address: { "@type": "PostalAddress", addressCountry: "BD", addressLocality: "Dhaka" },
  sameAs: [profile.socials.github, profile.socials.linkedin],
  knowsAbout: ["TypeScript", "React", "Next.js", "Node.js", "PostgreSQL", "UI Engineering"],
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      data-accent="blue"
      className={`${spaceGrotesk.variable} ${inter.variable} ${jetbrains.variable}`}
      suppressHydrationWarning
    >
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
