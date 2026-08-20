import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { axe } from "jest-axe";
import { DropdownMenu, type DropdownMenuEntry } from "./DropdownMenu";

const ITEMS: DropdownMenuEntry[] = [
  { id: "edit", label: "Edit" },
  { id: "duplicate", label: "Duplicate" },
  "separator",
  { id: "archive", label: "Archive", disabled: true },
  { id: "delete", label: "Delete", danger: true },
];

describe("DropdownMenu", () => {
  it("is closed by default", () => {
    render(<DropdownMenu trigger="Actions" items={ITEMS} />);
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  });

  it("opens on trigger click and focuses the first enabled item", () => {
    render(<DropdownMenu trigger="Actions" items={ITEMS} />);
    fireEvent.click(screen.getByRole("button", { name: "Actions" }));
    expect(screen.getByRole("menu")).toBeInTheDocument();
    expect(screen.getByRole("menuitem", { name: "Edit" })).toHaveFocus();
  });

  it("calls onSelect and closes when an item is clicked", () => {
    const onSelect = vi.fn();
    const items: DropdownMenuEntry[] = [{ id: "edit", label: "Edit", onSelect }];
    render(<DropdownMenu trigger="Actions" items={items} />);
    fireEvent.click(screen.getByRole("button", { name: "Actions" }));
    fireEvent.click(screen.getByRole("menuitem", { name: "Edit" }));
    expect(onSelect).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  });

  it("moves focus with ArrowDown, skipping disabled items", () => {
    render(<DropdownMenu trigger="Actions" items={ITEMS} />);
    fireEvent.click(screen.getByRole("button", { name: "Actions" }));
    const edit = screen.getByRole("menuitem", { name: "Edit" });
    fireEvent.keyDown(edit, { key: "ArrowDown" });
    expect(screen.getByRole("menuitem", { name: "Duplicate" })).toHaveFocus();

    fireEvent.keyDown(screen.getByRole("menuitem", { name: "Duplicate" }), { key: "ArrowDown" });
    expect(screen.getByRole("menuitem", { name: "Delete" })).toHaveFocus();
  });

  it("closes on Escape and refocuses the trigger", () => {
    render(<DropdownMenu trigger="Actions" items={ITEMS} />);
    const trigger = screen.getByRole("button", { name: "Actions" });
    fireEvent.click(trigger);
    fireEvent.keyDown(screen.getByRole("menuitem", { name: "Edit" }), { key: "Escape" });
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });

  it("closes when clicking outside", () => {
    render(<DropdownMenu trigger="Actions" items={ITEMS} />);
    fireEvent.click(screen.getByRole("button", { name: "Actions" }));
    expect(screen.getByRole("menu")).toBeInTheDocument();
    fireEvent.pointerDown(document.body);
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  });

  it("does not render a disabled item as clickable", () => {
    render(<DropdownMenu trigger="Actions" items={ITEMS} />);
    fireEvent.click(screen.getByRole("button", { name: "Actions" }));
    expect(screen.getByRole("menuitem", { name: "Archive" })).toBeDisabled();
  });

  it("has no accessibility violations with the menu open", async () => {
    const { container } = render(<DropdownMenu trigger="Actions" items={ITEMS} />);
    fireEvent.click(screen.getByRole("button", { name: "Actions" }));
    expect(await axe(container)).toHaveNoViolations();
  });
});
