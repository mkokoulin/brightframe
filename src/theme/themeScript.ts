export type Theme = "light" | "dark" | "system";
export type A11yMode = "default" | "visually-impaired";

export type ThemeScriptOptions = {
  /** Must match the `storageKey` passed to <ThemeProvider>. Defaults to "haloui". */
  storageKey?: string;
  /** Must match the `defaultTheme` passed to <ThemeProvider>. Defaults to "system". */
  defaultTheme?: Theme;
};

/**
 * Returns a minified IIFE that reads the persisted theme/a11y preference and applies
 * `data-theme`/`data-a11y` to <html> synchronously, before React hydrates and before
 * first paint. Inline it in the document head to avoid a flash of the wrong theme.
 *
 * Next.js (app router, in `app/layout.tsx`):
 * ```tsx
 * <head>
 *   <script dangerouslySetInnerHTML={{ __html: getThemeInitScript() }} />
 * </head>
 * ```
 *
 * Plain HTML (e.g. Vite's `index.html`):
 * ```html
 * <script>${getThemeInitScript()}</script>
 * ```
 */
export function getThemeInitScript(options: ThemeScriptOptions = {}): string {
  const storageKey = options.storageKey ?? "haloui";
  const defaultTheme = options.defaultTheme ?? "system";
  const themeKey = `${storageKey}-theme`;
  const a11yKey = `${storageKey}-a11y`;

  return (
    "(function(){try{" +
    `var t=localStorage.getItem(${JSON.stringify(themeKey)})||${JSON.stringify(defaultTheme)};` +
    'var r=t==="system"?(window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"):t;' +
    'if(r==="dark")document.documentElement.setAttribute("data-theme","dark");' +
    `var a=localStorage.getItem(${JSON.stringify(a11yKey)});` +
    'if(a==="visually-impaired")document.documentElement.setAttribute("data-a11y","visually-impaired");' +
    "}catch(e){}})();"
  );
}
