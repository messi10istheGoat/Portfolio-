"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  Check,
  Copy,
  CornerDownLeft,
  Download,
  Mail,
  Palette,
  Search,
  SquareArrowOutUpRight,
} from "lucide-react";
import { ACCENTS, useAccent } from "@/components/providers/AccentProvider";
import { profile } from "@/data/profile";
import { projects } from "@/data/projects";
import { lockScroll, unlockScroll } from "@/lib/scroll-lock";
import { withBasePath } from "@/lib/site";
import { cn } from "@/lib/utils";

type Group = "NAVIGATE" | "PROJECTS" | "CONNECT" | "APPEARANCE";

interface Command {
  id: string;
  label: string;
  hint?: string;
  group: Group;
  keywords?: string;
  run: () => void;
}

const OPEN_EVENT = "open-command-palette";

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const [copied, setCopied] = useState(false);
  const { accent, setAccent } = useAccent();
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const restoreFocus = useRef<HTMLElement | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  const close = useCallback(() => setOpen(false), []);

  /* Reset transient UI when the palette is (re)opened — done in the openers
     rather than an effect so React never cascades a render. */
  const openPalette = useCallback(() => {
    setQuery("");
    setActiveIndex(0);
    setOpen((value) => !value);
  }, []);

  const goToSection = useCallback(
    (id: string) => {
      close();
      if (pathname !== "/") {
        router.push(`/#${id}`);
        return;
      }
      window.setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
        // Keep the URL shareable without a full navigation.
        window.history.replaceState(null, "", `#${id}`);
      }, 80);
    },
    [close, pathname, router],
  );

  const commands = useMemo<Command[]>(() => {
    const nav: Command[] = [
      { id: "nav-home", label: "Go to Home", hint: "TOP", group: "NAVIGATE", run: () => goToSection("home") },
      { id: "nav-about", label: "Open About", hint: "01", group: "NAVIGATE", run: () => goToSection("about") },
      { id: "nav-stack", label: "Explore Skills", hint: "02", group: "NAVIGATE", run: () => goToSection("stack") },
      { id: "nav-work", label: "View Projects", hint: "03", group: "NAVIGATE", run: () => goToSection("work") },
      { id: "nav-github", label: "GitHub Activity", hint: "04", group: "NAVIGATE", run: () => goToSection("github") },
      {
        id: "nav-experience",
        label: "View Experience",
        hint: "05",
        group: "NAVIGATE",
        run: () => goToSection("experience"),
      },
      { id: "nav-process", label: "See the Process", hint: "06", group: "NAVIGATE", run: () => goToSection("process") },
      {
        id: "nav-contact",
        label: "Contact Me",
        hint: "07",
        group: "NAVIGATE",
        keywords: "hire email message",
        run: () => goToSection("contact"),
      },
    ];

    const projectCommands: Command[] = projects.map((project) => ({
      id: `project-${project.slug}`,
      label: `Case study — ${project.title}`,
      hint: project.number,
      group: "PROJECTS",
      keywords: `${project.subtitle} ${project.stack.join(" ")} ${project.categoryLabel} ${project.year}`,
      run: () => {
        close();
        router.push(`/work/${project.slug}`);
      },
    }));

    const connect: (Command | false)[] = [
      Boolean(profile.socials.linkedin) && {
        id: "linkedin-profile",
        label: "Open LinkedIn",
        hint: "EXTERNAL",
        group: "CONNECT",
        run: () => {
          close();
          window.open(profile.socials.linkedin, "_blank", "noopener,noreferrer");
        },
      },
      {
        id: "github-profile",
        label: "Open GitHub",
        hint: "EXTERNAL",
        group: "CONNECT",
        run: () => {
          close();
          window.open(profile.socials.github, "_blank", "noopener,noreferrer");
        },
      },
      {
        id: "resume",
        label: "Download Résumé",
        hint: "PDF",
        group: "CONNECT",
        keywords: "cv curriculum",
        run: () => {
          close();
          window.open(withBasePath(profile.resumePath), "_blank", "noopener,noreferrer");
        },
      },
      {
        id: "email",
        label: "Copy Email Address",
        hint: profile.email,
        group: "CONNECT",
        keywords: profile.email,
        run: async () => {
          try {
            await navigator.clipboard.writeText(profile.email);
            setCopied(true);
            window.setTimeout(() => setCopied(false), 2200);
          } catch {
            window.location.href = `mailto:${profile.email}`;
          }
        },
      },
    ];

    const appearance: Command[] = ACCENTS.map((option) => ({
      id: `accent-${option.key}`,
      label: `Change Accent — ${option.label}`,
      hint: accent === option.key ? "ACTIVE" : option.hex.replace("#", ""),
      group: "APPEARANCE",
      keywords: "colour color theme",
      run: () => setAccent(option.key),
    }));

    // LinkedIn is only offered when a profile is configured.
    const connectCommands = connect.filter((command): command is Command => Boolean(command));

    return [...nav, ...projectCommands, ...connectCommands, ...appearance];
  }, [accent, close, goToSection, router, setAccent]);

  const filtered = useMemo(() => {
    const value = query.trim().toLowerCase();
    if (!value) return commands;
    const terms = value.split(/\s+/);
    return commands.filter((command) => {
      const haystack = `${command.label} ${command.hint ?? ""} ${command.keywords ?? ""} ${command.group}`.toLowerCase();
      return terms.every((term) => haystack.includes(term));
    });
  }, [commands, query]);

  /* Scroll lock, focus restore and initial focus. */
  useEffect(() => {
    if (!open) {
      restoreFocus.current?.focus?.();
      return;
    }
    restoreFocus.current = document.activeElement as HTMLElement;
    lockScroll();
    const timer = window.setTimeout(() => {
      inputRef.current?.focus();
      inputRef.current?.select();
    }, 30);
    return () => {
      window.clearTimeout(timer);
      unlockScroll();
    };
  }, [open]);

  /* Global key bindings. */
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const typingInField =
        target?.tagName === "INPUT" || target?.tagName === "TEXTAREA" || target?.isContentEditable;

      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        openPalette();
      } else if (event.key === "Escape") {
        setOpen(false);
      } else if (event.key === "/" && !open && !typingInField) {
        event.preventDefault();
        openPalette();
      }
    };
    const onOpen = () => setOpen(true);
    window.addEventListener("keydown", onKey);
    window.addEventListener(OPEN_EVENT, onOpen as EventListener);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener(OPEN_EVENT, onOpen as EventListener);
    };
  }, [open, openPalette]);

  /* Derived rather than stored: the highlight can never point past the end of
     the result list, and no effect has to chase it. */
  const highlighted = filtered.length === 0 ? -1 : Math.min(activeIndex, filtered.length - 1);

  /* Keep the highlighted row in view. */
  useEffect(() => {
    if (!open || highlighted < 0) return;
    const node = listRef.current?.querySelector<HTMLElement>(`[data-index="${highlighted}"]`);
    node?.scrollIntoView({ block: "nearest" });
  }, [highlighted, open]);

  const handleInputKey = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((index) => (filtered.length ? (index + 1) % filtered.length : 0));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((index) => (filtered.length ? (index - 1 + filtered.length) % filtered.length : 0));
    } else if (event.key === "Enter") {
      event.preventDefault();
      const command = filtered[highlighted];
      if (!command) return;
      command.run();
      if (command.id !== "email") close();
    } else if (event.key === "Tab") {
      // Only the input and the list are interactive: keep focus inside.
      event.preventDefault();
    }
  };

  const onQueryChange = (value: string) => {
    setQuery(value);
    setActiveIndex(0);
  };

  let lastGroup: Group | null = null;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[90] flex items-start justify-center px-4 pt-[12vh] sm:pt-[16vh]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <button
            type="button"
            aria-label="Close command palette"
            className="absolute inset-0 cursor-default bg-[rgba(4,5,7,0.72)] backdrop-blur-md"
            onClick={close}
            tabIndex={-1}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Command palette"
            initial={{ opacity: 0, y: -14, scale: 0.985 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.99 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className="glass-strong relative w-full max-w-[640px] overflow-hidden rounded-[3px]"
          >
            <div className="flex items-center gap-3 border-b border-white/10 px-4 py-3.5">
              <Search className="h-4 w-4 shrink-0 text-accent" />
              <input
                ref={inputRef}
                value={query}
                onChange={(event) => onQueryChange(event.target.value)}
                onKeyDown={handleInputKey}
                placeholder="Search commands, projects, sections…"
                aria-label="Search commands"
                role="combobox"
                aria-expanded
                aria-controls="command-list"
                aria-autocomplete="list"
                aria-activedescendant={filtered[highlighted]?.id}
                className="w-full bg-transparent font-mono text-[12px] uppercase tracking-[0.08em] text-bone placeholder:text-fog focus:outline-none"
              />
              <span className="mono-sm hidden shrink-0 border border-white/15 px-1.5 py-0.5 text-[8px] text-fog sm:block">
                ESC
              </span>
            </div>

            <div
              ref={listRef}
              id="command-list"
              role="listbox"
              aria-label="Commands"
              className="thin-scroll max-h-[52vh] overflow-y-auto overscroll-contain py-2"
            >
              {filtered.length === 0 && (
                <p className="mono px-4 py-10 text-center text-[10px] text-fog">
                  NO RESULTS — TRY &ldquo;PROJECTS&rdquo; OR &ldquo;ACCENT&rdquo;
                </p>
              )}
              {filtered.map((command, index) => {
                const showGroup = command.group !== lastGroup;
                lastGroup = command.group;
                return (
                  <div key={command.id}>
                    {showGroup && (
                      <p className="mono-sm px-4 pb-1.5 pt-3 text-[9px] text-fog/80">{command.group}</p>
                    )}
                    <button
                      type="button"
                      role="option"
                      id={command.id}
                      aria-selected={index === highlighted}
                      data-index={index}
                      onMouseEnter={() => setActiveIndex(index)}
                      onMouseMove={() => setActiveIndex(index)}
                      onClick={() => {
                        command.run();
                        if (command.id !== "email") close();
                      }}
                      className={cn(
                        "flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors",
                        index === highlighted ? "bg-white/[0.07]" : "hover:bg-white/[0.04]",
                      )}
                    >
                      <span
                        className={cn(
                          "grid h-6 w-6 shrink-0 place-items-center border text-[9px]",
                          index === highlighted
                            ? "border-accent/70 bg-accent/10 text-accent"
                            : "border-white/12 text-fog",
                        )}
                      >
                        {command.group === "APPEARANCE" ? (
                          <Palette className="h-3 w-3" />
                        ) : command.group === "PROJECTS" ? (
                          <span className="mono-sm">{command.hint}</span>
                        ) : command.id === "resume" ? (
                          <Download className="h-3 w-3" />
                        ) : command.id === "email" ? (
                          copied ? (
                            <Check className="h-3 w-3 text-lime" />
                          ) : (
                            <Copy className="h-3 w-3" />
                          )
                        ) : command.id.includes("profile") ? (
                          <SquareArrowOutUpRight className="h-3 w-3" />
                        ) : (
                          <CornerDownLeft className="h-3 w-3" />
                        )}
                      </span>
                      <span className="flex-1 font-mono text-[11px] uppercase tracking-[0.06em] text-bone">
                        {command.id === "email" && copied ? "EMAIL COPIED TO CLIPBOARD" : command.label}
                      </span>
                      {command.hint && (
                        <span className="mono-sm truncate text-[8px] text-fog">{command.hint}</span>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>

            <div className="flex items-center justify-between gap-3 border-t border-white/10 bg-black/20 px-4 py-2.5">
              <div className="mono-sm flex items-center gap-3 text-[8px] text-fog">
                <span>↑↓ NAVIGATE</span>
                <span className="hidden sm:inline">↵ EXECUTE</span>
                <span className="hidden sm:inline">ESC CLOSE</span>
              </div>
              <span className="mono-sm flex items-center gap-1.5 text-[8px] text-fog">
                <Mail className="h-3 w-3" /> {profile.email}
              </span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
