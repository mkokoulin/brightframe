import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Container } from "./Container";

describe("Container", () => {
  it("renders its children", () => {
    render(<Container>Page content</Container>);
    expect(screen.getByText("Page content")).toBeInTheDocument();
  });

  it("merges a custom className", () => {
    render(<Container className="custom">Page content</Container>);
    expect(screen.getByText("Page content").className).toContain("custom");
  });

  it("renders as a div by default", () => {
    render(<Container>Page content</Container>);
    expect(screen.getByText("Page content").tagName).toBe("DIV");
  });

  it("renders as a different tag when as is given", () => {
    render(<Container as="main">Page content</Container>);
    expect(screen.getByText("Page content").tagName).toBe("MAIN");
  });
});
