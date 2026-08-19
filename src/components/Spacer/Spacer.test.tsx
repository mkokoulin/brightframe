import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { Spacer } from "./Spacer";

describe("Spacer", () => {
  it("renders a div hidden from assistive tech", () => {
    const { container } = render(<Spacer />);
    const el = container.firstElementChild as HTMLElement;
    expect(el.tagName).toBe("DIV");
    expect(el.getAttribute("aria-hidden")).toBe("true");
  });

  it("defaults to a 16px vertical spacer", () => {
    const { container } = render(<Spacer />);
    const el = container.firstElementChild as HTMLElement;
    expect(el.style.height).toBe("var(--space-16)");
    expect(el.style.width).toBe("");
  });

  it("sets width for a horizontal spacer from the spacing scale", () => {
    const { container } = render(<Spacer axis="horizontal" size={24} />);
    const el = container.firstElementChild as HTMLElement;
    expect(el.style.width).toBe("var(--space-24)");
    expect(el.style.height).toBe("");
  });

  it("grows to fill available space when size is auto", () => {
    const { container } = render(<Spacer size="auto" />);
    const el = container.firstElementChild as HTMLElement;
    expect(el.style.flex).toBe("1 0 0px");
    expect(el.style.width).toBe("");
    expect(el.style.height).toBe("");
  });

  it("merges a custom className", () => {
    const { container } = render(<Spacer className="custom" />);
    expect((container.firstElementChild as HTMLElement).className).toContain("custom");
  });

  it("preserves a caller-supplied style", () => {
    const { container } = render(<Spacer style={{ background: "red" }} />);
    expect((container.firstElementChild as HTMLElement).style.background).toBe("red");
  });
});
