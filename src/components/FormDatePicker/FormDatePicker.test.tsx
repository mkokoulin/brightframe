import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, within } from "@testing-library/react";
import { axe } from "jest-axe";
import { FormDatePicker, parseYMD, toYMD } from "./FormDatePicker";

describe("parseYMD / toYMD", () => {
  it("parses a YYYY-MM-DD string into a local Date", () => {
    const d = parseYMD("2026-06-10");
    expect(d.getFullYear()).toBe(2026);
    expect(d.getMonth()).toBe(5);
    expect(d.getDate()).toBe(10);
  });

  it("round-trips through toYMD", () => {
    expect(toYMD(parseYMD("2026-06-10"))).toBe("2026-06-10");
  });
});

describe("FormDatePicker", () => {
  it("shows the placeholder when no value is set", () => {
    render(<FormDatePicker value="" onChange={vi.fn()} placeholder="Pick a date" />);
    expect(screen.getByText("Pick a date")).toBeInTheDocument();
  });

  it("shows a formatted value when set, using the default en-US locale", () => {
    render(<FormDatePicker value="2026-06-10" onChange={vi.fn()} />);
    expect(screen.getByRole("button")).toHaveTextContent("June 10, 2026");
  });

  it("formats the value according to the locale prop", () => {
    render(<FormDatePicker value="2026-06-10" onChange={vi.fn()} locale="ru-RU" />);
    expect(screen.getByRole("button")).toHaveTextContent("10 июня 2026");
  });

  it("opens the MobileDatePicker when the trigger is clicked", () => {
    render(<FormDatePicker value="2026-06-10" onChange={vi.fn()} />);

    fireEvent.click(screen.getByRole("button"));

    expect(screen.getByText("Apply")).toBeInTheDocument();
  });

  it("calls onChange with the picked date and closes the picker", () => {
    const onChange = vi.fn();
    render(<FormDatePicker value="2026-06-10" onChange={onChange} />);

    fireEvent.click(screen.getByRole("button", { name: /June 10, 2026/ }));
    const dayBtn = within(document.body).getAllByRole("button", { name: "15" })[0];
    fireEvent.click(dayBtn);

    expect(onChange).toHaveBeenCalledWith("2026-06-15");
    expect(screen.queryByText("Apply")).not.toBeInTheDocument();
  });

  it("shows the error message and marks the trigger invalid", () => {
    render(<FormDatePicker value="" onChange={vi.fn()} error="Required" />);

    expect(screen.getByRole("button")).toHaveAttribute("aria-invalid", "true");
    expect(screen.getByRole("alert")).toHaveTextContent("Required");
  });

  it("has no accessibility violations with the picker open", async () => {
    render(<FormDatePicker value="2026-06-10" onChange={vi.fn()} />);
    fireEvent.click(screen.getByRole("button", { name: /June 10, 2026/ }));
    expect(await axe(document.body)).toHaveNoViolations();
  });
});
