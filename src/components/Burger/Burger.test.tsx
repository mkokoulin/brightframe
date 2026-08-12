import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
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
});
