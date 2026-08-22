import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Formik, Form } from "formik";
import { FormikSwitch } from "./FormikSwitch";
import { SubmitButton } from "../SubmitButton";

const meta: Meta<typeof FormikSwitch> = {
  title: "Form/Formik/FormikSwitch",
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: `\`\`\`tsx
import { Formik, Form } from "formik";
import { FormikSwitch } from "brightframe/FormikSwitch";

<Formik initialValues={{ notifications: false }} onSubmit={console.log}>
  <Form>
    <FormikSwitch name="notifications" label="Notifications" />
  </Form>
</Formik>
\`\`\``,
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof FormikSwitch>;

type FormValues = { notifications: boolean };

function Wrapper() {
  const [submitted, setSubmitted] = useState<FormValues | null>(null);
  return (
    <Formik<FormValues> initialValues={{ notifications: false }} onSubmit={setSubmitted}>
      <Form>
        <FormikSwitch name="notifications" label="Notifications" />
        <SubmitButton style={{ marginTop: 12 }}>Submit</SubmitButton>
        {submitted && <p>Submitted: {String(submitted.notifications)}</p>}
      </Form>
    </Formik>
  );
}

export const Playground: Story = {
  render: () => <Wrapper />,
};
