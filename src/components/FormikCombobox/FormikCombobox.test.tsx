import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Formik, Form } from "formik";
import { axe } from "jest-axe";
import { FormikCombobox } from "./FormikCombobox";
import type { ComboboxOption } from "../Combobox";

type FormValues = { city: string };

const OPTIONS: ComboboxOption[] = [
  { value: "yer", label: "Yerevan" },
  { value: "tbi", label: "Tbilisi" },
];

function TestForm({ onSubmit = vi.fn() }: { onSubmit?: (values: FormValues) => void }) {
  return (
    <Formik<FormValues>
      initialValues={{ city: "" }}
      validate={(values) => (values.city ? {} : { city: "City is required" })}
      onSubmit={onSubmit}
    >
      <Form>
        <FormikCombobox name="city" label="City" options={OPTIONS} />
        <button type="submit">Submit</button>
      </Form>
    </Formik>
  );
}

describe("FormikCombobox", () => {
  it("submits the option value picked from the list", async () => {
    const onSubmit = vi.fn();
    render(<TestForm onSubmit={onSubmit} />);
    fireEvent.focus(screen.getByRole("combobox", { name: "City" }));
    fireEvent.pointerDown(screen.getByRole("option", { name: "Tbilisi" }));
    await userEvent.click(screen.getByRole("button", { name: "Submit" }));
    expect(onSubmit).toHaveBeenCalledWith(expect.objectContaining({ city: "tbi" }), expect.anything());
  });

  it("has no accessibility violations", async () => {
    const { container } = render(<TestForm />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
