import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Formik, Form } from "formik";
import { FormikCheckbox } from "./FormikCheckbox";
import { SubmitButton } from "../SubmitButton";

const meta: Meta<typeof FormikCheckbox> = {
  title: "Form/Formik/FormikCheckbox",
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: `\`\`\`tsx
import { Formik, Form } from "formik";
import { FormikCheckbox } from "brightframe/FormikCheckbox";

<Formik
  initialValues={{ terms: false }}
  validate={(v) => (v.terms ? {} : { terms: "You must accept the terms" })}
  onSubmit={console.log}
>
  <Form>
    <FormikCheckbox name="terms" label="Accept terms" />
  </Form>
</Formik>
\`\`\``,
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof FormikCheckbox>;

type FormValues = { terms: boolean };

function Wrapper() {
  const [submitted, setSubmitted] = useState<FormValues | null>(null);
  return (
    <Formik<FormValues>
      initialValues={{ terms: false }}
      validate={(values) => (values.terms ? {} : { terms: "You must accept the terms" })}
      onSubmit={setSubmitted}
    >
      <Form>
        <FormikCheckbox name="terms" label="Accept terms" />
        <SubmitButton style={{ marginTop: 12 }}>Submit</SubmitButton>
        {submitted && <p>Submitted: {String(submitted.terms)}</p>}
      </Form>
    </Formik>
  );
}

export const Playground: Story = {
  render: () => <Wrapper />,
};
