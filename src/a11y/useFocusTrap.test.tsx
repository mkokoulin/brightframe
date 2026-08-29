import { describe, it, expect } from "vitest";
import { useRef } from "react";
import { render, fireEvent } from "@testing-library/react";
import { useFocusTrap } from "./useFocusTrap";

function TrapHarness({ active, empty = false }: { active: boolean; empty?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  useFocusTrap(ref, active);
  return (
    <div>
      <button type="button">outside</button>
      <div ref={ref} tabIndex={-1} data-testid="container">
        {!empty && (
          <>
            <button type="button">first</button>
            <button type="button">second</button>
            <button type="button">last</button>
          </>
        )}
      </div>
    </div>
  );
}

describe("useFocusTrap", () => {
  it("moves focus to the first focusable element on activation", () => {
    const { getByText } = render(<TrapHarness active={true} />);
    expect(document.activeElement).toBe(getByText("first"));
  });

  it("focuses the container itself when it has no focusable children", () => {
    const { getByTestId } = render(<TrapHarness active={true} empty />);
    expect(document.activeElement).toBe(getByTestId("container"));
  });

  it("does nothing when inactive", () => {
    render(<TrapHarness active={false} />);
    expect(document.activeElement).toBe(document.body);
  });

  it("wraps Tab from the last element back to the first", () => {
    const { getByText } = render(<TrapHarness active={true} />);
    const last = getByText("last");
    last.focus();
    fireEvent.keyDown(getByText("first").parentElement!, { key: "Tab" });
    expect(document.activeElement).toBe(getByText("first"));
  });

  it("wraps Shift+Tab from the first element back to the last", () => {
    const { getByText } = render(<TrapHarness active={true} />);
    fireEvent.keyDown(getByText("first").parentElement!, { key: "Tab", shiftKey: true });
    expect(document.activeElement).toBe(getByText("last"));
  });

  it("restores focus to the previously-focused element on deactivation", () => {
    const { getByText, rerender } = render(<TrapHarness active={false} />);
    const outside = getByText("outside");
    outside.focus();
    expect(document.activeElement).toBe(outside);

    rerender(<TrapHarness active={true} />);
    expect(document.activeElement).toBe(getByText("first"));

    rerender(<TrapHarness active={false} />);
    expect(document.activeElement).toBe(outside);
  });
});
