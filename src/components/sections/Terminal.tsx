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
  /** Index into `history` while browsing with ↑/↓ (-1 = editing a new line). */
  const [historyIndex, setHistoryIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    requestAnimationFrame(() => {
      const node = scrollRef.current;
      if (node) node.scrollTop = node.scrollHeight;
    });
  };

  const run = (raw: string) => {
    const command = raw.trim().toLowerCase();
    if (!command) return;

    const next: Line[] = [{ type: "input", value: raw.trim() }];

    switch (command) {
      case "help":
        next.push({
          type: "output",
          value: "about · projects · stack · contact · socials · resume · whoami · date · ls · clear",
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
        setHistoryIndex(-1);
        return;
      case "whoami":
        next.push({ type: "output", value: "visitor — and that's exactly how it should be." });
        break;
      case "resume":
      case "cv":
        next.push({ type: "output", value: `resume: ${profile.resumePath}` });
        break;
      case "help me":
      case "ls":
        next.push({ type: "output", value: "sections: home · about · stack · work · github · experience · process · contact" });
        break;
      case "date":
        next.push({ type: "output", value: new Date().toString() });
        break;
      case "exit":
      case "quit":
        next.push({ type: "output", value: "there is no escape — but the contact form works." });
        break;
      default:
        next.push({
          type: "output",
          value: `command not found: ${command}. type 'help'.`,
        });
    }

    setLines((previous) => [...previous, ...next].slice(-60));
    setHistory((previous) => [...previous, command].slice(-50));
    setHistoryIndex(-1);
    scrollToBottom();
  };

  const browseHistory = (direction: -1 | 1) => {
    if (!history.length) return;
    const nextIndex =
      direction === -1
        ? historyIndex === -1
          ? history.length - 1
          : Math.max(0, historyIndex - 1)
        : historyIndex === -1
          ? -1
          : Math.min(history.length - 1, historyIndex + 1);
    setHistoryIndex(nextIndex);
    setValue(nextIndex === -1 ? "" : history[nextIndex]);
  };

  return (
    <div className="glass relative overflow-hidden">
      <div className="flex items-center justify-between border-b border-white/10 px-3 py-2">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-[#ff5f57]/70" />
          <span className="h-2 w-2 rounded-full bg-[#febc2e]/70" />
          <span className="h-2 w-2 rounded-full bg-lime/70" />
          <span className="ml-2 font-mono text-[13px] text-fog">SYSTEM / INTERACTIVE</span>
        </div>
        <span className="font-mono text-[14px] text-accent">TTY_01</span>
      </div>

      <div
        ref={scrollRef}
        className="thin-scroll h-[210px] overflow-y-auto px-3 py-3 font-mono text-[14px] leading-relaxed"
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
        }}
        className="flex items-center gap-2 border-t border-white/10 px-3 py-2"
      >
        <label htmlFor="terminal-input" className="font-mono text-[14px] text-accent">
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
          className="w-full bg-transparent font-mono text-[16px] text-bone placeholder:text-fog/70 focus:outline-none md:text-[14px]"
          onKeyDown={(event) => {
            if (event.key === "ArrowUp") {
              event.preventDefault();
              browseHistory(-1);
            } else if (event.key === "ArrowDown") {
              event.preventDefault();
              browseHistory(1);
            } else if (event.key === "l" && (event.ctrlKey || event.metaKey)) {
              event.preventDefault();
              setLines([]);
            }
          }}
        />
        <button
          type="submit"
          className="shrink-0 border border-white/15 px-2.5 py-1.5 font-mono text-[13px] text-ash transition-colors hover:border-accent/60 hover:text-accent"
        >
          RUN ↵
        </button>
      </form>
    </div>
  );
}
