import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { expectNoA11yViolations } from "../../test-utils/a11y";
import { Badge } from "./Badge";

describe("Badge", () => {
  it("renders its children", () => {
    render(<Badge>-20%</Badge>);
    expect(screen.getByText("-20%")).toBeInTheDocument();
  });

  it("renders as a div by default", () => {
    render(<Badge>-20%</Badge>);
    expect(screen.getByText("-20%").tagName).toBe("DIV");
  });

  it("renders as a different tag when as is given", () => {
    render(<Badge as="span">-20%</Badge>);
    expect(screen.getByText("-20%").tagName).toBe("SPAN");
  });

  it("defaults to the top-right corner", () => {
    render(<Badge>-20%</Badge>);
    const el = screen.getByText("-20%");
    expect(el.className).toContain("topRight");
  });

  it("switches corner classes when corner is given", () => {
    render(<Badge corner="bottom-left">-20%</Badge>);
    const el = screen.getByText("-20%");
    expect(el.className).toContain("bottomLeft");
    expect(el.className).not.toContain("topRight");
  });

  it("merges a custom className", () => {
    render(<Badge className="custom">-20%</Badge>);
    expect(screen.getByText("-20%").className).toContain("custom");
  });

  it("has no accessibility violations", async () => {
    const { container } = render(<Badge corner="bottom-left">-20%</Badge>);
    await expectNoA11yViolations(container);
  });
});
