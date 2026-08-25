export type RuleKind = "safe-rename" | "manual-review";

export type ComponentRule = {
  /** The local default-imported name at the legacy call site (e.g. `Button` in `import Button from "../Button/Button"`). */
  legacyName: string;
  /** Named export to import from `brightframe` (or `config.packageName`) instead. */
  brightframeName: string;
  kind: RuleKind;
  /** Shown in the report. Required in practice for `manual-review` — explain the gap. */
  note?: string;
};

export type MigrationConfig = {
  /** Defaults to `"brightframe"`. */
  packageName?: string;
  rules: ComponentRule[];
};

export type FindingKind = "safe-rename" | "manual-review" | "global-css-import";

export type MigrationFinding = {
  file: string;
  kind: FindingKind;
  legacyName?: string;
  brightframeName?: string;
  detail: string;
};

export type MigrationResult = {
  findings: MigrationFinding[];
  /**
   * Absolute paths of files with at least one `safe-rename` applied. Populated
   * regardless of `write` — this reflects the in-memory transform, so a dry run can
   * still report which files *would* change. Whether that reaches disk depends only
   * on the `write` option passed to `runMigration`.
   */
  changedFiles: string[];
};
