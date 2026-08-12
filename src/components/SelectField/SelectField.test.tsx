import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { SelectField, type SelectOption } from "./SelectField";

const OPTIONS: SelectOption[] = [
  { value: "a", label: "Option A" },
  { value: "b", label: "Option B" },
];

describe("SelectField", () => {
  it("shows the placeholder when no value is selected", () => {
    render(<SelectField label="Choice" value="" options={OPTIONS} placeholder="Pick one" onChange={() => {}} />);
    expect(screen.getByRole("combobox")).toHaveTextContent("Pick one");
  });

  it("shows the selected option's label", () => {
    render(<SelectField label="Choice" value="b" options={OPTIONS} onChange={() => {}} />);
    expect(screen.getByRole("combobox")).toHaveTextContent("Option B");
  });

  it("opens the listbox on click and selects an option", () => {
    const onChange = vi.fn();
    render(<SelectField label="Choice" value="" options={OPTIONS} onChange={onChange} />);
    fireEvent.click(screen.getByRole("combobox"));
    fireEvent.pointerDown(screen.getByRole("option", { name: "Option A" }));
    expect(onChange).toHaveBeenCalledWith("a");
  });

  it("shows an error message", () => {
    render(<SelectField label="Choice" value="" options={OPTIONS} error="Required" onChange={() => {}} />);
    expect(screen.getByRole("alert")).toHaveTextContent("Required");
  });
});
