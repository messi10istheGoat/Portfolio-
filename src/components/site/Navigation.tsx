"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { ArrowUpRight, Command, Menu, X } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/ui/BrandIcons";
import { profile } from "@/data/profile";
import { ACCENTS, useAccent } from "@/components/providers/AccentProvider";
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
              ? "border-white/15 bg-[rgba(8,9,12,0.82)] shadow-[0_20px_60px_-30px_rgba(0,0,0,0.95)] backdrop-blur-2xl"
              : "border-white/10 bg-[rgba(13,15,19,0.44)] backdrop-blur-xl",
          )}
          style={{ borderRadius: 2 }}
        >
          {/* monogram + identity */}
          <Link
            href={isHome ? "#home" : "/"}
            className="group flex items-center gap-3"
            aria-label={`${profile.name} — home`}
          >
            <span className="relative grid h-9 w-9 place-items-center border border-white/25 bg-[rgba(255,255,255,0.045)]">
              <span className="display text-[13px] tracking-[-0.02em] text-bone">{profile.monogram}</span>
              <span className="absolute -right-px -top-px h-1.5 w-1.5 bg-accent transition-transform duration-300 group-hover:scale-150" />
            </span>
            <span className="hidden leading-none sm:block">
              <span className="block font-display text-[13px] font-semibold uppercase tracking-[0.04em] text-bone">
                {profile.name}
              </span>
              <span className="mono-sm mt-1 block text-[9px] text-fog">{profile.role}</span>
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
                    "relative px-2.5 py-2 font-mono text-[10px] tracking-[0.14em] transition-colors duration-300 xl:px-3",
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
              <span className="mono-sm text-[8px] text-ash">AVAILABLE FOR OPPORTUNITIES</span>
            </div>

            <div className="hidden items-center gap-0.5 border border-white/10 p-0.5 sm:flex">
              {ACCENTS.map((option) => (
                <button
                  key={option.key}
                  type="button"
                  onClick={() => setAccent(option.key)}
                  title={`Accent — ${option.label}`}
                  aria-label={`Set accent colour to ${option.label}`}
                  aria-pressed={accent === option.key}
                  className="grid h-5 w-5 place-items-center transition-transform hover:scale-110"
                >
                  <span
                    className={cn("block h-2.5 w-2.5 transition-all", accent === option.key && "ring-1 ring-white/70 ring-offset-2 ring-offset-[#0d0f13]")}
                    style={{ backgroundColor: option.hex }}
                  />
                </button>
              ))}
            </div>

            <Magnetic strength={5}>
              <a
                href={profile.socials.github}
                target="_blank"
                rel="noreferrer noopener"
                aria-label="GitHub profile (opens in a new tab)"
                data-cursor="open"
                className="grid h-8 w-8 place-items-center border border-white/10 text-ash transition-colors hover:border-accent/60 hover:text-accent"
              >
                <GithubIcon className="h-3.5 w-3.5" />
              </a>
            </Magnetic>
            <Magnetic strength={5}>
              <a
                href={profile.socials.linkedin}
                target="_blank"
                rel="noreferrer noopener"
                aria-label="LinkedIn profile (opens in a new tab)"
                data-cursor="open"
                className="hidden h-8 w-8 place-items-center border border-white/10 text-ash transition-colors hover:border-accent/60 hover:text-accent sm:grid"
              >
                <LinkedinIcon className="h-3.5 w-3.5" />
              </a>
            </Magnetic>

            <button
              type="button"
              onClick={openPalette}
              className="flex h-8 items-center gap-1.5 border border-white/15 bg-white/[0.04] px-2.5 text-ash transition-colors hover:border-accent/60 hover:text-accent"
              aria-label="Open command palette"
            >
              <Command className="h-3.5 w-3.5" />
              <span className="mono-sm hidden text-[8px] md:inline">K</span>
            </button>

            <button
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              className="grid h-8 w-8 place-items-center border border-white/15 text-bone lg:hidden"
              aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={menuOpen}
              aria-controls="mobile-nav"
            >
              {menuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
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
            className="fixed inset-0 z-[55] flex flex-col bg-[rgba(8,9,12,0.96)] pt-24 backdrop-blur-2xl lg:hidden"
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
                    className="group flex items-baseline justify-between border-b border-white/10 py-4"
                  >
                    <span className="display text-[11vw] leading-[0.9] text-bone transition-colors group-hover:text-accent sm:text-[8vw]">
                      {link.label}
                    </span>
                    <span className="mono-sm text-fog">0{index + 1}</span>
                  </motion.a>
                ))}
              </nav>

              <div className="mt-8 space-y-5">
                <div className="flex flex-wrap gap-2">
                  <a
                    href={profile.socials.github}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="btn btn-ghost flex-1 justify-between py-3 text-[10px]"
                  >
                    GITHUB <ArrowUpRight className="h-3.5 w-3.5" />
                  </a>
                  <a
                    href={profile.socials.linkedin}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="btn btn-ghost flex-1 justify-between py-3 text-[10px]"
                  >
                    LINKEDIN <ArrowUpRight className="h-3.5 w-3.5" />
                  </a>
                </div>
                <div className="flex items-center justify-between border border-white/10 p-3">
                  <div className="flex items-center gap-2">
                    <span className="status-dot" />
                    <span className="mono-sm text-[9px] text-ash">{profile.availability.toUpperCase()}</span>
                  </div>
                  <div className="flex gap-2">
                    {ACCENTS.map((option) => (
                      <button
                        key={option.key}
                        type="button"
                        onClick={() => setAccent(option.key)}
                        aria-label={`Set accent colour to ${option.label}`}
                        className="h-4 w-4"
                        style={{
                          backgroundColor: option.hex,
                          outline: accent === option.key ? "1px solid #fff" : "none",
                          outlineOffset: 2,
                        }}
                      />
                    ))}
                  </div>
                </div>
                <a href={`mailto:${profile.email}`} className="mono block text-[10px] text-fog">
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
