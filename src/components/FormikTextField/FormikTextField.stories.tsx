import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Formik, Form } from "formik";
import { FormikTextField } from "./FormikTextField";
import { SubmitButton } from "../SubmitButton";

const meta: Meta<typeof FormikTextField> = {
  title: "Form/Formik/FormikTextField",
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: `Drop-in replacement for \`LabeledField\` inside a Formik \`<Formik>\`/\`<Form>\` —
wires \`value\`/\`onChange\`/\`onBlur\`/\`error\` to the field automatically via \`useField\`.

\`\`\`tsx
import { Formik, Form } from "formik";
import { FormikTextField } from "brightframe/FormikTextField";

<Formik
  initialValues={{ email: "" }}
  validate={(v) => (v.email ? {} : { email: "Email is required" })}
  onSubmit={console.log}
>
  <Form>
    <FormikTextField name="email" label="Email" />
  </Form>
</Formik>
\`\`\``,
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof FormikTextField>;

type FormValues = { email: string };

function Wrapper() {
  const [submitted, setSubmitted] = useState<FormValues | null>(null);
  return (
    <Formik<FormValues>
      initialValues={{ email: "" }}
      validate={(values) => (values.email ? {} : { email: "Email is required" })}
      onSubmit={setSubmitted}
    >
      <Form>
        <FormikTextField name="email" label="Email" />
        <SubmitButton style={{ marginTop: 12 }}>Submit</SubmitButton>
        {submitted && <p>Submitted: {submitted.email}</p>}
      </Form>
    </Formik>
  );
}

export const Playground: Story = {
  render: () => <Wrapper />,
};
