import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { expectNoA11yViolations } from "../../test-utils/a11y";
import { Accordion, type AccordionItem } from "./Accordion";

const ITEMS: AccordionItem[] = [
  { id: "a", title: "A", content: "Content A" },
  { id: "b", title: "B", content: "Content B" },
  { id: "c", title: "C", content: "Content C", disabled: true },
];

describe("Accordion", () => {
  it("renders all items collapsed by default", () => {
    render(<Accordion items={ITEMS} />);
    expect(screen.getByRole("button", { name: "A" })).toHaveAttribute("aria-expanded", "false");
    expect(screen.getByRole("button", { name: "B" })).toHaveAttribute("aria-expanded", "false");
  });

  it("opens an item on click", () => {
    render(<Accordion items={ITEMS} />);
    fireEvent.click(screen.getByRole("button", { name: "A" }));
    expect(screen.getByRole("button", { name: "A" })).toHaveAttribute("aria-expanded", "true");
  });

  it("closes an open item on second click", () => {
    render(<Accordion items={ITEMS} defaultValue={["a"]} />);
    fireEvent.click(screen.getByRole("button", { name: "A" }));
    expect(screen.getByRole("button", { name: "A" })).toHaveAttribute("aria-expanded", "false");
  });

  it("closes the previously open item when opening another (single mode)", () => {
    render(<Accordion items={ITEMS} defaultValue={["a"]} />);
    fireEvent.click(screen.getByRole("button", { name: "B" }));
    expect(screen.getByRole("button", { name: "A" })).toHaveAttribute("aria-expanded", "false");
    expect(screen.getByRole("button", { name: "B" })).toHaveAttribute("aria-expanded", "true");
  });

  it("keeps multiple items open when multiple is set", () => {
    render(<Accordion items={ITEMS} multiple defaultValue={["a"]} />);
    fireEvent.click(screen.getByRole("button", { name: "B" }));
    expect(screen.getByRole("button", { name: "A" })).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByRole("button", { name: "B" })).toHaveAttribute("aria-expanded", "true");
  });

  it("does not open a disabled item", () => {
    render(<Accordion items={ITEMS} />);
    fireEvent.click(screen.getByRole("button", { name: "C" }));
    expect(screen.getByRole("button", { name: "C" })).toHaveAttribute("aria-expanded", "false");
  });

  it("calls onChange with the next open ids and respects controlled value", () => {
    const onChange = vi.fn();
    render(<Accordion items={ITEMS} value={["a"]} onChange={onChange} />);
    fireEvent.click(screen.getByRole("button", { name: "B" }));
    expect(onChange).toHaveBeenCalledWith(["b"]);
    // still reflects the controlled value since the parent didn't update it
    expect(screen.getByRole("button", { name: "A" })).toHaveAttribute("aria-expanded", "true");
  });

  it("has no accessibility violations with an item open", async () => {
    const { container } = render(<Accordion items={ITEMS} />);
    fireEvent.click(screen.getByRole("button", { name: "A" }));
    await expectNoA11yViolations(container);
  });
});
