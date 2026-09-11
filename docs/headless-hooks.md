# Headless hooks

Most of `brightframe` is deliberately *not* headless — a styled `<Btn>`/`<Card>`/`<Modal>` that
matches the rest of the kit out of the box is the whole pitch. But for components with real
interaction logic, separating that logic from the markup (à la Radix/Headless UI/Downshift) lets
you keep the kit's behavior while fully controlling the DOM — useful for a bespoke design, a
non-standard layout the styled component doesn't support, or just understanding exactly what the
styled version does under the hood.

## `useCombobox`

The first component with a headless counterpart: `useCombobox` (exported
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

## `useReorder`

Exported alongside the styled `Table` from `brightframe/Table` (`Table` itself uses it internally
for `reorderableRows`/`reorderableColumns`). Unlike `useCombobox`, it isn't tied to table markup at
all — it's headless pointer + keyboard reorder logic for any list of items, vertical or
horizontal. Pointer dragging finds the closest item to the pointer by comparing bounding-rect
midpoints (register each item's DOM node via `registerItemRef`); keyboard follows the WAI-ARIA APG
"reorderable list" pattern — Space/Enter grabs the item at a handle, Arrow keys move it one
position at a time (reordering live), Space/Enter drops, Escape cancels.

```tsx
import { useReorder } from "brightframe/Table";

const reorder = useReorder({
  count: items.length,
  onReorder: (from, to) => setItems((prev) => { /* move prev[from] to index `to` */ }),
});

<ul>
  {items.map((item, i) => (
    <li key={item.id} ref={reorder.registerItemRef(i)}>
      <button {...reorder.getHandleProps(i)}>⠿</button>
      {item.label}
    </li>
  ))}
</ul>
<div role="status" aria-live="polite">{reorder.announcement}</div>
```

### Shape

- **State**: `activeIndex` (item being dragged/keyboard-grabbed), `overIndex` (current drop
  candidate), `announcement` (text for a visually-hidden live region — grab/move/drop/cancel).
- **`registerItemRef(index)`**: a ref-callback factory — pointer dragging needs each item's real
  layout to find the closest one to the pointer.
- **`getHandleProps(index)`**: spread onto whatever element is the drag handle.
- **`axis`**: `"vertical"` (default) or `"horizontal"`.
- The hook never reorders your data itself — it only reports intent via `onReorder(from, to)`;
  the caller owns the actual array splice, matching `onReorderRows`/`onReorderColumns`'s contract
  on `Table` itself.

## `useColumnResize`

Also exported from `brightframe/Table` (`Table` uses it internally for `resizableColumns`).
Headless pointer + keyboard resize logic for one column's width — or any horizontally-adjustable
pair of regions, not table-specific. Pointer dragging tracks `clientX` delta from the drag's start
width. Keyboard follows the WAI-ARIA APG "window splitter" pattern: a focused handle is a
`role="separator"` with `aria-orientation="vertical"`; Left/Right arrows adjust by `step` (10px by
default), Home/End jump to the min/max bound.

```tsx
import { useColumnResize } from "brightframe/Table";

const resize = useColumnResize({ minWidth: 60, onResize: (id, width) => setWidths((w) => ({ ...w, [id]: width })) });

<div {...resize.getResizeHandleProps(column.id, currentWidths[column.id], column.label)} />
```

### Shape

- **State**: `resizingColumnId` — id of the column currently being pointer-dragged, or `null`.
- **`getResizeHandleProps(columnId, currentWidth, label?)`**: spread onto the drag handle element;
  `label` feeds the handle's `aria-label` ("Resize *label* column").
- **Options**: `minWidth` (default 60), `maxWidth` (unbounded by default — also disables the `End`
  key, since there's no bound to jump to), `step` (default 10).
- Same "caller owns the state" contract as `useReorder`: the hook reports the next width via
  `onResize(columnId, width)`, it doesn't store anything itself.

## Why `Combobox` first, not `SelectField` or `DropdownMenu`

`Combobox` has strictly more logic than `SelectField` (text query + live filtering + revert-on-blur
— `SelectField`'s open/focus/keyboard-nav needs are a subset of what `useCombobox` already covers),
so it could plausibly adopt `useCombobox` internally later without losing anything. `DropdownMenu`'s
open/keyboard/focus machinery is structurally similar but *item-list-oriented*, not
*filter-oriented* — it's a separate, not-yet-started extraction, not a variant of this one.

## Roadmap

Nothing else is planned yet. The shared "outside-pointerdown close" and "open/focusedIndex" logic
duplicated across `Combobox`, `SelectField`, and `DropdownMenu` (noted when `useCombobox` was
first extracted) is still the natural next thing to pull into its own reusable piece, rather than
copy-pasting `useCombobox`'s internals again — `useReorder`/`useColumnResize` didn't touch that
duplication, since they're a different kind of interaction (drag/resize, not open/filter/select).
