import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useForm, FormProvider } from "react-hook-form";
import { RHFTextField } from "./RHFTextField";
import { SubmitButton } from "../SubmitButton";

const meta: Meta<typeof RHFTextField> = {
  title: "Form/React Hook Form/RHFTextField",
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: `Drop-in replacement for \`LabeledField\` inside a react-hook-form \`FormProvider\` —
wires \`value\`/\`onChange\`/\`onBlur\`/\`error\` to the field automatically via \`useController\`.

\`\`\`tsx
import { useForm, FormProvider } from "react-hook-form";
import { RHFTextField } from "brightframe/RHFTextField";

type FormValues = { email: string };

function Example() {
  const methods = useForm<FormValues>({ defaultValues: { email: "" } });
  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(console.log)}>
        <RHFTextField<FormValues> name="email" label="Email" rules={{ required: "Email is required" }} />
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
type Story = StoryObj<typeof RHFTextField>;

type FormValues = { email: string };

function Wrapper() {
  const methods = useForm<FormValues>({ defaultValues: { email: "" } });
  const [submitted, setSubmitted] = useState<FormValues | null>(null);
  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(setSubmitted)}>
        <RHFTextField<FormValues> name="email" label="Email" rules={{ required: "Email is required" }} />
        <SubmitButton style={{ marginTop: 12 }}>Submit</SubmitButton>
        {submitted && <p>Submitted: {submitted.email}</p>}
      </form>
    </FormProvider>
  );
}

export const Playground: Story = {
  render: () => <Wrapper />,
};
