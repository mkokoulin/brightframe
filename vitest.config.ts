import path from "node:path";
import { fileURLToPath } from "node:url";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";
import { storybookTest } from "@storybook/addon-vitest/vitest-plugin";
import { playwright } from "@vitest/browser-playwright";

const dirname = typeof __dirname !== "undefined" ? __dirname : path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react()],
  test: {
    projects: [
      {
        extends: true,
        test: {
          name: "unit",
          environment: "jsdom",
          globals: true,
          setupFiles: ["./vitest.setup.ts"],
          include: ["src/**/*.test.{ts,tsx}", "codemods/**/*.test.{ts,tsx}"],
          // The "visual" project below owns this file — it needs real browser mode
          // (screenshots), not jsdom, so it must not also run here.
          exclude: ["src/test-utils/visual.stories.test.tsx"],
        },
      },
      {
        extends: true,
        plugins: [
          // Runs every Storybook story as a real browser test — accessibility checks
          // via the already-installed @storybook/addon-a11y ride on this project.
          // See docs/a11y-audit.md.
          storybookTest({ configDir: path.join(dirname, ".storybook") }),
        ],
        test: {
          name: "storybook",
          browser: {
            enabled: true,
            headless: true,
            provider: playwright({}),
            instances: [{ browser: "chromium" }],
          },
        },
      },
      {
        extends: true,
        test: {
          name: "visual",
          include: ["src/test-utils/visual.stories.test.tsx"],
          setupFiles: ["./src/test-utils/visual.setup.ts"],
          browser: {
            enabled: true,
            headless: true,
            provider: playwright({}),
            instances: [{ browser: "chromium" }],
          },
        },
      },
    ],
  },
});
