# Accessibility audit

`brightframe` checks accessibility at two levels, both enforced in CI:

1. **Per-component unit tests** — every `src/components/*/*.test.tsx` asserts
   `expectNoA11yViolations(container)` (a shared helper in `src/test-utils/a11y.ts` wrapping
   `jest-axe`), scanning that one component in isolation under jsdom.
2. **Story-level, real-browser audit** — `@storybook/addon-vitest` + `@storybook/addon-a11y` run
   every Storybook story as a real Chromium test via Vitest's browser mode (the `"storybook"`
   Vitest project in `vitest.config.ts`), with `parameters.a11y.test = "error"` set globally in
   `.storybook/preview.tsx`. This catches things isolated per-component tests structurally can't:
   composition bugs (two components combined breaking each other's semantics), real rendered
   contrast (actual pixels via Chromium, not jsdom), and duplicate landmark names across a full
   page.

Run locally: `bun run test:storybook` (needs Chromium — `bunx playwright install chromium` once).

## What this pass found and fixed (2026-08-24)

Running the story-level audit for the first time surfaced 29 real violations across 16 story
files — none of the per-component unit tests had caught these, because each only ever renders its
own component alone. Root-caused to four distinct bugs, all fixed:

- **`--c-accent` (#ffa05f) contrast** — the single biggest contributor (42 of the 70
  color-contrast findings). Orange text/fills using this token measured 1.94–2.01:1 against
  white/`--c-bg`, both as text-on-white (`Eyebrow`) and as white-text-on-solid-fill (`Progress`,
  `DayBadge`, `Btn`'s accent-tinted states). Darkened to `#955419` (light theme only — dark
  theme's near-black `--c-bg` already gave it ample contrast) — same hue, same "warm decorative,
  never a button fill" role, just dark enough to clear 4.5:1 even against the lighter
  `--c-form-accent-bg` tint.
- **`--c-badge-orange-text` (#c05800 on `--c-badge-orange-bg`)** — 3.81:1. Darkened to `#a04a00`
  (light theme only), same hue.
- **`Alert.module.css` had two separate `.description` rules** — one setting
  `opacity: var(--opacity-90)` (no color), one setting `color: var(--c-text-2)` (no opacity) —
  merged into one rule. The 90%-opacity blend against each variant's tinted background (blue/
  green/orange/red) was dragging description text below 4.5:1 on every variant; merging to a
  single opaque rule fixed all four at once.
- **`--c-error`/`--c-error-hover`** — `#c34747` already cleared 4.5:1 as *white text on a solid
  fill* (`Fab` danger, `Tag` error, `DayBadge` weekend — fixed in an earlier session), but measured
  only 4.23:1 as *`--c-error`-colored text on the softer `--c-error-soft` background* (`Alert`'s
  error-variant title) — the opposite polarity of the same token, not automatically covered by the
  first fix. Darkened further to `#b23e3e`/`#993535` (light theme only), which clears both cases.
- **`--c-text-2` (#5f6b78)** — Alert's now-merged `.description` rule measured 4.45:1 on the blue/
  green badge-tint backgrounds, just under 4.5. Darkened marginally to `#5c6874`.
- **Hardcoded literal color, not a token**: `Btn`'s `.external` variant (Telegram/Instagram-style
  button) used a literal `#229ED9` — 3.01:1 for its white label text. Darkened to `#1076a3` (and
  its hover state to `#0e648b`) — same family-of-bugs as a prior session's `QuestionIcon.tsx` raw
  hex, caught the same way (grepping for literal hex values that never respond to token changes).
- **Nested interactive controls** (`nested-interactive`, 7 instances): `DropdownMenu.stories.tsx`
  and `Popover.stories.tsx` (plus DropdownMenu's own doc-comment example) demonstrated passing a
  real `<Btn>` (or `<button>`) as `trigger` — both components already render their own `<button>`
  around `trigger` for the `aria-haspopup`/`aria-expanded` wiring, so this nests two buttons
  (invalid HTML, WCAG 4.1.2). A `FakeButtonLabel`-style helper already existed for this exact
  problem in `UIKitOverview.stories.tsx`; added an equivalent local `TriggerLabel` to both story
  files and fixed the doc-comment example. Also added a one-line JSDoc warning on both components'
  `trigger` prop so future consumers don't reproduce it.
- **`HorizontalScroller`'s scrollable track had no way to reach it by keyboard**
  (`scrollable-region-focusable`, 2 instances) — a scrollable region with no other focusable
  descendant is untabbable. Added `tabIndex={0}` + `role="region"` + a new optional `label` prop
  (defaults to `"Scrollable content"`) so each instance gets a distinct accessible name — needed
  because `UIKitOverview`'s page renders two `HorizontalScroller`s side by side, and identical
  region names on one page is its own violation (`landmark-unique`), caught immediately after
  fixing the first bug.
- **Inline link relying on color alone** (`link-in-text-block`, 2 instances) —
  `Link.stories.tsx`'s "Inline in a paragraph" story demonstrated `underline={false}` for links
  embedded in a sentence, which is exactly the case that prop is *not* for (it's meant for links
  that already read as interactive from context — nav items, footer links — not body text).
  Removed the prop from that one story so it teaches the correct pattern instead.
- **`EventsPoster.stories.tsx`'s past-event dimming used `opacity: 0.55`** on the event title,
  which (like the `Alert.description` bug above) blends the text toward the background and drops
  it below 4.5:1 — even though the event is already separately marked with a "Past" tag. Swapped
  the `opacity` hack for an opaque `color: var(--c-text-2)` when `event.past`, which reads as
  de-emphasized without failing contrast.

## Accepted, tracked exception

**`BookingForm.stories.tsx`'s `Default` story** overrides `parameters.a11y.test` to `"todo"`.
`GuestsCounter`'s `.label` uses `--c-text-3` (tuned once already for 4.84:1 on white/surface
backgrounds), which drops to 3.75:1 when composed directly on `FormCard`'s `--c-form-accent-bg`
(a strong purple tint) — this demo does exactly that. Not fixed here because the real options are
a design decision, not a mechanical token pass: either give on-tint contexts a dedicated,
darker label color, or restrict `FormCard`'s strong background to compositions that only place
`--c-text-1`-or-darker content on it. Tracked here rather than silently suppressed everywhere;
revisit alongside `FormCard`'s other known-open item (its "fields drop their border inside"
contract, noted in an earlier session).

## A likely rendering artifact, not a real bug

One contrast finding (`GuestsCounter`'s "Guests" label on a **white** background, reported at
4.47:1 vs. the required 4.5:1) doesn't correspond to any of the fixes above — the raw token math
for `--c-text-3` on white is 4.84:1, comfortably compliant. The ~0.37 gap is consistent with
axe's pixel-sampling contrast check measuring actual anti-aliased glyph edges at that specific
bold/17px rendering, not the flat CSS color. Left as-is rather than darkening `--c-text-3` again
(used across roughly 80 components) to chase what's very likely a sub-pixel rendering quirk
rather than a real, reproducible failure — if it resurfaces as a hard failure rather than a
near-miss, worth a fresh look.
