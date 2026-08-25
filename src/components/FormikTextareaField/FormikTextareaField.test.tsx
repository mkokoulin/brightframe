import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Formik, Form } from "formik";
import { expectNoA11yViolations } from "../../test-utils/a11y";
import { FormikTextareaField } from "./FormikTextareaField";

type FormValues = { bio: string };

function TestForm({ onSubmit = vi.fn() }: { onSubmit?: (values: FormValues) => void }) {
  return (
    <Formik<FormValues>
      initialValues={{ bio: "" }}
      validate={(values) => (values.bio ? {} : { bio: "Bio is required" })}
      onSubmit={onSubmit}
    >
      <Form>
        <FormikTextareaField name="bio" label="Bio" />
        <button type="submit">Submit</button>
      </Form>
    </Formik>
  );
}

describe("FormikTextareaField", () => {
  it("submits what the user types under the field's form name", async () => {
    const onSubmit = vi.fn();
    render(<TestForm onSubmit={onSubmit} />);
    await userEvent.type(screen.getByLabelText("Bio"), "Hello");
    await userEvent.click(screen.getByRole("button", { name: "Submit" }));
    expect(onSubmit).toHaveBeenCalledWith(expect.objectContaining({ bio: "Hello" }), expect.anything());
  });

  it("surfaces the error only after the field is touched", async () => {
    render(<TestForm />);
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "Submit" }));
    expect(await screen.findByRole("alert")).toHaveTextContent("Bio is required");
  });

  it("has no accessibility violations", async () => {
    const { container } = render(<TestForm />);
    await expectNoA11yViolations(container);
  });
});
