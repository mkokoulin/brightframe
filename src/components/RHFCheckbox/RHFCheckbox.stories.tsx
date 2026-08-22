import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useForm, FormProvider } from "react-hook-form";
import { RHFCheckbox } from "./RHFCheckbox";
import { SubmitButton } from "../SubmitButton";

const meta: Meta<typeof RHFCheckbox> = {
  title: "Form/React Hook Form/RHFCheckbox",
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: `\`\`\`tsx
import { useForm, FormProvider } from "react-hook-form";
import { RHFCheckbox } from "brightframe/RHFCheckbox";

type FormValues = { terms: boolean };

function Example() {
  const methods = useForm<FormValues>({ defaultValues: { terms: false } });
  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(console.log)}>
        <RHFCheckbox<FormValues> name="terms" label="Accept terms" rules={{ required: "You must accept the terms" }} />
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
type Story = StoryObj<typeof RHFCheckbox>;

type FormValues = { terms: boolean };

function Wrapper() {
  const methods = useForm<FormValues>({ defaultValues: { terms: false } });
  const [submitted, setSubmitted] = useState<FormValues | null>(null);
  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(setSubmitted)}>
        <RHFCheckbox<FormValues>
          name="terms"
          label="Accept terms"
          rules={{ required: "You must accept the terms" }}
        />
        <SubmitButton style={{ marginTop: 12 }}>Submit</SubmitButton>
        {submitted && <p>Submitted: {String(submitted.terms)}</p>}
      </form>
    </FormProvider>
  );
}

export const Playground: Story = {
  render: () => <Wrapper />,
};
