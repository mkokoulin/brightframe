import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { Skeleton } from "./Skeleton";

describe("Skeleton", () => {
  it("renders a single text placeholder by default", () => {
    const { container } = render(<Skeleton />);
    const el = container.firstElementChild as HTMLElement;
    expect(el.tagName).toBe("SPAN");
    expect(el).toHaveAttribute("aria-hidden", "true");
  });

  it("renders the requested variant", () => {
    const { container } = render(<Skeleton variant="circle" />);
    expect(container.querySelector('[class*="circle"]')).toBeInTheDocument();
  });

  it("applies width and height as inline styles", () => {
    const { container } = render(<Skeleton variant="rect" width={160} height={80} />);
    const el = container.firstElementChild as HTMLElement;
    expect(el).toHaveStyle({ width: "160px", height: "80px" });
  });

  it("renders multiple lines for variant=text with lines > 1", () => {
    const { container } = render(<Skeleton variant="text" lines={3} />);
    expect(container.querySelectorAll('[class*="text"]').length).toBe(3);
  });

  it("renders the last line shorter than the others", () => {
    const { container } = render(<Skeleton variant="text" lines={2} width="100%" />);
    const spans = container.querySelectorAll("span");
    expect(spans[0]).toHaveStyle({ width: "100%" });
    expect(spans[1]).toHaveStyle({ width: "70%" });
  });

  it("merges a custom className", () => {
    const { container } = render(<Skeleton className="custom" />);
    expect((container.firstElementChild as HTMLElement).className).toContain("custom");
  });
});
