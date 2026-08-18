# Contributing

Thanks for considering a contribution to `brightframe`.

## Setup

```bash
bun install          # or npm install
bun run storybook    # interactive playground on :6006
```

## Before opening a PR

```bash
bun run typecheck
bun run test
bun run build
```

All three must pass — CI runs the same three commands on every PR.

## Adding a component

Every component lives in its own folder under `src/components/<Name>/` and follows the same shape. Use an existing one (`Btn` is a good simple reference, `Modal` a good reference for portal/overlay components) as a template:

```
src/components/<Name>/
  <Name>.tsx           # the component itself
  <Name>.module.css    # CSS Modules, themed via var(--c-*) tokens from src/tokens.css
  <Name>.stories.tsx   # Storybook stories, title: "Category/<Name>"
  <Name>.test.tsx       # vitest + Testing Library
  index.ts              # re-exports the component and its types
```

Then add `export * from "./components/<Name>";` to `src/index.ts`, and add a row to the component table in `README.md`.

Conventions worth matching:
- Native HTML attributes pass through (`...rest`), `className` merges rather than replaces, colors/spacing come from the design tokens in `src/tokens.css` — never hardcode a color.
- Interactive components are fully controlled from the outside (`value`/`onChange`), following the pattern in `SelectField`/`Tabs`, rather than owning business state internally.
- No new runtime dependencies without discussing it in an issue first — the kit is deliberately dependency-light (`react-imask` is currently the only one).

## Reporting bugs / requesting components

Open an issue using the templates — a minimal reproduction (or a Storybook story showing the problem) is the single most useful thing you can include.

## License

By contributing, you agree your contribution is licensed under the project's [MIT license](./LICENSE).
