# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

This log was reconstructed retroactively from git history starting 2026-08-19; entries
before that date are dated by commit, not by release announcement.

## [Unreleased]

### Added

- **React Server Components audit**: every component under `src/components/**` is now correctly
  marked `"use client"` (client-only hooks or own-JSX DOM event handlers) or intentionally left
  unmarked (pure props-in/markup-out, safe inside a Server Component tree). Found and fixed a real
  gap: the entire `Formik*` field-wrapper family (`FormikCheckbox`, `FormikCombobox`,
  `FormikRadioGroup`, `FormikSelectField`, `FormikSwitch`, `FormikTextareaField`,
  `FormikTextField`) called `useField()` from `formik` without the directive, while every parallel
  `RHF*` wrapper already had it — an inconsistency caught by grepping hook usage against existing
  directives, not by manual review. Also fixed: `Breadcrumb`, `Burger` (no internal state, but
  declares `onClick` in its own JSX — still needs the directive), `CalendarSlider`,
  `DateTimePicker`, `GuestsCounter`, `LabeledField`, `TextareaField`. Added
  `scripts/check-use-client.mjs` (runs in CI) as a permanent guard so new components can't silently
  ship without the correct marker, and `docs/rsc.md` covering the rule, the `ThemeProvider`/
  `useTheme()` client-boundary requirement, `getThemeInitScript` SSR flash-of-wrong-theme
  mitigation, and a deliberately-unresolved edge case (`Progress`/`Skeleton`'s `{...rest}`
  passthrough could carry a consumer's event handler — left marked rather than mechanically
  "corrected," since unmarking is the riskier direction).
- CI (`ci.yml`) now also runs `bun run lint` (previously only available as a script, never wired
  into CI despite ESLint being configured) and `node scripts/check-use-client.mjs`.
