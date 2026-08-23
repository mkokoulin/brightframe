import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
import { Btn } from "./Btn";
import styles from "./Btn.module.css";

describe("Btn", () => {
  it("renders a button by default", () => {
    render(<Btn>Register</Btn>);
    expect(screen.getByRole("button", { name: "Register" })).toBeInTheDocument();
  });

  it("renders as a link when href is given", () => {
    render(<Btn href="/somewhere">Go</Btn>);
    const link = screen.getByRole("link", { name: "Go" });
    expect(link).toHaveAttribute("href", "/somewhere");
  });

  it("applies the primary/md classes by default", () => {
    render(<Btn>Register</Btn>);
    const btn = screen.getByRole("button");
    expect(btn.className).toContain(styles.primary);
    expect(btn.className).toContain(styles.md);
  });

  it("applies the requested variant and size classes", () => {
    render(<Btn variant="danger" size="lg">Delete</Btn>);
    const btn = screen.getByRole("button");
    expect(btn.className).toContain(styles.danger);
    expect(btn.className).toContain(styles.lg);
  });

  it("applies pill and fullWidth modifier classes", () => {
    render(<Btn pill fullWidth>Register</Btn>);
    const btn = screen.getByRole("button");
    expect(btn.className).toContain(styles.pill);
    expect(btn.className).toContain(styles.fullWidth);
  });

  it("renders iconLeft and iconRight", () => {
    render(
      <Btn iconLeft={<span data-testid="icon-left" />} iconRight={<span data-testid="icon-right" />}>
        Next
      </Btn>,
    );
    expect(screen.getByTestId("icon-left")).toBeInTheDocument();
    expect(screen.getByTestId("icon-right")).toBeInTheDocument();
  });

  it("fires onClick and forwards native button props", async () => {
    const onClick = vi.fn();
    render(<Btn onClick={onClick} disabled>Register</Btn>);
    const btn = screen.getByRole("button");
    expect(btn).toBeDisabled();

    await userEvent.click(btn);
    expect(onClick).not.toHaveBeenCalled();
  });

  it("merges a custom className", () => {
    render(<Btn className="custom">Register</Btn>);
    expect(screen.getByRole("button").className).toContain("custom");
  });

  it("renders as a fixed 44×44 icon-only button", () => {
    render(
      <Btn iconOnly aria-label="Search">
        <span data-testid="icon" />
      </Btn>,
    );
    const btn = screen.getByRole("button", { name: "Search" });
    expect(btn.className).toContain(styles.iconOnly);
    expect(screen.getByTestId("icon")).toBeInTheDocument();
  });

  it("shows a spinner, disables the button, and swaps the label while loading", () => {
    render(
      <Btn loading loadingLabel="Sending">
        Send the request
      </Btn>,
    );
    const btn = screen.getByRole("button", { name: "Sending" });
    expect(btn).toBeDisabled();
    expect(btn).toHaveAttribute("aria-busy", "true");
    expect(screen.queryByText("Send the request")).not.toBeInTheDocument();
  });

  it("keeps the original label while loading if no loadingLabel is given", () => {
    render(<Btn loading>Register</Btn>);
    expect(screen.getByRole("button", { name: "Register" })).toBeInTheDocument();
  });

  it("locks the button's pre-loading width so loading doesn't shift the layout", () => {
    const widthSpy = vi.spyOn(HTMLElement.prototype, "offsetWidth", "get").mockReturnValue(190);
    try {
      const { rerender } = render(<Btn>Send the request</Btn>);
      rerender(
        <Btn loading loadingLabel="Sending">
          Send the request
        </Btn>,
      );
      expect(screen.getByRole("button").style.minWidth).toBe("190px");
    } finally {
      widthSpy.mockRestore();
    }
  });

  it("has no accessibility violations", async () => {
    const { container } = render(
      <Btn iconLeft={<span data-testid="icon-left" />} iconRight={<span data-testid="icon-right" />}>
        Next
      </Btn>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
