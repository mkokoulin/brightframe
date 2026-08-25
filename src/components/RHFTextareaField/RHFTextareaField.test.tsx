import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useForm, FormProvider } from "react-hook-form";
import { expectNoA11yViolations } from "../../test-utils/a11y";
import { RHFTextareaField } from "./RHFTextareaField";

type FormValues = { bio: string };

function TestForm({ onSubmit = vi.fn() }: { onSubmit?: (values: FormValues) => void }) {
  const methods = useForm<FormValues>({ defaultValues: { bio: "" } });
  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)}>
        <RHFTextareaField<FormValues> name="bio" label="Bio" rules={{ required: "Bio is required" }} />
        <button type="submit">Submit</button>
      </form>
    </FormProvider>
  );
}

describe("RHFTextareaField", () => {
  it("submits what the user types under the field's form name", async () => {
    const onSubmit = vi.fn();
    render(<TestForm onSubmit={onSubmit} />);
    await userEvent.type(screen.getByLabelText("Bio"), "Hello");
    await userEvent.click(screen.getByRole("button", { name: "Submit" }));
    expect(onSubmit).toHaveBeenCalledWith({ bio: "Hello" }, expect.anything());
  });

  it("surfaces react-hook-form validation errors on the field", async () => {
    render(<TestForm />);
    await userEvent.click(screen.getByRole("button", { name: "Submit" }));
    expect(await screen.findByRole("alert")).toHaveTextContent("Bio is required");
  });

  it("has no accessibility violations", async () => {
    const { container } = render(<TestForm />);
    await expectNoA11yViolations(container);
  });
});
