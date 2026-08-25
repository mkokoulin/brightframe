import { resolve } from "node:path";
import { writeFileSync } from "node:fs";
import { Project } from "ts-morph";
import { runMigration } from "./engine";
import type { MigrationConfig } from "./types";

function parseArgs(argv: string[]) {
  let write = false;
  let config = "";
  let report = "";
  const positional: string[] = [];

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === "--write") write = true;
    else if (arg === "--config") config = argv[++i] ?? "";
    else if (arg === "--report") report = argv[++i] ?? "";
    else positional.push(arg);
  }

  return { targetDir: positional[0] ?? "", write, config, report };
}

const FINDING_SECTIONS = ["safe-rename", "manual-review", "global-css-import"] as const;

async function main() {
  const { targetDir, write, config: configPath, report: reportPath } = parseArgs(process.argv.slice(2));

  if (!targetDir || !configPath) {
    console.error("Usage: bun codemods/migrate-legacy-kit/cli.ts <targetDir> --config <configPath> [--write] [--report <path>]");
    console.error("\nDry-run by default (no files are written); pass --write to apply safe-rename changes.");
    process.exitCode = 1;
    return;
  }

  const configModule = (await import(resolve(process.cwd(), configPath))) as { default: MigrationConfig };
  const config = configModule.default;

  const resolvedTarget = resolve(targetDir);
  const project = new Project({ skipAddingFilesFromTsConfig: true });
  project.addSourceFilesAtPaths(`${resolvedTarget}/**/*.{ts,tsx}`);

  // `runMigration` never calls `project.saveSync()` on its own — only this `write` flag,
  // read directly from the CLI args, decides whether anything actually reaches disk.
  const result = runMigration(project, config, { write });

  const lines: string[] = [];
  lines.push(`# migrate-legacy-kit — ${write ? "applied" : "dry run"}`);
  lines.push("");
  lines.push(`Target: \`${targetDir}\``);
  lines.push(`Config: \`${configPath}\``);
  lines.push("");

  if (result.findings.length === 0) {
    lines.push("No legacy-kit imports found matching this config.");
  }

  for (const kind of FINDING_SECTIONS) {
    const group = result.findings.filter((f) => f.kind === kind);
    if (group.length === 0) continue;
    lines.push(`## ${kind} (${group.length})`);
    lines.push("");
    for (const finding of group) {
      lines.push(`- \`${finding.file}\`: ${finding.detail}`);
    }
    lines.push("");
  }

  if (!write && result.findings.some((f) => f.kind === "safe-rename")) {
    const count = result.findings.filter((f) => f.kind === "safe-rename").length;
    lines.push(`${count} safe-rename change(s) available — re-run with \`--write\` to apply them.`);
  }

  const output = lines.join("\n");
  if (reportPath) {
    writeFileSync(resolve(reportPath), output, "utf8");
    console.log(`Report written to ${reportPath}`);
  } else {
    console.log(output);
  }
}

main();
