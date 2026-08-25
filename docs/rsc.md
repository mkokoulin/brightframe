# React Server Components compatibility

Every component in `brightframe` is either a Client Component (marked `"use client"`) or safe to
render inside a Server Component tree (no directive, no hooks, no DOM event handlers declared in its
own JSX). This page documents how that split is maintained and where the real edge cases are.

## The rule

React Server Components have no hook dispatcher at all — a component needs `"use client"` if it does
**either** of the following in its own source:

1. Calls any React hook (`useState`, `useEffect`, `useLayoutEffect`, `useContext`, `useReducer`,
   `useRef`, `useMemo`, `useCallback`, `useImperativeHandle`, `useSyncExternalStore`, or
   `createContext`) — even `useMemo`/`useCallback` alone, which have no "state" in the everyday
   sense but still require the hook dispatcher.
2. Declares a DOM event handler attribute (`onClick={...}`, `onChange={...}`, `onKeyDown={...}`,
   etc.) directly in its own JSX — a Server Component's output is static markup; there is no
   mechanism for a plain function prop to survive into an interactive listener unless the component
   itself is a Client Component.

Pure presentational components — props in, markup out, no hooks, no handlers wired up in their own
JSX (`Card`, `Tag`, `Badge`, `Container`, `Grid`, `Stack`, `Spacer`, `Divider`, the icon set in
`src/icons`, and most others) — correctly have **no** directive. Adding one unnecessarily would opt
them out of server rendering and streaming for no benefit; the tree-shakeable per-component entry
points (`brightframe/Card`, `brightframe/Tag`, ...) mean a Server Component tree that only imports
these pulls in **zero** client-boundary code.

## The guard

`scripts/check-use-client.mjs` walks every `src/components/*/*.{ts,tsx}` file (excluding
`.test.tsx`/`.stories.tsx` and `index.ts` barrels, which only re-export) and applies the two checks
above. It only ever flags a **missing** directive on a file that needs one — it never suggests
removing an existing directive, since that direction has a real ambiguity (see below). It runs in
CI (`.github/workflows/ci.yml`) so a new component can't silently ship without the correct marker.

**Extended to plain `.ts` hook files after a real gap surfaced**: the original version of this
script only scanned `.tsx` files, on the assumption that hook usage lives in component files. That
missed `CalendarSlider/useMediaQuery.ts` (a standalone hook, no directive) — harmless in practice
since it's only imported internally by `CalendarSlider.tsx`, which already has the directive, so no
consumer could reach it un-marked. It stopped being harmless once `Combobox/useCombobox.ts` shipped
as a directly-importable, publicly-exported hook (`brightframe/Combobox`'s `useCombobox`, see
[[headless-hooks]]) — a Server Component importing it directly would get an unmarked module. Fixed
both, and widened the script's glob to `.ts` as well as `.tsx` so this class of gap can't recur.

## `ThemeProvider` / `useTheme()` need a Client Component boundary

`ThemeProvider` (in `src/theme/ThemeProvider.tsx`) is marked `"use client"` — it's a Context
Provider backed by `useState`/`useEffect`, and `useTheme()` calls `useContext` internally. In a
Next.js App Router app, this means:

- You cannot render `<ThemeProvider>` directly from a Server Component `app/layout.tsx` root — wrap
  it in your own small `"use client"` component (or mark the layout itself client, though scoping it
  to a dedicated wrapper keeps the rest of the layout server-rendered).
- `useTheme()` can only be called from inside a Client Component. Calling it from a Server Component
  throws at build time, not silently no-ops.

### Avoiding a flash of the wrong theme

Because `ThemeProvider` only applies `data-theme`/`data-a11y` to `<html>` after mount, an SSR app can
show a flash of the default (light) theme before hydration. `getThemeInitScript()` (in
`src/theme/themeScript.ts`) returns a small inline script string for exactly this:

```tsx
// app/layout.tsx (Server Component — no "use client" needed for this file itself)
import { getThemeInitScript } from "brightframe/theme";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <script dangerouslySetInnerHTML={{ __html: getThemeInitScript() }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
```

`getThemeInitScript` is a plain function returning a string — it has no hooks and needs no directive
itself, so it's safe to call from a Server Component. Note it only ever sets `data-theme="dark"`
(light stays the unmarked default), matching `ThemeProvider`'s own `applyDocumentAttributes` logic.

## A real inconsistency this audit caught: `Formik*` vs `RHF*`

Every `RHF*` field wrapper (`RHFCheckbox`, `RHFCombobox`, `RHFRadioGroup`, `RHFSelectField`,
`RHFSwitch`, `RHFTextareaField`, `RHFTextField`) already had `"use client"` before this audit. The
parallel `Formik*` family (`FormikCheckbox`, `FormikCombobox`, `FormikRadioGroup`,
`FormikSelectField`, `FormikSwitch`, `FormikTextareaField`, `FormikTextField`) had none of them
marked, despite calling `useField()` from `formik` in every case — a real, previously-unnoticed gap,
not a theoretical one. Caught by grepping all ~64 hook-using component files against the ~36 that
already had the directive, not by reading each file by hand. Fixed as part of this pass, along with
`Breadcrumb`, `Burger`, `CalendarSlider`, `DateTimePicker`, `GuestsCounter`, `LabeledField`, and
`TextareaField`.

`Burger` is worth calling out specifically: it holds no state of its own (`open`/`setOpen` are
props), but its own JSX still declares `onClick={() => setOpen(!open)}` — hook-free components can
still need the directive purely from rule 2 above.

## An open, deliberately-unresolved ambiguity: passthrough prop spreads

`Progress` and `Skeleton` are pure props-in/markup-out components — no hooks, no handler declared in
their own JSX — but both spread `{...rest}` onto their host element from a `HTMLAttributes<...>`-typed
prop, without excluding handler-shaped keys. That means a consumer *could* pass `onClick` through the
spread, which would require the component to be a Client Component to actually work. Both were
already marked `"use client"` before this audit, and this pass deliberately leaves them marked rather
than "fixing" them to match the mechanical rule — unmarking is the riskier direction (a false
negative silently breaks a consumer's handler at runtime, whereas an unnecessary directive only costs
a small, otherwise-unused client boundary). `scripts/check-use-client.mjs` intentionally only checks
for missing directives, never for ones that might be removable, since resolving this ambiguity
correctly needs knowing whether real consumers actually pass handlers through — not something a
static grep can determine.
