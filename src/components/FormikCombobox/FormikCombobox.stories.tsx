import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Formik, Form } from "formik";
import { FormikCombobox } from "./FormikCombobox";
import { SubmitButton } from "../SubmitButton";
import type { ComboboxOption } from "../Combobox";

const meta: Meta<typeof FormikCombobox> = {
  title: "Form/Formik/FormikCombobox",
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: `\`\`\`tsx
import { Formik, Form } from "formik";
import { FormikCombobox } from "brightframe/FormikCombobox";

const options = [
  { value: "yer", label: "Yerevan" },
  { value: "tbi", label: "Tbilisi" },
];

<Formik
  initialValues={{ city: "" }}
  validate={(v) => (v.city ? {} : { city: "City is required" })}
  onSubmit={console.log}
>
  <Form>
    <FormikCombobox name="city" label="City" options={options} />
  </Form>
</Formik>
\`\`\``,
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof FormikCombobox>;

type FormValues = { city: string };

const OPTIONS: ComboboxOption[] = [
  { value: "yer", label: "Yerevan" },
  { value: "tbi", label: "Tbilisi" },
  { value: "ist", label: "Istanbul" },
];

function Wrapper() {
  const [submitted, setSubmitted] = useState<FormValues | null>(null);
  return (
    <Formik<FormValues>
      initialValues={{ city: "" }}
      validate={(values) => (values.city ? {} : { city: "City is required" })}
      onSubmit={setSubmitted}
    >
      <Form>
        <FormikCombobox name="city" label="City" options={OPTIONS} />
        <SubmitButton style={{ marginTop: 12 }}>Submit</SubmitButton>
        {submitted && <p>Submitted: {submitted.city}</p>}
      </Form>
    </Formik>
  );
}

export const Playground: Story = {
  render: () => <Wrapper />,
};
