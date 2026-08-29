import { useState } from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { expectNoA11yViolations } from "../../test-utils/a11y";
import { Modal } from "./Modal";

describe("Modal", () => {
  it("renders nothing when closed", () => {
    render(
      <Modal open={false} onClose={vi.fn()}>
        Body
      </Modal>,
    );
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("renders the dialog with title and body when open", () => {
    render(
      <Modal open onClose={vi.fn()} title="Confirm booking">
        Body content
      </Modal>,
    );
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText("Confirm booking")).toBeInTheDocument();
    expect(screen.getByText("Body content")).toBeInTheDocument();
  });

  it("closes when the close button is clicked", () => {
    const onClose = vi.fn();
    render(
      <Modal open onClose={onClose} title="Title">
        Body
      </Modal>,
    );
    fireEvent.click(screen.getByRole("button", { name: "Close" }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("closes on Escape key", () => {
    const onClose = vi.fn();
    render(
      <Modal open onClose={onClose}>
        Body
      </Modal>,
    );
    fireEvent.keyDown(document, { key: "Escape" });
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("closes when the overlay is clicked", () => {
    const onClose = vi.fn();
    render(
      <Modal open onClose={onClose}>
        Body
      </Modal>,
    );
    const overlay = document.querySelector('[class*="overlay"]');
    fireEvent.pointerDown(overlay as Element);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("does not close on overlay click when closeOnOverlayClick is false", () => {
    const onClose = vi.fn();
    render(
      <Modal open onClose={onClose} closeOnOverlayClick={false}>
        Body
      </Modal>,
    );
    const overlay = document.querySelector('[class*="overlay"]');
    fireEvent.pointerDown(overlay as Element);
    expect(onClose).not.toHaveBeenCalled();
  });

  it("does not close when clicking inside the dialog", () => {
    const onClose = vi.fn();
    render(
      <Modal open onClose={onClose} title="Title">
        Body
      </Modal>,
    );
    fireEvent.pointerDown(screen.getByRole("dialog"));
    expect(onClose).not.toHaveBeenCalled();
  });

  it("renders a footer when provided", () => {
    render(
      <Modal open onClose={vi.fn()} footer={<button type="button">Confirm</button>}>
        Body
      </Modal>,
    );
    expect(screen.getByRole("button", { name: "Confirm" })).toBeInTheDocument();
  });

  it("moves focus to the dialog's first focusable element (the close button) on open", () => {
    render(
      <Modal open onClose={vi.fn()} title="Title">
        <button type="button">Body button</button>
      </Modal>,
    );
    expect(document.activeElement).toBe(screen.getByRole("button", { name: "Close" }));
  });

  it("restores focus to the trigger element when it closes", () => {
    function Wrapper() {
      const [open, setOpen] = useState(false);
      return (
        <>
          <button type="button" onClick={() => setOpen(true)}>
            Open
          </button>
          <Modal open={open} onClose={() => setOpen(false)} title="Title">
            Body
          </Modal>
        </>
      );
    }
    render(<Wrapper />);
    const trigger = screen.getByRole("button", { name: "Open" });
    trigger.focus();
    fireEvent.click(trigger);
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    fireEvent.keyDown(document, { key: "Escape" });
    expect(document.activeElement).toBe(trigger);
  });

  it("has no accessibility violations", async () => {
    render(
      <Modal open onClose={vi.fn()} title="Confirm booking" footer={<button type="button">Confirm</button>}>
        Body content
      </Modal>,
    );
    await expectNoA11yViolations(document.body);
  });
});
