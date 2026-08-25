# Headless hooks

Most of `brightframe` is deliberately *not* headless — a styled `<Btn>`/`<Card>`/`<Modal>` that
matches the rest of the kit out of the box is the whole pitch. But for components with real
interaction logic, separating that logic from the markup (à la Radix/Headless UI/Downshift) lets
you keep the kit's behavior while fully controlling the DOM — useful for a bespoke design, a
non-standard layout the styled component doesn't support, or just understanding exactly what the
styled version does under the hood.

## `useCombobox`

The first (and so far only) component with a headless counterpart: `useCombobox` (exported
alongside the styled `Combobox` from `brightframe/Combobox`) owns open/closed state, live
filtering, keyboard navigation (Escape/ArrowUp/ArrowDown/Enter), revert-on-Escape, and
close-on-outside-click. `Combobox` itself is now built on top of it — not a parallel
reimplementation, so bugs fixed in one show up fixed in the other.

```tsx
import { useState } from "react";
import { useCombobox } from "brightframe/Combobox";

const [value, setValue] = useState("");
const combobox = useCombobox({ options, value, onChange: setValue });

<div ref={combobox.containerRef}>
  <input {...combobox.getInputProps()} />
  {combobox.open && (
    <ul {...combobox.getListProps()}>
      {combobox.filteredOptions.map((option, index) => (
        <li key={option.value} {...combobox.getOptionProps(option, index)}>
          {option.label}
        </li>
      ))}
    </ul>
  )}
</div>
```

See it live, fully unstyled, in Storybook under **Form / Combobox (headless)**
(`src/components/Combobox/Combobox.headless.stories.tsx`) — same behavior as the styled component,
none of its CSS.

### Shape

- **State**: `open`, `query`, `focusedIndex`, `filteredOptions`, `selectedOption`.
- **Actions**: `select(option)`, `close()` (closes and reverts the query to the selected label —
  what Escape does), `toggle()`.
- **Prop getters** (Downshift-style — call them, spread the result): `getInputProps()`,
  `getListProps()`, `getOptionProps(option, index)`.
- **Open state**: uncontrolled by default; pass `open`/`onOpenChange` (optionally `defaultOpen`) to
  control it yourself — the same controlled/uncontrolled shape `DropdownMenu` already uses.
- **Filtering**: defaults to a case-insensitive substring match on `option.label`; pass your own
  `filter(option, query)` to change it.

## Why `Combobox` first, not `SelectField` or `DropdownMenu`

`Combobox` has strictly more logic than `SelectField` (text query + live filtering + revert-on-blur
— `SelectField`'s open/focus/keyboard-nav needs are a subset of what `useCombobox` already covers),
so it could plausibly adopt `useCombobox` internally later without losing anything. `DropdownMenu`'s
open/keyboard/focus machinery is structurally similar but *item-list-oriented*, not
*filter-oriented* — it's a separate, not-yet-started extraction, not a variant of this one.

## Roadmap

Nothing else is planned yet. If a second headless hook gets built, the shared "outside-pointerdown
close" and "open/focusedIndex" logic duplicated across `Combobox`, `SelectField`, and
`DropdownMenu` (noted when `useCombobox` was first extracted) is the natural next thing to pull
into its own reusable piece, rather than copy-pasting `useCombobox`'s internals again.
