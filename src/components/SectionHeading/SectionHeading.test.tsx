import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { SectionHeading } from "./SectionHeading";

describe("SectionHeading", () => {
  it("renders the title as an <h2>", () => {
    render(<SectionHeading title="Our plans" />);
    const heading = screen.getByRole("heading", { level: 2, name: "Our plans" });
    expect(heading).toBeInTheDocument();
  });

  it("does not render a subtitle paragraph when none is given", () => {
    render(<SectionHeading title="Our plans" />);
    expect(screen.queryByText(/./, { selector: "p" })).not.toBeInTheDocument();
  });

  it("renders the subtitle when given", () => {
    render(<SectionHeading title="Our plans" subtitle="Flexible options for any work rhythm" />);
    expect(screen.getByText("Flexible options for any work rhythm").tagName).toBe("P");
  });

  it("merges a custom className onto the title", () => {
    render(<SectionHeading title="Our plans" className="custom" />);
    expect(screen.getByRole("heading").className).toContain("custom");
  });
});