- **Accessibility: story-level, real-browser axe audit in CI**, on top of the existing
  per-component `jest-axe` unit tests. Added `@storybook/addon-vitest` + Vitest 4 browser mode
  (Playwright/Chromium) as a second Vitest project (`"storybook"` in `vitest.config.ts`, alongside
  the existing jsdom `"unit"` project — both run via the unchanged `bun run test`), wired to the
  already-installed `@storybook/addon-a11y` with `parameters.a11y.test = "error"` set globally.
  Extracted `src/test-utils/a11y.ts` (`expectNoA11yViolations`) and mechanically refactored all 73
  `*.test.tsx` files to use it instead of a duplicated inline `jest-axe` call. Running the new
  story-level audit for the first time surfaced 29 real violations across 16 story files that no
  isolated per-component test could have caught (composition bugs, real rendered contrast, a
  duplicate-landmark-name issue) — see `docs/a11y-audit.md` for the full root-cause breakdown and
  every fix, including: darkened `--c-accent`/`--c-badge-orange-text`/`--c-error`/
  `--c-error-hover`/`--c-text-2` (light theme only) for WCAG AA contrast; merged `Alert.module.css`'s
  two conflicting `.description` rules (an `opacity: 90%` blend was dragging text below 4.5:1);
  replaced a hardcoded literal `#229ED9` in `Btn`'s `.external` variant with a darker, still-legible
  shade; fixed `DropdownMenu`/`Popover`'s own stories (and doc comments) demonstrating a nested-
  button anti-pattern; made `HorizontalScroller`'s scrollable track keyboard-focusable (new optional
  `label` prop for unique region names when multiple instances share a page); fixed an
  inline-link-relying-on-color-alone story in `Link.stories.tsx`; and swapped an `opacity`-based
  dimming hack in `EventsPoster.stories.tsx` for an opaque muted color. One exception is
  deliberately left open and tracked (`BookingForm.stories.tsx`'s `Default` story, `a11y.test:
  "todo"`) — a real design decision, not a mechanical fix; see `docs/a11y-audit.md`.
- **Visual regression testing**: a third Vitest project (`"visual"`, reusing the same Chromium/
  Playwright browser mode added for the a11y audit above) screenshots one representative story per
  component x light/dark theme (142 baselines, 71 of 73 components — see `docs/visual-regression.md`
  for the two exclusions and why) via Vitest 4's native `toMatchScreenshot()`, committed under
  `src/test-utils/__screenshots__/`. Verified end-to-end: a deliberate CSS regression introduced
  into `Btn`'s `.primary` background was caught immediately (including in `Modal`/`Drawer`'s own
  baselines, which compose a primary `Btn`), then reverted. New scripts `test:visual`/
  `test:visual:update`; CI uploads the screenshots directory as an artifact on any failure.
- **Bundle size budget, enforced in CI**: `size-limit` + `@size-limit/preset-small-lib` (not
  `@size-limit/file` — `dist/Btn.js` is a 99-byte re-export shim over a Rollup-hashed shared chunk,
  so a raw-file-size check would report the wrong number entirely; `preset-small-lib` re-bundles
  via esbuild following the real import graph). New `.size-limit.json` checks the full kit (JS +
  CSS) and one representative component (`Btn`, JS + CSS); budgets are the real numbers from the
  first measured run (39.85 kB / 11.83 kB / 641 B / 890 B, all minified + brotli), not invented
  ones. New `bun run size` script, wired into CI after the build step. README gained a "Bundle
  size" table with the same real numbers.
- **Headless `useCombobox` hook**, exported alongside the styled `Combobox` from
  `brightframe/Combobox` — first component to get a headless counterpart (see
  `docs/headless-hooks.md` for why `Combobox` over `SelectField`/`DropdownMenu`). Extracted its
  open/query/filter/keyboard-nav/outside-click logic out of `Combobox.tsx` into
  `useCombobox.ts`, with a Downshift-style prop-getter API (`getInputProps`/`getListProps`/
  `getOptionProps`) and a controlled/uncontrolled `open` option matching `DropdownMenu`'s existing
  shape. `Combobox.tsx` itself now consumes the hook internally — same public props, same rendered
  DOM/ARIA, `Combobox.test.tsx` passes unmodified as the regression baseline. New
  `useCombobox.test.ts` (hook-only, via `renderHook`) and a new, genuinely unstyled
  `Combobox.headless.stories.tsx` demo proving the hook works standalone.
- **Found and fixed a second, related "use client" gap** while wiring up the new hook (see
  `docs/rsc.md`): `useCombobox.ts` and the pre-existing `CalendarSlider/useMediaQuery.ts` are both
  standalone hooks, and the original `check-use-client.mjs` only scanned `.tsx` files — harmless
  for `useMediaQuery` (only ever imported by an already-marked `CalendarSlider.tsx`), but a real gap
  now that `useCombobox` ships as its own public, directly-importable export. Fixed both and
  widened the guard script to scan `.ts` as well as `.tsx`.
- **Generic `migrate-legacy-kit` codemod** (`codemods/migrate-legacy-kit/`, a repo-local dev tool —
  not published on npm, see its own README for why): a ts-morph-based transform engine, config-
  driven rather than hardcoded to any one legacy kit. Two rule kinds: `safe-rename` (default
  import → named `brightframe` import, plus renaming every reference in that file, applied only
  with `--write`) and `manual-review` (reported with an explanatory note, never auto-rewritten —
  used for e.g. a `Button`/`Btn` pair that isn't behaviorally equivalent). Also detects plain
  (non-CSS-Modules) stylesheet imports as a separate, always-reported finding. `--write` is the
  only thing that ever calls `project.saveSync()` — verified directly via `sourceFile.isSaved()`
  in `migrate-legacy-kit.test.ts`, run against fixtures through an in-memory ts-morph `Project`.
  `configs/lan-site.example.ts` is a worked example grounded in brightframe's real "Origin"
  history. Ran it dry (no `--write`) against lan-site's actual orphaned pre-extraction component
  directory as a demonstration — correctly found all 9 dead components' plain-CSS imports and
  flagged `Button` (2 files) as manual-review for its `to`/router-push behavior that `Btn` doesn't
  have; found zero `safe-rename` matches, which is expected, not a bug — this run only scanned the
  orphaned components' own directory, and lan-site's real app pages already migrated to
  `brightframe` imports directly, so there's nothing left in that specific scope for a rename rule
  to match. Confirmed via `git status` in `lan-site` that nothing there changed. Report committed
  at `codemods/migrate-legacy-kit/reports/lan-site-dry-run.md`.
- **UI kit v2 follow-up: three demo-only gaps promoted to real shipped APIs.** The UI kit v2 pass
  had built these as one-off helpers on `examples/UIKitOverview.stories.tsx` rather than component
  features; now real, tested, exported components/props, and the Overview page consumes them
  directly instead of its local helpers.
  - **`Tag` gained `onDismiss`/`dismissLabel`**: renders a small × button (same close-button
    pattern as `Alert`'s — `currentColor`-based, since `Tag` has many background colours and a
    single brand-coloured ring wouldn't read on all of them) that fires `onDismiss` when clicked.
    Additive — omitting the prop renders the exact same non-dismissible tag as before.
  - **New `AvatarGroup` component** (`brightframe/Avatar`, alongside `Avatar`): overlapping
    stack (`-10px` margin) with a `--c-surface`-coloured ring per avatar for separation, and an
    optional `max` prop that collapses the remainder into a real "+N" avatar (built by passing a
    computed `name` straight through `Avatar`'s own initials logic, not a bespoke pill).
  - **New `LanguageSwitch` component** (`brightframe/LanguageSwitch`): a controlled `value`/
    `onChange` pill group, default options RU/EN/HY, `options` prop for custom locale sets.
  - Fixed a latent bug this surfaced in `src/test-utils/visual.stories.test.tsx`: its component
    identity for visual-regression baselines was derived from the *directory* name, which
    silently collides if a directory ever holds more than one component's `.stories.tsx` file
    (exactly what adding `Avatar/AvatarGroup.stories.tsx` did — both baselines would have been
    named `Avatar-*`). Switched the derivation to the stories *filename* instead; no other
    component's baseline name changes since this was previously a one-file-per-directory
    convention everywhere else.
- **UI kit v2: `FormCard`'s "fields drop their border inside" contract, the last open item from
  that pass.** `LabeledField`, `TextareaField`, `SelectField`, `Combobox`, and `FormDatePicker`
  (the five components sharing the "section-02 field anatomy" — 48px pill/rounded, `1px
  var(--c-border)` resting border) now read that border colour as `var(--field-border-color,
  var(--c-border))` instead of the literal token. `FormCard` sets `--field-border-color:
  transparent` on its own root, which cascades to any nested field automatically via normal CSS
  custom-property inheritance — no context or JS wiring between the two components, and zero
  effect outside a `FormCard` since the custom property is simply unset there. Focus/error border
  colours are untouched (`--c-brand`/`--c-error` are set directly in those rules, not through this
  variable), so a nested field's focus ring stays fully visible — checked in Storybook by tabbing
  into a field inside the new `FormCard` story. Deliberately scoped to these five text/select-style
  fields, not `Checkbox`/`RadioGroup`/`Switch` — those are a distinct toggle-control visual
  language the original spec's "fields" language never referred to, and the real-world reference
  (`BookingForm.stories.tsx`'s `FormCard` usage) only ever nests the five. New `FormCard.stories.tsx`
  "— With nested fields (borderless contract)" story, and the Overview page's own "Form card"
  specimen (section 14) now nests a real `LabeledField` instead of just a heading and a button —
  closing the specific gap flagged in an earlier session ("the FormCard demo on the page doesn't
  nest real fields inside it").
- **New `BorderBeam` component** (`brightframe/BorderBeam`): a purely decorative wrapper that
  loops a gradient beam around a container's border — for login panels, recommendation cards,
  AI-feature modules, or key CTA blocks, inspired by the component of the same name added to antd
  6.4.0. `colors`/`duration`/`size`/`lineWidth`/`radius` props, plus `triggerOnHover` to only
  animate on hover. CSS-only (a rotating oversized conic-gradient clipped to a fixed ring via the
  padding-box/content-box mask-exclude trick, driven entirely by custom properties set from props)
  — no hooks, no own-JSX event handlers, so unlike `Reveal` it needs no `"use client"` directive
  and stays safe inside a Server Component tree. Freezes instead of spinning under
  `prefers-reduced-motion`.
- **New `useFocusTrap` hook** (`brightframe/a11y`, alongside a new `src/a11y/` module): implements
  the WAI-ARIA modal dialog keyboard contract for a portalled container — moves focus inside on
  activation, traps Tab/Shift+Tab cycling within it, restores focus to whatever was focused before
  activation once it deactivates. Wired into `Modal` and `Drawer`, neither of which had any of
  this despite already carrying `role="dialog"`/`aria-modal="true"` — a keyboard user could Tab
  straight out into the page behind the overlay, and focus was never moved into the dialog or back
  to the triggering element. (`Popover`/`MobileDatePicker` also render `role="dialog"` content but
  weren't touched in this pass — flagged for a follow-up, not fixed here.)
- **`scripts/a11y-score.mjs`** (`bun run a11y:score`): a per-component accessibility heuristic
  score, deliberately scoped to what the existing DOM-based checks (`jest-axe` per component,
  `@storybook/addon-a11y` on every real-browser story) structurally cannot verify — correctness of
  *behavior*, not just presence of the right markup. AST-walks every component with `ts-morph`
  (already a devDependency, used by the legacy-kit codemod) for two structural rules —
  `role="dialog" aria-modal="true"` without a `useFocusTrap` call, and an `<svg>` with no
  `aria-hidden`/accessible name anywhere in its JSX ancestry, correctly skipping unexported
  single-use icon helpers a caller already wraps — plus three source/CSS heuristics: a
  `formatValue`d range input missing `aria-valuetext`, increase/decrease-labelled controls with no
  `aria-live`, and a looping (`infinite`) CSS animation with no `prefers-reduced-motion` guard.
  Always exits `0` — a report, not a gate. Two false positives surfaced and fixed while calibrating
  it against the real kit, not left as noise: `Accordion`'s private, single-use `PlusIcon` helper
  (wrapped in `aria-hidden` by its one call site — invisible to per-file AST analysis across that
  composition boundary, so the dialog rule now only descends into *exported* functions) and
  `Popover` (a deliberately non-modal `role="dialog"` disclosure panel with no `aria-modal` —
  trapping its focus would have been a regression, not a fix, so the rule now requires
  `aria-modal="true"` too). Currently 75/75 components clean, 100/100 average.
- **New `Table` component** (`brightframe/Table`): the design handoff's screen map explicitly had
  no matching component for its "Table" spec — closes that gap. A real `<table>` (not a div-grid),
  generic over row type `T`: `columns` (`id`/`header`/`cell`/`sortable`/`align`/`width`) + `data` +
  `getRowId`. Sorting and row selection are both controlled, matching `Pagination`'s existing
  `page`/`onChange` precedent rather than introducing a new stateful pattern — `sort`/
  `onSortChange` for a tri-state (asc → desc → unsorted) sort on any `sortable` column, and
  `selectedRowIds`/`onSelectedRowIdsChange` for a header "select all" + per-row checkbox column
  (reuses the existing `Checkbox` component, including its indeterminate state for a partial
  selection) — omit either pair to render without that behaviour. Empty state renders a plain
  muted row (same convention as `Combobox`'s "Nothing found"), `caption` prop for an optional
  a11y-friendly table description. Marked `"use client"` (declares its own `onClick`/`onChange`
  handlers in JSX, same rule as `Burger`). `npm run a11y:score`: 100/100.
- **`Table` split into primitives, plus filters/inline editing/column highlight/drag-reorder/
  pagination.** User asked for this as a follow-up to the `Table` component above: separate row/
  cell/header/footer pieces, and a much larger feature set. Repo research first (no existing
  Context-based compound-component pattern anywhere in this kit — `Tabs`/`Accordion`/`DropdownMenu`
  all take a flat config array, and the one `createContext` usage in the whole repo is
  `ToastProvider`, a different shape) ruled out a `Table.Row`-style dot-notation/Context API in
  favour of the one real multi-piece precedent that exists, `SegmentedBar`/`SegmentedItem` — plain
  standalone named exports sharing no context/state.
  - **New standalone primitives** (`brightframe/Table`): `TableRow`, `TableCell`, `TableHeaderCell`,
    `TableFooter` — fully-controlled, explicit-props building blocks `Table` is now built from
    internally (zero behaviour change confirmed by the pre-existing `Table.test.tsx`'s 8 tests
    passing unmodified through the refactor) and that are also usable standalone for hand-rolled
    table markup — see the new `Composed from primitives` story.
  - **Column filters**: `filterable` per column renders a funnel button + popover (same
    controlled-open, outside-`pointerdown`/Escape-to-close mechanics duplicated across
    `Popover`/`Combobox`/`DropdownMenu` already — matched rather than newly abstracted, consistent
    with how the codebase already handles this in 6+ places). `filters`/`onFiltersChange`, like
    `sort`, never touch `data` — `Table` reports the filter text, the consumer re-filters and passes
    a new `data` array back down, exactly like it already doesn't sort internally.
  - **Inline cell editing**: `editable`/`getEditValue`/`onEditCommit` per column. An editable
    `TableCell` renders its content inside a plain `<button>` that swaps to an `<input>` on
    click/Enter/Space (commit on Enter/blur, cancel on Escape) — deliberately not a full WAI-ARIA
    "Data Grid" (`role="grid"`/roving tabindex); that's the textbook-correct pattern for a fully
    editable grid but a much bigger a11y undertaking that doesn't match how the rest of this kit
    builds interactive things (trigger → panel/input swap, e.g. `Popover`, `FormDatePicker`). Each
    edit trigger's `aria-label` includes the row's current value (`"Edit Guests: 3"`, not just
    `"Edit Guests"`) — the first pass used a column-only label and a test caught that every row in a
    column collapsed to the same accessible name.
  - **Column highlighting**: `TableHeaderCell`/`TableCell` accept `highlighted`; `Table` drives it
    from header-cell hover by default (self-managed, ephemeral UI state — no props required), or
    fully via `highlightedColumnId`/`onHighlightColumnChange` using the same
    `isControlled = x !== undefined` conditional-controlled pattern already used by
    `Popover`/`DropdownMenu`/`useCombobox`.
  - **Row and column drag-and-drop reordering**: new headless `useReorder` hook (`brightframe/
    Table`, exported like `useCombobox`) — pointer drag (closest-row/column-by-bounding-rect-
    midpoint hit-testing) plus a WAI-ARIA-APG "reorderable list" keyboard alternative (Space/Enter
    grabs, Arrow keys move one position at a time — reordering live rather than staging a pending
    move, since `Table` never owns `data`/`columns` itself and has to assume the consumer applies
    each `onReorderRows(from, to)`/`onReorderColumns(from, to)` call, same trust model as
    `sort`/`filters`; Space/Enter drops, Escape cancels), with a `role="status" aria-live="polite"`
    announcer reusing `GuestsCounter`'s existing live-region pattern verbatim. No new dependency —
    repo has no dnd/sortable library installed (only runtime dep is `react-imask`) and the kit's
    established "measured, not invented" bundle-budget culture pushed toward hand-built over adding
    one for this. `reorderableRows`/`reorderableColumns` add an opt-in grip-dots drag-handle column/
    per-header-cell handle (the one hand-rolled icon in this pass that's filled dots rather than the
    kit's usual single-stroke line-icon convention — a grip glyph doesn't read as a line icon).
  - **Pagination + footer**: `pagination` prop renders the real `Pagination` component (unmodified)
    inside a new `<tfoot>` row; `footer` renders arbitrary custom content (e.g. totals) above it.
  - Bundle-size budget remeasured and bumped with headroom, same "real numbers, not invented"
    approach as the original budget: full-kit JS 44.36 kB → 50 kB limit (was 45 kB), CSS 13.08 kB →
    15 kB limit (was 14 kB); `Btn`'s per-component budget is unaffected.
  - Verified: `typecheck`/`lint`/`test:unit` (36 Table-area tests, up from 9)/`test:storybook` (7 new
    stories, 253/253 passing, zero new a11y violations)/`test:visual` (Table's baselines
    regenerated — genuinely changed rendered output, not a regression)/`build`/`size`/`a11y:score`
    (100/100) all clean.
- **`Table` column resizing** (`resizableColumns` + controlled `columnWidths`/`onColumnWidthsChange`,
  same conditional-controlled pattern as `filters`/`highlightedColumnId`): a drag handle on each
  header cell's trailing edge, widened via pointer drag or, once focused, Left/Right arrow keys
  (Home/End jump to the min/max bound) — a new headless `useColumnResize` hook (`brightframe/Table`,
  exported like `useReorder`) implementing the WAI-ARIA APG "window splitter" pattern
  (`role="separator" aria-orientation="vertical"` with `aria-valuenow`/`-min`/`-max`), not a custom
  gesture. A column's starting width is `columnWidths[col.id] ?? column.width ?? 160px`, clamped to
  a 60px floor so a column can't be dragged into an unusable sliver; width is applied the same way
  the existing static `column.width` already was (inline `style` on the `<th>` only, no
  `table-layout: fixed`/`<colgroup>` — this kit's tables have never needed pixel-exact column
  control, and adding one would change the default `auto`-layout rendering of every non-resizable
  `Table` too). Verified: `typecheck`/`lint`/`test:unit` (new `useColumnResize.test.ts` covering the
  keyboard path and aria attributes, plus `Table.test.tsx` coverage for the rendered handles and
  `columnWidths` reporting)/`build` all clean.
- **`Table` filter popover clipped by the table's own horizontal scroll container** — user
  screenshot ("такого не должно быть"): opening the leftmost filterable column's filter panel
  showed "h name…" instead of "Search name…", the left half sheared off. `.filterPanel` was
  right-anchored (`right: 0`) to its trigger, which for a narrow first column pushes the ~200px
  panel's left edge past the table's own left boundary — and `.wrap`'s `overflow-x: auto` (needed
  for the table's own responsive horizontal scroll) clips anything that overflows it, including this
  absolutely-positioned popover. Switched to left-anchored (`left: 0`, grows rightward from the
  funnel button instead of leftward) — fixes the leftmost-column case outright and matches
  `Popover`/`DropdownMenu`'s own precedent of no collision/flip detection (good enough for the
  common case, not chasing every column-width edge case). Verified visually in Storybook (typed into
  the now-fully-visible input, filtering still worked) and confirmed the fix doesn't touch `Table`'s
  visual-regression baseline (the popover isn't open in the captured story state).

- **The four real findings `a11y-score` surfaced on its first calibration run**:
  - `MobileDatePicker`: same gap as `Modal`/`Drawer` above — `role="dialog" aria-modal="true"`
    with no focus management. Wired to `useFocusTrap`.
  - `Loader`: the root had no accessible name at all (screen readers announced nothing while
    content was loading), and its decorative `<svg>` wasn't hidden from assistive tech. Added a
    `label` prop (default `"Loading"`) as `role="status"`/`aria-label` on the root, `aria-hidden`
    on the `<svg>`. Also slowed (not disabled) its spin under `prefers-reduced-motion`, unlike
    `Reveal`/`BorderBeam`'s purely decorative motion — the spin is this component's *only* visual
    loading signal, so removing it outright would leave reduced-motion users with a static ring
    and no indication anything is happening. `Btn`'s loading spinner got the same slow-down
    treatment, for the same reason, for consumers that don't pass `loadingLabel`.
- **Screen-reader-specific gaps that axe's static ARIA checks don't catch**, found by walking the
  interactive components' actual announced behavior rather than just their markup:
  - `Slider`: the native `<input type="range">` announces its raw numeric value, which silently
    diverged from what `formatValue` shows sighted users (e.g. `"$50"`/`"50%"`) — screen reader
    users heard `"50"` regardless. Added `aria-valuetext={formatValue(...)}` to both the
    single-thumb and two-thumb (min/max) inputs so the announced value always matches what's
    rendered.
  - `Tooltip`: `aria-describedby` was set on the wrapping `<span>` that only exists to bridge
    hover/focus events from the trigger — screen readers resolve `aria-describedby` against
    whichever element actually has focus, so it was never read. Now cloned onto the trigger
    element itself (`React.cloneElement`, since `children` is always a single focusable element by
    the component's own contract) instead of the wrapper.
  - `GuestsCounter`: the count display was a plain `<div>` — clicking Increase/Decrease updated it
    visually with zero screen-reader feedback. Added `role="status"`/`aria-live="polite"`/
    `aria-atomic="true"` plus an `aria-label` that names the counter (`"Guests 3"` rather than a
    bare `"3"`), so each change is announced on its own.

## [0.4.9] - 2026-09-01

### Fixed

- **`CalendarSlider` overflowed its own box when embedded in a container narrower than the
  viewport** (a sidebar, a grid column, a dashboard widget — anything not full-bleed). The
  two-column-vs-stacked layout switch already used a CSS container query against `.block`'s own
  width, but the stacked-vs-compact-button switch (`isMobile`, driving both a `@media (max-width:
  768px)` rule and a `useMediaQuery` hook) was keyed to the viewport width instead. Result: a
  component sitting in a <=768px-wide container on an otherwise-wide screen would stack its two
  full-size (624px/528px) month grids instead of collapsing to the compact button, overflowing
  past its own edges into whatever sits next to it. Replaced `useMediaQuery` (removed, was
  private to this component) with a new `useContainerNarrow` hook (`ResizeObserver` on the
  `.block` ref) and converted the `768px` breakpoint from `@media` to `@container`, so both
  breakpoints now agree with each other and with the component's actual rendered width.
- **`Loader`**: removed the dead, never-referenced `.fixed` CSS class left over from an earlier
  attempt at a non-overlay layout mode. Clarified `overlay`'s doc comment: it only toggles the
  dimming scrim, not positioning — the root is unconditionally `position: absolute; inset: 0` (by
  design, matching its tests and the "All sizes" story), so `<Loader overlay={false}>` still
  requires a `position: relative`, explicitly-sized ancestor. No behavior change.

## [0.4.1] - 2026-08-23

### Fixed

- **`dist/brightframe.css` was missing from the published package.** `vite.config.ts`'s
  `cssCodeSplit: true` (needed so `brightframe/<Name>` pulls in only that component's own
  CSS) meant no combined stylesheet was ever emitted for the root `"style"` /
  `"./style.css"` exports, even though `package.json` pointed at
  `dist/brightframe.css`. Any consumer importing `brightframe/style.css` (the
  README/EXAMPLES-documented way to load all component styles at once) got a build
  failure. Added `scripts/bundle-css.mjs`, run as part of `npm run build`, which
  concatenates every per-component `dist/*.css` file (excluding `tokens.css`/`fonts.css`,
  which stay separate, required imports per the README) into `dist/brightframe.css`.
- **Root barrel (`import ... from "brightframe"`) crashed for any consumer without
  `react-hook-form` installed**, even ones that never touch the RHF wrappers. `src/index.ts`
  unconditionally did `export * from "./components/RHFTextField"` etc.; because `export *`
  is statically linked, evaluating the root barrel evaluated those modules too, which
  top-level `import` from `react-hook-form` — a peer dependency declared *optional* in
  `peerDependenciesMeta`. Same latent issue for the `Formik*` wrappers and `formik`.
  Removed the `RHF*`/`Formik*` re-exports from the root barrel; they're still importable
  (and were always independently built as their own entries) via their own sub-path, e.g.
  `brightframe/RHFTextField`, which only pulls in `react-hook-form` for consumers that
  actually use it.

### Changed

- **UI kit v2 visual revision, in progress** — recreating the `design_handoff_brightframe_v2`
  handoff (client brief: "everything should be nicer, more usable, more modern," components
  looked inconsistent) inside the existing components, section by section per the handoff's
  screen map. This entry tracks cumulative progress; see the handoff's `README.md` for full
  section-by-section specs and `github.md` for the section → component file mapping.
  - Global: focus-visible ring switched from `--c-accent` (orange, ~2:1 contrast on white) to
    `--c-brand` (blue) at `outline-offset: 3px` (was 2px), across all 19 components that draw
    it directly. Confirmed with the project owner over the handoff's own flagged open question.
    Colour-family transitions (`background`, `border-color`, `box-shadow`) now use plain `ease`
    instead of `--ease-native`'s cubic-bezier, per the kit's four-easing vocabulary (`150ms ease`
    for colour, sprung/`--ease-native` reserved for accordion/modal/sheet/progress-style motion).
  - Added `--radius-md` (alias of `--radius-12`) and `--radius-lg` (alias of `--radius-16`)
    semantic tokens, and `--space-18`/`--space-22`/`--space-26` (button padding steps not
    previously in the scale).
  - **01 Buttons** (`Btn`, `GhostButton`, `SubmitButton`): buttons are always pill-shaped now
    (radius 999px is the button default, not opt-in via `pill` — the kit has "one radius" for
    controls; the `pill` prop is kept as a harmless no-op alias for existing call sites, not
    removed). Sizes recut to the kit scale: `sm` 36px/18px pad, `md` 44px/22px pad, `lg` 52px/
    26px pad (`Btn`); `SubmitButton` to 50px per its assembly-example spec. Disabled opacity
    unified to `0.4` (was 0.5–0.6 depending on component).
    **Colour-role fix**: `--c-accent` (orange) is no longer used as a button background — the
    kit reserves accent for progress/slider/time-slot/DayBadge fills only; `--c-brand` (blue)
    is the button fill colour. `Btn`'s `primary` and `brand` variants are now visually identical
    (both brand-blue) and `SubmitButton`'s `accent` variant now renders as `brand` — kept as
    aliases rather than removed, since both are public props on a published package. `Btn`'s
    `secondary` variant is now a neutral outline (`--c-text-1`/`--c-border`, was brand-outlined)
    and `ghost` ("Quiet" in the kit) is brand-tinted text on transparent/brand-soft hover (was
    neutral grey). `danger` is now a quiet outlined treatment (transparent + `--c-error` border/
    text, alpha-tinted hover/active via `color-mix`) rather than a solid filled red button, so
    destructive actions read as lower-emphasis than primary by design, per the handoff spec.
    `external` and `white` variants are unaffected (site-specific, not part of the kit's 4-variant
    spec). **Icon-only shape and loading state added later** (see the entry near the end of this
    log, "`Btn` icon-button shape + loading state") — deferred at the time this section was done,
    built once the rest of the 20-section pass was finished.
  - **02 Fields and forms** (`LabeledField`, `TextareaField`, `SelectField`, `Checkbox`,
    `Switch`, `RadioGroup`): fields recut to the kit spec — 48px tall, pill radius (textarea
    keeps `--radius-md` since it isn't pill-shaped), `1px solid var(--c-border)` on `--c-bg`
    (was a borderless `--c-surface` block using an invisible box-shadow as its "border"), focus
    state is now `border-color: var(--c-brand)` + `box-shadow: 0 0 0 3px var(--c-brand-soft)`
    (previously `LabeledField`/`TextareaField` had no visible focus indicator at all beyond the
    suppressed native outline — a real a11y gap the new anatomy fixes as a side effect). Field
    text bumped 14px → 15px, label bumped to 13px/700 (was 400) in `--c-text-1` (was muted
    `--c-text-3`) matching the type scale's `label` vs `caption` distinction, label-to-control
    gap 6px → 8px. Error state now tints the border/focus-ring red instead of only the border.
    **Colour-role fix, same as buttons**: `Checkbox` checked/indeterminate fill, `Switch` "on"
    fill and `RadioGroup` selected dot all switch from `--c-accent` (orange) to `--c-brand`
    (blue) — the handoff states this explicitly for checkboxes ("checked fills `--c-brand`");
    applied the same to switch/radio for consistency since the kit's whole complaint was
    inconsistent-looking controls, and no separate accent-based spec exists for them. `Checkbox`
    box grows 20×20 → 24×24 with `--radius-8` (was `--radius-6`), tick colour is now the
    `--c-bg` token (was a hardcoded `#fff` — matters for dark theme). `Switch` track grows
    40×24 → 54×30, thumb 18×18 → 24×24, throw 16px → 24px, "on" transition now `220ms` on the
    new `--ease-spring` token (`cubic-bezier(0.34,1.3,0.64,1)`, added to `tokens.css` — reused
    across "sprung" motion: accordion marker, modal/toast entry, switch knob) instead of
    `--duration-160 --ease-native`.
    **Also fixed** (found while redoing `Checkbox`, unrelated to the handoff but the original
    ask that started this session): the check-glyph SVG path was stretched edge-to-edge across
    its own viewBox, which reads as visually bottom-right-heavy inside a rounded box — replaced
    with a standard-proportioned checkmark path that centers correctly (verified by rendering
    both at 4× in a browser before/after).
    Confirmed per the handoff's own open note: the `Formik*`/`RHF*` field wrappers needed no
    changes — they render these field components directly and inherited the new styling
    automatically; full test suite still passes (517/517).
  - **03 Accordion**: header padding `16px 4px` → `24px 30px`, text `15px/600` → `17px/700`
    (added `--font-size-17`), hover changed from a text-colour shift to a `--c-brand-soft`
    background wash. Marker changed from a plain chevron (rotate 180°, always `--c-text-2`) to
    a 30×30 circular marker with a `+` glyph that rotates 135° open (visually the same "×" as a
    45° rotation, per the plus sign's 90°-repeat symmetry — the handoff is explicit the glyph
    is never swapped for a minus) on the new `--ease-spring` token, background/text flipping
    `--c-surface-2`/`--c-text-1` (closed) → `--c-brand`/`--c-bg` (open). Body text 14px →
    15px/1.5, capped at `62ch`, gained a 220ms fade-and-rise on open (opacity + `translateY`)
    layered on top of the existing grid-rows collapse animation, padding matched to the header's
    30px horizontal inset (new `--space-28`/`--space-30` tokens).
  - **04 Tabs**: pill variant's selected state changed from a lifted `--c-surface` card
    (`box-shadow: --c-shadow-sm`) to a solid `--c-brand` fill with `--c-bg` text, `min-height
    42px`/`padding 0 20px`, track radius `--radius-12` → `--radius-999` (pill, matching "one
    radius"). Underline variant's selected border colour fixed from `--c-accent` (orange —
    another instance of the button/link colour-role bug) to `--c-brand`; unselected text now
    explicitly `--c-text-3` (was defaulting to the shared `--c-text-2`, so the two variants'
    unselected states no longer look identical). Panel gained `16px/1.75` body type, `70ch` cap,
    and a 200ms fade-in on tab change.
  - **05 Cards** (`Card`, `ActionCard`, `InfoCards`): `Card`'s `hover` treatment simplified to
    the spec's single `200ms ease` transform+shadow (was a hand-tuned two-speed enter/exit pair
    with a bespoke cubic-bezier), `translateY(-5px)`+`--c-shadow-3xl` → `translateY(-4px)`+
    `--c-shadow-md` per the "Plan cards" hover spec. `rmd`/`rlg` radius options now reference the
    `--radius-md`/`--radius-lg` aliases (same 12/16px values, no visual change — just wired to
    the semantic tokens these are literally for). **Colour-role fix**: `ActionCard`'s and
    `InfoCards`' circular arrow-link chip (border/icon fill) switched `--c-accent` → `--c-brand`
    — the same accent-as-interactive-colour bug as buttons/checkbox/switch/radio/tabs.
    `ActionCard` hover now also tints its border to `--c-brand` (previously only shadow+lift).
    Note: `Card`'s `outlined` variant already matched the "Plan card" base look (`--c-surface` +
    `1px --c-border`) with no change needed. `ActionCard`/`InfoCards`' own anatomy (icon-tile +
    title + body + arrow) doesn't match section 05's "Plan card"/"Event card" specs — it's
    actually closer to section 10's "service card" spec (`github.md` maps both components to
    section 10 as well) — deferred structural sizing/typography changes for `ActionCard`/
    `InfoCards` to when section 10 is done, to avoid re-deriving the spec twice from the wrong
    section. `Skeleton` (also described in section 05's prose but not in `github.md`'s table for
    this section) not yet touched.
  - **06 Dropdown, badges, table** (`Combobox`, `DropdownMenu`, `Badge`, `Tag`, `Skeleton`,
    `Pagination` — no `Table` component exists, that part of the spec has nowhere to land):
    `Combobox`'s input now matches the section 02 field anatomy (48px pill, real `1px --c-border`
    border, focus = brand border + 3px brand-soft ring — it hadn't been touched in section 02's
    pass) and its panel is now `--radius-md`/`--c-shadow-md` (was `--radius-16` + a permanently
    brand-bordered `shadow-xl`), options padded `12px/14px` at `--radius-10` (was borderless
    40px rows), and the selected option now shows a tick glyph (new — it didn't render one
    before). `DropdownMenu`'s panel padding 6px→8px, radius `--radius-12`→`--radius-md` (same
    value, semantic), items padded `9px/10px`→`12px/14px` at `--radius-8`→`--radius-10`.
    `Tag` (the kit's "Badges" — `Badge` itself is a plain corner-positioning utility with no
    visual spec to apply) recut to `5px/12px`–`6px/14px` padding, always-pill radius (was
    `--radius-20`, functionally already round but now on the semantic pill token), weight
    600→700, and gained four new variants — `blue`/`orange`/`green`/`purple` — wired to the
    `--c-badge-*` token pairs that already existed in `tokens.css` but weren't used by any
    component yet. The spec's other new idea, dismissible filter tags with a `×` button, has no
    home in any existing component (`Tag` isn't dismissible, `Badge` is a positioning wrapper) —
    **not implemented**, would need a new component, deferred like the `Btn` loading state.
    `Skeleton`'s shimmer gradient stop `--c-border-soft`→`--c-surface-alt`, sweep width
    400%→220%, animation `1.4s ease-in-out`→`1.6s linear`, and its `.text` line variant is now
    fully pill-radius (was `--radius-4`) per "same radius... as the real card." `Pagination`
    buttons grew 32px→40px with a visible `1px --c-border` ring (previously borderless), hover
    tint `--c-surface-2`→`--c-brand-soft`, and the current-page fill fixed `--c-accent`→
    `--c-brand` (same colour-role bug, again). Also normalized the `errorIn` fade-in animation's
    timing function to plain `ease` (was `--ease-native`) across `LabeledField`/`TextareaField`/
    `SelectField`/`Combobox` — missed in section 02's pass, caught here for consistency since
    `Combobox` shares the identical animation.
  - **07 Calendar and alerts** (`CalendarSlider`, `DateTimePicker`, `Alert`): the "month grid"
    spec text describes `DateTimePicker`'s calendar panel, not `CalendarSlider` (a day-strip, not
    a month grid — its own detailed spec lives in section 16, deferred there like `ActionCard`/
    `InfoCards` were to section 10). `DateTimePicker` day cells grew 34px→42px, weekday captions
    are now `11px` uppercase (were `12px`, not uppercased). **Found and fixed a real bug**: the
    selected-day and selected-time-slot fills were hardcoded `rgba(255,160,95,…)` literals
    (orange) rather than the `--c-accent` token — since `--c-accent` is overridden to *blue* in
    the `data-a11y="visually-impaired"` theme, this meant the A+A high-contrast mode silently
    still showed orange for these two states, undermining the theme it's supposed to serve.
    Selected day now uses a solid `--c-brand` fill (per spec — day *selection* is a brand/blue
    interactive state, not an accent one) with `--c-bg` text/700; selected time slot keeps
    `--c-accent` (time-slot fills are explicitly in the accent bucket per the role-split rule)
    but now via the token. Added a `data-today` marker (didn't exist before) rendering a
    `--c-brand`-bordered, 700-weight cell per spec's "Today" state. Disabled/closed days now
    show `--c-surface-2` fill + `--c-text-3` text + `0.6` opacity (was opacity-only at `0.35`,
    so unavailability read as "slightly faded" rather than "closed"). `Alert` padding
    `12px/14px`→`18px/20px`, radius aliased to `--radius-md`, title `14px`→`15px`, body
    `13px/1.5`→`14px/1.6` at `90%` opacity (new `--opacity-90`/`--line-height-160` tokens),
    close-button hover background switched from a hardcoded `rgba(0,0,0,0.06)` to the existing
    theme-aware `--c-hover-overlay` token (same class of bug as the calendar fix — a literal
    that silently ignored theme overrides). Alert's four variants already matched the spec's
    badge-pair colours exactly, no change needed there. The spec's "10px currentColor dot"
    alert-anatomy detail was skipped — `Alert` already has a real per-variant icon system, which
    is strictly more informative than the prototype's plain-dot placeholder; adding a redundant
    dot next to an existing icon would be a downgrade, not a fix. No "Legend" UI was added (new
    feature, not a restyle — same class of deferral as `Btn`'s loading state).
  - **08 Header and navigation** (`Navbar`, `Burger`, `Drawer`): `Navbar` gained a self-contained
    "scrolled" state — a `scroll` listener (`"use client"`, new optional `scrollThreshold` prop,
    default 8px) toggles `data-scrolled` on the root, which compacts padding `18px`→`14px` and
    adds `--c-shadow-sm`, matching the spec's default/scrolled pair. No public prop was removed
    or repurposed, so this is additive. `NavbarItem`'s active state changed from a filled
    `--c-accent` pill (another instance of the accent-as-interactive-colour bug) to a `14px`
    (was `12px`) text link with a `2px --c-brand` bottom border, matching "nav links with a 2px
    underline on the active item" — text-fill selection doesn't appear anywhere else in the kit's
    nav patterns. `Burger` rebuilt from a `width:100%` 3-bar flex column (which only worked at
    its native aspect ratio) to a fixed `18×2px` bar set absolutely centered in a `44×44` button
    (was `32×32`, below the kit's "touch targets never go below 44px" rule) with a standard
    hamburger↔X rotation on `--ease-spring` — the previous X-animation depended on the bars being
    full-width, which no longer holds now that they're a fixed size independent of the button box.
    `Drawer`: `left`/`right` placements now `min(360px, 100%)` (was `90vw`), entry duration
    `220ms`→`260ms` (new `--duration-260`), and its backdrop switched from a hardcoded
    `rgba(0,0,0,0.45)` to `color-mix(in srgb, #030717 52%, transparent)` — matches the spec
    exactly and is the same class of theme-literal bug as the `Alert`/`DateTimePicker` fixes in
    section 07 (though here the literal wasn't provably wrong, just not tokenized/spec-matched).
    **Not implemented**: the "primary CTA gets shorter (min-height 36) when scrolled" and
    "wordmark 19px→16px when scrolled" details — `Navbar`'s `brand`/`actions` are consumer-
    supplied `ReactNode` slots, so `Navbar` has no ability to resize their contents without a
    context/render-prop API `Navbar` doesn't have; deferred, same class of gap as `Btn`'s
    icon-button/loading state. The "mobile menu" row anatomy (min-height 52, bottom border, `›`)
    is a usage pattern built from `Drawer`'s existing body slot, not a `Drawer` feature — no
    change needed there. Note for later sections: `Modal`, `MobileDatePicker`, and `Loader`'s
    overlay backdrops still use hardcoded `rgba(0,0,0,…)` — same fix (`color-mix` on `#030717`)
    applies when their owning sections (09, 16, 13) are done.
  - **09 Overlays** (`Modal`, `Drawer`, `Toast`): this section gives `Drawer` a second, more
    detailed pass — its own "Overlays" spec (padding 34px, 40×40 close button, 420px sheet width)
    supersedes section 08's narrower "mobile menu" numbers (360px) for the component itself;
    treating this section as `Drawer`'s canonical anatomy since it's the more complete
    description (padding/close-button/CTA placement, not just a usage note). `Drawer` width
    360px→420px, close button 32×32→40×40, header/body/footer horizontal inset →34px (new
    `--space-34`). `Modal`: backdrop `rgba(0,0,0,0.45)`→`color-mix(#030717 62%)` +
    `backdrop-filter: blur(3px)` (same literal-vs-token class of fix as Drawer's backdrop in
    section 08), entry easing `--ease-native`→`--ease-spring` (dialogs are explicitly in the
    "sprung" bucket per the animation vocabulary), radius aliased to `--radius-lg`, shadow
    layered `--c-shadow-card`+`--c-shadow-lg` (was `--c-shadow-md`), title `18px`→`24px`, body
    gained explicit `15px/1.7` type (new `--line-height-170`, it previously had no font-size of
    its own at all), header/body/footer padding →34px horizontal (new `--space-34`, shared with
    `Drawer`). Modal's existing `sm`/`md`/`lg` size system (400/560/760px) was left alone rather
    than collapsed to the spec's single `440px` — it's a real, already-shipped size variant
    consumers depend on, and 440 doesn't cleanly replace any one of the three without an
    unannounced breaking resize.
    **`Toast` — deliberately not redesigned to the spec's anatomy**: the spec describes a single,
    always-bottom-center, dark-pill toast with a plain accent dot (`--c-text-1` fill,
    `--c-surface` text, no title, no per-kind colour). The shipped `Toast`/`ToastProvider` is a
    materially more capable system — six positions, a stacked queue, four colour-coded variants
    with icons, independent per-toast dismissal — none of which the simpler prototype anatomy
    supports. Recutting it down to the prototype's single-pill shape would be a regression, not a
    fix (same reasoning as keeping `Checkbox` a real `<input>` instead of a `role="checkbox"`
    button, and keeping `Alert`'s icon system instead of a plain dot). Only applied the universal,
    non-conflicting fixes: entry easing → `--ease-spring` (toast entry is explicitly in the kit's
    "sprung" bucket), radius aliased to `--radius-md`, close-button transition `ease-native`→
    `ease`. Default auto-dismiss duration (`4000ms`) intentionally left as-is rather than cut to
    the spec's `2600ms` — the shipped toast carries title+description text that needs more read
    time than the prototype's single-line message.
  - **10 Site blocks** (`Card`, `ActionCard`, `DayBadge`): closes the loop from section 05 —
    `ActionCard` is really this section's "service card" (`<a>`, icon tile, title, body, arrow
    link pinned bottom, hover border+shadow), not section 05's plan/event card, so its structural
    anatomy is done now instead. Icon tile 40px→48px, title 16px→18px, description line-height
    to an explicit `1.6` (new reuse of `--line-height-160`). **Structural change**: the arrow chip
    moved from the top-right corner (alongside the icon) to pinned at the bottom via `margin-top:
    auto` on a newly-flex `.card` — matches "arrow link pinned bottom" precisely; this changes
    the DOM order (icon → title → description → arrow) but not the public props, and the existing
    test suite has no order-dependent assertions so nothing broke. `Card`'s hover/radius handling
    was already done in section 05. The section's other three card patterns (discounted plan,
    event-with-cover, blog post) are consumer-composed from `Card` + `Badge`/`Tag`/`Btn` — no
    dedicated `PlanCard`/`EventCard`/`BlogPostCard` component exists or is warranted, same as
    concluded for section 05's plan/event cards. `DayBadge` is also mapped to this section in
    `github.md`, but its actual detailed geometry spec (120px/72px shapes, weekday/day/month type)
    lives in section 14 — deferred there, not redone from this section's silence on it.
  - **11 Media** (`Carousel`, `HorizontalScroller`): `HorizontalScroller` already matched its
    spec almost exactly (unlike most other "second reference" components this pass) — only the
    hover-background transition needed the `ease-native`→`ease` fix. `Carousel`'s dots grew
    `8px`→`10px` (inactive) and `20px`→`28px` (active) over `200ms` (was `160ms`), viewport
    radius aliased to `--radius-md`. Added a new optional `counter` prop (default `false`,
    additive) rendering a "current / total" pill bottom-right — `color-mix(#030717 70%)`
    background, white `12px` text, per the "Gallery" spec's counter-pill anatomy, which didn't
    exist as a feature before. New test coverage for it (2 tests) and a `Gallery` story
    demonstrating counter+dots+arrows together. The spec's "Map block" and "Partner ticker"
    (auto-scrolling logo marquee) have no corresponding component in the kit and aren't built —
    `HorizontalScroller` is a manual-scroll/snap component, not an autoplaying marquee, so it
    isn't a substitute; same class of gap as the dismissible filter tag from section 06.
  - **12 Utility** (`Breadcrumb`, `Footer`, `Fab`): `Fab`'s `md` size was already exactly the
    spec's "Back-to-top: 52px circle, --c-brand fill, --c-shadow-md" — only needed the easing fix
    and its three colour variants' hardcoded `#fff` text swapped for the `--c-bg` token (same
    literal-vs-token class of fix as elsewhere this pass). The spec's "appears after the first
    screen, above content" is scroll-triggered visibility behaviour that belongs to a specific
    *usage* of `Fab` as a back-to-top button, not the generic icon-button component itself
    (`Fab` is explicitly documented as not self-positioning) — not built into `Fab`, same
    reasoning as `Navbar` not resizing consumer slots. `Breadcrumb` gap `6px`→`8px`, text
    `13px`→`14px`, current-page weight `600`→`700`. `Footer` grid `minmax(180px,1fr)`→
    `minmax(200px,1fr)`, gap unified to `32px` (was `40px` desktop-only), padding `48px/24px`→
    uniform `40px`, background `--c-surface-alt`→`--c-surface-2` (a real colour mismatch, not
    just an un-aliased literal — these are different hex values), column headings recut to
    `12px` uppercase at `0.1em` tracking (new `--letter-spacing-10`, was `14px` no tracking),
    links `14px`→`15px`. The spec's "Language switch" (three `52×40` RU/EN/HY pills) and
    "social pills" (`40px` circular icon links in the footer) have no dedicated component and
    weren't built — both are composable from existing primitives (`SegmentedBar`-like pills,
    `Fab`-sized circular links) by a consumer, same gap class as section 11's ticker/map block.
  - **13 Feedback** (`Loader`, `Progress`, `EmptyState`, `Tooltip`, `InfoTooltip`, `Popover`):
    `Loader` and `Progress` already matched the spec almost to the pixel and millisecond
    (circle geometry, `2s linear` rotation, track/fill colours, `220ms cubic-bezier(0.22,1,0.36,1)`
    width transition, `1.2s ease-in-out` indeterminate sweep) — only `Progress`'s label weight
    `600`→`700` changed. Note: `Loader`'s overlay backdrop (`rgba(0,0,0,0.5)`) was flagged in
    section 08's reminder as a likely hardcoded-literal bug, but the spec itself states this
    exact literal for the loader overlay specifically (unlike Modal/Drawer's `color-mix`
    backdrops) — left as-is, the earlier reminder over-generalized. `EmptyState` gained a `2px
    --c-border` ring around its icon (didn't exist — the glyph swims in empty space without one),
    icon glyph explicitly sized down to `22px` inside the now-48px ring container, description
    line-height to `1.55` (new `--line-height-155`), padding unified to `40px` on all sides (was
    `40px`/`16px` asymmetric). `Tooltip` max-width `240px`→`220px`; **found the same hardcoded-
    hex-colour bug as elsewhere this pass, one level down**: `InfoTooltip`'s question-mark glyph
    (`icons/QuestionIcon.tsx`) drew itself with raw `#FFA05F`/`#4F4F4F` hex values instead of
    tokens, so it never responded to dark or A+A theming — fixed to `--c-brand`/`--c-text-3`
    (active/inactive), ring stroke `2px`→`1px` per spec. `InfoTooltip` was also missing the
    fade-in entrance animation `Tooltip` already had — added (`120ms ease`, matching). `Popover`
    min-width `220px`→`240px`, padding `16px`→`18px`, border colour `--c-border-soft`→
    `--c-border` (a real, not just unaliased, mismatch), radius aliased to `--radius-md`. All
    `ease-native`→`ease` easing fixes applied where transitions were colour/fade, not sheet-like.
  - **14 Picking and bookings** (`Slider`, `GuestsCounter`, `TimeRangePicker`, `Avatar`,
    `DayBadge`, `FormCard`; `SegmentedBar`'s real spec is section 17, `HorizontalScroller` was
    done in section 11): `Slider` already matched the spec almost exactly (20px row, 4px track,
    18×18 thumb, focus ring, range pointer-events split) — only its thumb's hardcoded `#fff`
    became `--c-bg`. **Found real (not just unaliased) token mismatches**, same pattern as
    sections 07/13: `GuestsCounter`'s ±buttons were `--c-surface-alt` (spec: `--c-surface-2`,
    added a hover state on `--c-surface-alt` instead since the two are close but distinct
    surfaces); `Avatar`'s circle background was `--c-surface-2` (spec: `--c-surface-alt`);
    `DayBadge`'s weekday/day/month text was `--c-surface-alt` (spec: `--c-bg` — same fix applied
    to both the default and weekend fills, which already share the same CSS rule); `FormCard`'s
    shadow was `--c-shadow-card` (spec: `--c-shadow-sm`); `TimeRangePicker`'s duration chip was
    `--c-surface-alt` (spec: `--c-surface-2`). `TimeRangePicker`'s outer pill and item radius
    fixed `--radius-16`→`--radius-999` (spec explicitly calls it "a pill"), dropdown panel
    `--radius-16`/12px padding→`--radius-8`/8px padding, slot padding unified to `8px`, active
    time-button/slot text `#fff`→`--c-bg` token, and its several raw-second transition durations
    (`0.15s`/`0.14s`/`0.12s`/`0.1s`) normalized to existing duration tokens with `ease` instead of
    `--ease-native` for colour transitions. `GuestsCounter`'s counter-button weight `600`→`700`.
    **Not built**: `Avatar`'s "stacked, −10px overlap, +N badge" group variant doesn't exist —
    same class of gap as the dismissible tag/language-switch/ticker (new composable feature, not
    a restyle); `FormCard`'s "fields inside drop their border" would need either a CSS custom-
    property contract or context between `FormCard` and the field components, deferred as a
    cross-component coordination feature rather than a mechanical fix.
  - **15 Typography** (`Eyebrow`, `Title`, `SubTitle`, `SectionHeading`, `Link`, `Divider`):
    mapped the type-scale table onto the components that already stand in for each row —
    `Title`(h1)/`SubTitle`(h2)/`SectionHeading`(section-heading+lead). `Title` gained `1.1`
    line-height and `-0.01em` tracking (new `--line-height-110`, reused `--letter-spacing-n1`),
    size/weight/uppercase already matched h1. `SubTitle` size `32px`→`34px` (new `--font-size-34`,
    matches h2 exactly), gained `1.15` leading (new `--line-height-115`) and the same `-0.01em`
    tracking — **and lost its `uppercase`**: the spec's table marks h1 "uppercase" but not h2, so
    forcing every subtitle to caps was a real spec deviation, not a rounding choice.
    `SectionHeading`'s heading already matched the "section-heading" row (36px/400/`--c-brand`)
    exactly except its line-height was a fixed `44px` (1.222) instead of the spec's unitless
    `1.2` — swapped to the exact `--line-height-120` token. Its companion paragraph maps to the
    "lead" row (18px/400/1.7) but was set at `16px`/`1.625` — fixed (reused `--line-height-170`
    from Modal). `Eyebrow` was a mix of the type scale's "label" and "overline" rows (13px sizing
    with overline's uppercase+tracking) — recut fully to "overline" (11px/700/leading-1/uppercase/
    0.12em tracking), since an eyebrow-above-a-heading is exactly what that row describes; its
    colour wasn't specified in the table and was left as `--c-accent`. `Link`'s four treatments
    (default/muted/brand≈accent/no-underline-till-hover) already matched the spec's four link
    styles exactly — only the hover-colour easing needed the `ease-native`→`ease` fix.
    `Divider`'s labelled-rule caption weight `600`→`700`.
  - **16 Dates** (`CalendarSlider`, `DateTimePicker`, `MobileDatePicker`, `FormDatePicker`):
    `CalendarSlider` — "the component the client specifically flagged as missing" — was already
    an almost complete, faithful build of this exact spec (13/11-day columns, 64px header row,
    ‹/› only on their respective side, 48px day-cell columns with a 40px round button, 40px-tall
    range band with the exact `--radius-20`/0 asymmetric corners, `--c-range-bar` token that
    already equals `color-mix(--c-brand 14%)` in light mode). **Found one real behavioural bug**:
    the ‹/› arrows called `shiftMonth`/`addMonthsClamped`, stepping the visible window by a full
    calendar month — but the spec is explicit both arrows "step by 7 days," and geometrically a
    24-day-wide window jumping a full month would show entirely non-overlapping dates each click.
    Replaced with a `shiftWindow` stepping ±7 days; removed the now-dead `addMonthsClamped`;
    updated the default English button labels ("Previous/Next month" → "…week") and the one test
    that asserted on the old label/behaviour. Also fixed: weekday caption colour `--c-text-3`→
    `--c-text-2`, selected-day text `#ffffff`→`--c-bg` token, and the preset track (Today/Week/
    Month) — which maps to section 02's "segmented control" spec more precisely than this
    section's one-line mention — recut to that spec's `4px` padding/pill radius/`--c-shadow-sm`
    selected state and gained the `--c-surface-2` background it was missing entirely.
    **Correction to a change made earlier in this same pass**: `DateTimePicker`'s month-grid day
    cells, set to `42px` in section 07 per that section's generic "Calendar" text, don't
    geometrically fit the `320px`-wide dropdown panel this section pins down for `DateTimePicker`
    specifically (7×42px + gaps + padding > 320px) — corrected to the `34px` this section
    specifies, which section 07 had no reason to know about since it wasn't describing this
    component's actual panel width. `MobileDatePicker`: backdrop hardcoded `rgba(0,0,0,0.4)` →
    `color-mix(#030717 52%)` (the reminder flagged in section 08, now resolved), sheet gained a
    `480px` max-width cap (was unbounded `100%`), radius `--radius-20`→`--radius-24`, grab handle
    `36px`→`44px` wide, entrance `300ms`→`260ms`, its primary "Apply" action `48px`→`52px`
    (kept the paired secondary "Reset" button — the spec's "full-width primary Done" describes
    the primary action's own spec, not a mandate to delete the existing secondary control), and
    its desktop centered-dialog variant's entrance easing switched to `--ease-spring` to match
    `Modal`'s established "dialogs are sprung" precedent from section 09. `FormDatePicker`
    brought up to the standard 48px pill field anatomy from section 02 (it hadn't been touched
    then, same gap as `Combobox` was in section 06).
  - **17 Search and switches** (`Combobox`, `SegmentedBar`): `Combobox` mostly done in section
    06 — the remaining gaps were the selected (not just selected-*and*-keyboard-focused) row not
    showing the `--c-brand-soft` background, the empty-result message at `13px` (spec: `15px`),
    and its default English copy ("No matches" vs the spec's literal "Nothing found," changed
    since it's a translatable default any consumer can already override). `SegmentedBar` outer
    track `--radius-16`→`--radius-999` ("a 46px *pill*"), inner items `--radius-16`→`--radius-md`
    (spec ties `--radius-md` to "each" row, not the outer pill), items gained the `14px` label
    type they had none of before, plus baseline interactive affordance (`cursor: pointer`, hover
    tint) — the component was a purely decorative `<div>` with no visual sign it's meant to be
    "independently clickable"; full keyboard/`role="button"` semantics were left to the consumer
    (same as before), since building that out is a behavioural feature, not a restyle.
  - **18 Layout** (`Container`, `Grid`, `Stack`, `Spacer`, `Reveal`): this section describes
    "invisible primitives, shown on tint" for the demo — most already matched exactly (`Grid`
    defaults to 12 columns/16px gap; `Reveal`'s `translateY(32px)` fade over `0.8s cubic-bezier(
    0.16,1,0.3,1)` is pixel- and millisecond-identical to spec, left as raw values since they're
    unique to this one component and not worth a token; `Stack`/`Spacer`'s spec numbers are demo
    examples of already-fully-configurable props, not defaults to change).
    **⚠️ Behavioural change flagged for verification against the live site**: `Container` had no
    `max-width`, `padding`, or centering at all — only a `background-color` and `height: 100%` —
    despite the spec (and its own name) describing "max-width with edge padding, content
    centred." Added `max-width: 1200px; margin: 0 auto; padding: 0 24px;`, matching the `1200px`
    convention already used by `Footer`/`InfoCards`/`CalendarSlider`. This *will* change layout
    on any existing page where `Container` was relied on as an unconstrained full-bleed
    background wrapper (its Storybook docs describe an `as="main"` page-root usage, which this
    change now also width-constrains) — recommend checking `lancoworking.am` usages of
    `Container` before shipping, this is a real behavioural change, not a token/colour fix like
    most of this pass.
  - **19 Assembly example** (`examples/BookingForm.stories.tsx` — a Storybook demo, not shipped
    library code): already close to spec (`FormCard` shell, `Eyebrow`+`Title`, the exact field
    set, `SubmitButton` already full-width/`min-height:50` automatically from section 01's fix).
    Swapped its hand-rolled inline-styled success banner for the real `Alert` component (variant
    `success`) now that section 07 brought `Alert` in line with the spec's green-badge-pair
    styling — both simpler and dog-foods the actual component instead of re-implementing its
    look inline. Did not add the spec's "rule card beside it in `--c-brand-soft`" (net-new demo
    content, not a restyle) or attempt the FormCard-drops-field-borders treatment (depends on the
    cross-component contract deferred in section 14).
  - **20 Poster** (`/events` page pattern — filter bar, day groups, event rows): confirmed as
    the one section with **no existing component mapping in `github.md` at all** — not a
    restyle target like every other section, a genuinely new pattern the client flagged as
    missing from the kit. Would need: a filter bar (5-option preset track + an "upcoming only"
    switch + a language-pill filter — none of which have a ready-made composite today, though
    `SegmentedBar`/`Switch`/pills are the right primitives), a day-group layout (`DayBadge` +
    an event-list column), and an event-row component (time column, language badge via `Tag`'s
    new blue/orange/purple variants, title, optional note, `Details →` link, conditional
    register button) — genuinely new component work, not mechanical restyling like the rest of
    this pass. **Not built this session** — same class of deferral as the `Btn` loading state,
    `Avatar` stacking, and the dismissible filter tag, but larger in scope than any of those;
    flagging it as the standout remaining gap for a dedicated follow-up session.
  - **20 Poster, built**: added `examples/EventsPoster.stories.tsx` composing the `/events`
    filter-bar + day-group + event-row pattern entirely from existing primitives (`DayBadge`,
    `Tag`'s blue/orange/purple language variants, `Link`, `Btn`, `Switch`, `EmptyState`), plus
    local (non-shipped) styling for the preset track, language pills, and event-row layout that
    have no dedicated component — same treatment as `BookingForm` for section 19, since
    `github.md` doesn't map this section to any component either. New `--font-size-22` token for
    the month heading. **Found a real, pre-existing WCAG AA failure while visually checking this
    in Storybook**: `DayBadge`'s weekend variant (white/`--c-bg` text on `--c-error` red) measures
    3.36:1 contrast, below the 4.5:1 required for its text size — not introduced by this pass
    (the prior `--c-surface-alt` text colour was comparably low-contrast against the same red),
    and not fixed here since a real fix means either darkening the shared `--c-error` token
    (affects every error state sitewide) or a font-size/weight change to cross into the "large
    text" 3:1 threshold — a design call, not a mechanical token swap. Flagged for a follow-up.
    Also fixed while building this: `DayBadge` defaulted to `ru-RU` locale, showing Russian
    weekday abbreviations inside an otherwise-English demo — passed `locale="en-US"` explicitly.
  - **All 20 sections of the `design_handoff_brightframe_v2` screen map have now been visited.**
    Remaining genuinely-new components/features identified but not built at that point (tracked
    as follow-ups, not silently dropped): `Btn` icon-button shape + loading state (01) — **since
    built, see below**; a dismissible filter tag (06); language switch + footer social pills
    (12); `Avatar` stacked-group variant + `FormCard`'s auto-borderless-fields contract (14). Two
    items need human verification before shipping, not further code changes: `Container`'s new
    max-width/padding/centering (18) against the live site, and `DayBadge`'s weekend-variant
    contrast failure (20) needs a design decision (darken `--c-error` sitewide, or bump the
    affected text past the "large text" threshold).
  - **`Btn` icon-button shape + loading state** — the last deferred item from section 01, built
    once the 20-section pass finished. New props (both additive, no breaking changes): `iconOnly`
    (fixed 44×44, transparent, `1px --c-border`, `--c-brand-soft`/`--c-brand` hover — a standalone
    shape+style modifier, not a per-variant combination, matching the spec's single icon-button
    treatment; icon passed as `children`) and `loading` + `loadingLabel` (shows a 16px/2px-ring
    spinner — `currentColor` ring with a `--c-bg` top edge, `700ms linear infinite`, exactly per
    spec — disables the control, sets `aria-busy`, and swaps the label to `loadingLabel` if
    given). The width-lock ("fixed at 190px before the click so the layout cannot shift") is
    generalized rather than hardcoded: a `useLayoutEffect` measures the button's own rendered
    width whenever it's *not* loading and applies that as `min-width` once `loading` becomes
    true, so any button's label — not just one hardcoded to 190px — gets a stable width. New
    tests (4) and two stories (`IconOnly`, `Loading`, the latter with a live 1.8s timeout demo).
    Verified in Storybook directly (spinner renders, label swaps, no width jump) in addition to
    typecheck/test(523/523)/lint/build.
- **`Overview / UI Kit` Storybook page** (`examples/UIKitOverview.stories.tsx`) — a single
  scrollable specimen page mirroring `design_handoff_brightframe_v2/UI Kit.dc.html`'s structure
  (sticky header with a working Light/Dark/A+A switch, hero, token strip, then all 20 numbered
  sections), built entirely from the real shipped components rather than the prototype's inline
  mockup. Doubles as an integration check — every component touched across this whole redesign
  rendered together on one page for the first time. The header's theme switch sets `data-theme`/
  `data-a11y` directly (matching what `.storybook/preview.tsx`'s own toolbar decorator does)
  rather than nesting a real `ThemeProvider` inside the story, which would fight the decorator
  for control of the same two attributes. Sections 19/20 link out to the existing `BookingForm`/
  `EventsPoster` stories instead of re-embedding them.
  **Found and fixed real bugs while building/scanning this in Storybook's Accessibility panel**
  (a real-browser a11y scan the individual-story test suite doesn't run): `Toast`'s notification
  viewport had `aria-label` on a plain `<div>` with no ARIA role, which axe flags as prohibited —
  added `role="region"`, a pre-existing bug now fixed sitewide. Two bugs were in the new overview
  page itself, not pre-existing: `DropdownMenu`/`Popover` both render their own `<button>` around
  whatever `trigger` you pass them, so passing a full `<Btn>` as the trigger (as this page
  initially did) nests a `<button>` inside a `<button>` — fixed by introducing a `FakeButtonLabel`
  helper (a `<span>` visually matching `Btn`'s secondary style, used only where a component
  already supplies its own interactive wrapper); the header's `<nav>` had no `aria-label`,
  colliding with `Pagination`'s own labelled `<nav>` elsewhere on the page (landmark-uniqueness) —
  labelled it.
  **Corrected against the actual prototype file** (the user pointed at their claude.ai/design
  project directly; the local reference is `UI Kit.dc.html` at the zip's top level — a slightly
  newer file than the nested `design_handoff_brightframe_v2/UI Kit.dc.html` the rest of this
  redesign was built from, though the two differ by only ~40 lines of CSS custom properties, not
  content). The page's hero and nav were built from `README.md`'s prose spec, which only
  describes typography/layout, not the prototype's literal copy — opening the real file directly
  surfaced three concrete gaps: the H1 was invented ("Letters and Numbers", from an unrelated
  `Title` story) instead of the prototype's actual "One set of rules across the kit" (with its
  real lead paragraph); the header nav only linked 8 of the prototype's 19 sections; and an
  entire section — "What's in the kit · and where," a component index grouped into pill lists
  right after the hero — was missing outright. All three fixed to match the real file.
  **Found a systemic, pre-existing token issue, not fixed**: the *majority* of a 70-count colour-
  contrast violation surfaced by this page comes from one repeated pattern — `--c-text-3`
  (`#808385`) on white measures 3.81:1, below the 4.5:1 WCAG AA threshold for normal text.
  `--c-text-3` is the kit's general-purpose muted/caption/hint colour, used across most of the ~80
  components (captions, hints, placeholder-ish text, disabled-adjacent copy) — this is a
  *design-token* decision (darken `--c-text-3`, or restrict its use to large/bold text where the
  3:1 threshold applies), not a per-component fix, and out of scope to change unilaterally here.
  Flagged alongside `DayBadge`'s weekend-contrast issue as a design-owner decision.
  **Followed up by reconciling all 20 section headings/descriptions against the same prototype
  file**, not just the hero/nav/index fixed above: `SectionBlock` (and `PointerSection`, its
  thin wrapper for sections 19/20) previously took only a `title` prop and rendered invented
  copy under it. Both now take separate `heading`/`description` props, and every section call
  site (01 through 20) was updated with the prototype's real per-section heading and lead
  sentence in place of the placeholder text. `PointerSection` additionally renamed its old
  `description` prop to `pointerNote`, since that text (describing what the linked-out story
  contains) is distinct from the section's own heading/description pulled from the prototype.
  Two section titles were also corrected to match the prototype's exact eyebrow text: "Utility"
  → "Utility elements", "Typography and dividers" → "Text and dividers". Verified against the
  live prototype file (served locally) side-by-side with the Storybook page, then confirmed with
  typecheck/test(523/523)/lint/build all green.
- **`Overview / UI Kit` page: layout-section fidelity fix + a few requested additions**
  (2026-08-23, prompted by "everything's clumped together" in the Container/Grid/Stack/Spacer/
  Reveal section). Comparing the live prototype's DOM directly (not just its text) showed a real
  structural mismatch, not a spacing tweak: `Stack·column`, `Stack·row` and `Spacer` are three
  small cards side by side in the prototype (~158px tall each), while this page stacked them as
  two half-width cards plus one separate full-width card — and that full-width `Spacer` card was
  370px tall showing two solid boxes with a big blank gap between them, because the "scale" was
  demonstrated as literal invisible `<Spacer>` elements with no visual marker. The prototype
  instead shows five small coloured bars of increasing height (8/16/24/40/64px) — a real bar
  chart, immediately legible. Rebuilt to match: the three specimens now sit in one compact row,
  `Spacer` renders as a bar chart (plus a small live `<Spacer axis="horizontal">` demo below it
  so the actual component still appears, not just a decorative substitute), and `Reveal`'s two
  blocks now sit side by side in a compact card instead of stacked with a lot of empty space.
  Also: `Grid`'s two separate `<Grid>` instances merged into one (6 items at 6/3/3/4/4/4 spans
  wrap into 2 rows on a single 12-column grid automatically, matching the prototype's actual
  markup, not just its visual result).
  Alongside this, three small requested additions: the `Overview` sidebar group now sorts first
  in Storybook (`storySort` in `.storybook/preview.tsx`), so the bare dev-server root redirects
  straight to this page instead of an alphabetically-first component story; the `01 Forms`
  section gained an "Input types" specimen (`LabeledField` with `type="date"`/`"time"`/
  `"datetime-local"`, using its existing `type` passthrough — no component change needed) to
  show native date/time pickers alongside the existing text fields; and the `11 Media` section's
  partner ticker gained small coloured monogram badges (initials on a rotating set of the
  existing `--c-badge-*` token pairs) next to each name, since a plain text-only ticker read as
  bare — generic placeholder badges, not scraped or reproduced real partner logos (the live site
  has no partner-logos feature to source from; the names were always the prototype's own
  invented placeholders). Verified typecheck/test(523/523)/lint/build all green, plus a visual
  pass in Storybook for all of the above.
- **README: added a "Full showcase" section with `Overview / UI Kit` screenshots** — five images
  in `docs/` (`overview-hero.jpg`, `overview-buttons.jpg` + its dark-theme twin, `overview-cards.jpg`,
  `overview-dates.jpg`) captured directly from the live Storybook page, laid out the same
  way the existing booking-form light/dark preview pair already was (centered, paired side by
  side). Links to the live page on GitHub Pages.
- **`--c-error` WCAG AA contrast fix** — same systemic pattern as `--c-text-3` above: white text
  directly on a solid `--c-error` fill measured 3.37:1 in light theme (needs 4.5:1), found via
  `DayBadge`'s weekend variant but actually shared by three components (`DayBadge` weekend,
  `Fab`'s `danger` variant, `Tag`'s `error` variant all put `--c-bg`/`#fff` text straight on
  `--c-error`). Dark theme was already fine (6.77:1). Fixed by darkening the light-theme token:
  `--c-error` `#eb5757`→`#c34747` (4.71:1 on `--c-bg`), `--c-error-hover` `#c45e5e`→`#a83d3d`
  (5.98:1, kept darker-than-base to preserve the existing hover-darkens convention). `--c-error-
  soft` (used as a light tint behind `--c-error`-coloured *text* in `Alert`, not affected by this
  contrast issue — darkening only improves that pairing) left unchanged. Dark theme's `--c-error`/
  `--c-error-hover` also untouched, already compliant.
- **`FormDatePicker`: fixed a double focus outline** — clicking into the "Date of visit" field
  showed two stacked rings: the kit's own pill-shaped `box-shadow` ring on `.row:focus-within`
  (correct) plus the browser's default black rectangular outline on the inner `<button
  class="trigger">` (a bug — nothing suppressed it). `LabeledField`/`TextareaField` already pair
  `border: none` with `outline: none` on their own inner control; `FormDatePicker`'s trigger
  button was the one place that forgot the second half of that pair. Added `outline: none` to
  `.trigger` in `FormDatePicker.module.css`.
- **`Overview / UI Kit` page: fixed icon "jump" in the mobile tab bar demo, and swapped native
  date/time inputs for the kit's own pickers**. The `04 Tabs` section's "Icon tabs · mobile bar"
  specimen shifted its icons vertically on tap: the active label's `padding`/`font-weight` change
  altered the label's own box height, and since the button centers its icon+label column with
  `justifyContent: center`, that height change nudged the icon up or down by a couple of pixels.
  Fixed by keeping the label's padding constant across states (only its background/weight/colour
  change now, never its box size) and pinning an explicit `lineHeight`. Verified by comparing the
  icon's `getBoundingClientRect()` before/after activating a different tab — now bit-identical.
  Separately, the `02 Forms` section's "Input types" specimen originally used raw `<input
  type="date">`/`type="time"`/`type="datetime-local">`, which pop the browser's own unstyled
  native calendar/clock — inconsistent with the rest of the kit's always-branded pickers.
  Replaced with the real `FormDatePicker` (date) and `DateTimePicker` (date + time); dropped the
  standalone time-only field since no branded time-only component exists in the kit
  (`DateTimePicker` always pairs date with time by design — flagged as a possible future gap, not built as
  a workaround here).
- **`Checkbox`: fixed off-centre checkmark** — a real layout bug, not a visual tweak. `.box` used
  `display: flex; justify-content: center` to centre its glyph, but *both* the check and the
  indeterminate-dash `<svg>` are always in the DOM as flex-row siblings (only one is
  `opacity: 0`-hidden at a time — hiding via opacity doesn't remove an element from flex layout).
  With `justify-content: center`, the browser centres the *pair* of them together as one row
  (16px check + 12px dash, no gap), not each individually — so the visible glyph rendered
  off-centre, hugging the left edge with the invisible other one's width pushing it that way
  (measured: 1px gap on the left, 10px+ on the right, in a 24px box). Switched `.box` to `display:
  grid; place-items: center` and gave `.check`/`.dash` `grid-area: 1 / 1`, so they stack in the
  same cell and each centres independently regardless of the other's presence — verified
  numerically (`getBoundingClientRect()` on box vs glyph) at exactly 4px on all four sides now,
  across every checkbox on the `Overview / UI Kit` page, plus visually on the `Indeterminate`
  story. This is the same root-cause *category* as the very first fix in this session's original
  ask (checkbox tick reading "bottom-right-heavy") — that one was a bad SVG path; this one is a
  layout bug in how the box centres its (two, one hidden) children.
- **`--c-text-3` WCAG AA contrast fix** — the muted/caption/hint colour used across most of the
  ~80 components measured 3.81:1 against white in light theme (light `#808385`) and 4.22:1 in
  dark theme against `--c-surface` (dark `#7a8498`), both below the 4.5:1 AA threshold for normal
  text; flagged as a design-owner decision when it surfaced while building the `Overview / UI
  Kit` page (see above). Resolved by darkening the token rather than restricting its use to
  large/bold text: the restriction path would require auditing font-size/weight at every one of
  the ~80 usage sites individually, while a token swap fixes every usage in one shot with a
  minor, same-hue visual delta. New values: light `#6f7274` (4.84:1 on white, 4.69:1 on
  `--c-bg`), dark `#8590a5` (4.93:1 on `--c-surface`, 6.00:1 on `--c-bg`) — both computed via the
  WCAG relative-luminance formula, not eyeballed. A+A theme's `--c-text-3` (`#333333`, 12.63:1)
  was already well clear of AA and untouched. Closes task #11.
- **`Overview / UI Kit` page: full content/structure rebuild across all 20 sections**, prompted
  by the user pointing at a fresher export of the same design-handoff zip and reporting
  differences "from 01 — Buttons to 20 — Poster." The prior pass (above) had only fixed the
  hero/nav/index chrome and each section's *heading/description* copy — the section *bodies*
  were still built from `README.md`'s prose spec, which describes typography/layout rules but
  not the prototype's literal per-section content. Comparing the real `UI Kit.dc.html` DOM
  directly (structural outlines + innerText, not just visual screenshots) showed every section
  demonstrates specific, realistic lancoworking-branded content — named pricing plans, real
  guest names in a table, specific event copy — not generic one-of-each-variant placeholders.
  Rebuilt accordingly:
  - **01 Buttons**: four labelled group cards (Primary/Secondary/Quiet/Danger, each with its own
    sub-note and 3 sizes + disabled) replacing the single mixed row; added icon-button row (4
    icons), loading-state demo, a simulated `:focus-visible` outline demo, and a card for
    `GhostButton`/`SubmitButton` (real shipped components with no prototype equivalent).
  - **02 Forms**: real field copy/order (Name+caption, Email+error, Comment; Plan select,
    duration `RadioGroup`, 3 `Checkbox`es, a `Switch`) matching the prototype's DOM order exactly.
  - **03 Accordion**: 4 real FAQ items (was 3 generic ones) plus the prototype's "Rule" callout —
    new shared `RuleNote` component for this recurring editorial-aside pattern (reused in 08).
  - **04 Tabs**: added the "icon tabs · mobile bar" sub-demo (Home/Coworking/Events/Blog/More,
    64px targets, active-pill styling) that didn't exist before; pill/underline tab labels and
    body copy corrected to match (Desks/Meeting rooms/Café).
  - **05 Cards**: 3 real pricing-plan cards (One-off/Pass/Dedicated desk, with price, feature
    checklist, CTA) and 2 event cards, replacing one generic pricing card + one `ActionCard`;
    moved a `Skeleton` demo here from Data (matches the prototype's actual section ownership).
  - **06 Data**: added the `DropdownMenu` demo back (was dropped), a real 4-row booking table
    (Guest/Plan/Date/Status columns, no `Table` component exists so composed with plain
    `<table>`+tokens, consistent with how Poster composed its own pieces), and dismissible
    filter tags via a new `RemovableTag` helper — closes the long-flagged "dismissible filter
    tag" gap from section 06's original build.
  - **07 Calendar and alerts**: added a Selected/Today/Closed legend and disabled Sundays on the
    `DateTimePicker` (`disableDate`) to match "unavailable days read as such before you click";
    expanded 2 alerts to the prototype's real 4 (success/warning/info/error).
  - **08 Header and navigation**: added the prototype's second "scrolled state" preview
    (Navbar can't be forced into that state via props, so this is a static visual mock beside
    the live one) and its "Rule" callout; nav links and CTA copy corrected to the real brand
    ("LAN" / "Book a desk").
  - **10 Site blocks**: rebuilt from 2 unrelated pieces (a `DayBadge`+text row, one `ActionCard`)
    to the prototype's real 4-card set — discount plan (badge, struck-through price, feature
    list), event card, `ActionCard` (still correct for the service-card slot), and a blog/post
    card.
  - **11 Media**: added the "how to find us" map block and an auto-scrolling, hover-pauses
    partner-name ticker (both composed from plain elements + a scoped `@keyframes` — no dedicated
    components exist for either, same class of gap as Poster's own pieces).
  - **12 Utility elements**: added a language switch (new `LanguageSwitch` helper, RU/EN/HY —
    composable from existing primitives per the standing note that no dedicated component
    exists) and expanded the 2-column footer to the real 4-column one (The venue/Services/
    Partnering/Contacts) with social links and a back-to-top `Fab` demo with its caption.
  - **13 Feedback**: expanded to the prototype's fuller set — 3 `Progress` sizes with working
    ±10% controls, `EmptyState` with a real action button, all-4-sides `Tooltip` demo, and a
    dedicated `Popover` demo (was folded into the tooltip row). **Found and fixed a real bug
    while building this**: `Loader` renders `position: absolute` unconditionally (fills its
    nearest positioned ancestor) — the original single-loader specimen happened to work by
    accident, but a 3-loader row rendered all three completely invisible with no console error,
    since none had a `position: relative` wrapper. Fixed by wrapping each in a sized, positioned
    box, matching the pattern `Loader.stories.tsx` already used — a real trap for anyone reusing
    this component without a positioned parent, not specific to this page.
  - **14 Picking and bookings**: added a dual-handle budget `Slider` alongside duration, a second
    labelled `GuestsCounter` ("Meeting rooms"), an avatar-overlap "+7" group (composed manually —
    no stacked-avatar-group component exists, previously-flagged gap), all 3 `DayBadge` variants
    side by side (default/compact/weekend — was only default), a real `FormCard` demo (was a
    placeholder paragraph), and the duration-chip `HorizontalScroller` with real prices.
  - **15 Text and dividers**: replaced the small ad-hoc specimen with the prototype's full type
    scale table (12 rows: display/h1–h4/section-heading/lead/body/body-sm/label/caption/overline,
    each with a real specimen and its size·weight·leading spec), a PT Sans weights demo, and all
    4 real link kinds (default/muted/brand/no-underline) — `SectionHeading` kept as its own demo
    so the "what's in the kit" index claim stays true.
  - **16 Dates**: added "date and time in one control" (reusing `DateTimePicker`'s own collapsed-
    pill trigger) and a "date in a mobile sheet" demo (`MobileDatePicker`, previously entirely
    unused on this page) alongside the existing day strip and form date picker.
  - **17 Search and switches**: `Combobox` demo recast as the prototype's actual "Room" field
    (was a generic city picker) with its real caption; `SegmentedBar` items and copy corrected
    to match (date/time-range/guest-count parts with the real caption line).
  - **18 Layout**: added a `Container` demo (was entirely missing — the component whose own
    max-width change is task #10), a second `Grid` row (span 4/4/4, was only 6/3/3), explicit
    row+column `Stack` demos side by side (was implicit via the page's own layout), a `Spacer`
    scale demo (4→64, all valid `SpaceValue`s), and a "Replay" button that remounts the `Reveal`
    demo via a `key` bump (`Reveal` has no imperative replay API).
  - Sections 09 (Overlays) and 19–20 (Assembly example/Poster) needed only small copy fixes
    ("Open the modal"/"Open the drawer"/"Show a toast" to match exactly) — their structure
    already matched the prototype from the original build.
  All of the above were extracted from the live prototype DOM (structural outlines + literal
  text, not re-typed from memory) to avoid re-introducing invented copy. Verified visually
  section-by-section in Storybook against the prototype (catching the `Loader` bug above) in
  addition to typecheck/test(523/523)/lint/build all green throughout.
- **`Container`'s 1200px max-width verified against `lancoworking.am`** (closes task #10).
  Inspected the live site's actual DOM — it doesn't consume the `brightframe` package yet (no
  matching bundle; every class is a hand-rolled CSS module), so this was a forward-looking check,
  not a live-breakage fix. Standard content sections (pricing tariffs, events, education) already
  render at exactly `max-width:1200px; padding-left:24px`, an exact match confirming the number
  came from the site's real convention rather than being invented. The Hero and Footer, however,
  use a different, wider convention (`max-width:1440px; padding-left:120px`) that `Container`
  (a single fixed size, no variants, no responsive breakpoints) doesn't support — flagged as a
  scope note for whenever Hero/Footer page-section components get built, not a defect in what
  shipped.
- **Storybook now opens `Overview / UI Kit` by default** — added a `storySort` order
  (`.storybook/preview.tsx`) putting the "Overview" title group first, so visiting the bare dev
  server root (no `?path=`) lands on the full showcase page instead of an alphabetically-first
  component story.
- **Addons panel starts closed on the `Overview / UI Kit` page** — new `.storybook/manager.ts`
  sets `layoutCustomisations.showPanel` to return `false` when `state.storyId ===
  "overview-ui-kit--default"`, falling back to Storybook's normal default everywhere else. The
  Overview page (which opens by default per the entry above) is meant to be viewed as a full
  page — the Controls/Actions/Accessibility dock at the bottom just ate canvas height for a page
  that doesn't use Controls at all. Note the top-level `showPanel: boolean` shorthand some older
  Storybook docs describe doesn't exist in this version (10.3.6); the real API nests it under
  `layoutCustomisations` as a `(state, defaultValue) => boolean` callback, which is what makes
  per-story scoping possible here. Required restarting the dev server — manager config, unlike
  `preview.tsx`, isn't picked up by Vite's HMR.
- react-hook-form and Formik integration: `RHFTextField`, `RHFTextareaField`,
  `RHFSelectField`, `RHFCheckbox`, `RHFRadioGroup`, `RHFSwitch`, `RHFCombobox` and their
  Formik counterparts (`FormikTextField`, `FormikTextareaField`, `FormikSelectField`,
  `FormikCheckbox`, `FormikRadioGroup`, `FormikSwitch`, `FormikCombobox`) — drop-in
  wrappers around the existing controlled field components that wire `value`/`onChange`/
  `onBlur`/`error` to a react-hook-form `useController`/`FormProvider` field or a Formik
  `useField`, so validation errors from either library render through each field's
  existing error UI. `react-hook-form` and `formik` are optional peer dependencies —
  only pulled in if you import one of these components (each has its own build entry,
  e.g. `brightframe/RHFTextField`).
- ESLint (flat config), scoped to `react-hooks/rules-of-hooks`, `react-hooks/exhaustive-deps`,
  and `eslint-plugin-jsx-a11y`'s recommended rules — the classic hook-correctness and
  accessibility checks, not `react-hooks`' newer React Compiler-oriented rule set
  (purity/immutability/gating/...), which doesn't apply here. Run via `npm run lint`.
- `--radius-*` and `--duration-*` design tokens in `tokens.css`, on the same
  "suffix = literal value" convention as `--space-*` — centralizes the radii and
  transition/animation durations already in use across components.
- `@storybook/addon-a11y`, wired into `.storybook/main.ts` — surfaces automated
  accessibility violations per story.
- `jest-axe`-based accessibility assertions (`toHaveNoViolations`) for `Modal`,
  `Drawer`, `Tabs`, `DropdownMenu`, `RadioGroup`, `Combobox`, and `SelectField`.
- `--font-size-*`, `--font-weight-*`, and `--line-height-*` design tokens in
  `tokens.css`, on the same "suffix = literal value" convention as `--space-*`/
  `--radius-*`/`--duration-*` — centralizes the type sizes, weights, and line
  heights already in use across components. Percentage line heights (`120%`,
  `140%`, `150%`) are exposed as `--line-height-120`/`140`/`150`, holding the
  unitless equivalent (`1.2`/`1.4`/`1.5`) per CSS best practice.
- `--z-*` design tokens in `tokens.css` (`--z-10` through `--z-400`), covering the
  global overlay stack: tooltips/bubbles below menus/popovers below loading
  overlays below listbox/sheet overlays below modal/drawer below toast, gapped
  to leave room for new layers between tiers.
- `jest-axe`-based accessibility assertions extended to the remaining 51
  components (previously only `Modal`, `Drawer`, `Tabs`, `DropdownMenu`,
  `RadioGroup`, `Combobox`, and `SelectField` had them) — every component in the
  kit now asserts `toHaveNoViolations()` in its default (and, where meaningful,
  open/expanded) state.
- `Progress` gained a `label` prop (default `"Progress"`), used as the
  `aria-label` on its `role="progressbar"` element.
- `--border-width-*` design tokens in `tokens.css`, on the same "suffix =
  literal value" convention as `--space-*`/`--radius-*` (decimal point dropped,
  e.g. `--border-width-15` is 1.5px) — centralizes the stroke widths already in
  use across borders and focus-ring box-shadows.
- `--opacity-*` design tokens in `tokens.css`, same convention, covering the
  non-binary opacity values already in use for muted text, disabled states and
  dimming overlays. Plain `0`/`1` (fade-animation endpoints, fully-hidden/
  fully-shown toggles) are left as literal numbers, same call as the
  in-component `z-index` values.
- `--c-shadow-lg`/`xl`/`2xl`/`3xl` extending the existing `sm`/`md`/`card`
  elevation tiers, and `--c-shadow-glow-accent`/`brand`/`info` (plus `-sm`
  variants) for the colored hover shadows on filled buttons — centralizes the
  box-shadow values already in use.
- `--letter-spacing-*` design tokens in `tokens.css`, same value-based
  convention (negative `em` values get an `n` prefix instead of a `-`; the two
  stray `px`-based values keep a `px` suffix to disambiguate from the `em`
  scale) — centralizes the letter-spacing values already in use.

### Fixed

- `Progress`'s `role="progressbar"` had no accessible name by default (axe:
  `aria-progressbar-name`) — fixed via the new `label` prop above.
- `MobileDatePicker`'s bottom sheet (and `FormDatePicker`, which renders it) had
  no `role="dialog"` or accessible name on its portaled content (axe: `region`,
  content not contained by a landmark) — it's now `role="dialog"` with
  `aria-modal="true"` and an `aria-label` from the current step's hint text.
- `Popover`'s panel had `role="dialog"` but no accessible name (axe:
  `aria-dialog-name`) — the panel now gets `aria-labelledby` pointing at the
  trigger button.

  All three found while extending accessibility test coverage above.
- `DateTimePicker`'s date/time tab switcher nested two clickable `<span>`s
  inside its trigger `<button>` — invalid HTML, and the "time" tab was
  completely unreachable by keyboard (only the outer button was focusable, so
  keyboard users could never select it). The trigger is now a plain `<div>`
  wrapping two real `<button>`s, one per tab; the group also gained an Escape
  key handler to close the popover, since switching from a single toggling
  button to two non-toggling ones dropped that path.
- `FormDatePicker`'s trigger `<button>` had `aria-invalid` set, which isn't a
  valid ARIA property on the `button` role (jsx-a11y:
  `role-supports-aria-props`) — removed; the existing `aria-describedby`
  pointing at the error message already conveys the error to assistive tech.
- Found via the new ESLint setup above.

### Removed

- `package-lock.json` — the project installs via `bun.lock` (see CI), so the
  npm lockfile was stray, drift-prone cruft; now gitignored.

### Changed

- All components' hardcoded `border-radius` and transition/animation `Nms` durations
  replaced with the new `--radius-*`/`--duration-*` tokens — no visual change, but both
  are now themeable/overridable like color, typography, and spacing already were.
- All components' hardcoded `font-size`, `font-weight`, and `line-height` values
  replaced with the new typography tokens — no visual change. `Title`/`SubTitle`'s
  three `rem`-based font sizes were also normalized to the kit's existing px
  convention (`2.5rem`/`2rem`/`1.5rem` → `--font-size-40`/`32`/`24`, equal at the
  default 16px root).
- Components' `z-index` values that belong to the shared overlay stack (`10`, `50`,
  `100`, `200`, `300`, `400`) replaced with the new `--z-*` tokens — no visual
  change. Small `z-index` values used only to order elements within one
  component's own stacking context (a carousel slide above its siblings, a badge
  above its card, a slider thumb above its track, ...) are left as plain numbers,
  since they aren't part of this global scale.
- All components' hardcoded `border` widths (including the `1.5px` focus-ring
  thickness baked into several `box-shadow: 0 0 0 1.5px …` declarations),
  non-binary `opacity` values, and `box-shadow` values replaced with the new
  `--border-width-*`/`--opacity-*`/`--c-shadow-*` tokens — no visual change.
  `FormCard`'s shadow was identical to the existing `--c-shadow-card` and now
  reuses it directly instead of getting a new token.
- All components' hardcoded `letter-spacing` values replaced with the new
  `--letter-spacing-*` tokens — no visual change. Every literal in use across
  `src/components/**/*.module.css` is now a design token; color was already
  fully tokenized (including per-theme overrides).

## [0.3.6] - 2026-08-19

### Added

- `Stack` and `Spacer` layout primitives — `Stack` for flex row/column layouts with a
  responsive, token-based `gap`; `Spacer` for one-off gaps (including `size="auto"` to
  push siblings apart) that a `Stack`'s uniform gap can't express.
- `--space-*` spacing tokens (`--space-0` through `--space-64`) in `tokens.css`, on the
  same 4px grid `Stack`/`Spacer` consume.
- `css-types` script (via `typed-css-modules`) generating typed declarations for
  `*.module.css` files, run automatically before `dev`, `build`, and `typecheck`.
- `@storybook/addon-docs`, wired into `.storybook/main.ts` — the `tags: ["autodocs"]`
  already present on every story was a no-op without it, so no component had a Docs
  tab or source panel at all.
- A "how to use this in code" snippet (import statement + minimal JSX) on every
  component's Storybook Docs page, via `parameters.docs.description.component`.

### Changed

- All components' hardcoded pixel spacing (padding/margin/gap) replaced with the new
  `--space-*` tokens — no visual change, but spacing now themeable/overridable like
  color and typography already were.

## [0.3.5] - 2026-08-19

### Added

- 17 new components: `Alert`, `Avatar`, `Breadcrumb`, `Checkbox`, `Combobox`, `Divider`,
  `Drawer`, `DropdownMenu`, `Pagination`, `Popover`, `Progress`, `RadioGroup`, `Skeleton`,
  `Slider`, `Switch`, `Toast`, `Tooltip`.
- CI workflow, issue templates (bug report, feature request), pull request template, and
  `CONTRIBUTING.md`.

## [0.3.4] - 2026-08-18

### Added

- `Tabs`, `Modal`, `Accordion` components.

## [0.3.3] - 2026-08-18

### Added

- Per-component entry points (`brightframe/<Name>` + `brightframe/<Name>.css`) so
  consumers can import a single component without pulling in the full kit stylesheet.

### Changed

- Vite build now emits one bundle per component (`cssCodeSplit: true`) instead of a
  single combined stylesheet.

## [0.3.2] - 2026-08-14

### Added

- `Grid` component, plus `ActionCard`, `Badge`, `Carousel`, `EmptyState`, `Fab`,
  `Footer`, `HorizontalScroller`, `Navbar`.

## [0.3.1] - 2026-08-13

### Added

- Optional `brightframe/fonts.css` module loading PT Sans from Google Fonts.
- "Foundations / Fonts" Storybook story documenting font usage.

### Changed

- Unified all components on a single `--font-sans` design token; previously three
  inconsistent font stacks (PT Sans, Rubik, Montserrat) were hardcoded with no way to
  actually load any of them.

## [0.3.0] - 2026-08-12

### Added

- 12 new components: `CalendarSlider`, `DateTimePicker`, `FormCard`, `FormDatePicker`,
  `GuestsCounter`, `LabeledField`, `MobileDatePicker`, `SegmentedBar`, `SelectField`,
  `SubmitButton`, `TextareaField`, `TimeRangePicker`.

### Changed

- Full native-attribute passthrough (`style`, `id`, `data-*`, `aria-*`, event handlers)
  extended to `GhostButton`, `InfoTooltip`, `SectionHeading`, `DayBadge`, `Reveal`,
  `InfoCards`, `Loader`, `Burger`, `Link`.
- New variants/sizes added: `GhostButton` size, `InfoTooltip` position, `Burger`
  size/color, `Link` variant/underline, `Loader` size, `DayBadge` size, `Reveal`
  direction/threshold, `SubmitButton` variant/fullWidth.
- Polymorphic `as` prop added to `Title`, `SubTitle`, `SectionHeading`, `Container`.
- Livelier, more representative Storybook stories across primitives.

## [0.2.0] - 2026-08-12

### Added

- Initial batch of form/layout components (see commit `13bd8ee`).

## [0.1.1] - 2026-08-12

### Changed

- Package renamed from `haloui` to `brightframe` — npm rejected the unscoped name
  `haloui` as too similar to the existing package `halo-ui`. Dist filenames, imports,
  docs, and the default `ThemeProvider` storage key were updated; the GitHub repo and
  source directory kept the `haloui` name.
- Repo URL references updated after the GitHub repo itself was renamed to `brightframe`.
- `package.json` description/keywords expanded and `homepage`/`bugs` URLs added for
  npm/GitHub discoverability.
- README's LAN link pointed at `lancoworking.am`.

## [0.1.0] - 2026-08-12

### Added

- Initial release: React UI primitives (`Btn`, `Card`, `Tag`, `InfoTooltip`,
  `GhostButton`, `Eyebrow`, `SectionHeading`, `DayBadge`, `Reveal`, `InfoCards`,
  `Loader`, `Burger`, `Link`, `Title`, `SubTitle`, `Container`) plus a
  `ThemeProvider`/`useTheme` for light/dark/system theming and an accessible
  high-contrast mode, extracted from the LAN coworking site as a standalone,
  framework-agnostic package.
- Design tokens, full test coverage, Storybook, examples, and docs (README,
  EXAMPLES.md, PUBLISHING.md).

[Unreleased]: https://github.com/mkokoulin/brightframe/compare/v0.3.6...HEAD
[0.3.6]: https://github.com/mkokoulin/brightframe/compare/v0.3.5...v0.3.6
[0.3.5]: https://github.com/mkokoulin/brightframe/compare/v0.3.4...v0.3.5
[0.3.4]: https://github.com/mkokoulin/brightframe/compare/v0.3.3...v0.3.4
[0.3.3]: https://github.com/mkokoulin/brightframe/compare/v0.3.2...v0.3.3
[0.3.2]: https://github.com/mkokoulin/brightframe/compare/v0.3.1...v0.3.2
[0.3.1]: https://github.com/mkokoulin/brightframe/compare/v0.3.0...v0.3.1
[0.3.0]: https://github.com/mkokoulin/brightframe/compare/v0.2.0...v0.3.0
[0.2.0]: https://github.com/mkokoulin/brightframe/compare/v0.1.1...v0.2.0
[0.1.1]: https://github.com/mkokoulin/brightframe/compare/v0.1.0...v0.1.1
[0.1.0]: https://github.com/mkokoulin/brightframe/releases/tag/v0.1.0
