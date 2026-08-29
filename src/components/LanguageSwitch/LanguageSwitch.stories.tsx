import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { LanguageSwitch } from "./LanguageSwitch";

const meta: Meta<typeof LanguageSwitch> = {
  title: "Molecules/LanguageSwitch",
  component: LanguageSwitch,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: `\`\`\`tsx
import { LanguageSwitch } from "brightframe/LanguageSwitch";

const [lang, setLang] = useState("en");
<LanguageSwitch value={lang} onChange={setLang} />
\`\`\``,
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof LanguageSwitch>;

function Controlled() {
  const [lang, setLang] = useState("en");
  return <LanguageSwitch value={lang} onChange={setLang} />;
}

export const Playground: Story = {
  render: () => <Controlled />,
};

export const CustomOptions: Story = {
  name: "— Custom options",
  render: () => {
    function Wrapper() {
      const [lang, setLang] = useState("fr");
      return (
        <LanguageSwitch
          value={lang}
          onChange={setLang}
          options={[
            { code: "fr", label: "FR" },
            { code: "de", label: "DE" },
            { code: "es", label: "ES" },
          ]}
        />
      );
    }
    return <Wrapper />;
  },
};
