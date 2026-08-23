import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, within } from "@testing-library/react";
import { axe } from "jest-axe";
import { CalendarSlider } from "./CalendarSlider";

const DAY = new Date(2026, 5, 10); // 10 Jun 2026 (Wednesday)

describe("CalendarSlider", () => {
  it("renders the month label and weekday headers using the default English locale/labels", () => {
    render(<CalendarSlider value={{ start: DAY, end: DAY }} onChange={vi.fn()} />);
    expect(screen.getAllByText("June").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Mo").length).toBeGreaterThan(0);
  });

  it("formats the month label according to the locale prop", () => {
    render(<CalendarSlider value={{ start: DAY, end: DAY }} onChange={vi.fn()} locale="ru-RU" />);
    expect(screen.getAllByText("Июнь").length).toBeGreaterThan(0);
  });

  it("accepts a labels override for weekdays and presets", () => {
    render(
      <CalendarSlider
        value={{ start: DAY, end: DAY }}
        onChange={vi.fn()}
        labels={{ weekdays: ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"], week: "Неделя" }}
      />,
    );
    expect(screen.getAllByText("Пн").length).toBeGreaterThan(0);
    expect(screen.getByRole("button", { name: "Неделя" })).toBeInTheDocument();
  });

  it("marks the selected day as pressed", () => {
    render(<CalendarSlider value={{ start: DAY, end: DAY }} onChange={vi.fn()} />);
    const dayBtn = within(document.body).getAllByRole("button", { name: "10" })[0];
    expect(dayBtn).toHaveAttribute("aria-pressed", "true");
  });

  it("starts a range selection on the first day click, then completes it on the second", () => {
    const onChange = vi.fn();
    render(<CalendarSlider value={{ start: DAY, end: DAY }} onChange={onChange} />);

    const day10 = within(document.body).getAllByRole("button", { name: "10" })[0];
    const day15 = within(document.body).getAllByRole("button", { name: "15" })[0];

    fireEvent.click(day10);
    expect(onChange).toHaveBeenLastCalledWith(
      expect.objectContaining({ start: expect.any(Date), end: expect.any(Date) }),
      "custom",
    );

    fireEvent.click(day15);
    const [range, preset] = onChange.mock.calls[onChange.mock.calls.length - 1];
    expect(preset).toBe("custom");
    expect(range.start.getDate()).toBe(10);
    expect(range.end.getDate()).toBe(15);
  });

  it('applies the "week" preset and marks it active', () => {
    const onChange = vi.fn();
    render(<CalendarSlider value={{ start: DAY, end: DAY }} onChange={onChange} />);

    const weekBtn = screen.getByRole("button", { name: "Week" });
    fireEvent.click(weekBtn);

    expect(onChange).toHaveBeenCalledWith(expect.any(Object), "week");
    expect(weekBtn.className).toMatch(/filterActive/);
  });

  it("navigates the visible window forward 7 days per arrow click", () => {
    render(<CalendarSlider value={{ start: DAY, end: DAY }} onChange={vi.fn()} />);

    const nextBtn = screen.getByRole("button", { name: "Next week" });
    fireEvent.click(nextBtn);
    fireEvent.click(nextBtn);

    // Two 7-day steps from 10 Jun push the right-hand group's first day past June 30.
    expect(screen.getAllByText(/July|August/).length).toBeGreaterThan(0);
  });

  it("throws when neither range nor value is provided", () => {
    const renderInvalid = () => render(<CalendarSlider onChange={vi.fn()} />);
    expect(renderInvalid).toThrow();
  });

  it("has no accessibility violations", async () => {
    const { container } = render(<CalendarSlider value={{ start: DAY, end: DAY }} onChange={vi.fn()} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
