"use client";

import { motion } from "framer-motion";
import { ACCENTS, useAccent } from "@/components/providers/AccentProvider";
import { useTheme } from "@/components/providers/ThemeProvider";
import { MoonGlyph, SunGlyph } from "@/components/ui/ThemeGlyphs";
import { cn } from "@/lib/utils";

/**
 * ThemeRail — the fixed control strip on the right edge.
 *
 * Why a rail and not a navbar control: the header is where navigation lives,
 * and these two controls are ambient preferences, not destinations. Pinning
 * them to the viewport edge keeps them reachable from every scroll position
 * without competing with the logo and section links.
 *
 * Desktop only (lg and up). Below that the same controls live in the mobile
 * menu, where there is room for labelled buttons and a target that is not
 * sitting under the user's thumb.
 *
 * Width is deliberately 34px: it has to clear the page gutter, which is
 * 36.9px at the lg breakpoint (1024px) and grows from there. Every control is
 * at least 24×24 so it stays a legal pointer target.
 */
export function ThemeRail() {
  const { theme, toggleTheme, isDark } = useTheme();
  const { accent, setAccent } = useAccent();

  return (
    <motion.aside
      initial={{ opacity: 0, x: 12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.7, delay: 0.9, ease: [0.16, 1, 0.3, 1] }}
      className="fixed right-0 top-1/2 z-40 hidden -translate-y-1/2 lg:block"
      aria-label="Theme and accent controls"
    >
      <div className="flex w-[34px] flex-col items-center gap-2 border-y border-l border-white/12 bg-[color-mix(in_srgb,var(--paper)_82%,transparent)] py-2.5 backdrop-blur-xl">
        <button
          type="button"
          onClick={toggleTheme}
          aria-pressed={isDark}
          aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
          title={isDark ? "Switch to light mode" : "Switch to dark mode"}
          className="grid h-[30px] w-[30px] place-items-center border border-white/12 text-ash transition-colors hover:border-accent/60 hover:text-accent focus-visible:border-accent focus-visible:text-accent focus-visible:outline-none"
        >
          {isDark ? <SunGlyph /> : <MoonGlyph />}
        </button>

        <span className="h-px w-4 bg-white/15" aria-hidden />

        <div className="flex flex-col items-center" role="group" aria-label="Accent colour">
          {ACCENTS.map((option) => (
            <button
              key={option.key}
              type="button"
              onClick={() => setAccent(option.key)}
              title={option.label}
              aria-label={`Set accent colour to ${option.label}`}
              aria-pressed={accent === option.key}
              className="group grid h-6 w-6 place-items-center focus-visible:outline-none"
            >
              <span
                className={cn(
                  "block h-3 w-3 transition-transform duration-200 group-hover:scale-[1.35] group-focus-visible:scale-[1.35]",
                  accent === option.key
                    ? "scale-[1.2] ring-1 ring-white/80 ring-offset-2 ring-offset-ink-2"
                    : "opacity-65 group-hover:opacity-100",
                )}
                style={{ background: option.hex }}
              />
            </button>
          ))}
        </div>

        <span className="h-px w-4 bg-white/15" aria-hidden />

        <span
          className="mono-sm text-[12px] uppercase leading-none tracking-[0.16em] text-fog"
          style={{ writingMode: "vertical-rl", textOrientation: "mixed" }}
          aria-hidden
        >
          {theme === "dark" ? "DARK" : "LIGHT"}
        </span>
      </div>
    </motion.aside>
  );
}
