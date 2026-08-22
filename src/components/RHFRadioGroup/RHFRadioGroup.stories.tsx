import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useForm, FormProvider } from "react-hook-form";
import { RHFRadioGroup } from "./RHFRadioGroup";
import { SubmitButton } from "../SubmitButton";
import type { RadioOption } from "../RadioGroup";

const meta: Meta<typeof RHFRadioGroup> = {
  title: "Form/React Hook Form/RHFRadioGroup",
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: `\`\`\`tsx
import { useForm, FormProvider } from "react-hook-form";
import { RHFRadioGroup } from "brightframe/RHFRadioGroup";

type FormValues = { plan: string };
const options = [
  { value: "day", label: "Day pass" },
  { value: "month", label: "Monthly desk" },
];

function Example() {
  const methods = useForm<FormValues>({ defaultValues: { plan: "" } });
  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(console.log)}>
        <RHFRadioGroup<FormValues> name="plan" label="Plan" options={options} rules={{ required: "Plan is required" }} />
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
type Story = StoryObj<typeof RHFRadioGroup>;

type FormValues = { plan: string };

const OPTIONS: RadioOption[] = [
  { value: "day", label: "Day pass" },
  { value: "month", label: "Monthly desk" },
  { value: "office", label: "Dedicated office" },
];

function Wrapper() {
  const methods = useForm<FormValues>({ defaultValues: { plan: "" } });
  const [submitted, setSubmitted] = useState<FormValues | null>(null);
  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(setSubmitted)}>
        <RHFRadioGroup<FormValues>
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
