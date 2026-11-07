"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type AccentKey = "blue" | "lime" | "cyan" | "violet";

export const ACCENTS: { key: AccentKey; label: string; hex: string }[] = [
  { key: "blue", label: "ELECTRIC BLUE", hex: "#668CFF" },
  { key: "lime", label: "ACID LIME", hex: "#C6F36A" },
  { key: "cyan", label: "CYBER CYAN", hex: "#62D9E8" },
  { key: "violet", label: "SOFT VIOLET", hex: "#A78BFA" },
];

const STORAGE_KEY = "portfolio-accent";

interface AccentContextValue {
  accent: AccentKey;
  setAccent: (accent: AccentKey) => void;
  cycleAccent: () => void;
}

const AccentContext = createContext<AccentContextValue | null>(null);

function apply(accent: AccentKey) {
  if (typeof document === "undefined") return;
  document.documentElement.dataset.accent = accent;
}

export function AccentProvider({ children }: { children: ReactNode }) {
  const [accent, setAccentState] = useState<AccentKey>("blue");

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY) as AccentKey | null;
    if (stored && ACCENTS.some((entry) => entry.key === stored)) {
      setAccentState(stored);
      apply(stored);
    } else {
      apply("blue");
    }
  }, []);

  const setAccent = useCallback((next: AccentKey) => {
    setAccentState(next);
    apply(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* storage can be unavailable — accent still applies for the session */
    }
  }, []);

  const cycleAccent = useCallback(() => {
    setAccentState((current) => {
      const index = ACCENTS.findIndex((entry) => entry.key === current);
      const next = ACCENTS[(index + 1) % ACCENTS.length].key;
      apply(next);
      try {
        window.localStorage.setItem(STORAGE_KEY, next);
      } catch {
        /* ignore */
      }
      return next;
    });
  }, []);

  const value = useMemo(() => ({ accent, setAccent, cycleAccent }), [accent, setAccent, cycleAccent]);

  return <AccentContext.Provider value={value}>{children}</AccentContext.Provider>;
}

export function useAccent(): AccentContextValue {
  const context = useContext(AccentContext);
  if (!context) {
    return {
      accent: "blue",
      setAccent: () => undefined,
      cycleAccent: () => undefined,
    };
  }
  return context;
}

export const accentBootstrapScript = `(function(){try{var a=localStorage.getItem("${STORAGE_KEY}");if(a&&["blue","lime","cyan","violet"].indexOf(a)>-1){document.documentElement.dataset.accent=a}}catch(e){}})();`;
