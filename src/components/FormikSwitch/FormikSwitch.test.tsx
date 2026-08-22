import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Formik, Form } from "formik";
import { axe } from "jest-axe";
import { FormikSwitch } from "./FormikSwitch";

type FormValues = { notifications: boolean };

function TestForm({ onSubmit = vi.fn() }: { onSubmit?: (values: FormValues) => void }) {
  return (
    <Formik<FormValues> initialValues={{ notifications: false }} onSubmit={onSubmit}>
      <Form>
        <FormikSwitch name="notifications" label="Notifications" />
        <button type="submit">Submit</button>
      </Form>
    </Formik>
  );
}

describe("FormikSwitch", () => {
  it("submits the checked state under the field's form name", async () => {
    const onSubmit = vi.fn();
    render(<TestForm onSubmit={onSubmit} />);
    await userEvent.click(screen.getByRole("switch", { name: "Notifications" }));
    await userEvent.click(screen.getByRole("button", { name: "Submit" }));
    expect(onSubmit).toHaveBeenCalledWith(expect.objectContaining({ notifications: true }), expect.anything());
  });

  it("has no accessibility violations", async () => {
    const { container } = render(<TestForm />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
