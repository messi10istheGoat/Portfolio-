"use client";

import { useRef, useState } from "react";
import { profile } from "@/data/profile";
import { projects } from "@/data/projects";
import { techCategories } from "@/data/skills";

interface Line {
  type: "input" | "output" | "system";
  value: string;
}

const boot: Line[] = [
  { type: "system", value: "portfolio terminal v1.0 — type 'help' for commands" },
];

export function Terminal() {
  const [lines, setLines] = useState<Line[]>(boot);
  const [value, setValue] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const run = (raw: string) => {
    const command = raw.trim().toLowerCase();
    if (!command) return;

    const next: Line[] = [{ type: "input", value: raw.trim() }];

    switch (command) {
      case "help":
        next.push({
          type: "output",
          value: "available: about · projects · stack · contact · socials · clear",
        });
        break;
      case "about":
        next.push({
          type: "output",
          value: `${profile.name} — ${profile.role}. ${profile.hero.intro}`,
        });
        break;
      case "projects":
        projects.slice(0, 6).forEach((project) => {
          next.push({
            type: "output",
            value: `${project.number} ${project.title} — ${project.subtitle} (/${project.slug})`,
          });
        });
        break;
      case "stack":
        techCategories.forEach((category) => {
          next.push({
            type: "output",
            value: `${category.title}: ${category.items.map((item) => item.name).join(", ")}`,
          });
        });
        break;
      case "contact":
        next.push({ type: "output", value: `email: ${profile.email}` });
        next.push({ type: "output", value: `availability: ${profile.availability}` });
        break;
      case "socials":
        next.push({ type: "output", value: `github: ${profile.socials.github}` });
        next.push({ type: "output", value: `linkedin: ${profile.socials.linkedin}` });
        break;
      case "clear":
        setLines([]);
        setHistory((previous) => [...previous, command]);
        return;
      case "whoami":
        next.push({ type: "output", value: "visitor — and that's exactly how it should be." });
        break;
      default:
        next.push({
          type: "output",
          value: `command not found: ${command}. type 'help'.`,
        });
    }

    setLines((previous) => [...previous, ...next].slice(-60));
    setHistory((previous) => [...previous, command]);
  };

  return (
    <div className="glass relative overflow-hidden">
      <div className="flex items-center justify-between border-b border-white/10 px-3 py-2">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-[#ff5f57]/70" />
          <span className="h-2 w-2 rounded-full bg-[#febc2e]/70" />
          <span className="h-2 w-2 rounded-full bg-lime/70" />
          <span className="mono-sm ml-2 text-[8px] text-fog">SYSTEM / INTERACTIVE</span>
        </div>
        <span className="mono-sm text-[8px] text-accent">TTY_01</span>
      </div>

      <div
        ref={scrollRef}
        className="thin-scroll h-[190px] overflow-y-auto px-3 py-3 font-mono text-[10px] leading-relaxed"
        aria-live="polite"
      >
        {lines.map((line, index) => (
          <div key={`${line.value}-${index}`} className="flex gap-1.5">
            {line.type === "input" && <span className="shrink-0 text-accent">visitor@portfolio:~$</span>}
            <span
              className={
                line.type === "system"
                  ? "text-fog"
                  : line.type === "input"
                    ? "text-bone"
                    : "text-ash"
              }
            >
              {line.value}
            </span>
          </div>
        ))}
        {lines.length === 0 && <p className="text-fog">screen cleared.</p>}
      </div>

      <form
        onSubmit={(event) => {
          event.preventDefault();
          run(value);
          setValue("");
          requestAnimationFrame(() => {
            scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
          });
        }}
        className="flex items-center gap-2 border-t border-white/10 px-3 py-2.5"
      >
        <label htmlFor="terminal-input" className="font-mono text-[10px] text-accent">
          $
        </label>
        <input
          id="terminal-input"
          ref={inputRef}
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder="type a command…"
          autoComplete="off"
          spellCheck={false}
          aria-label="Terminal command input"
          className="w-full bg-transparent font-mono text-[10px] text-bone placeholder:text-fog/70 focus:outline-none"
          onKeyDown={(event) => {
            if (event.key === "ArrowUp" && history.length) {
              event.preventDefault();
              setValue(history[history.length - 1]);
            }
          }}
        />
        <button
          type="submit"
          className="mono-sm shrink-0 border border-white/15 px-2 py-1 text-[8px] text-ash transition-colors hover:border-accent/60 hover:text-accent"
        >
          RUN ↵
        </button>
      </form>
    </div>
  );
}
