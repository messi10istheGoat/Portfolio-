"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowUp, ArrowUpRight, Mail } from "lucide-react";
import { profile } from "@/data/profile";
import { ACCENTS, useAccent } from "@/components/providers/AccentProvider";
import { GithubIcon, LinkedinIcon, XIcon } from "@/components/ui/BrandIcons";
import { cn } from "@/lib/utils";
import { withBasePath } from "@/lib/site";

const navLinks = [
  { id: "about", label: "ABOUT" },
  { id: "work", label: "WORK" },
  { id: "stack", label: "STACK" },
  { id: "github", label: "GITHUB" },
  { id: "experience", label: "EXPERIENCE" },
  { id: "process", label: "PROCESS" },
  { id: "contact", label: "CONTACT" },
];

export function LocalTime() {
  const [time, setTime] = useState<string | null>(null);
  const [zone, setZone] = useState<string>("");

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setTime(
        new Intl.DateTimeFormat("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        }).format(now),
      );
      const resolved = Intl.DateTimeFormat().resolvedOptions().timeZone ?? "";
      setZone(resolved.split("/").pop()?.replace(/_/g, " ").toUpperCase() ?? "");
    };
    update();
    const interval = window.setInterval(update, 1000);
    return () => window.clearInterval(interval);
  }, []);

  return (
    <span className="font-mono text-[14px] text-ash">
      LOCAL TIME {time ? `${time} ${zone ? `· ${zone}` : ""}` : "--:--:--"}
    </span>
  );
}

export function Footer() {
  const { accent, setAccent } = useAccent();
  const year = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden border-t border-white/10 bg-paper-deep">
      <div className="grid-field pointer-events-none absolute inset-0 opacity-30" aria-hidden />
      <div className="radial-bleed pointer-events-none absolute inset-x-0 -top-40 h-80 opacity-60" aria-hidden />

      <div className="shell relative">
        <div className="flex flex-col gap-10 border-b border-white/10 py-14 lg:flex-row lg:items-end lg:justify-between">
          <h2 className="display max-w-[14ch] text-[clamp(2.4rem,6.4vw,5.6rem)]">
            <span className="block">DESIGNED</span>
            <span className="block">TO THINK.</span>
            <span className="block text-outline-accent">ENGINEERED</span>
            <span className="block">TO BUILD.</span>
          </h2>

          <div className="flex flex-col items-start gap-5 lg:items-end">
            <p className="max-w-[32ch] font-sans text-[15px] leading-relaxed text-fog lg:text-right">
              Open to collaborations, product work, and interesting engineering problems.
            </p>
            <a
              href={`mailto:${profile.email}`}
              className="group flex items-center gap-3 border-b border-white/20 pb-2 font-display text-lg font-semibold tracking-tight text-bone transition-colors hover:border-accent hover:text-accent sm:text-2xl"
              data-cursor="mail"
            >
              {profile.email}
              <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
            </a>
            <div className="flex items-center gap-2">
              {[
                { href: profile.socials.github, label: "GitHub", Icon: GithubIcon },
                { href: profile.socials.linkedin, label: "LinkedIn", Icon: LinkedinIcon },
                { href: profile.socials.x, label: "X", Icon: XIcon },
                { href: `mailto:${profile.email}`, label: "Email", Icon: Mail },
              ]
                .filter(({ href }) => Boolean(href))
                .map(({ href, label, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target={href.startsWith("mailto") ? undefined : "_blank"}
                  rel="noreferrer noopener"
                  aria-label={label}
                  className="grid h-10 w-10 place-items-center border border-white/12 text-ash transition-all hover:-translate-y-0.5 hover:border-accent/60 hover:text-accent"
                >
                  <Icon className="h-3.5 w-3.5" />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8 py-10 md:grid-cols-4">
          <div className="col-span-2 md:col-span-1">
            <p className="font-mono text-[13px] tracking-[0.04em] text-fog">INDEX</p>
            <p className="mt-3 font-display text-sm font-semibold uppercase tracking-[0.02em] text-bone">
              {profile.name}
            </p>
            <p className="mono mt-1 text-[14px] text-fog">{profile.location}</p>
            <div className="mt-4 flex items-center gap-2">
              <span className="status-dot" aria-hidden />
              <span className="font-mono text-[14px] text-ash">SYSTEM ONLINE</span>
            </div>
          </div>

          <div>
            <p className="font-mono text-[13px] tracking-[0.04em] text-fog">NAVIGATION</p>
            <ul className="mt-3 space-y-1.5">
              {navLinks.map((link) => (
                <li key={link.id}>
                  <Link
                    href={`/#${link.id}`}
                    className="group inline-flex items-center gap-1.5 py-1 font-mono text-[14px] text-ash transition-colors hover:text-accent"
                  >
                    <span className="h-px w-0 bg-accent transition-all duration-300 group-hover:w-3" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="font-mono text-[13px] tracking-[0.04em] text-fog">CONNECT</p>
            <ul className="mt-3 space-y-1.5">
              {[
                { label: "GITHUB", href: profile.socials.github },
                { label: "LINKEDIN", href: profile.socials.linkedin },
                { label: "X / TWITTER", href: profile.socials.x },
                { label: "EMAIL", href: `mailto:${profile.email}` },
                { label: "RÉSUMÉ", href: withBasePath(profile.resumePath) },
              ]
                .filter((item) => Boolean(item.href))
                .map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    target={
                      item.href.startsWith("mailto") || item.href.startsWith("/") ? undefined : "_blank"
                    }
                    rel="noreferrer noopener"
                    className="inline-flex items-center gap-1 py-1 font-mono text-[14px] text-ash transition-colors hover:text-accent"
                  >
                    {item.label}
                    <ArrowUpRight className="h-2.5 w-2.5" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="font-mono text-[13px] tracking-[0.04em] text-fog">ACCENT SYSTEM</p>
            <div className="mt-3 space-y-1.5">
              {ACCENTS.map((option) => (
                <button
                  key={option.key}
                  type="button"
                  onClick={() => setAccent(option.key)}
                  aria-pressed={accent === option.key}
                  className={cn(
                    "flex w-full items-center gap-2.5 border border-transparent px-1.5 py-2 font-mono text-[13px] transition-colors",
                    accent === option.key ? "text-bone" : "text-fog hover:text-ash",
                  )}
                >
                  <span
                    className="block h-3 w-3 shrink-0"
                    style={{ backgroundColor: option.hex }}
                    aria-hidden
                  />
                  {option.label}
                  {accent === option.key && <span className="ml-auto text-accent">●</span>}
                </button>
              ))}
            </div>
            <div className="mt-5">
              <LocalTime />
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4 border-t border-white/10 py-6 md:flex-row md:items-center md:justify-between">
          <div className="mono-sm flex flex-wrap items-center gap-x-5 gap-y-2 text-[14px] text-fog">
            <span>© {year} {profile.name.toUpperCase()}</span>
            <span className="hidden h-3 w-px bg-white/15 sm:block" />
            <span>BUILD: {profile.meta.version}</span>
            <span>STACK: {profile.meta.stackLine}</span>
            <span className="text-ash">{profile.meta.crafted}</span>
          </div>
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="mono-sm group inline-flex items-center gap-2 border border-white/12 px-3 py-2 text-[14px] text-ash transition-colors hover:border-accent/60 hover:text-accent"
          >
            BACK TO TOP
            <ArrowUp className="h-3 w-3 transition-transform group-hover:-translate-y-0.5" />
          </button>
        </div>
      </div>
    </footer>
  );
}
