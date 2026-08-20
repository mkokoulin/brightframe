import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { axe } from "jest-axe";
import { Combobox, type ComboboxOption } from "./Combobox";

const OPTIONS: ComboboxOption[] = [
  { value: "yer", label: "Yerevan" },
  { value: "tbi", label: "Tbilisi" },
  { value: "ist", label: "Istanbul" },
];

describe("Combobox", () => {
  it("shows the selected option's label as the input value", () => {
    render(<Combobox label="City" value="tbi" onChange={vi.fn()} options={OPTIONS} />);
    expect(screen.getByRole("combobox", { name: "City" })).toHaveValue("Tbilisi");
  });

  it("opens the list on focus", () => {
    render(<Combobox label="City" value="" onChange={vi.fn()} options={OPTIONS} />);
    fireEvent.focus(screen.getByRole("combobox", { name: "City" }));
    expect(screen.getByRole("listbox")).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "Yerevan" })).toBeInTheDocument();
  });

  it("filters options as the user types", () => {
    render(<Combobox label="City" value="" onChange={vi.fn()} options={OPTIONS} />);
    const input = screen.getByRole("combobox", { name: "City" });
    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: "ist" } });
    expect(screen.getByRole("option", { name: "Istanbul" })).toBeInTheDocument();
    expect(screen.queryByRole("option", { name: "Yerevan" })).not.toBeInTheDocument();
  });

  it("shows the empty message when nothing matches", () => {
    render(<Combobox label="City" value="" onChange={vi.fn()} options={OPTIONS} emptyMessage="Nothing found" />);
    const input = screen.getByRole("combobox", { name: "City" });
    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: "zzz" } });
    expect(screen.getByText("Nothing found")).toBeInTheDocument();
  });

  it("selects an option on click and closes the list", () => {
    const onChange = vi.fn();
    render(<Combobox label="City" value="" onChange={onChange} options={OPTIONS} />);
    fireEvent.focus(screen.getByRole("combobox", { name: "City" }));
    fireEvent.pointerDown(screen.getByRole("option", { name: "Tbilisi" }));
    expect(onChange).toHaveBeenCalledWith("tbi");
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
    expect(screen.getByRole("combobox", { name: "City" })).toHaveValue("Tbilisi");
  });

  it("reverts the typed text on Escape without changing the selection", () => {
    const onChange = vi.fn();
    render(<Combobox label="City" value="tbi" onChange={onChange} options={OPTIONS} />);
    const input = screen.getByRole("combobox", { name: "City" });
    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: "zzz" } });
    fireEvent.keyDown(input, { key: "Escape" });
    expect(input).toHaveValue("Tbilisi");
    expect(onChange).not.toHaveBeenCalled();
  });

  it("selects the focused option on Enter", () => {
    const onChange = vi.fn();
    render(<Combobox label="City" value="" onChange={onChange} options={OPTIONS} />);
    const input = screen.getByRole("combobox", { name: "City" });
    fireEvent.focus(input);
    fireEvent.keyDown(input, { key: "ArrowDown" });
    fireEvent.keyDown(input, { key: "Enter" });
    expect(onChange).toHaveBeenCalledWith("tbi");
  });

  it("renders an error message with role=alert", () => {
    render(<Combobox label="City" value="" onChange={vi.fn()} options={OPTIONS} error="Required" />);
    expect(screen.getByRole("alert")).toHaveTextContent("Required");
  });

  it("has no accessibility violations with the list open", async () => {
    const { container } = render(<Combobox label="City" value="" onChange={vi.fn()} options={OPTIONS} />);
    fireEvent.focus(screen.getByRole("combobox", { name: "City" }));
    expect(await axe(container)).toHaveNoViolations();
  });
});
