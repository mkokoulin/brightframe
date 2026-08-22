import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Formik, Form } from "formik";
import { axe } from "jest-axe";
import { FormikTextField } from "./FormikTextField";

type FormValues = { email: string };

function TestForm({ onSubmit = vi.fn() }: { onSubmit?: (values: FormValues) => void }) {
  return (
    <Formik<FormValues>
      initialValues={{ email: "" }}
      validate={(values) => (values.email ? {} : { email: "Email is required" })}
      onSubmit={onSubmit}
    >
      <Form>
        <FormikTextField name="email" label="Email" />
        <button type="submit">Submit</button>
      </Form>
    </Formik>
  );
}

describe("FormikTextField", () => {
  it("submits what the user types under the field's form name", async () => {
    const onSubmit = vi.fn();
    render(<TestForm onSubmit={onSubmit} />);
    await userEvent.type(screen.getByLabelText("Email"), "a@b.com");
    await userEvent.click(screen.getByRole("button", { name: "Submit" }));
    expect(onSubmit).toHaveBeenCalledWith(expect.objectContaining({ email: "a@b.com" }), expect.anything());
  });

  it("surfaces the error only after the field is touched", async () => {
    render(<TestForm />);
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "Submit" }));
    expect(await screen.findByRole("alert")).toHaveTextContent("Email is required");
  });

  it("has no accessibility violations", async () => {
    const { container } = render(<TestForm />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
