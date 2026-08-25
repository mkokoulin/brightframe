import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { expectNoA11yViolations } from "../../test-utils/a11y";
import { RadioGroup, type RadioOption } from "./RadioGroup";

const OPTIONS: RadioOption[] = [
  { value: "a", label: "A" },
  { value: "b", label: "B" },
  { value: "c", label: "C", disabled: true },
];

describe("RadioGroup", () => {
  it("marks the option matching value as checked", () => {
    render(<RadioGroup options={OPTIONS} value="b" onChange={vi.fn()} />);
    expect(screen.getByRole("radio", { name: "A" })).not.toBeChecked();
    expect(screen.getByRole("radio", { name: "B" })).toBeChecked();
  });

  it("calls onChange with the selected option's value", () => {
    const onChange = vi.fn();
    render(<RadioGroup options={OPTIONS} value="a" onChange={onChange} />);
    fireEvent.click(screen.getByRole("radio", { name: "B" }));
    expect(onChange).toHaveBeenCalledWith("b");
  });

  it("disables individual options", () => {
    render(<RadioGroup options={OPTIONS} value="a" onChange={vi.fn()} />);
    expect(screen.getByRole("radio", { name: "C" })).toBeDisabled();
  });

  it("wires the group label via aria-labelledby", () => {
    render(<RadioGroup options={OPTIONS} value="a" onChange={vi.fn()} label="Plan" />);
    expect(screen.getByRole("radiogroup", { name: "Plan" })).toBeInTheDocument();
  });

  it("renders an error message with role=alert", () => {
    render(<RadioGroup options={OPTIONS} value="" onChange={vi.fn()} error="Required" />);
    expect(screen.getByRole("alert")).toHaveTextContent("Required");
  });

  it("keeps every option under the same native name so only one can be checked", () => {
    render(<RadioGroup options={OPTIONS} value="a" onChange={vi.fn()} />);
    const names = new Set(
      OPTIONS.map((o) => (screen.getByRole("radio", { name: o.label as string }) as HTMLInputElement).name),
    );
    expect(names.size).toBe(1);
  });

  it("has no accessibility violations", async () => {
    const { container } = render(<RadioGroup options={OPTIONS} value="a" onChange={vi.fn()} label="Plan" />);
    await expectNoA11yViolations(container);
  });
});
