import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Formik, Form } from "formik";
import { expectNoA11yViolations } from "../../test-utils/a11y";
import { FormikCheckbox } from "./FormikCheckbox";

type FormValues = { terms: boolean };

function TestForm({ onSubmit = vi.fn() }: { onSubmit?: (values: FormValues) => void }) {
  return (
    <Formik<FormValues>
      initialValues={{ terms: false }}
      validate={(values) => (values.terms ? {} : { terms: "You must accept the terms" })}
      onSubmit={onSubmit}
    >
      <Form>
        <FormikCheckbox name="terms" label="Accept terms" />
        <button type="submit">Submit</button>
      </Form>
    </Formik>
  );
}

describe("FormikCheckbox", () => {
  it("submits the checked state under the field's form name", async () => {
    const onSubmit = vi.fn();
    render(<TestForm onSubmit={onSubmit} />);
    await userEvent.click(screen.getByRole("checkbox", { name: "Accept terms" }));
    await userEvent.click(screen.getByRole("button", { name: "Submit" }));
    expect(onSubmit).toHaveBeenCalledWith(expect.objectContaining({ terms: true }), expect.anything());
  });

  it("surfaces the error only after the field is touched", async () => {
    render(<TestForm />);
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "Submit" }));
    expect(await screen.findByRole("alert")).toHaveTextContent("You must accept the terms");
  });

  it("has no accessibility violations", async () => {
    const { container } = render(<TestForm />);
    await expectNoA11yViolations(container);
  });
});
