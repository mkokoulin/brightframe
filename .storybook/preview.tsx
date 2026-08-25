import type { Preview } from "@storybook/react-vite";
import "../src/tokens.css";
import "../src/fonts.css";
import "./preview.css";

const preview: Preview = {
  parameters: {
    layout: "centered",
    // Runs axe (via @storybook/addon-a11y) as part of the Vitest "storybook" project
    // and fails that test on any violation. Override to "todo" on an individual story
    // only with a comment explaining why — see docs/a11y-audit.md.
    a11y: {
      test: "error",
    },
    backgrounds: {
      default: "light",
      values: [
        { name: "light", value: "#fbfbfd" },
        { name: "dark", value: "#0c0e14" },
      ],
    },
    options: {
      // Puts Overview/UI Kit first in the sidebar, which is also what Storybook
      // opens by default when no ?path= is given (e.g. visiting localhost:6006/).
      storySort: {
        order: ["Overview", "*"],
      },
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
