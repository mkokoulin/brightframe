import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, within } from "@testing-library/react";
import { MobileDatePicker } from "./MobileDatePicker";

const START = new Date(2026, 5, 10); // 10 Jun 2026
const END = new Date(2026, 5, 10);

function dayButton(container: HTMLElement, day: number) {
  const buttons = within(container).getAllByRole("button", { name: String(day) });
  return buttons[0];
}

describe("MobileDatePicker", () => {
  it("renders nothing when closed", () => {
    render(<MobileDatePicker open={false} onClose={vi.fn()} value={{ start: START, end: END }} onChange={vi.fn()} />);
    expect(screen.queryByText("Reset")).not.toBeInTheDocument();
  });

  it("renders the calendar when open, with default English labels", () => {
    render(<MobileDatePicker open onClose={vi.fn()} value={{ start: START, end: END }} onChange={vi.fn()} />);
    expect(screen.getByText("Reset")).toBeInTheDocument();
    expect(screen.getByText("Apply")).toBeInTheDocument();
  });

  it("closes when the close button is clicked", () => {
    const onClose = vi.fn();
    render(<MobileDatePicker open onClose={onClose} value={{ start: START, end: END }} onChange={vi.fn()} />);

    fireEvent.click(screen.getByRole("button", { name: "Close" }));

    expect(onClose).toHaveBeenCalled();
  });

  it("closes when clicking the overlay", () => {
    const onClose = vi.fn();
    render(<MobileDatePicker open onClose={onClose} value={{ start: START, end: END }} onChange={vi.fn()} />);

    const overlay = document.querySelector('[class*="overlay"]');
    fireEvent.pointerDown(overlay as Element);

    expect(onClose).toHaveBeenCalled();
  });

  it("single mode: selects a day and immediately applies + closes", () => {
    const onChange = vi.fn();
    const onClose = vi.fn();
    render(
      <MobileDatePicker mode="single" open onClose={onClose} value={{ start: START, end: END }} onChange={onChange} />,
    );

    fireEvent.click(dayButton(document.body, 15));

    expect(onChange).toHaveBeenCalledTimes(1);
    const [range] = onChange.mock.calls[0];
    expect(range.start.getDate()).toBe(15);
    expect(onClose).toHaveBeenCalled();
  });

  it("range mode: picking start then end updates the chips, and Apply commits the range", () => {
    const onChange = vi.fn();
    render(<MobileDatePicker mode="range" open onClose={vi.fn()} value={{ start: START, end: END }} onChange={onChange} />);

    fireEvent.click(dayButton(document.body, 5));
    fireEvent.click(dayButton(document.body, 20));

    fireEvent.click(screen.getByText("Apply"));

    expect(onChange).toHaveBeenCalledTimes(1);
    const [range] = onChange.mock.calls[0];
    expect(range.start.getDate()).toBe(5);
    expect(range.end.getDate()).toBe(20);
  });

  it("disables days before minDate", () => {
    render(
      <MobileDatePicker
        open
        onClose={vi.fn()}
        value={{ start: START, end: END }}
        onChange={vi.fn()}
        minDate={new Date(2026, 5, 10)}
      />,
    );

    expect(dayButton(document.body, 1)).toBeDisabled();
    expect(dayButton(document.body, 15)).toBeEnabled();
  });

  it("accepts a labels override", () => {
    render(
      <MobileDatePicker
        open
        onClose={vi.fn()}
        value={{ start: START, end: END }}
        onChange={vi.fn()}
        labels={{ reset: "Sbrosit", apply: "Primenit" }}
      />,
    );
    expect(screen.getByText("Sbrosit")).toBeInTheDocument();
    expect(screen.getByText("Primenit")).toBeInTheDocument();
  });

  it("formats weekday labels according to the locale prop", () => {
    render(
      <MobileDatePicker open onClose={vi.fn()} value={{ start: START, end: END }} onChange={vi.fn()} locale="ru-RU" />,
    );
    expect(screen.getAllByText("Пн").length).toBeGreaterThan(0);
  });
});
