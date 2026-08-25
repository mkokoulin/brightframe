import type { Project } from "ts-morph";
import type { MigrationConfig, MigrationFinding, MigrationResult } from "./types";

const GLOBAL_CSS_IMPORT = /\.css$/;
const MODULE_CSS_IMPORT = /\.module\.css$/;

/**
 * Scans every source file already added to `project` for legacy-kit import patterns
 * matching `config.rules`, plus a standalone check for plain (non-CSS-Modules) global
 * stylesheet imports. `safe-rename` rules are rewritten in place (import + every JSX/
 * identifier reference in that file, via ts-morph's rename); `manual-review` rules and
 * global CSS imports are only ever reported, never rewritten — see docs in this
 * directory's README for why each of those is a real, unautomatable gap, not an
 * oversight. Nothing is written to disk unless `options.write` is `true`.
 */
export function runMigration(project: Project, config: MigrationConfig, options: { write: boolean }): MigrationResult {
  const packageName = config.packageName ?? "brightframe";
  const findings: MigrationFinding[] = [];
  const changedFiles = new Set<string>();

  for (const sourceFile of project.getSourceFiles()) {
    const filePath = sourceFile.getFilePath();

    for (const imp of sourceFile.getImportDeclarations()) {
      const spec = imp.getModuleSpecifierValue();
      if (GLOBAL_CSS_IMPORT.test(spec) && !MODULE_CSS_IMPORT.test(spec)) {
        findings.push({
          file: filePath,
          kind: "global-css-import",
          detail: `Imports a plain global stylesheet ("${spec}") — CSS-Modules conversion isn't automated; convert it by hand, matching brightframe's own extraction (see the README's "Origin" section).`,
        });
      }
    }

    for (const rule of config.rules) {
      const imp = sourceFile.getImportDeclarations().find((i) => {
        const defaultImport = i.getDefaultImport();
        return defaultImport?.getText() === rule.legacyName && i.getModuleSpecifierValue().startsWith(".");
      });
      if (!imp) continue;

      if (rule.kind === "manual-review") {
        findings.push({
          file: filePath,
          kind: "manual-review",
          legacyName: rule.legacyName,
          brightframeName: rule.brightframeName,
          detail: rule.note ?? `Legacy "${rule.legacyName}" import found, no automated migration rule for it.`,
        });
        continue;
      }

      const defaultImport = imp.getDefaultImport();
      // Renames every reference to the local default-imported binding in this file
      // (JSX tags, any other usage) to the brightframe named export, before dropping
      // the old import — so by the time the import itself is rewritten, nothing in the
      // file still refers to the old local name.
      defaultImport?.rename(rule.brightframeName);
      imp.remove();
      sourceFile.addImportDeclaration({
        namedImports: [rule.brightframeName],
        moduleSpecifier: packageName,
      });

      changedFiles.add(filePath);
      findings.push({
        file: filePath,
        kind: "safe-rename",
        legacyName: rule.legacyName,
        brightframeName: rule.brightframeName,
        detail: `Rewrote the default import of "${rule.legacyName}" to a named "${rule.brightframeName}" import from "${packageName}", and renamed matching references in this file.`,
      });
    }
  }

  if (options.write) {
    project.saveSync();
  }

  return { findings, changedFiles: [...changedFiles] };
}
