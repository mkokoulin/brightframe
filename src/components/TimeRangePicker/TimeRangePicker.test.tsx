import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import type { ComponentProps } from "react";
import { TimeRangePicker } from "./TimeRangePicker";

function setup(overrides: Partial<ComponentProps<typeof TimeRangePicker>> = {}) {
  const onDateChange = vi.fn();
  const onStartTimeChange = vi.fn();
  const onEndTimeChange = vi.fn();
  const props = {
    date: "2026-06-10",
    onDateChange,
    startTime: "10:00",
    endTime: "12:00",
    onStartTimeChange,
    onEndTimeChange,
    ...overrides,
  };
  const utils = render(<TimeRangePicker {...props} />);
  return { ...utils, onDateChange, onStartTimeChange, onEndTimeChange };
}

describe("TimeRangePicker", () => {
  it("renders the current start and end times", () => {
    setup();
    expect(screen.getByRole("button", { name: "10:00" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "12:00" })).toBeInTheDocument();
  });

  it("opens the start-time panel and picks a new start time", () => {
    const { onStartTimeChange } = setup();

    fireEvent.click(screen.getByRole("button", { name: "10:00" }));
    expect(screen.getByRole("listbox")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("option", { name: "11:00" }));

    expect(onStartTimeChange).toHaveBeenCalledWith("11:00");
  });

  it("only offers start-time options that are before the current end time", () => {
    setup({ startTime: "10:00", endTime: "10:30" });

    fireEvent.click(screen.getByRole("button", { name: "10:00" }));

    expect(screen.queryByRole("option", { name: "11:00" })).not.toBeInTheDocument();
    expect(screen.getByRole("option", { name: "10:00" })).toBeInTheDocument();
  });

  it("opens the end-time panel and picks a new end time", () => {
    const { onEndTimeChange } = setup();

    fireEvent.click(screen.getByRole("button", { name: "12:00" }));
    fireEvent.click(screen.getByRole("option", { name: "13:00" }));

    expect(onEndTimeChange).toHaveBeenCalledWith("13:00");
  });

  it("closes the open panel on Escape", () => {
    setup();

    fireEvent.click(screen.getByRole("button", { name: "10:00" }));
    expect(screen.getByRole("listbox")).toBeInTheDocument();

    fireEvent.keyDown(document, { key: "Escape" });

    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  it("shows the formatted duration between start and end, using the default English unit labels", () => {
    setup({ startTime: "10:00", endTime: "11:30" });
    expect(screen.getByText("1h 30m")).toBeInTheDocument();
  });

  it("accepts custom duration unit labels", () => {
    setup({ startTime: "10:00", endTime: "11:30", durationUnitLabels: { hour: "ч", minute: "м" } });
    expect(screen.getByText("1ч 30м")).toBeInTheDocument();
  });

  it("uses a custom businessHours range for the offered slots", () => {
    setup({ businessHours: { openHour: 8, closeHour: 9, stepMin: 30 } });
    fireEvent.click(screen.getByRole("button", { name: "10:00" }));
    expect(screen.getByRole("option", { name: "08:00" })).toBeInTheDocument();
    expect(screen.queryByRole("option", { name: "11:00" })).not.toBeInTheDocument();
  });
});
