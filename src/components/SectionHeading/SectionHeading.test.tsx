import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { expectNoA11yViolations } from "../../test-utils/a11y";
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

  it("renders as h1 when as='h1' is given", () => {
    render(<SectionHeading title="Our plans" as="h1" />);
    expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
  });

  it("applies the center alignment class to both title and subtitle", () => {
    render(<SectionHeading title="Our plans" subtitle="Sub" align="center" />);
    expect(screen.getByRole("heading").className).toContain("center");
    expect(screen.getByText("Sub").className).toContain("center");
  });

  it("does not apply an alignment class for the default left align", () => {
    render(<SectionHeading title="Our plans" />);
    expect(screen.getByRole("heading").className).not.toContain("center");
    expect(screen.getByRole("heading").className).not.toContain("right");
  });

  it("has no accessibility violations", async () => {
    const { container } = render(<SectionHeading title="Our plans" subtitle="Sub" align="center" />);
    await expectNoA11yViolations(container);
  });
});
