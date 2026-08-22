import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Formik, Form } from "formik";
import { FormikTextareaField } from "./FormikTextareaField";
import { SubmitButton } from "../SubmitButton";

const meta: Meta<typeof FormikTextareaField> = {
  title: "Form/Formik/FormikTextareaField",
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: `\`\`\`tsx
import { Formik, Form } from "formik";
import { FormikTextareaField } from "brightframe/FormikTextareaField";

<Formik
  initialValues={{ bio: "" }}
  validate={(v) => (v.bio ? {} : { bio: "Bio is required" })}
  onSubmit={console.log}
>
  <Form>
    <FormikTextareaField name="bio" label="Bio" />
  </Form>
</Formik>
\`\`\``,
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof FormikTextareaField>;

type FormValues = { bio: string };

function Wrapper() {
  const [submitted, setSubmitted] = useState<FormValues | null>(null);
  return (
    <Formik<FormValues>
      initialValues={{ bio: "" }}
      validate={(values) => (values.bio ? {} : { bio: "Bio is required" })}
      onSubmit={setSubmitted}
    >
      <Form>
        <FormikTextareaField name="bio" label="Bio" />
        <SubmitButton style={{ marginTop: 12 }}>Submit</SubmitButton>
        {submitted && <p>Submitted: {submitted.bio}</p>}
      </Form>
    </Formik>
  );
}

export const Playground: Story = {
  render: () => <Wrapper />,
};
