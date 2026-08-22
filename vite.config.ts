import { readdirSync } from "node:fs";
import { resolve } from "node:path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

const componentsDir = resolve(__dirname, "src/components");
const componentNames = readdirSync(componentsDir, { withFileTypes: true })
  .filter((d) => d.isDirectory())
  .map((d) => d.name);

// One entry per component (so `brightframe/Btn` pulls in only Btn's JS + CSS),
// plus the full barrel, theme, and icons entries.
const entry: Record<string, string> = {
  brightframe: resolve(__dirname, "src/index.ts"),
  theme: resolve(__dirname, "src/theme/index.ts"),
  icons: resolve(__dirname, "src/icons/index.ts"),
};
for (const name of componentNames) {
  entry[name] = resolve(componentsDir, name, "index.ts");
}

export default defineConfig({
  plugins: [
    react(),
    dts({
      include: ["src"],
      exclude: ["src/**/*.stories.tsx", "src/**/*.test.tsx", "src/**/*.test.ts"],
      insertTypesEntry: true,
    }),
  ],
  build: {
    lib: {
      entry,
      name: "BrightFrame",
      fileName: (format, entryName) => `${entryName}.${format === "es" ? "js" : "cjs"}`,
      formats: ["es", "cjs"],
    },
    rollupOptions: {
      external: ["react", "react-dom", "react/jsx-runtime", "react-hook-form", "formik"],
    },
    cssCodeSplit: true,
    sourcemap: true,
  },
});
