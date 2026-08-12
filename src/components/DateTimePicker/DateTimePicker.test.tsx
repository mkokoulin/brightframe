import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, within } from "@testing-library/react";
import { DateTimePicker } from "./DateTimePicker";

const VALUE = new Date(2026, 5, 10, 14, 30); // 10 Jun 2026, 14:30

const RU_MONTHS: [string, string, string, string, string, string, string, string, string, string, string, string] = [
  "Января",
  "Февраля",
  "Марта",
  "Апреля",
  "Мая",
  "Июня",
  "Июля",
  "Августа",
  "Сентября",
  "Октября",
  "Ноября",
  "Декабря",
];

function getToggle(container: HTMLElement) {
  return container.querySelector("[aria-expanded]") as HTMLElement;
}

describe("DateTimePicker", () => {
  it("renders the formatted date and time in the closed trigger, using the default English months", () => {
    render(<DateTimePicker value={VALUE} onChange={vi.fn()} />);
    expect(screen.getByText("10 June")).toBeInTheDocument();
    expect(screen.getByText("14:30")).toBeInTheDocument();
  });

  it("formats the date using a labels override", () => {
    render(<DateTimePicker value={VALUE} onChange={vi.fn()} labels={{ months: RU_MONTHS }} />);
    expect(screen.getByText("10 Июня")).toBeInTheDocument();
  });

  it("starts collapsed", () => {
    const { container } = render(<DateTimePicker value={VALUE} onChange={vi.fn()} />);
    expect(getToggle(container)).toHaveAttribute("aria-expanded", "false");
  });

  it("expands when the date tab is clicked", () => {
    const { container } = render(<DateTimePicker value={VALUE} onChange={vi.fn()} />);

    fireEvent.click(screen.getByText("10 June"));

    expect(getToggle(container)).toHaveAttribute("aria-expanded", "true");
  });

  it("calls onChange with the picked day, preserving the time", () => {
    const onChange = vi.fn();
    render(<DateTimePicker value={VALUE} onChange={onChange} />);

    fireEvent.click(screen.getByText("10 June"));
    const dayBtn = within(document.body).getAllByRole("button", { name: "15" })[0];
    fireEvent.click(dayBtn);

    expect(onChange).toHaveBeenCalledTimes(1);
    const [next] = onChange.mock.calls[0];
    expect(next.getDate()).toBe(15);
    expect(next.getHours()).toBe(14);
    expect(next.getMinutes()).toBe(30);
  });

  it("switches to the time panel and picks a new time", () => {
    const onChange = vi.fn();
    render(<DateTimePicker value={VALUE} onChange={onChange} />);

    fireEvent.click(screen.getByText("14:30"));
    fireEvent.click(screen.getByRole("button", { name: "15:00" }));

    expect(onChange).toHaveBeenCalledTimes(1);
    const [next] = onChange.mock.calls[0];
    expect(next.getHours()).toBe(15);
    expect(next.getMinutes()).toBe(0);
    expect(next.getDate()).toBe(10);
  });

  it("disables days before minDate", () => {
    render(<DateTimePicker value={VALUE} onChange={vi.fn()} minDate={new Date(2026, 5, 10)} />);

    const dayBtn = within(document.body).getAllByRole("button", { name: "1" })[0];
    expect(dayBtn).toBeDisabled();
  });

  it("does not expand when disabled", () => {
    const { container } = render(<DateTimePicker value={VALUE} onChange={vi.fn()} disabled />);

    fireEvent.click(screen.getByText("10 June"));

    expect(getToggle(container)).toHaveAttribute("aria-expanded", "false");
  });
});
