import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { axe } from "jest-axe";
import { Tabs, type TabItem } from "./Tabs";

const ITEMS: TabItem[] = [
  { id: "a", label: "A", content: "Content A" },
  { id: "b", label: "B", content: "Content B" },
  { id: "c", label: "C", content: "Content C", disabled: true },
];

describe("Tabs", () => {
  it("renders the first enabled tab as active by default", () => {
    render(<Tabs items={ITEMS} />);
    expect(screen.getByRole("tab", { name: "A" })).toHaveAttribute("aria-selected", "true");
    expect(screen.getByText("Content A")).toBeInTheDocument();
  });

  it("respects defaultValue", () => {
    render(<Tabs items={ITEMS} defaultValue="b" />);
    expect(screen.getByRole("tab", { name: "B" })).toHaveAttribute("aria-selected", "true");
    expect(screen.getByText("Content B")).toBeInTheDocument();
  });

  it("switches tabs on click and calls onChange", () => {
    const onChange = vi.fn();
    render(<Tabs items={ITEMS} onChange={onChange} />);
    fireEvent.click(screen.getByRole("tab", { name: "B" }));
    expect(onChange).toHaveBeenCalledWith("b");
    expect(screen.getByRole("tab", { name: "B" })).toHaveAttribute("aria-selected", "true");
    expect(screen.getByText("Content B")).toBeInTheDocument();
  });

  it("does not activate a disabled tab", () => {
    render(<Tabs items={ITEMS} />);
    fireEvent.click(screen.getByRole("tab", { name: "C" }));
    expect(screen.getByRole("tab", { name: "A" })).toHaveAttribute("aria-selected", "true");
  });

  it("respects a controlled value over internal state", () => {
    const onChange = vi.fn();
    render(<Tabs items={ITEMS} value="b" onChange={onChange} />);
    fireEvent.click(screen.getByRole("tab", { name: "A" }));
    expect(onChange).toHaveBeenCalledWith("a");
    // still shows "b" as selected since the parent didn't update `value`
    expect(screen.getByRole("tab", { name: "B" })).toHaveAttribute("aria-selected", "true");
  });

  it("moves focus and selection with ArrowRight, skipping disabled tabs", () => {
    render(<Tabs items={ITEMS} />);
    const tabA = screen.getByRole("tab", { name: "A" });
    tabA.focus();
    fireEvent.keyDown(tabA, { key: "ArrowRight" });
    expect(screen.getByRole("tab", { name: "B" })).toHaveAttribute("aria-selected", "true");
    expect(screen.getByRole("tab", { name: "B" })).toHaveFocus();
  });

  it("wraps around with ArrowLeft from the first tab, skipping disabled tabs", () => {
    render(<Tabs items={ITEMS} />);
    const tabA = screen.getByRole("tab", { name: "A" });
    tabA.focus();
    fireEvent.keyDown(tabA, { key: "ArrowLeft" });
    expect(screen.getByRole("tab", { name: "B" })).toHaveAttribute("aria-selected", "true");
  });

  it("jumps to the last tab with End", () => {
    render(<Tabs items={ITEMS} />);
    const tabA = screen.getByRole("tab", { name: "A" });
    tabA.focus();
    fireEvent.keyDown(tabA, { key: "End" });
    expect(screen.getByRole("tab", { name: "B" })).toHaveAttribute("aria-selected", "true");
  });

  it("has no accessibility violations", async () => {
    const { container } = render(<Tabs items={ITEMS} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
