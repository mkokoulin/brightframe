import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { expectNoA11yViolations } from "../../test-utils/a11y";
import { BorderBeam } from "./BorderBeam";

describe("BorderBeam", () => {
  it("renders its children", () => {
    render(<BorderBeam>Content</BorderBeam>);
    expect(screen.getByText("Content")).toBeInTheDocument();
  });

  it("applies default color, duration, line width, radius and arc as CSS custom properties", () => {
    render(<BorderBeam>Content</BorderBeam>);
    const wrapper = screen.getByText("Content");
    expect(wrapper.style.getPropertyValue("--bf-color-1")).toBe("var(--c-brand)");
    expect(wrapper.style.getPropertyValue("--bf-color-2")).toBe("var(--c-accent)");
    expect(wrapper.style.getPropertyValue("--bf-duration")).toBe("6s");
    expect(wrapper.style.getPropertyValue("--bf-line-width")).toBe("1.5px");
    expect(wrapper.style.getPropertyValue("--bf-radius")).toBe("var(--radius-lg)");
    expect(wrapper.style.getPropertyValue("--bf-arc")).toBe("100deg");
  });

  it("maps size to its arc degrees", () => {
    const { rerender } = render(<BorderBeam size="compact">Content</BorderBeam>);
    let wrapper = screen.getByText("Content");
    expect(wrapper.style.getPropertyValue("--bf-arc")).toBe("60deg");

    rerender(<BorderBeam size="extended">Content</BorderBeam>);
    wrapper = screen.getByText("Content");
    expect(wrapper.style.getPropertyValue("--bf-arc")).toBe("160deg");
  });

  it("accepts custom colors, duration, lineWidth and a numeric radius", () => {
    render(
      <BorderBeam colors={["#f472b6", "#a78bfa"]} duration={4} lineWidth={2} radius={20}>
        Content
      </BorderBeam>,
    );
    const wrapper = screen.getByText("Content");
    expect(wrapper.style.getPropertyValue("--bf-color-1")).toBe("#f472b6");
    expect(wrapper.style.getPropertyValue("--bf-color-2")).toBe("#a78bfa");
    expect(wrapper.style.getPropertyValue("--bf-duration")).toBe("4s");
    expect(wrapper.style.getPropertyValue("--bf-line-width")).toBe("2px");
    expect(wrapper.style.getPropertyValue("--bf-radius")).toBe("20px");
  });

  it("merges a custom className onto the wrapper", () => {
    render(<BorderBeam className="custom">Content</BorderBeam>);
    const wrapper = screen.getByText("Content");
    expect(wrapper.className).toContain("custom");
  });

  it("passes through native div attributes", () => {
    render(<BorderBeam data-testid="beam-wrapper">Content</BorderBeam>);
    expect(screen.getByTestId("beam-wrapper")).toBeInTheDocument();
  });

  it("has no accessibility violations", async () => {
    const { container } = render(<BorderBeam>Content</BorderBeam>);
    await expectNoA11yViolations(container);
  });
});
