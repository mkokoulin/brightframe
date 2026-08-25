# Visual regression testing

Every component gets one committed screenshot baseline per theme (light/dark), asserted in CI on
every push and PR — no manual clicking through 73+ Storybook stories to eyeball whether anything
shifted.

## How it works

`src/test-utils/visual.stories.test.tsx` runs as its own Vitest project (`"visual"` in
`vitest.config.ts`, same Chromium/Playwright browser mode as the `"storybook"` a11y project — see
`docs/a11y-audit.md`). It:

1. Globs every `src/components/*/*.stories.tsx` file.
2. Composes its stories via `composeStories` and picks one representative story per component —
   the first export matching `/^Default/i`, falling back to the first exported story. This is a
   deterministic rule (no per-component judgment call), which keeps the baseline count bounded as
   new story *variants* are added — only a genuinely new *component* adds new baselines.
3. Renders it once with `data-theme` unset (light) and once with `data-theme="dark"`, matching
   `.storybook/preview.tsx`'s own theme decorator.
4. Asserts `expect.element(container).toMatchScreenshot(name)` (`src/test-utils/visual.ts`), using
   Vitest 4's native browser-mode screenshot matcher — `pixelmatch`, `allowedMismatchedPixelRatio:
   0.01` as a starting threshold (tune after real CI runs show their actual cross-machine noise,
   not before).

Baselines are committed PNGs under `src/test-utils/__screenshots__/visual.stories.test.tsx/`
(Vitest's own naming convention, platform-scoped) — no git-lfs. If the repo's size becomes a real
problem as more baselines accumulate, that's a later problem to solve, not one to preempt now.

Run locally: `bun run test:visual` (needs Chromium — `bunx playwright install chromium` once).

## Updating a baseline on purpose

After a deliberate visual change:

```bash
bun run test:visual:update
```

Then review what actually changed before committing:

```bash
git diff --stat -- src/test-utils/__screenshots__/
```

Only the PNGs for the component(s) you touched should show up. If something unrelated changed
too, that's a real regression worth investigating before committing, not routing around.

## Baselines are platform-scoped

Vitest's `toMatchScreenshot` suffixes each baseline filename with browser + OS (e.g.
`Badge-light-chromium-win32.png`) because font rendering/antialiasing differs enough across
platforms to produce false positives otherwise. That means baselines generated on a dev machine
only satisfy CI if committed *from a matching platform* — a `-win32` baseline is invisible to the
`ci.yml` `test` job, which runs on `ubuntu-latest` and looks for `-linux`.

If CI is failing every visual test with "No existing reference screenshot found" (or a fresh
component/platform has no baseline yet), run the **Update visual baselines** workflow
(`.github/workflows/update-visual-baselines.yml`, manually triggered) — it runs
`bun run test:visual:update` on `ubuntu-latest` and opens a PR with the generated PNGs. Review the
diff before merging, same as updating a baseline locally.

## Two components are excluded

`Loader` and `MobileDatePicker` are skipped (see the `EXCLUDED_COMPONENTS` set in
`visual.stories.test.tsx`) — both render their primary visual content via `position: absolute`/
`position: fixed` with no normal-flow, positioned ancestor in this harness (`Loader` has no idle
state, always spinning; `MobileDatePicker`'s demo opens its sheet, whose backdrop is
`position: fixed`, i.e. viewport-relative). Unlike Storybook's own preview, which renders every
story inside a real page layout, this harness mounts each composed story into a bare, unstyled
`render()` container — so a fixed/absolute-positioned tree contributes nothing to that container's
own layout box, and `toMatchScreenshot()` times out waiting for a frame that never stabilizes
instead of ever completing. This is a real limitation of the harness, not a bug in either
component — if it's worth solving properly later (e.g. screenshotting `document.body` for these
two instead of the render container), that's a targeted follow-up, not a blocker for the other 71
components.

## Frozen animations

`visual.stories.test.tsx` injects a global stylesheet before every test
(`animation: none !important; transition: none !important`) — without it, any component with a
continuous or in-progress CSS animation never reaches a stable frame for the screenshot matcher to
compare against, and the assertion times out rather than fails. This has to be injected per-test
(in a `beforeEach`, not once in the project's `setupFiles`) because Vitest's browser mode gives
each test its own document.

## CI

On any failure, the whole `src/test-utils/__screenshots__/` directory (actual + reference + diff
images Vitest writes alongside the real baselines) is uploaded as a GitHub Actions artifact
(`visual-regression-diffs`, 14-day retention) — download it from the failed run to see exactly
what changed before deciding whether to fix the code or update the baseline.
