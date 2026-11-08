"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { ArrowUpRight, Command, Menu, X } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/ui/BrandIcons";
import { profile } from "@/data/profile";
import { ACCENTS, useAccent } from "@/components/providers/AccentProvider";
import { useTheme } from "@/components/providers/ThemeProvider";
import { MoonGlyph, SunGlyph } from "@/components/ui/ThemeGlyphs";
import { cn } from "@/lib/utils";
import { Magnetic } from "@/components/ui/Magnetic";
import { lockScroll, unlockScroll } from "@/lib/scroll-lock";

const links = [
  { id: "home", label: "HOME" },
  { id: "about", label: "ABOUT" },
  { id: "work", label: "WORK" },
  { id: "stack", label: "STACK" },
  { id: "experience", label: "EXPERIENCE" },
  { id: "contact", label: "CONTACT" },
];

export function Navigation() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [active, setActive] = useState("home");
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { accent, setAccent } = useAccent();
  // The desktop rail owns these controls; the mobile menu mirrors them because
  // the rail is hidden below lg.
  const { theme, toggleTheme, isDark } = useTheme();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!isHome) return;
    const sections = links
      .map((link) => document.getElementById(link.id))
      .filter((node): node is HTMLElement => Boolean(node));
    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(visible.target.id);
      },
      { rootMargin: "-42% 0px -48% 0px", threshold: [0, 0.2, 0.6, 1] },
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [isHome, pathname]);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  useEffect(() => {
    if (!menuOpen) return;
    lockScroll();
    return () => unlockScroll();
  }, [menuOpen]);


  const hrefFor = (id: string) => (isHome ? `#${id}` : `/#${id}`);

  const onSectionClick = (id: string) => {
    setMenuOpen(false);
    if (!isHome) {
      // Cross-route: let the Link/anchor navigate; the menu is already closed.
      return;
    }
    // Native hash navigation does not re-scroll when the hash is unchanged.
    window.setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 0);
  };

  const openPalette = () => {
    window.dispatchEvent(new CustomEvent("open-command-palette"));
    setMenuOpen(false);
  };

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-[60] px-3 pt-3 sm:px-5 sm:pt-4">
        <div
          className={cn(
            "mx-auto flex max-w-[1440px] items-center justify-between gap-3 border px-3 py-2.5 transition-all duration-500 sm:px-4",
            scrolled
              ? "border-white/15 bg-[color-mix(in_srgb,var(--paper)_86%,transparent)] shadow-[var(--shadow-float)] backdrop-blur-2xl"
              : "border-white/10 bg-[color-mix(in_srgb,var(--ink-2)_46%,transparent)] backdrop-blur-xl",
          )}
          style={{ borderRadius: 2 }}
        >
          {/* monogram + identity */}
          <Link
            href={isHome ? "#home" : "/"}
            className="group flex items-center gap-3"
            aria-label={`${profile.name} — home`}
          >
            <span className="relative grid h-10 w-10 place-items-center border border-white/25 bg-[rgba(var(--edge),0.045)]">
              <span className="display text-[14px] tracking-[-0.02em] text-bone">{profile.monogram}</span>
              <span className="absolute -right-px -top-px h-1.5 w-1.5 bg-accent transition-transform duration-300 group-hover:scale-150" />
            </span>
            <span className="hidden leading-none sm:block">
              <span className="block font-display text-[14px] font-semibold uppercase tracking-[0.03em] text-bone">
                {profile.name}
              </span>
              <span className="mt-1.5 hidden font-mono text-[14px] uppercase tracking-[0.02em] text-fog xl:block">
                {profile.role}
              </span>
            </span>
          </Link>

          {/* center nav */}
          <nav aria-label="Primary" className="hidden items-center gap-0.5 lg:flex">
            {links.map((link) => {
              const isActive = isHome && active === link.id;
              return (
                <a
                  key={link.id}
                  href={hrefFor(link.id)}
                  onClick={() => onSectionClick(link.id)}
                  aria-current={isActive ? "true" : undefined}
                  className={cn(
                    "relative px-2.5 py-2.5 font-mono text-[14px] uppercase tracking-[0.04em] transition-colors duration-300 xl:px-3.5",
                    isActive ? "text-bone" : "text-fog hover:text-bone",
                  )}
                >
                  {isActive && (
                    <motion.span
                      layoutId="nav-active"
                      className="absolute inset-0 border border-white/15 bg-white/[0.055]"
                      transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    />
                  )}
                  <span className="relative flex items-center gap-1.5">
                    <span
                      className={cn(
                        "h-1 w-1 rounded-full transition-colors",
                        isActive ? "bg-accent" : "bg-white/20",
                      )}
                    />
                    {link.label}
                  </span>
                </a>
              );
            })}
          </nav>

          {/* right cluster */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            <div className="mr-1 hidden items-center gap-1.5 border border-white/10 px-2.5 py-1.5 xl:flex">
              <span className="status-dot" aria-hidden />
              <span className="font-mono text-[14px] uppercase tracking-[0.03em] text-ash">
                OPEN TO WORK
              </span>
            </div>

            <Magnetic strength={5}>
              <a
                href={profile.socials.github}
                target="_blank"
                rel="noreferrer noopener"
                aria-label="GitHub profile (opens in a new tab)"
                data-cursor="open"
                className="grid h-10 w-10 place-items-center border border-white/10 text-ash transition-colors hover:border-accent/60 hover:text-accent"
              >
                <GithubIcon className="h-4 w-4" />
              </a>
            </Magnetic>
            {profile.socials.linkedin && (
              <Magnetic strength={5}>
                <a
                  href={profile.socials.linkedin}
                  target="_blank"
                  rel="noreferrer noopener"
                  aria-label="LinkedIn profile (opens in a new tab)"
                  data-cursor="open"
                  className="hidden h-10 w-10 place-items-center border border-white/10 text-ash transition-colors hover:border-accent/60 hover:text-accent sm:grid"
                >
                  <LinkedinIcon className="h-4 w-4" />
                </a>
              </Magnetic>
            )}

            <button
              type="button"
              onClick={openPalette}
              className="flex h-10 items-center gap-1.5 border border-white/15 bg-white/[0.04] px-2.5 text-ash transition-colors hover:border-accent/60 hover:text-accent"
              aria-label="Open command palette"
            >
              <Command className="h-4 w-4" />
              <span className="hidden font-mono text-[14px] tracking-[0.02em] md:inline">⌘K</span>
            </button>

            <button
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              className="grid h-10 w-10 place-items-center border border-white/15 text-bone lg:hidden"
              aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={menuOpen}
              aria-controls="mobile-nav"
            >
              {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            id="mobile-nav"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[55] flex flex-col bg-[color-mix(in_srgb,var(--paper)_97%,transparent)] pt-24 backdrop-blur-2xl lg:hidden"
          >
            <div className="grid-field pointer-events-none absolute inset-0 opacity-40" aria-hidden />
            <div className="relative flex flex-1 flex-col justify-between overflow-y-auto px-6 pb-10">
              <nav aria-label="Mobile" className="flex flex-col">
                {links.map((link, index) => (
                  <motion.a
                    key={link.id}
                    href={hrefFor(link.id)}
                    onClick={() => onSectionClick(link.id)}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 + index * 0.045, duration: 0.5 }}
                    className="group flex items-center justify-between gap-4 border-b border-white/10 py-3.5"
                  >
                    <span className="display text-[clamp(1.75rem,7.5vw,2.5rem)] leading-[1] text-bone transition-colors group-hover:text-accent">
                      {link.label}
                    </span>
                    <span className="font-mono text-[14px] tabular-nums text-fog">0{index + 1}</span>
                  </motion.a>
                ))}
              </nav>

              <div className="mt-8 space-y-5">
                <div className="flex flex-wrap gap-2">
                  <a
                    href={profile.socials.github}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="btn btn-ghost flex-1 justify-between"
                  >
                    GitHub <ArrowUpRight className="h-3.5 w-3.5" />
                  </a>
                  {profile.socials.linkedin && (
                    <a
                      href={profile.socials.linkedin}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="btn btn-ghost flex-1 justify-between"
                    >
                      LinkedIn <ArrowUpRight className="h-3.5 w-3.5" />
                    </a>
                  )}
                </div>
                <div className="flex flex-wrap items-center justify-between gap-3 border border-white/10 p-3">
                  <div className="flex items-center gap-2">
                    <span className="status-dot" />
                    <span className="font-mono text-[14px] tracking-[0.02em] text-ash">{profile.availability}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={toggleTheme}
                      aria-pressed={isDark}
                      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
                      className="flex h-9 items-center gap-2 border border-white/15 px-2.5 font-mono text-[14px] uppercase tracking-[0.06em] text-ash transition-colors hover:border-accent/60 hover:text-accent"
                    >
                      {isDark ? <SunGlyph size={14} /> : <MoonGlyph size={14} />}
                      {isDark ? "Light" : "Dark"}
                    </button>
                    <div className="flex gap-2">
                      {ACCENTS.map((option) => (
                        <button
                          key={option.key}
                          type="button"
                          onClick={() => setAccent(option.key)}
                          aria-label={`Set accent colour to ${option.label}`}
                          aria-pressed={accent === option.key}
                          className="h-7 w-7"
                          style={{
                            backgroundColor: option.hex,
                            outline:
                              accent === option.key ? "1px solid rgba(var(--edge),0.85)" : "none",
                            outlineOffset: 2,
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <a
                  href={`mailto:${profile.email}`}
                  className="block font-mono text-[14px] lowercase tracking-[0.01em] text-ash underline-offset-4 transition-colors hover:text-accent hover:underline"
                >
                  {profile.email}
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
