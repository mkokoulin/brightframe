import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ThemeProvider, useTheme } from "./ThemeProvider";

function mockMatchMedia(prefersDark: boolean) {
  window.matchMedia = ((query: string) => ({
    matches: query.includes("prefers-color-scheme: dark") && prefersDark,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  })) as unknown as typeof window.matchMedia;
}

function Probe() {
  const { theme, resolvedTheme, setTheme, toggleTheme, a11y, setA11y } = useTheme();
  return (
    <div>
      <span data-testid="theme">{theme}</span>
      <span data-testid="resolved">{resolvedTheme}</span>
      <span data-testid="a11y">{a11y}</span>
      <button onClick={() => setTheme("dark")}>set dark</button>
      <button onClick={() => setTheme("light")}>set light</button>
      <button onClick={toggleTheme}>toggle</button>
      <button onClick={() => setA11y("visually-impaired")}>enable a11y</button>
    </div>
  );
}

const originalMatchMedia = window.matchMedia;

beforeEach(() => {
  document.documentElement.removeAttribute("data-theme");
  document.documentElement.removeAttribute("data-a11y");
  window.localStorage.clear();
});

afterEach(() => {
  window.matchMedia = originalMatchMedia;
});

describe("ThemeProvider / useTheme", () => {
  it("resolves 'system' against the OS preference", () => {
    mockMatchMedia(true);
    render(
      <ThemeProvider>
        <Probe />
      </ThemeProvider>,
    );
    expect(screen.getByTestId("theme")).toHaveTextContent("system");
    expect(screen.getByTestId("resolved")).toHaveTextContent("dark");
    expect(document.documentElement).toHaveAttribute("data-theme", "dark");
  });

  it("applies an explicit defaultTheme without consulting the OS preference", () => {
    mockMatchMedia(true);
    render(
      <ThemeProvider defaultTheme="light">
        <Probe />
      </ThemeProvider>,
    );
    expect(screen.getByTestId("resolved")).toHaveTextContent("light");
    expect(document.documentElement).not.toHaveAttribute("data-theme");
  });

  it("updates the resolved theme and the data-theme attribute via setTheme", async () => {
    mockMatchMedia(false);
    render(
      <ThemeProvider>
        <Probe />
      </ThemeProvider>,
    );

    await userEvent.click(screen.getByText("set dark"));
    expect(screen.getByTestId("resolved")).toHaveTextContent("dark");
    expect(document.documentElement).toHaveAttribute("data-theme", "dark");
  });

  it("persists the chosen theme to localStorage", async () => {
    mockMatchMedia(false);
    render(
      <ThemeProvider storageKey="test-app">
        <Probe />
      </ThemeProvider>,
    );

    await userEvent.click(screen.getByText("set dark"));
    expect(window.localStorage.getItem("test-app-theme")).toBe("dark");
  });

  it("reads a persisted theme on mount instead of defaultTheme", () => {
    window.localStorage.setItem("brightframe-theme", "dark");
    mockMatchMedia(false);
    render(
      <ThemeProvider defaultTheme="light">
        <Probe />
      </ThemeProvider>,
    );
    expect(screen.getByTestId("resolved")).toHaveTextContent("dark");
  });

  it("toggleTheme flips between light and dark", async () => {
    mockMatchMedia(false);
    render(
      <ThemeProvider defaultTheme="light">
        <Probe />
      </ThemeProvider>,
    );

    await userEvent.click(screen.getByText("toggle"));
    expect(screen.getByTestId("resolved")).toHaveTextContent("dark");

    await userEvent.click(screen.getByText("toggle"));
    expect(screen.getByTestId("resolved")).toHaveTextContent("light");
  });

  it("sets data-a11y when a11y is enabled", async () => {
    mockMatchMedia(false);
    render(
      <ThemeProvider>
        <Probe />
      </ThemeProvider>,
    );

    await userEvent.click(screen.getByText("enable a11y"));
    expect(document.documentElement).toHaveAttribute("data-a11y", "visually-impaired");
  });

  it("throws when useTheme is used outside a ThemeProvider", () => {
    // Swallow the expected React error-boundary console.error noise for this assertion.
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    expect(() => render(<Probe />)).toThrow(/must be used within a <ThemeProvider>/);
    spy.mockRestore();
  });
});
