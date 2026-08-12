import type { Preview } from "@storybook/react-vite";
import "../src/tokens.css";

const preview: Preview = {
  parameters: {
    layout: "centered",
    backgrounds: {
      default: "light",
      values: [
        { name: "light", value: "#fbfbfd" },
        { name: "dark", value: "#0c0e14" },
      ],
    },
  },
  globalTypes: {
    theme: {
      description: "Design token theme",
      toolbar: {
        title: "Theme",
        icon: "circlehollow",
        items: [
          { value: "light", title: "Light" },
          { value: "dark", title: "Dark" },
          { value: "visually-impaired", title: "A11y" },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: {
    theme: "light",
  },
  decorators: [
    (Story, context) => {
      const theme = context.globals.theme ?? "light";
      document.documentElement.setAttribute("data-theme", theme === "dark" ? "dark" : "");
      document.documentElement.setAttribute("data-a11y", theme === "visually-impaired" ? "visually-impaired" : "");
      return Story();
    },
  ],
};

export default preview;
