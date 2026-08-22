import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useForm, FormProvider } from "react-hook-form";
import { RHFTextareaField } from "./RHFTextareaField";
import { SubmitButton } from "../SubmitButton";

const meta: Meta<typeof RHFTextareaField> = {
  title: "Form/React Hook Form/RHFTextareaField",
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: `\`\`\`tsx
import { useForm, FormProvider } from "react-hook-form";
import { RHFTextareaField } from "brightframe/RHFTextareaField";

type FormValues = { bio: string };

function Example() {
  const methods = useForm<FormValues>({ defaultValues: { bio: "" } });
  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(console.log)}>
        <RHFTextareaField<FormValues> name="bio" label="Bio" rules={{ required: "Bio is required" }} />
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
type Story = StoryObj<typeof RHFTextareaField>;

type FormValues = { bio: string };

function Wrapper() {
  const methods = useForm<FormValues>({ defaultValues: { bio: "" } });
  const [submitted, setSubmitted] = useState<FormValues | null>(null);
  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(setSubmitted)}>
        <RHFTextareaField<FormValues> name="bio" label="Bio" rules={{ required: "Bio is required" }} />
        <SubmitButton style={{ marginTop: 12 }}>Submit</SubmitButton>
        {submitted && <p>Submitted: {submitted.bio}</p>}
      </form>
    </FormProvider>
  );
}

export const Playground: Story = {
  render: () => <Wrapper />,
};
