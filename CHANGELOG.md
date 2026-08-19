# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

This log was reconstructed retroactively from git history starting 2026-08-19; entries
before that date are dated by commit, not by release announcement.

## [Unreleased]

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
