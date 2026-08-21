import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
import { Checkbox } from "./Checkbox";

describe("Checkbox", () => {
  it("renders unchecked by default and toggles on click", () => {
    const onChange = vi.fn();
    render(<Checkbox checked={false} onChange={onChange} label="Accept" />);
    const checkbox = screen.getByRole("checkbox", { name: "Accept" });
    expect(checkbox).not.toBeChecked();

    fireEvent.click(checkbox);
    expect(onChange).toHaveBeenCalledWith(true);
  });

  it("reflects the checked prop", () => {
    render(<Checkbox checked label="Accept" onChange={vi.fn()} />);
    expect(screen.getByRole("checkbox", { name: "Accept" })).toBeChecked();
  });

  it("sets the DOM indeterminate property without affecting checked", () => {
    render(<Checkbox checked={false} onChange={vi.fn()} indeterminate label="Some selected" />);
    const checkbox = screen.getByRole("checkbox", { name: "Some selected" }) as HTMLInputElement;
    expect(checkbox.indeterminate).toBe(true);
    expect(checkbox.checked).toBe(false);
  });

  it("is disabled and does not fire onChange", async () => {
    const onChange = vi.fn();
    render(<Checkbox checked={false} onChange={onChange} disabled label="Accept" />);
    const checkbox = screen.getByRole("checkbox", { name: "Accept" });
    expect(checkbox).toBeDisabled();
    await userEvent.click(checkbox);
    expect(onChange).not.toHaveBeenCalled();
  });

  it("renders an error message with role=alert", () => {
    render(<Checkbox checked={false} onChange={vi.fn()} label="Accept" error="Required" />);
    expect(screen.getByRole("alert")).toHaveTextContent("Required");
    expect(screen.getByRole("checkbox")).toHaveAttribute("aria-invalid", "true");
  });

  it("has no accessibility violations", async () => {
    const { container } = render(<Checkbox checked={false} onChange={vi.fn()} label="Accept" error="Required" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
