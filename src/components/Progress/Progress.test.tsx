import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { expectNoA11yViolations } from "../../test-utils/a11y";
import { Progress } from "./Progress";

describe("Progress", () => {
  it("sets aria-valuenow/min/max from value/max", () => {
    render(<Progress value={30} max={100} />);
    const bar = screen.getByRole("progressbar");
    expect(bar).toHaveAttribute("aria-valuenow", "30");
    expect(bar).toHaveAttribute("aria-valuemin", "0");
    expect(bar).toHaveAttribute("aria-valuemax", "100");
  });

  it("clamps value within [0, max]", () => {
    const { rerender } = render(<Progress value={150} max={100} />);
    expect(screen.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "100");

    rerender(<Progress value={-20} max={100} />);
    expect(screen.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "0");
  });

  it("shows a percentage label when showLabel is set", () => {
    render(<Progress value={40} showLabel />);
    expect(screen.getByText("40%")).toBeInTheDocument();
  });

  it("does not show a label by default", () => {
    render(<Progress value={40} />);
    expect(screen.queryByText("40%")).not.toBeInTheDocument();
  });

  it("omits aria-valuenow when indeterminate (no value)", () => {
    render(<Progress />);
    expect(screen.getByRole("progressbar")).not.toHaveAttribute("aria-valuenow");
  });

  it("defaults to an accessible name of Progress", () => {
    render(<Progress value={40} />);
    expect(screen.getByRole("progressbar")).toHaveAttribute("aria-label", "Progress");
  });

  it("uses a custom label as the accessible name", () => {
    render(<Progress value={40} label="Upload progress" />);
    expect(screen.getByRole("progressbar", { name: "Upload progress" })).toBeInTheDocument();
  });

  it("has no accessibility violations", async () => {
    const { container } = render(<Progress value={40} showLabel />);
    await expectNoA11yViolations(container);
  });
});
