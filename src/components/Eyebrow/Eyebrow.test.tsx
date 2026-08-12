import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Eyebrow } from "./Eyebrow";

describe("Eyebrow", () => {
  it("renders its children inside a <p>", () => {
    render(<Eyebrow>Coworking</Eyebrow>);
    const el = screen.getByText("Coworking");
    expect(el.tagName).toBe("P");
  });

  it("merges a custom className", () => {
    render(<Eyebrow className="custom">Coworking</Eyebrow>);
    expect(screen.getByText("Coworking").className).toContain("custom");
  });
});
