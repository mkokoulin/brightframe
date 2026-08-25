import type { StorybookConfig } from "@storybook/react-vite";

const config: StorybookConfig = {
  stories: ["../src/**/*.stories.@(ts|tsx)"],
  addons: ["@storybook/addon-docs", "@storybook/addon-a11y", "@storybook/addon-vitest"],
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
  // GitHub Pages serves project sites under /<repo>/, not at the domain root.
  // Set STORYBOOK_BASE_PATH (e.g. "/brightframe/") in CI; local dev keeps the default "/".
  async viteFinal(viteConfig) {
    return {
      ...viteConfig,
      base: process.env.STORYBOOK_BASE_PATH ?? "/",
    };
  },
  // Google Analytics for the deployed Storybook site (GA4 property "Brightframe
  // Storybook"). Set STORYBOOK_GA_ID (e.g. "G-XXXXXXXXXX") in CI; unset locally
  // so dev sessions aren't tracked.
  previewHead: (head) => {
    const gaId = process.env.STORYBOOK_GA_ID;
    if (!gaId) return head;
    return `${head}
    <script async src="https://www.googletagmanager.com/gtag/js?id=${gaId}"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '${gaId}');
    </script>`;
  },
};

export default config;
