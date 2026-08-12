import type { StorybookConfig } from "@storybook/react-vite";

const config: StorybookConfig = {
  stories: ["../src/**/*.stories.@(ts|tsx)"],
  addons: [],
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
  // GitHub Pages serves project sites under /<repo>/, not at the domain root.
  // Set STORYBOOK_BASE_PATH (e.g. "/haloui/") in CI; local dev keeps the default "/".
  async viteFinal(viteConfig) {
    return {
      ...viteConfig,
      base: process.env.STORYBOOK_BASE_PATH ?? "/",
    };
  },
};

export default config;
