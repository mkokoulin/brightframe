import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { expectNoA11yViolations } from "../../test-utils/a11y";
import { SubTitle } from "./SubTitle";

describe("SubTitle", () => {
  it("renders its children as an <h2>", () => {
    render(<SubTitle>Workspaces and meeting rooms</SubTitle>);
    expect(screen.getByRole("heading", { level: 2, name: "Workspaces and meeting rooms" })).toBeInTheDocument();
  });

  it("merges a custom className", () => {
    render(<SubTitle className="custom">Workspaces</SubTitle>);
    expect(screen.getByRole("heading").className).toContain("custom");
  });

  it("renders as a different tag when as is given", () => {
    render(<SubTitle as="h3">Workspaces</SubTitle>);
    expect(screen.getByRole("heading", { level: 3 })).toBeInTheDocument();
  });

  it("has no accessibility violations", async () => {
    const { container } = render(<SubTitle>Workspaces and meeting rooms</SubTitle>);
    await expectNoA11yViolations(container);
  });
});
