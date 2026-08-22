import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Formik, Form } from "formik";
import { axe } from "jest-axe";
import { FormikRadioGroup } from "./FormikRadioGroup";
import type { RadioOption } from "../RadioGroup";

type FormValues = { plan: string };

const OPTIONS: RadioOption[] = [
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
        <FormikRadioGroup name="plan" label="Plan" options={OPTIONS} />
        <button type="submit">Submit</button>
      </Form>
    </Formik>
  );
}

describe("FormikRadioGroup", () => {
  it("submits the selected option's value", async () => {
    const onSubmit = vi.fn();
    render(<TestForm onSubmit={onSubmit} />);
    await userEvent.click(screen.getByRole("radio", { name: "Pro" }));
    await userEvent.click(screen.getByRole("button", { name: "Submit" }));
    expect(onSubmit).toHaveBeenCalledWith(expect.objectContaining({ plan: "pro" }), expect.anything());
  });

  it("has no accessibility violations", async () => {
    const { container } = render(<TestForm />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
