import { describe, expect, it } from "vitest";
import { getThemeInitScript } from "./themeScript";

describe("getThemeInitScript", () => {
  it("returns a single IIFE wrapped in try/catch", () => {
    const script = getThemeInitScript();
    expect(script.startsWith("(function(){try{")).toBe(true);
    expect(script.endsWith("}catch(e){}})();")).toBe(true);
  });

  it("embeds the default storageKey and defaultTheme", () => {
    const script = getThemeInitScript();
    expect(script).toContain('"haloui-theme"');
    expect(script).toContain('"haloui-a11y"');
    expect(script).toContain('"system"');
  });

  it("embeds a custom storageKey and defaultTheme", () => {
    const script = getThemeInitScript({ storageKey: "my-app", defaultTheme: "dark" });
    expect(script).toContain('"my-app-theme"');
    expect(script).toContain('"my-app-a11y"');
    expect(script).toContain('||"dark"');
  });

  it("produces syntactically valid JavaScript", () => {
    expect(() => new Function(getThemeInitScript())).not.toThrow();
  });

  it("applies data-theme=dark when it runs against a dark preference with no stored value", () => {
    const originalMatchMedia = window.matchMedia;
    window.matchMedia = ((query: string) => ({
      matches: query.includes("dark"),
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    })) as unknown as typeof window.matchMedia;

    document.documentElement.removeAttribute("data-theme");
    window.localStorage.clear();

    // eslint-disable-next-line no-new-func
    new Function(getThemeInitScript())();

    expect(document.documentElement).toHaveAttribute("data-theme", "dark");

    document.documentElement.removeAttribute("data-theme");
    window.matchMedia = originalMatchMedia;
  });
});
