import localFont from "next/font/local";

/**
 * Self-hosted variable fonts, wired through `next/font/local`.
 *
 * Why not `next/font/google`? It fetched stylesheets from fonts.googleapis.com
 * at build time, so `next build` failed whenever the build machine had no
 * network — which is most CI runners. Why not a plain `@font-face`? Because
 * `next/font` gives us hashed, immutable URLs, automatic preloading of the
 * faces actually used, and `size-adjust` fallback metrics that stop the layout
 * from shifting when the font swaps in.
 *
 * The three files in ./fonts are the Latin subsets of the @fontsource-variable
 * builds (SIL Open Font License). ~136 KB total, no third-party requests.
 */

export const spaceGrotesk = localFont({
  src: "./fonts/space-grotesk-latin.woff2",
  variable: "--font-space-grotesk",
  weight: "300 700",
  style: "normal",
  display: "swap",
  preload: true,
  fallback: ["Arial Black", "Arial", "sans-serif"],
  adjustFontFallback: false,
});

export const inter = localFont({
  src: "./fonts/inter-latin.woff2",
  variable: "--font-inter",
  weight: "100 900",
  style: "normal",
  display: "swap",
  preload: true,
  fallback: ["system-ui", "Segoe UI", "Arial", "sans-serif"],
  adjustFontFallback: false,
});

export const jetbrainsMono = localFont({
  src: "./fonts/jetbrains-mono-latin.woff2",
  variable: "--font-jetbrains",
  weight: "100 800",
  style: "normal",
  display: "swap",
  preload: false,
  fallback: ["ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
  adjustFontFallback: false,
});

export const fontVariables = `${spaceGrotesk.variable} ${inter.variable} ${jetbrainsMono.variable}`;
