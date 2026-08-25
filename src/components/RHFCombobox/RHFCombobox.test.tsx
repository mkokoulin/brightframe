import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useForm, FormProvider } from "react-hook-form";
import { expectNoA11yViolations } from "../../test-utils/a11y";
import { RHFCombobox } from "./RHFCombobox";
import type { ComboboxOption } from "../Combobox";

type FormValues = { city: string };

const OPTIONS: ComboboxOption[] = [
  { value: "yer", label: "Yerevan" },
  { value: "tbi", label: "Tbilisi" },
];

function TestForm({ onSubmit = vi.fn() }: { onSubmit?: (values: FormValues) => void }) {
  const methods = useForm<FormValues>({ defaultValues: { city: "" } });
  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)}>
        <RHFCombobox<FormValues>
          name="city"
          label="City"
          options={OPTIONS}
          rules={{ required: "City is required" }}
        />
        <button type="submit">Submit</button>
      </form>
    </FormProvider>
  );
}

describe("RHFCombobox", () => {
  it("submits the option value picked from the list", async () => {
    const onSubmit = vi.fn();
    render(<TestForm onSubmit={onSubmit} />);
    fireEvent.focus(screen.getByRole("combobox", { name: "City" }));
    fireEvent.pointerDown(screen.getByRole("option", { name: "Tbilisi" }));
    await userEvent.click(screen.getByRole("button", { name: "Submit" }));
    expect(onSubmit).toHaveBeenCalledWith({ city: "tbi" }, expect.anything());
  });

  it("surfaces react-hook-form validation errors on the field", async () => {
    render(<TestForm />);
    await userEvent.click(screen.getByRole("button", { name: "Submit" }));
    expect(await screen.findByRole("alert")).toHaveTextContent("City is required");
  });

  it("has no accessibility violations", async () => {
    const { container } = render(<TestForm />);
    await expectNoA11yViolations(container);
  });
});
