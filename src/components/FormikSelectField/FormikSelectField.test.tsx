import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Formik, Form } from "formik";
import { expectNoA11yViolations } from "../../test-utils/a11y";
import { FormikSelectField } from "./FormikSelectField";
import type { SelectOption } from "../SelectField";

type FormValues = { plan: string };

const OPTIONS: SelectOption[] = [
  { value: "basic", label: "Basic" },
  { value: "pro", label: "Pro" },
];

function TestForm({ onSubmit = vi.fn() }: { onSubmit?: (values: FormValues) => void }) {
  return (
    <Formik<FormValues>
      initialValues={{ plan: "" }}
      validate={(values) => (values.plan ? {} : { plan: "Plan is required" })}
      onSubmit={onSubmit}
    >
      <Form>
        <FormikSelectField name="plan" label="Plan" options={OPTIONS} />
        <button type="submit">Submit</button>
      </Form>
    </Formik>
  );
}

describe("FormikSelectField", () => {
  it("submits the option value picked from the listbox", async () => {
    const onSubmit = vi.fn();
    render(<TestForm onSubmit={onSubmit} />);
    fireEvent.click(screen.getByRole("combobox", { name: "Plan" }));
    fireEvent.pointerDown(screen.getByRole("option", { name: "Pro" }));
    await userEvent.click(screen.getByRole("button", { name: "Submit" }));
    expect(onSubmit).toHaveBeenCalledWith(expect.objectContaining({ plan: "pro" }), expect.anything());
  });

  it("has no accessibility violations", async () => {
    const { container } = render(<TestForm />);
    await expectNoA11yViolations(container);
  });
});
