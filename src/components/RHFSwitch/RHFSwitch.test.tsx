import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useForm, FormProvider } from "react-hook-form";
import { expectNoA11yViolations } from "../../test-utils/a11y";
import { RHFSwitch } from "./RHFSwitch";

type FormValues = { notifications: boolean };

function TestForm({ onSubmit = vi.fn() }: { onSubmit?: (values: FormValues) => void }) {
  const methods = useForm<FormValues>({ defaultValues: { notifications: false } });
  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)}>
        <RHFSwitch<FormValues> name="notifications" label="Notifications" />
        <button type="submit">Submit</button>
      </form>
    </FormProvider>
  );
}

describe("RHFSwitch", () => {
  it("submits the checked state under the field's form name", async () => {
    const onSubmit = vi.fn();
    render(<TestForm onSubmit={onSubmit} />);
    await userEvent.click(screen.getByRole("switch", { name: "Notifications" }));
    await userEvent.click(screen.getByRole("button", { name: "Submit" }));
    expect(onSubmit).toHaveBeenCalledWith({ notifications: true }, expect.anything());
  });

  it("has no accessibility violations", async () => {
    const { container } = render(<TestForm />);
    await expectNoA11yViolations(container);
  });
});
