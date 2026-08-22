import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useForm, FormProvider } from "react-hook-form";
import { RHFCombobox } from "./RHFCombobox";
import { SubmitButton } from "../SubmitButton";
import type { ComboboxOption } from "../Combobox";

const meta: Meta<typeof RHFCombobox> = {
  title: "Form/React Hook Form/RHFCombobox",
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: `\`\`\`tsx
import { useForm, FormProvider } from "react-hook-form";
import { RHFCombobox } from "brightframe/RHFCombobox";

type FormValues = { city: string };
const options = [
  { value: "yer", label: "Yerevan" },
  { value: "tbi", label: "Tbilisi" },
];

function Example() {
  const methods = useForm<FormValues>({ defaultValues: { city: "" } });
  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(console.log)}>
        <RHFCombobox<FormValues> name="city" label="City" options={options} rules={{ required: "City is required" }} />
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
type Story = StoryObj<typeof RHFCombobox>;

type FormValues = { city: string };

const OPTIONS: ComboboxOption[] = [
  { value: "yer", label: "Yerevan" },
  { value: "tbi", label: "Tbilisi" },
  { value: "ist", label: "Istanbul" },
];

function Wrapper() {
  const methods = useForm<FormValues>({ defaultValues: { city: "" } });
  const [submitted, setSubmitted] = useState<FormValues | null>(null);
  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(setSubmitted)}>
        <RHFCombobox<FormValues>
          name="city"
          label="City"
          options={OPTIONS}
          rules={{ required: "City is required" }}
        />
        <SubmitButton style={{ marginTop: 12 }}>Submit</SubmitButton>
        {submitted && <p>Submitted: {submitted.city}</p>}
      </form>
    </FormProvider>
  );
}

export const Playground: Story = {
  render: () => <Wrapper />,
};
