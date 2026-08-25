# migrate-legacy-kit

A generic, config-driven codemod for migrating a legacy, inline component library toward
`brightframe` — built and validated against brightframe's own real extraction history (see the
main README's "Origin" section), but the transform engine itself doesn't know anything about
brightframe specifically. The rename map lives entirely in a config file you supply.

This is a **repo-local dev tool**, run via `bun`, not published as part of the `brightframe` npm
package or its own CLI.

## Usage

```bash
bun codemods/migrate-legacy-kit/cli.ts <targetDir> --config <configPath> [--write] [--report <path>]
```

- **Dry-run by default.** Without `--write`, nothing is ever written to disk — you get a report of
  what the tool *would* change.
- `--write` applies only `safe-rename` rules. `manual-review` rules are **never** auto-rewritten,
  regardless of flags — that's a deliberate, tested safety property (see
  `migrate-legacy-kit.test.ts`), not a missing feature.
- `--report <path>` writes the report to a file instead of stdout.

Example, using the included worked example config:

```bash
bun codemods/migrate-legacy-kit/cli.ts ../lan-site/src/components \
  --config codemods/migrate-legacy-kit/configs/lan-site.example.ts \
  --report codemods/migrate-legacy-kit/reports/lan-site-dry-run.md
```

## Writing your own config

A `MigrationConfig` (see `types.ts`) is just a package name and a list of rules:

```ts
import type { MigrationConfig } from "./types";

const config: MigrationConfig = {
  packageName: "brightframe", // defaults to "brightframe" if omitted
  rules: [
    // 1:1, no behavior change — safe to auto-rewrite.
    { legacyName: "Title", brightframeName: "Title", kind: "safe-rename" },

    // Not 1:1 — flagged, never auto-rewritten. `note` explains the gap in the report.
    { legacyName: "Button", brightframeName: "Btn", kind: "manual-review", note: "..." },
  ],
};

export default config;
```

`configs/lan-site.example.ts` is exactly this shape, grounded in brightframe's own real extraction
— copy it as a starting point for a different legacy kit.

## What it actually detects and does

For each `.ts`/`.tsx` file under `<targetDir>`:

1. **`safe-rename` rule matched** (a relative default import whose local name equals `legacyName`):
   rewrites the import to a named `brightframeName` import from `packageName`, and renames every
   reference to the old local name in that file (JSX tags included) to match — applied only with
   `--write`.
2. **`manual-review` rule matched**: reported with its `note`, never rewritten.
3. **Any plain (non-`.module.css`) CSS import**, regardless of rules: reported as a separate
   finding — CSS-Modules conversion isn't automated by this tool.

What it deliberately does **not** attempt: renaming components the config doesn't mention (no
guessed mappings — e.g. this tool won't invent a `Dialog` → `Modal` rule just because the names
seem related), or rewriting anything cross-file (each file is transformed independently).

## Testing

`migrate-legacy-kit.test.ts` runs the engine against the fixtures in `__fixtures__/` using an
in-memory ts-morph `Project` — no fixture file on disk is ever modified by the test suite itself,
regardless of which `write` value a given test exercises.
