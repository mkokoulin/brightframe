import { expect } from "vitest";

// Starting point, not a final tuned number — see docs/visual-regression.md for how to
// re-tune after the first real CI run surfaces its actual cross-machine noise.
const SCREENSHOT_OPTIONS = {
  comparatorName: "pixelmatch",
  comparatorOptions: { allowedMismatchedPixelRatio: 0.01 },
} as const;

/** Asserts `element` matches its committed baseline screenshot named `name`. */
export async function expectMatchesScreenshot(element: HTMLElement, name: string): Promise<void> {
  await expect.element(element).toMatchScreenshot(name, SCREENSHOT_OPTIONS);
}
