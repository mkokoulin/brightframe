import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useForm, FormProvider } from "react-hook-form";
import { RHFSelectField } from "./RHFSelectField";
import { SubmitButton } from "../SubmitButton";
import type { SelectOption } from "../SelectField";

const meta: Meta<typeof RHFSelectField> = {
  title: "Form/React Hook Form/RHFSelectField",
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: `\`\`\`tsx
import { useForm, FormProvider } from "react-hook-form";
import { RHFSelectField } from "brightframe/RHFSelectField";

type FormValues = { plan: string };
const options = [
  { value: "basic", label: "Basic" },
  { value: "pro", label: "Pro" },
];

function Example() {
  const methods = useForm<FormValues>({ defaultValues: { plan: "" } });
  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(console.log)}>
        <RHFSelectField<FormValues> name="plan" label="Plan" options={options} rules={{ required: "Plan is required" }} />
      </form>
    </FormProvider>
  );
}
\`\`\``,
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof RHFSelectField>;

type FormValues = { plan: string };

const OPTIONS: SelectOption[] = [
  { value: "basic", label: "Basic" },
  { value: "pro", label: "Pro" },
  { value: "enterprise", label: "Enterprise" },
];

function Wrapper() {
  const methods = useForm<FormValues>({ defaultValues: { plan: "" } });
  const [submitted, setSubmitted] = useState<FormValues | null>(null);
  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(setSubmitted)}>
        <RHFSelectField<FormValues>
          name="plan"
          label="Plan"
          options={OPTIONS}
          rules={{ required: "Plan is required" }}
        />
        <SubmitButton style={{ marginTop: 12 }}>Submit</SubmitButton>
        {submitted && <p>Submitted: {submitted.plan}</p>}
      </form>
    </FormProvider>
  );
}

export const Playground: Story = {
  render: () => <Wrapper />,
};
