import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Combobox, type ComboboxOption } from "./Combobox";

const meta: Meta<typeof Combobox> = {
  title: "Form/Combobox",
  component: Combobox,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: `\`\`\`tsx
import { useState } from "react";
import { Combobox } from "brightframe/Combobox";

const [value, setValue] = useState("");

<Combobox
  label="City"
  value={value}
  onChange={setValue}
  options={[{ value: "yer", label: "Yerevan" }, { value: "tbi", label: "Tbilisi" }]}
  placeholder="Search a city…"
/>
\`\`\``,
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Combobox>;

const CITIES: ComboboxOption[] = [
  { value: "yer", label: "Yerevan" },
  { value: "tbi", label: "Tbilisi" },
  { value: "ist", label: "Istanbul" },
  { value: "dxb", label: "Dubai" },
  { value: "lon", label: "London" },
  { value: "nyc", label: "New York" },
];

function Wrapper() {
  const [value, setValue] = useState("");
  return (
    <div style={{ width: 280 }}>
      <Combobox label="City" value={value} onChange={setValue} options={CITIES} placeholder="Search a city…" />
    </div>
  );
}

export const Playground: Story = {
  render: () => <Wrapper />,
};

export const WithError: Story = {
  args: {
    label: "City",
    value: "",
    onChange: () => {},
    options: CITIES,
    error: "Choose a city to continue",
  },
  render: (args) => (
    <div style={{ width: 280 }}>
      <Combobox {...args} />
    </div>
  ),
};
