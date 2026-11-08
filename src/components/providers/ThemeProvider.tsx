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

export type ThemeKey = "dark" | "light";

const STORAGE_KEY = "portfolio-theme";
const DEFAULT_THEME: ThemeKey = "dark";

function isValid(value: unknown): value is ThemeKey {
  return value === "dark" || value === "light";
}

/* ------------------------------------------------------------------ */
/* Shared external store                                               */
/* ------------------------------------------------------------------ */
/* Same pattern as the accent: the theme lives outside React so the    */
/* first paint is already correct (the bootstrap script sets the       */
/* attribute before hydration), and every consumer reads one value     */
/* through useSyncExternalStore instead of an effect that setStates.   */

const listeners = new Set<() => void>();
let current: ThemeKey = DEFAULT_THEME;

function readStored(): ThemeKey {
  if (typeof window === "undefined") return DEFAULT_THEME;
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return isValid(stored) ? stored : DEFAULT_THEME;
  } catch {
    return DEFAULT_THEME;
  }
}

const THEME_COLOR: Record<ThemeKey, string> = {
  dark: "#08090C",
  light: "#F6F4EF",
};

function apply(theme: ThemeKey) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  root.dataset.theme = theme;
  // Let the browser paint its own chrome (address bar, form controls) to
  // match, and keep scrollbar rendering correct between modes.
  root.style.colorScheme = theme;
  // Keep the mobile-browser address bar in step with the toggle rather than
  // with the OS preference declared in the viewport export.
  document
    .querySelector('meta[name="theme-color"]')
    ?.setAttribute("content", THEME_COLOR[theme]);
}

function publish(next: ThemeKey, persist: boolean) {
  if (isValid(next)) current = next;
  apply(current);
  if (persist) {
    try {
      window.localStorage.setItem(STORAGE_KEY, current);
    } catch {
      /* storage can be unavailable — the theme still applies this session */
    }
  }
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot(): ThemeKey {
  return current;
}

function getServerSnapshot(): ThemeKey {
  return DEFAULT_THEME;
}

function hydrateFromStorage() {
  const stored = readStored();
  if (stored !== current) {
    current = stored;
    listeners.forEach((listener) => listener());
  }
  apply(current);
}

if (typeof window !== "undefined") {
  // Keep multiple open tabs in sync.
  window.addEventListener("storage", (event) => {
    if (event.key !== STORAGE_KEY) return;
    const next = isValid(event.newValue) ? event.newValue : DEFAULT_THEME;
    publish(next, false);
  });
}

/* ------------------------------------------------------------------ */
/* Context API                                                         */
/* ------------------------------------------------------------------ */

interface ThemeContextValue {
  theme: ThemeKey;
  setTheme: (theme: ThemeKey) => void;
  toggleTheme: () => void;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  useEffect(() => {
    hydrateFromStorage();
  }, []);

  const setTheme = useCallback((next: ThemeKey) => {
    publish(next, true);
  }, []);

  const toggleTheme = useCallback(() => {
    publish(current === "dark" ? "light" : "dark", true);
  }, []);

  const value = useMemo(
    () => ({ theme, setTheme, toggleTheme, isDark: theme === "dark" }),
    [theme, setTheme, toggleTheme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  if (!context) {
    return {
      theme,
      setTheme: () => undefined,
      toggleTheme: () => undefined,
      isDark: theme === "dark",
    };
  }
  return { ...context, theme, isDark: theme === "dark" };
}

/**
 * Runs before first paint. Dark is the default, so the only work is adopting
 * a stored light preference — and never flashing dark to someone who chose
 * light. Mirrors the accent bootstrap in the same document head.
 */
export const themeBootstrapScript = `(function(){try{var t=localStorage.getItem("${STORAGE_KEY}");if(t==="light"||t==="dark"){document.documentElement.dataset.theme=t;document.documentElement.style.colorScheme=t;}else{document.documentElement.dataset.theme="dark";document.documentElement.style.colorScheme="dark";}}catch(e){}})();`;
