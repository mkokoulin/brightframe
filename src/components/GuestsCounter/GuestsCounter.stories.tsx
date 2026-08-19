import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { GuestsCounter } from "./GuestsCounter";

const meta: Meta<typeof GuestsCounter> = {
  title: "Form/GuestsCounter",
  component: GuestsCounter,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: `\`\`\`tsx
import { useState } from "react";
import { GuestsCounter } from "brightframe/GuestsCounter";

const [guests, setGuests] = useState(2);

<GuestsCounter value={guests} onChange={setGuests} label="Guests" />
\`\`\``,
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof GuestsCounter>;

export const Playground: Story = {
  args: {
    value: 2,
    min: 1,
    max: 20,
  },
  render: (args) => {
    function Wrapper() {
      const [value, setValue] = useState(args.value);
      return <GuestsCounter {...args} value={value} onChange={setValue} />;
    }
    return <Wrapper />;
  },
};

export const CustomIcon: Story = {
  name: "— Custom icon",
  render: () => {
    function Wrapper() {
      const [value, setValue] = useState(4);
      return (
        <GuestsCounter
          value={value}
          onChange={setValue}
          label="Seats"
          icon={
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M2 13c0-2.2 2.7-4 6-4s6 1.8 6 4M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"
                stroke="currentColor"
                strokeWidth="1.3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          }
        />
      );
    }
    return <Wrapper />;
  },
};

export const NoIcon: Story = {
  name: "— icon={null}",
  render: () => {
    function Wrapper() {
      const [value, setValue] = useState(1);
      return <GuestsCounter value={value} onChange={setValue} icon={null} />;
    }
    return <Wrapper />;
  },
};

export const InBookingSummary: Story = {
  name: "— In a booking summary",
  render: () => {
    function Wrapper() {
      const [guests, setGuests] = useState(2);
      const [rooms, setRooms] = useState(1);
      return (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 12,
            width: 280,
            padding: 16,
            background: "var(--c-surface)",
            borderRadius: 14,
            boxShadow: "var(--c-shadow-sm)",
          }}
        >
          <GuestsCounter value={guests} onChange={setGuests} label="Guests" />
          <GuestsCounter value={rooms} onChange={setRooms} label="Meeting rooms" min={1} max={5} />
        </div>
      );
    }
    return <Wrapper />;
  },
};
