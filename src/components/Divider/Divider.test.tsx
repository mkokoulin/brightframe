import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { Divider } from "./Divider";

describe("Divider", () => {
  it("renders a horizontal separator by default", () => {
    render(<Divider />);
    expect(screen.getByRole("separator")).toHaveAttribute("aria-orientation", "horizontal");
  });

  it("renders a vertical separator", () => {
    render(<Divider orientation="vertical" />);
    expect(screen.getByRole("separator")).toHaveAttribute("aria-orientation", "vertical");
  });

  it("renders the label text when provided", () => {
    render(<Divider label="OR" />);
    expect(screen.getByText("OR")).toBeInTheDocument();
    expect(screen.getByRole("separator")).toHaveAttribute("aria-orientation", "horizontal");
  });

  it("merges a custom className", () => {
    render(<Divider className="custom" />);
    expect(screen.getByRole("separator").className).toContain("custom");
  });

  it("has no accessibility violations", async () => {
    const { container } = render(<Divider label="OR" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
