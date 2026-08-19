import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Drawer, type DrawerPlacement } from "./Drawer";
import { Btn } from "../Btn";

const meta: Meta<typeof Drawer> = {
  title: "Molecules/Drawer",
  component: Drawer,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: `\`\`\`tsx
import { useState } from "react";
import { Drawer } from "brightframe/Drawer";

const [open, setOpen] = useState(false);

<Drawer open={open} onClose={() => setOpen(false)} placement="right" title="Filters">
  <p>Narrow results by price, amenities, and availability.</p>
</Drawer>
\`\`\``,
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Drawer>;

function Wrapper({ placement }: { placement?: DrawerPlacement }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ padding: 40 }}>
      <Btn onClick={() => setOpen(true)}>Open drawer ({placement ?? "right"})</Btn>
      <Drawer
        open={open}
        onClose={() => setOpen(false)}
        placement={placement}
        title="Filters"
        footer={
          <>
            <Btn variant="ghost" onClick={() => setOpen(false)}>
              Reset
            </Btn>
            <Btn variant="primary" onClick={() => setOpen(false)}>
              Apply
            </Btn>
          </>
        }
      >
        <p>Narrow results by price, amenities, and availability.</p>
      </Drawer>
    </div>
  );
}

export const Right: Story = {
  render: () => <Wrapper placement="right" />,
};

export const Left: Story = {
  render: () => <Wrapper placement="left" />,
};

export const Top: Story = {
  render: () => <Wrapper placement="top" />,
};

export const Bottom: Story = {
  render: () => <Wrapper placement="bottom" />,
};
