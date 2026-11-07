"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react";

export type AccentKey = "blue" | "lime" | "cyan" | "violet";

export const ACCENTS: { key: AccentKey; label: string; hex: string }[] = [
  { key: "blue", label: "ELECTRIC BLUE", hex: "#668CFF" },
  { key: "lime", label: "ACID LIME", hex: "#C6F36A" },
  { key: "cyan", label: "CYBER CYAN", hex: "#62D9E8" },
  { key: "violet", label: "SOFT VIOLET", hex: "#A78BFA" },
];

const STORAGE_KEY = "portfolio-accent";
const DEFAULT_ACCENT: AccentKey = "blue";
const VALID = ACCENTS.map((entry) => entry.key);

function isValid(value: unknown): value is AccentKey {
  return typeof value === "string" && (VALID as string[]).includes(value);
}

/* ------------------------------------------------------------------ */
/* Shared external store                                               */
/* ------------------------------------------------------------------ */
/* The accent lives outside React so that (a) the first paint is already */
/* correct thanks to the bootstrap script, and (b) every consumer — nav, */
/* footer, palette, the <html> attribute — reads one value via           */
/* useSyncExternalStore instead of an effect that calls setState.        */

const listeners = new Set<() => void>();
let current: AccentKey = DEFAULT_ACCENT;

function readStored(): AccentKey {
  if (typeof window === "undefined") return DEFAULT_ACCENT;
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return isValid(stored) ? stored : DEFAULT_ACCENT;
  } catch {
    return DEFAULT_ACCENT;
  }
}

function apply(accent: AccentKey) {
  if (typeof document === "undefined") return;
  document.documentElement.dataset.accent = accent;
}

function publish(next: AccentKey, persist: boolean) {
  if (isValid(next)) current = next;
  apply(current);
  if (persist) {
    try {
      window.localStorage.setItem(STORAGE_KEY, current);
    } catch {
      /* storage can be unavailable — accent still applies for the session */
    }
  }
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot(): AccentKey {
  return current;
}

function getServerSnapshot(): AccentKey {
  return DEFAULT_ACCENT;
}

/** Called once from the provider to adopt the value the bootstrap script used. */
function hydrateFromStorage() {
  const stored = readStored();
  if (stored !== current) {
    current = stored;
    apply(stored);
    listeners.forEach((listener) => listener());
  }
}

if (typeof window !== "undefined") {
  // Keep multiple open tabs in sync.
  window.addEventListener("storage", (event) => {
    if (event.key !== STORAGE_KEY) return;
    const next = isValid(event.newValue) ? event.newValue : DEFAULT_ACCENT;
    publish(next, false);
  });
}

/* ------------------------------------------------------------------ */
/* Context API (kept for existing consumers)                           */
/* ------------------------------------------------------------------ */

interface AccentContextValue {
  accent: AccentKey;
  setAccent: (accent: AccentKey) => void;
  cycleAccent: () => void;
}

const AccentContext = createContext<AccentContextValue | null>(null);

export function AccentProvider({ children }: { children: ReactNode }) {
  const accent = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  useEffect(() => {
    hydrateFromStorage();
    apply(current);
  }, []);

  const setAccent = useCallback((next: AccentKey) => {
    publish(next, true);
  }, []);

  const cycleAccent = useCallback(() => {
    const index = VALID.indexOf(current);
    publish(VALID[(index + 1) % VALID.length], true);
  }, []);

  const value = useMemo(
    () => ({ accent, setAccent, cycleAccent }),
    [accent, setAccent, cycleAccent],
  );

  return <AccentContext.Provider value={value}>{children}</AccentContext.Provider>;
}

export function useAccent(): AccentContextValue {
  const context = useContext(AccentContext);
  const accent = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  if (!context) {
    return { accent, setAccent: () => undefined, cycleAccent: () => undefined };
  }
  // Prefer the live store value: it updates even before the provider re-renders.
  return { ...context, accent };
}

export const accentBootstrapScript = `(function(){try{var a=localStorage.getItem("${STORAGE_KEY}");if(a&&["blue","lime","cyan","violet"].indexOf(a)>-1){document.documentElement.dataset.accent=a}}catch(e){}})();`;
