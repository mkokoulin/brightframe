import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Formik, Form } from "formik";
import { FormikRadioGroup } from "./FormikRadioGroup";
import { SubmitButton } from "../SubmitButton";
import type { RadioOption } from "../RadioGroup";

const meta: Meta<typeof FormikRadioGroup> = {
  title: "Form/Formik/FormikRadioGroup",
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: `\`\`\`tsx
import { Formik, Form } from "formik";
import { FormikRadioGroup } from "brightframe/FormikRadioGroup";

const options = [
  { value: "day", label: "Day pass" },
  { value: "month", label: "Monthly desk" },
];

<Formik
  initialValues={{ plan: "" }}
  validate={(v) => (v.plan ? {} : { plan: "Plan is required" })}
  onSubmit={console.log}
>
  <Form>
    <FormikRadioGroup name="plan" label="Plan" options={options} />
  </Form>
</Formik>
\`\`\``,
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof FormikRadioGroup>;

type FormValues = { plan: string };

const OPTIONS: RadioOption[] = [
  { value: "day", label: "Day pass" },
  { value: "month", label: "Monthly desk" },
  { value: "office", label: "Dedicated office" },
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
        <FormikRadioGroup name="plan" label="Plan" options={OPTIONS} />
        <SubmitButton style={{ marginTop: 12 }}>Submit</SubmitButton>
        {submitted && <p>Submitted: {submitted.plan}</p>}
      </Form>
    </Formik>
  );
}

export const Playground: Story = {
  render: () => <Wrapper />,
};
