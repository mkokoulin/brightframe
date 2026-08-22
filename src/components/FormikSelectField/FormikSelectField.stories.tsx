import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Formik, Form } from "formik";
import { FormikSelectField } from "./FormikSelectField";
import { SubmitButton } from "../SubmitButton";
import type { SelectOption } from "../SelectField";

const meta: Meta<typeof FormikSelectField> = {
  title: "Form/Formik/FormikSelectField",
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: `\`\`\`tsx
import { Formik, Form } from "formik";
import { FormikSelectField } from "brightframe/FormikSelectField";

const options = [
  { value: "basic", label: "Basic" },
  { value: "pro", label: "Pro" },
];

<Formik
  initialValues={{ plan: "" }}
  validate={(v) => (v.plan ? {} : { plan: "Plan is required" })}
  onSubmit={console.log}
>
  <Form>
    <FormikSelectField name="plan" label="Plan" options={options} />
  </Form>
</Formik>
\`\`\``,
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof FormikSelectField>;

type FormValues = { plan: string };

const OPTIONS: SelectOption[] = [
  { value: "basic", label: "Basic" },
  { value: "pro", label: "Pro" },
  { value: "enterprise", label: "Enterprise" },
];

function Wrapper() {
  const [submitted, setSubmitted] = useState<FormValues | null>(null);
  return (
    <Formik<FormValues>
      initialValues={{ plan: "" }}
      validate={(values) => (values.plan ? {} : { plan: "Plan is required" })}
      onSubmit={setSubmitted}
    >
      <Form>
        <FormikSelectField name="plan" label="Plan" options={OPTIONS} />
        <SubmitButton style={{ marginTop: 12 }}>Submit</SubmitButton>
        {submitted && <p>Submitted: {submitted.plan}</p>}
      </Form>
    </Formik>
  );
}

export const Playground: Story = {
  render: () => <Wrapper />,
};
