# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

This log was reconstructed retroactively from git history starting 2026-08-19; entries
before that date are dated by commit, not by release announcement.

## [Unreleased]

### Added

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
