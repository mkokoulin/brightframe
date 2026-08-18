import type { Meta, StoryObj } from "@storybook/react-vite";
import { ToastProvider, useToast, type ToastVariant } from "./Toast";
import { Btn } from "../Btn";

const meta: Meta<typeof ToastProvider> = {
  title: "Molecules/Toast",
  component: ToastProvider,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
};

export default meta;
type Story = StoryObj<typeof ToastProvider>;

function Demo() {
  const { toast, dismissAll } = useToast();

  const fire = (variant: ToastVariant) =>
    toast({
      variant,
      title: variant[0].toUpperCase() + variant.slice(1),
      description: `This is a ${variant} notification.`,
    });

  return (
    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
      <Btn variant="secondary" onClick={() => fire("info")}>
        Info
      </Btn>
      <Btn variant="secondary" onClick={() => fire("success")}>
        Success
      </Btn>
      <Btn variant="secondary" onClick={() => fire("warning")}>
        Warning
      </Btn>
      <Btn variant="secondary" onClick={() => fire("error")}>
        Error
      </Btn>
      <Btn variant="ghost" onClick={() => toast({ description: "No auto-dismiss.", duration: 0 })}>
        Persistent
      </Btn>
      <Btn variant="ghost" onClick={dismissAll}>
        Dismiss all
      </Btn>
    </div>
  );
}

export const Playground: Story = {
  render: () => (
    <ToastProvider>
      <Demo />
    </ToastProvider>
  ),
};

export const TopCenter: Story = {
  render: () => (
    <ToastProvider position="top-center">
      <Demo />
    </ToastProvider>
  ),
};
