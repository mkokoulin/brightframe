import type { ComponentType } from "react";
import { describe, it, afterEach, beforeEach } from "vitest";
import { cleanup, render } from "@testing-library/react";
import { composeStories } from "@storybook/react-vite";
import { expectMatchesScreenshot } from "./visual";

// Freezes every CSS animation/transition at its end state. Without this, a
// continuously-animating component (e.g. Loader's spinner) never reaches a "stable"
// frame, and `toMatchScreenshot()` times out waiting for two consecutive captures to
// match instead of ever completing. Each test runs in its own browser-mode document, so
// this has to be injected per-test, not once in a setup file.
function freezeAnimations() {
  const style = document.createElement("style");
  style.textContent = "*, *::before, *::after { animation: none !important; transition: none !important; }";
  document.head.appendChild(style);
}

// One baseline per component × theme — not every story variant, which would make this
// suite (and its baseline count) grow without bound as stories are added. "Which story":
// the first export matching /^Default/i, falling back to the first exported story —
// deterministic, no per-component judgment call needed. `.headless.stories.tsx` files
// (e.g. Combobox's) are filtered out below — a second story file in the same directory
// would collide on this rule's per-directory naming, and an intentionally-unstyled
// reference demo has no CSS drift for this suite to protect against anyway.
const ALL_STORY_MODULES = import.meta.glob("../components/*/*.stories.tsx", {
  eager: true,
}) as Record<string, Record<string, unknown>>;

const STORY_MODULES = Object.fromEntries(
  Object.entries(ALL_STORY_MODULES).filter(([path]) => !path.includes(".headless.stories")),
);

type ComponentEntry = { name: string; storyExports: Record<string, unknown> };

// These components' default story renders `position: fixed`/`absolute` root content
// with no positioned, normal-flow ancestor to give it a bounding box — `Loader` has no
// "idle" state (always spinning, `position: absolute`) and `MobileDatePicker`'s demo
// opens its sheet, whose backdrop is `position: fixed`. Screenshotting the render
// container captures nothing meaningful and never stabilizes, so `toMatchScreenshot()`
// times out rather than fails — a real limitation of this per-component isolated-render
// harness (unlike Storybook's own layout, which centers content in a real page), not a
// bug in the components themselves. Excluded rather than special-cased; see
// docs/visual-regression.md.
const EXCLUDED_COMPONENTS = new Set(["Loader", "MobileDatePicker"]);

const COMPONENTS: ComponentEntry[] = Object.entries(STORY_MODULES)
  .map(([path, mod]) => {
    const match = /\/components\/([^/]+)\//.exec(path);
    return { name: match ? match[1] : path, storyExports: mod };
  })
  .filter((entry) => !EXCLUDED_COMPONENTS.has(entry.name));

beforeEach(() => {
  freezeAnimations();
});

afterEach(() => {
  cleanup();
  document.documentElement.removeAttribute("data-theme");
});

describe.each(COMPONENTS)("$name", ({ name, storyExports }) => {
  const exportNames = Object.keys(storyExports).filter((key) => key !== "default");
  const chosenName = exportNames.find((key) => /^Default/i.test(key)) ?? exportNames[0];
  const composed = composeStories(storyExports as never);
  const Story = composed[chosenName as keyof typeof composed] as ComponentType;

  it.each(["light", "dark"] as const)("matches its %s baseline", async (theme) => {
    if (theme === "dark") document.documentElement.setAttribute("data-theme", "dark");
    const { container } = render(<Story />);
    await expectMatchesScreenshot(container, `${name}-${theme}`);
  });
});
