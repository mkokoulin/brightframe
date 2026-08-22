import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useForm, FormProvider } from "react-hook-form";
import { axe } from "jest-axe";
import { RHFRadioGroup } from "./RHFRadioGroup";
import type { RadioOption } from "../RadioGroup";

type FormValues = { plan: string };

const OPTIONS: RadioOption[] = [
  { value: "basic", label: "Basic" },
  { value: "pro", label: "Pro" },
];

function TestForm({ onSubmit = vi.fn() }: { onSubmit?: (values: FormValues) => void }) {
  const methods = useForm<FormValues>({ defaultValues: { plan: "" } });
  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)}>
        <RHFRadioGroup<FormValues>
          name="plan"
          label="Plan"
          options={OPTIONS}
          rules={{ required: "Plan is required" }}
        />
        <button type="submit">Submit</button>
      </form>
    </FormProvider>
  );
}

describe("RHFRadioGroup", () => {
  it("submits the selected option's value", async () => {
    const onSubmit = vi.fn();
    render(<TestForm onSubmit={onSubmit} />);
    await userEvent.click(screen.getByRole("radio", { name: "Pro" }));
    await userEvent.click(screen.getByRole("button", { name: "Submit" }));
    expect(onSubmit).toHaveBeenCalledWith({ plan: "pro" }, expect.anything());
  });

  it("surfaces react-hook-form validation errors on the field", async () => {
    render(<TestForm />);
    await userEvent.click(screen.getByRole("button", { name: "Submit" }));
    expect(await screen.findByRole("alert")).toHaveTextContent("Plan is required");
  });

  it("has no accessibility violations", async () => {
    const { container } = render(<TestForm />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
