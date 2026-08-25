import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { expectNoA11yViolations } from "../../test-utils/a11y";
import { Drawer } from "./Drawer";

describe("Drawer", () => {
  it("renders nothing when closed", () => {
    render(
      <Drawer open={false} onClose={vi.fn()}>
        Body
      </Drawer>,
    );
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("renders the panel with title and body when open", () => {
    render(
      <Drawer open onClose={vi.fn()} title="Filters">
        Body content
      </Drawer>,
    );
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText("Filters")).toBeInTheDocument();
    expect(screen.getByText("Body content")).toBeInTheDocument();
  });

  it("closes when the close button is clicked", () => {
    const onClose = vi.fn();
    render(
      <Drawer open onClose={onClose} title="Filters">
        Body
      </Drawer>,
    );
    fireEvent.click(screen.getByRole("button", { name: "Close" }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("closes on Escape", () => {
    const onClose = vi.fn();
    render(
      <Drawer open onClose={onClose}>
        Body
      </Drawer>,
    );
    fireEvent.keyDown(document, { key: "Escape" });
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("closes when the overlay is clicked", () => {
    const onClose = vi.fn();
    render(
      <Drawer open onClose={onClose}>
        Body
      </Drawer>,
    );
    const overlay = document.querySelector('[class*="overlay"]');
    fireEvent.pointerDown(overlay as Element);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("does not close on overlay click when closeOnOverlayClick is false", () => {
    const onClose = vi.fn();
    render(
      <Drawer open onClose={onClose} closeOnOverlayClick={false}>
        Body
      </Drawer>,
    );
    const overlay = document.querySelector('[class*="overlay"]');
    fireEvent.pointerDown(overlay as Element);
    expect(onClose).not.toHaveBeenCalled();
  });

  it("does not close when clicking inside the panel", () => {
    const onClose = vi.fn();
    render(
      <Drawer open onClose={onClose} title="Filters">
        Body
      </Drawer>,
    );
    fireEvent.pointerDown(screen.getByRole("dialog"));
    expect(onClose).not.toHaveBeenCalled();
  });

  it("applies the placement class", () => {
    render(
      <Drawer open onClose={vi.fn()} placement="left">
        Body
      </Drawer>,
    );
    expect(screen.getByRole("dialog").className).toMatch(/left/);
  });

  it("has no accessibility violations", async () => {
    render(
      <Drawer open onClose={vi.fn()} title="Filters">
        Body content
      </Drawer>,
    );
    await expectNoA11yViolations(document.body);
  });
});
