import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { expectNoA11yViolations } from "../../test-utils/a11y";
import { Popover } from "./Popover";

describe("Popover", () => {
  it("is closed by default", () => {
    render(<Popover trigger="Open">Panel content</Popover>);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("opens on trigger click and closes on a second click", () => {
    render(<Popover trigger="Open">Panel content</Popover>);
    const trigger = screen.getByRole("button", { name: "Open" });

    fireEvent.click(trigger);
    expect(screen.getByRole("dialog")).toHaveTextContent("Panel content");

    fireEvent.click(trigger);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("closes when clicking outside", () => {
    render(<Popover trigger="Open">Panel content</Popover>);
    fireEvent.click(screen.getByRole("button", { name: "Open" }));
    expect(screen.getByRole("dialog")).toBeInTheDocument();

    fireEvent.pointerDown(document.body);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("closes on Escape and returns focus to the trigger", () => {
    render(<Popover trigger="Open">Panel content</Popover>);
    const trigger = screen.getByRole("button", { name: "Open" });
    fireEvent.click(trigger);
    expect(screen.getByRole("dialog")).toBeInTheDocument();

    fireEvent.keyDown(document, { key: "Escape" });
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });

  it("supports controlled open state", () => {
    const onOpenChange = vi.fn();
    const { rerender } = render(
      <Popover trigger="Open" open={false} onOpenChange={onOpenChange}>
        Panel content
      </Popover>,
    );
    fireEvent.click(screen.getByRole("button", { name: "Open" }));
    expect(onOpenChange).toHaveBeenCalledWith(true);
    // stays closed since the parent didn't update the `open` prop
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

    rerender(
      <Popover trigger="Open" open onOpenChange={onOpenChange}>
        Panel content
      </Popover>,
    );
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("labels the panel from the trigger", () => {
    render(<Popover trigger="Open">Panel content</Popover>);
    fireEvent.click(screen.getByRole("button", { name: "Open" }));
    expect(screen.getByRole("dialog", { name: "Open" })).toBeInTheDocument();
  });

  it("has no accessibility violations with the panel open", async () => {
    render(<Popover trigger="Open">Panel content</Popover>);
    fireEvent.click(screen.getByRole("button", { name: "Open" }));
    await expectNoA11yViolations(document.body);
  });
});
