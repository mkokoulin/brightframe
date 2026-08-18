"use client";

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { A11yMode, Theme } from "./themeScript";

export type { A11yMode, Theme };

/** Every color/shadow custom property defined in tokens.css — the ones that vary by data-theme. */
export type ThemeTokenVar =
  | "--c-bg"
  | "--c-surface"
  | "--c-surface-alt"
  | "--c-surface-2"
  | "--c-text-1"
  | "--c-text-2"
  | "--c-text-3"
  | "--c-text-nav"
  | "--c-border"
  | "--c-border-soft"
  | "--c-accent"
  | "--c-accent-hover"
  | "--c-brand"
  | "--c-brand-hover"
  | "--c-brand-soft"
  | "--c-shadow-sm"
  | "--c-shadow-md"
  | "--c-shadow-card"
  | "--c-error"
  | "--c-error-hover"
  | "--c-error-soft"
  | "--c-disabled"
  | "--c-hover-overlay"
  | "--c-dot"
  | "--c-range-bar"
  | "--c-surface-0"
  | "--c-surface-2-0"
  | "--c-form-accent-bg"
  | "--c-page-hero"
  | "--c-badge-blue-bg"
  | "--c-badge-blue-text"
  | "--c-badge-orange-bg"
  | "--c-badge-orange-text"
  | "--c-badge-green-bg"
  | "--c-badge-green-text"
  | "--c-badge-purple-bg"
  | "--c-badge-purple-text";

/** A partial set of token overrides — only the ones you name are changed, everything else keeps tokens.css's default. */
export type ThemeTokens = Partial<Record<ThemeTokenVar, string>>;

export type ThemeOverrides = {
  light?: ThemeTokens;
  dark?: ThemeTokens;
};

export type ThemeProviderProps = {
  children: React.ReactNode;
  /** Initial theme when nothing is stored yet. Defaults to "system". */
  defaultTheme?: Theme;
  /** Initial a11y mode when nothing is stored yet. Defaults to "default". */
  defaultA11y?: A11yMode;
  /** localStorage key prefix — must match getThemeInitScript's storageKey. Defaults to "brightframe". */
  storageKey?: string;
  /** Briefly disables CSS transitions while the theme attribute changes, so colors don't visibly animate. Defaults to true. */
  disableTransitionOnChange?: boolean;
  /**
   * Brand palette overrides, applied as inline custom properties on `<html>` — only the
   * resolved theme's set is active at a time, so `light`/`dark` can differ. Applied client-side
   * after mount; for SSR apps this means a brief flash of the default palette before hydration
   * (getThemeInitScript only knows about light/dark/a11y, not custom overrides).
   */
  palette?: ThemeOverrides;
};

export type ThemeContextValue = {
  /** The user's stored preference — may be "system". */
  theme: Theme;
  /** What's actually applied right now: "system" resolved against the OS preference. */
  resolvedTheme: "light" | "dark";
  setTheme: (theme: Theme) => void;
  /** Flips between "light" and "dark", resolving "system" first. */
  toggleTheme: () => void;
  a11y: A11yMode;
  setA11y: (mode: A11yMode) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

function getSystemTheme(): "light" | "dark" {
  if (typeof window === "undefined" || !window.matchMedia) return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function readStorage(key: string): string | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function writeStorage(key: string, value: string) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // localStorage may be unavailable (private browsing, disabled) — the preference
    // just won't persist across reloads, which is an acceptable degradation.
  }
}

function applyDocumentAttributes(resolvedTheme: "light" | "dark", a11y: A11yMode) {
  const root = document.documentElement;
  if (resolvedTheme === "dark") root.setAttribute("data-theme", "dark");
  else root.removeAttribute("data-theme");

  if (a11y === "visually-impaired") root.setAttribute("data-a11y", "visually-impaired");
  else root.removeAttribute("data-a11y");
}

/**
 * Applies brightframe's design tokens to the document by setting `data-theme`/`data-a11y`
 * on <html>, persists the choice to localStorage, and exposes it via useTheme(). Accepts an
 * optional `palette` prop to override individual tokens with your own brand colors.
 *
 * Pair with getThemeInitScript() to avoid a flash of the wrong theme on first paint.
 */
export function ThemeProvider({
  children,
  defaultTheme = "system",
  defaultA11y = "default",
  storageKey = "brightframe",
  disableTransitionOnChange = true,
  palette,
}: ThemeProviderProps) {
  const themeKey = `${storageKey}-theme`;
  const a11yKey = `${storageKey}-a11y`;

  const [theme, setThemeState] = useState<Theme>(() => (readStorage(themeKey) as Theme | null) ?? defaultTheme);
  const [a11y, setA11yState] = useState<A11yMode>(() => (readStorage(a11yKey) as A11yMode | null) ?? defaultA11y);
  const [systemTheme, setSystemTheme] = useState<"light" | "dark">(getSystemTheme);

  const resolvedTheme = theme === "system" ? systemTheme : theme;

  // Track OS theme changes so "system" stays in sync while mounted.
  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mql = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => setSystemTheme(mql.matches ? "dark" : "light");
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  // Apply the resolved theme's palette overrides as inline custom properties on <html> —
  // inline styles beat tokens.css's [data-theme="dark"] rules, so only one set is active at
  // a time. The cleanup removes exactly what this render set, before the next render's
  // (possibly different) overrides get applied — so switching theme or palette never leaves
  // a stale property behind.
  useEffect(() => {
    const root = document.documentElement;
    const overrides = palette?.[resolvedTheme] ?? {};

    for (const [key, value] of Object.entries(overrides)) {
      root.style.setProperty(key, value as string);
    }

    return () => {
      for (const key of Object.keys(overrides)) root.style.removeProperty(key);
    };
  }, [palette, resolvedTheme]);

  useEffect(() => {
    if (!disableTransitionOnChange) {
      applyDocumentAttributes(resolvedTheme, a11y);
      return;
    }

    // Suppress transitions for one frame so color/background changes apply instantly
    // instead of visibly animating through every transitioned property on the page.
    const style = document.createElement("style");
    style.textContent = "*,*::before,*::after{transition:none !important}";
    document.head.appendChild(style);

    applyDocumentAttributes(resolvedTheme, a11y);

    const id = window.setTimeout(() => {
      document.head.removeChild(style);
    }, 0);

    return () => {
      window.clearTimeout(id);
      style.remove();
    };
  }, [resolvedTheme, a11y, disableTransitionOnChange]);

  const setTheme = useCallback(
    (next: Theme) => {
      setThemeState(next);
      writeStorage(themeKey, next);
    },
    [themeKey],
  );

  const setA11y = useCallback(
    (next: A11yMode) => {
      setA11yState(next);
      writeStorage(a11yKey, next);
    },
    [a11yKey],
  );

  const toggleTheme = useCallback(() => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  }, [resolvedTheme, setTheme]);

  const value = useMemo<ThemeContextValue>(
    () => ({ theme, resolvedTheme, setTheme, toggleTheme, a11y, setA11y }),
    [theme, resolvedTheme, setTheme, toggleTheme, a11y, setA11y],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

/** Reads and updates theme/a11y state from the nearest <ThemeProvider>. */
export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme() must be used within a <ThemeProvider>.");
  return ctx;
}
