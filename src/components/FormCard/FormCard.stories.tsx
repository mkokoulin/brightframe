import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { FormCard } from "./FormCard";
import { LabeledField } from "../LabeledField/LabeledField";
import { SelectField } from "../SelectField/SelectField";
import { Btn } from "../Btn/Btn";
import { Stack } from "../Stack/Stack";

const meta: Meta<typeof FormCard> = {
  title: "Form/FormCard",
  component: FormCard,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          '```tsx\nimport { FormCard } from "brightframe/FormCard";\n\n<FormCard>\n  <p>Card content goes here</p>\n</FormCard>\n```',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof FormCard>;

export const Playground: Story = {
  args: {
    children: "Card content goes here",
  },
};

export const WithFields: Story = {
  name: "— With nested fields (borderless contract)",
  render: () => {
    function Wrapper() {
      const [name, setName] = useState("");
      const [room, setRoom] = useState("meeting");
      return (
        <FormCard style={{ maxWidth: 360 }}>
          <Stack gap={14}>
            <LabeledField label="Name" value={name} onChange={setName} placeholder="Jane Doe" />
            <SelectField
              label="Room"
              value={room}
              onChange={setRoom}
              options={[
                { value: "meeting", label: "Meeting room" },
                { value: "quiet", label: "Quiet room" },
              ]}
            />
            <Btn variant="primary" style={{ width: "100%" }}>Send</Btn>
          </Stack>
        </FormCard>
      );
    }
    return <Wrapper />;
  },
};
