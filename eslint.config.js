import js from "@eslint/js";
import tseslint from "typescript-eslint";
import reactHooks from "eslint-plugin-react-hooks";
import jsxA11y from "eslint-plugin-jsx-a11y";

export default tseslint.config(
  {
    ignores: ["dist", "storybook-static", "**/*.module.css.d.ts"],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ["scripts/**/*.mjs"],
    languageOptions: {
      globals: { console: "readonly", process: "readonly" },
    },
  },
  {
    files: ["**/*.{ts,tsx}"],
    plugins: {
      "react-hooks": reactHooks,
      "jsx-a11y": jsxA11y,
    },
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: "module",
    },
    rules: {
      // Only the two classic hook-correctness rules — the rest of
      // react-hooks' "recommended" set targets React Compiler compatibility
      // (purity/immutability/gating/...) and isn't relevant here.
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
      ...jsxA11y.configs.recommended.rules,
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
    },
  },
  {
    // Storybook demo content, not real navigation — `href="#"` placeholders
    // are intentional and don't need a navigable target.
    files: ["**/*.stories.tsx"],
    rules: {
      "jsx-a11y/anchor-is-valid": "off",
    },
  },
);
