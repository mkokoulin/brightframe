import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Modal, type ModalSize } from "./Modal";
import { Btn } from "../Btn";

const meta: Meta<typeof Modal> = {
  title: "Molecules/Modal",
  component: Modal,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
};

export default meta;
type Story = StoryObj<typeof Modal>;

function Wrapper({ size }: { size?: ModalSize }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ padding: 40 }}>
      <Btn onClick={() => setOpen(true)}>Open modal</Btn>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Confirm booking"
        size={size}
        footer={
          <>
            <Btn variant="ghost" onClick={() => setOpen(false)}>
              Cancel
            </Btn>
            <Btn variant="primary" onClick={() => setOpen(false)}>
              Confirm
            </Btn>
          </>
        }
      >
        <p>Your room is reserved for two nights starting Friday. Payment is collected on arrival.</p>
      </Modal>
    </div>
  );
}

export const Playground: Story = {
  render: () => <Wrapper size="md" />,
};

export const Small: Story = {
  render: () => <Wrapper size="sm" />,
};

export const Large: Story = {
  render: () => <Wrapper size="lg" />,
};

function TitlelessWrapper() {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ padding: 40 }}>
      <Btn onClick={() => setOpen(true)}>Open without title</Btn>
      <Modal open={open} onClose={() => setOpen(false)}>
        <p>A modal without a title still gets a close button and full keyboard/overlay dismissal.</p>
      </Modal>
    </div>
  );
}

export const WithoutTitle: Story = {
  render: () => <TitlelessWrapper />,
};
