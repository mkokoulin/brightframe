import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { expectNoA11yViolations } from "../../test-utils/a11y";
import { LabeledField } from "./LabeledField";

describe("LabeledField", () => {
  it("renders a plain input bound to value", () => {
    render(<LabeledField label="Name" value="Ann" onChange={() => {}} />);
    expect(screen.getByLabelText("Name")).toHaveValue("Ann");
  });

  it("calls onChange with the typed value for a plain input", () => {
    const onChange = vi.fn();
    render(<LabeledField label="Name" value="" onChange={onChange} />);

    fireEvent.change(screen.getByLabelText("Name"), { target: { value: "Bob" } });

    expect(onChange).toHaveBeenCalledWith("Bob");
  });

  it("renders the error message and aria-invalid", () => {
    render(<LabeledField label="Name" value="" onChange={() => {}} error="Required" />);

    expect(screen.getByLabelText("Name")).toHaveAttribute("aria-invalid", "true");
    expect(screen.getByRole("alert")).toHaveTextContent("Required");
  });

  it("displays the prefix as visible text and strips it from the editable value", () => {
    render(<LabeledField label="Phone" value="+37400000000" onChange={() => {}} prefix="+374" />);

    expect(screen.getByText("+374")).toBeInTheDocument();
    expect(screen.getByLabelText("Phone")).toHaveValue("00000000");
  });

  it("re-prepends the prefix when reporting changes", () => {
    const onChange = vi.fn();
    render(<LabeledField label="Phone" value="+37400000000" onChange={onChange} prefix="+374" />);

    fireEvent.change(screen.getByLabelText("Phone"), { target: { value: "11111111" } });

    expect(onChange).toHaveBeenCalledWith("+37411111111");
  });

  it("calls onBlur when losing focus", () => {
    const onBlur = vi.fn();
    render(<LabeledField label="Name" value="" onChange={() => {}} onBlur={onBlur} />);

    fireEvent.blur(screen.getByLabelText("Name"));

    expect(onBlur).toHaveBeenCalled();
  });

  it("has no accessibility violations", async () => {
    const { container } = render(
      <LabeledField label="Phone" value="+37400000000" onChange={vi.fn()} prefix="+374" />,
    );
    await expectNoA11yViolations(container);
  });
});
