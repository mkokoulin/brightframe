import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { Stack } from "./Stack";

describe("Stack", () => {
  it("renders its children", () => {
    render(<Stack>Content</Stack>);
    expect(screen.getByText("Content")).toBeInTheDocument();
  });

  it("renders as a div by default", () => {
    render(<Stack>Content</Stack>);
    expect(screen.getByText("Content").tagName).toBe("DIV");
  });

  it("renders as a different tag when as is given", () => {
    render(<Stack as="section">Content</Stack>);
    expect(screen.getByText("Content").tagName).toBe("SECTION");
  });

  it("merges a custom className", () => {
    render(<Stack className="custom">Content</Stack>);
    expect(screen.getByText("Content").className).toContain("custom");
  });

  it("defaults to column direction and no gap", () => {
    render(<Stack>Content</Stack>);
    const el = screen.getByText("Content");
    expect(el.style.getPropertyValue("--stack-direction-base")).toBe("column");
    expect(el.style.getPropertyValue("--stack-gap-base")).toBe("var(--space-0)");
  });

  it("sets a single gap from the spacing scale as a CSS custom property", () => {
    render(<Stack gap={16}>Content</Stack>);
    expect(screen.getByText("Content").style.getPropertyValue("--stack-gap-base")).toBe("var(--space-16)");
  });

  it("sets per-breakpoint direction and gap as CSS custom properties", () => {
    render(
      <Stack direction={{ base: "column", md: "row" }} gap={{ base: 8, lg: 24 }}>
        Content
      </Stack>,
    );
    const el = screen.getByText("Content");
    expect(el.style.getPropertyValue("--stack-direction-base")).toBe("column");
    expect(el.style.getPropertyValue("--stack-direction-md")).toBe("row");
    expect(el.style.getPropertyValue("--stack-gap-base")).toBe("var(--space-8)");
    expect(el.style.getPropertyValue("--stack-gap-lg")).toBe("var(--space-24)");
  });

  it("passes align and justify through to flex alignment", () => {
    render(
      <Stack align="center" justify="space-between">
        Content
      </Stack>,
    );
    const el = screen.getByText("Content");
    expect(el.style.alignItems).toBe("center");
    expect(el.style.justifyContent).toBe("space-between");
  });

  it("preserves a caller-supplied style alongside generated custom properties", () => {
    render(
      <Stack gap={8} style={{ background: "red" }}>
        Content
      </Stack>,
    );
    const el = screen.getByText("Content");
    expect(el.style.background).toBe("red");
    expect(el.style.getPropertyValue("--stack-gap-base")).toBe("var(--space-8)");
  });

  it("has no accessibility violations", async () => {
    const { container } = render(
      <Stack direction={{ base: "column", md: "row" }} gap={{ base: 8, lg: 24 }}>
        Content
      </Stack>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
