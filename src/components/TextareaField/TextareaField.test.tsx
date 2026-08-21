import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { axe } from "jest-axe";
import { TextareaField } from "./TextareaField";

describe("TextareaField", () => {
  it("renders the label and value", () => {
    render(<TextareaField label="Comment" value="hello" onChange={() => {}} />);
    expect(screen.getByLabelText("Comment")).toHaveValue("hello");
  });

  it("calls onChange with the new value", () => {
    const onChange = vi.fn();
    render(<TextareaField label="Comment" value="" onChange={onChange} />);
    fireEvent.change(screen.getByLabelText("Comment"), { target: { value: "hi" } });
    expect(onChange).toHaveBeenCalledWith("hi");
  });

  it("shows an error message and marks the field invalid", () => {
    render(<TextareaField label="Comment" value="" onChange={() => {}} error="Required" />);
    expect(screen.getByRole("alert")).toHaveTextContent("Required");
    expect(screen.getByLabelText("Comment")).toHaveAttribute("aria-invalid", "true");
  });

  it("has no accessibility violations", async () => {
    const { container } = render(<TextareaField label="Comment" value="" onChange={() => {}} error="Required" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
