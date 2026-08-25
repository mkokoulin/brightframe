import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { expectNoA11yViolations } from "../../test-utils/a11y";
import { Burger } from "./Burger";
import styles from "./Burger.module.css";

describe("Burger", () => {
  it("calls setOpen(true) when closed and clicked", () => {
    const setOpen = vi.fn();
    render(<Burger open={false} setOpen={setOpen} />);

    fireEvent.click(screen.getByRole("button"));

    expect(setOpen).toHaveBeenCalledWith(true);
  });

  it("calls setOpen(false) when open and clicked", () => {
    const setOpen = vi.fn();
    render(<Burger open setOpen={setOpen} />);

    fireEvent.click(screen.getByRole("button"));

    expect(setOpen).toHaveBeenCalledWith(false);
  });

  it("reflects the open state in the line classes and aria-pressed", () => {
    const { container, rerender } = render(<Burger open={false} setOpen={() => {}} />);
    expect(container.querySelectorAll(`.${styles.lineOpen}`)).toHaveLength(0);
    expect(screen.getByRole("button")).toHaveAttribute("aria-pressed", "false");

    rerender(<Burger open setOpen={() => {}} />);
    expect(container.querySelectorAll(`.${styles.lineOpen}`)).toHaveLength(3);
    expect(screen.getByRole("button")).toHaveAttribute("aria-pressed", "true");
  });

  it("applies a size modifier class for sm/lg", () => {
    const { container: sm } = render(<Burger open={false} setOpen={() => {}} size="sm" />);
    expect(sm.querySelector(`.${styles.sm}`)).toBeInTheDocument();

    const { container: md } = render(<Burger open={false} setOpen={() => {}} />);
    expect(md.querySelector(`.${styles.sm}`)).not.toBeInTheDocument();
    expect(md.querySelector(`.${styles.lg}`)).not.toBeInTheDocument();
  });

  it("sets the --burger-color CSS variable when color is given", () => {
    render(<Burger open={false} setOpen={() => {}} color="#ff0000" />);
    expect(screen.getByRole("button")).toHaveStyle("--burger-color: #ff0000");
  });

  it("has no accessibility violations", async () => {
    const setOpen = vi.fn();
    const { container } = render(<Burger open={false} setOpen={setOpen} />);
    await expectNoA11yViolations(container);
  });
});
