import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useForm, FormProvider } from "react-hook-form";
import { axe } from "jest-axe";
import { RHFCheckbox } from "./RHFCheckbox";

type FormValues = { terms: boolean };

function TestForm({ onSubmit = vi.fn() }: { onSubmit?: (values: FormValues) => void }) {
  const methods = useForm<FormValues>({ defaultValues: { terms: false } });
  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)}>
        <RHFCheckbox<FormValues>
          name="terms"
          label="Accept terms"
          rules={{ required: "You must accept the terms" }}
        />
        <button type="submit">Submit</button>
      </form>
    </FormProvider>
  );
}

describe("RHFCheckbox", () => {
  it("submits the checked state under the field's form name", async () => {
    const onSubmit = vi.fn();
    render(<TestForm onSubmit={onSubmit} />);
    await userEvent.click(screen.getByRole("checkbox", { name: "Accept terms" }));
    await userEvent.click(screen.getByRole("button", { name: "Submit" }));
    expect(onSubmit).toHaveBeenCalledWith({ terms: true }, expect.anything());
  });

  it("surfaces react-hook-form validation errors on the field", async () => {
    render(<TestForm />);
    await userEvent.click(screen.getByRole("button", { name: "Submit" }));
    expect(await screen.findByRole("alert")).toHaveTextContent("You must accept the terms");
  });

  it("has no accessibility violations", async () => {
    const { container } = render(<TestForm />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
