import { axe } from "jest-axe";
import { expect } from "vitest";

export { axe };

/** Asserts an axe scan of `container` finds zero WCAG violations. */
export async function expectNoA11yViolations(container: Element): Promise<void> {
  const results = await axe(container);
  expect(results).toHaveNoViolations();
}
