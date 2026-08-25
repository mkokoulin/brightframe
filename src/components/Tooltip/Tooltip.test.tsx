import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { expectNoA11yViolations } from "../../test-utils/a11y";
import { Tooltip } from "./Tooltip";

describe("Tooltip", () => {
  it("does not render the bubble until triggered", () => {
    render(
      <Tooltip content="Hint">
        <button type="button">Trigger</button>
      </Tooltip>,
    );
    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
  });

  it("shows the bubble on mouse enter and hides it on mouse leave", () => {
    render(
      <Tooltip content="Hint">
        <button type="button">Trigger</button>
      </Tooltip>,
    );
    const wrap = screen.getByText("Trigger").parentElement as HTMLElement;

    fireEvent.mouseEnter(wrap);
    expect(screen.getByRole("tooltip")).toHaveTextContent("Hint");

    fireEvent.mouseLeave(wrap);
    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
  });

  it("shows the bubble on focus and hides it on blur", () => {
    render(
      <Tooltip content="Hint">
        <button type="button">Trigger</button>
      </Tooltip>,
    );
    const button = screen.getByRole("button", { name: "Trigger" });

    fireEvent.focus(button);
    expect(screen.getByRole("tooltip")).toBeInTheDocument();

    fireEvent.blur(button);
    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
  });

  it("hides on Escape", () => {
    render(
      <Tooltip content="Hint">
        <button type="button">Trigger</button>
      </Tooltip>,
    );
    const button = screen.getByRole("button", { name: "Trigger" });
    fireEvent.focus(button);
    expect(screen.getByRole("tooltip")).toBeInTheDocument();

    fireEvent.keyDown(button, { key: "Escape" });
    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
  });

  it("never shows when disabled", () => {
    render(
      <Tooltip content="Hint" disabled>
        <button type="button">Trigger</button>
      </Tooltip>,
    );
    fireEvent.mouseEnter(screen.getByText("Trigger").parentElement as HTMLElement);
    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
  });

  it("respects the delay prop before showing", async () => {
    vi.useFakeTimers();
    render(
      <Tooltip content="Hint" delay={200}>
        <button type="button">Trigger</button>
      </Tooltip>,
    );
    const wrap = screen.getByText("Trigger").parentElement as HTMLElement;
    fireEvent.mouseEnter(wrap);
    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(200);
    });
    expect(screen.getByRole("tooltip")).toBeInTheDocument();
    vi.useRealTimers();
  });

  it("has no accessibility violations with the tooltip open", async () => {
    const { container } = render(
      <Tooltip content="Hint">
        <button type="button">Trigger</button>
      </Tooltip>,
    );
    const button = screen.getByRole("button", { name: "Trigger" });
    fireEvent.focus(button);
    await expectNoA11yViolations(container);
  });
});
