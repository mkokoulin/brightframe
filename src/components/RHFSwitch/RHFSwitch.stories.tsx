import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useForm, FormProvider } from "react-hook-form";
import { RHFSwitch } from "./RHFSwitch";
import { SubmitButton } from "../SubmitButton";

const meta: Meta<typeof RHFSwitch> = {
  title: "Form/React Hook Form/RHFSwitch",
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: `\`\`\`tsx
import { useForm, FormProvider } from "react-hook-form";
import { RHFSwitch } from "brightframe/RHFSwitch";

type FormValues = { notifications: boolean };

function Example() {
  const methods = useForm<FormValues>({ defaultValues: { notifications: false } });
  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(console.log)}>
        <RHFSwitch<FormValues> name="notifications" label="Notifications" />
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
type Story = StoryObj<typeof RHFSwitch>;

type FormValues = { notifications: boolean };

function Wrapper() {
  const methods = useForm<FormValues>({ defaultValues: { notifications: false } });
  const [submitted, setSubmitted] = useState<FormValues | null>(null);
  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(setSubmitted)}>
        <RHFSwitch<FormValues> name="notifications" label="Notifications" />
        <SubmitButton style={{ marginTop: 12 }}>Submit</SubmitButton>
        {submitted && <p>Submitted: {String(submitted.notifications)}</p>}
      </form>
    </FormProvider>
  );
}

export const Playground: Story = {
  render: () => <Wrapper />,
};
