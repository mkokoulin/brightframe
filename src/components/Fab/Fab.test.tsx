import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expectNoA11yViolations } from "../../test-utils/a11y";
import { Fab } from "./Fab";

describe("Fab", () => {
  it("renders as a button", () => {
    render(<Fab label="Scroll down">↓</Fab>);
    expect(screen.getByRole("button", { name: "Scroll down" }).tagName).toBe("BUTTON");
  });

  it("sets type=button so it doesn't submit a form by default", () => {
    render(<Fab label="Scroll down">↓</Fab>);
    expect(screen.getByRole("button", { name: "Scroll down" })).toHaveAttribute("type", "button");
  });

  it("uses the label as the accessible name", () => {
    render(<Fab label="Contact support">?</Fab>);
    expect(screen.getByRole("button", { name: "Contact support" })).toBeInTheDocument();
  });

  it("calls onClick when clicked", async () => {
    const onClick = vi.fn();
    render(
      <Fab label="Scroll down" onClick={onClick}>
        ↓
      </Fab>,
    );
    await userEvent.click(screen.getByRole("button", { name: "Scroll down" }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("is disabled when disabled is passed", () => {
    render(
      <Fab label="Scroll down" disabled>
        ↓
      </Fab>,
    );
    expect(screen.getByRole("button", { name: "Scroll down" })).toBeDisabled();
  });

  it("merges a custom className", () => {
    render(
      <Fab label="Scroll down" className="custom">
        ↓
      </Fab>,
    );
    expect(screen.getByRole("button", { name: "Scroll down" }).className).toContain("custom");
  });

  it("has no accessibility violations", async () => {
    const { container } = render(<Fab label="Scroll down">↓</Fab>);
    await expectNoA11yViolations(container);
  });
});
