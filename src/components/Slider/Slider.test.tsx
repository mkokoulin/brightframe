import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { expectNoA11yViolations } from "../../test-utils/a11y";
import { Slider } from "./Slider";

describe("Slider", () => {
  it("renders a single range input bound to a numeric value", () => {
    render(<Slider label="Guests" value={4} onChange={vi.fn()} min={1} max={10} />);
    const input = screen.getByRole("slider", { name: "Guests" }) as HTMLInputElement;
    expect(input).toHaveValue("4");
    expect(input).toHaveAttribute("min", "1");
    expect(input).toHaveAttribute("max", "10");
  });

  it("calls onChange with a number for single mode", () => {
    const onChange = vi.fn();
    render(<Slider label="Guests" value={4} onChange={onChange} min={1} max={10} />);
    const input = screen.getByRole("slider", { name: "Guests" });
    fireEvent.change(input, { target: { value: "7" } });
    expect(onChange).toHaveBeenCalledWith(7);
  });

  it("shows the formatted value when showValue is set", () => {
    render(<Slider label="Price" value={120} onChange={vi.fn()} showValue formatValue={(v) => `$${v}`} />);
    expect(screen.getByText("$120")).toBeInTheDocument();
  });

  it("renders two labeled thumbs in range mode", () => {
    render(<Slider label="Price range" value={[50, 200]} onChange={vi.fn()} min={0} max={500} />);
    const min = screen.getByRole("slider", { name: "Price range minimum" }) as HTMLInputElement;
    const max = screen.getByRole("slider", { name: "Price range maximum" }) as HTMLInputElement;
    expect(min).toHaveValue("50");
    expect(max).toHaveValue("200");
  });

  it("constrains the min thumb's range to not exceed the current max", () => {
    render(<Slider label="Price range" value={[50, 200]} onChange={vi.fn()} min={0} max={500} />);
    expect(screen.getByRole("slider", { name: "Price range minimum" })).toHaveAttribute("max", "200");
    expect(screen.getByRole("slider", { name: "Price range maximum" })).toHaveAttribute("min", "50");
  });

  it("calls onChange with a [min, max] tuple when the max thumb moves", () => {
    const onChange = vi.fn();
    render(<Slider label="Price range" value={[50, 200]} onChange={onChange} min={0} max={500} />);
    const max = screen.getByRole("slider", { name: "Price range maximum" });
    fireEvent.change(max, { target: { value: "300" } });
    expect(onChange).toHaveBeenCalledWith([50, 300]);
  });

  it("disables the input(s)", () => {
    render(<Slider label="Guests" value={4} onChange={vi.fn()} disabled />);
    expect(screen.getByRole("slider", { name: "Guests" })).toBeDisabled();
  });

  it("has no accessibility violations", async () => {
    const { container } = render(<Slider label="Price range" value={[50, 200]} onChange={vi.fn()} min={0} max={500} />);
    await expectNoA11yViolations(container);
  });
});
