import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { Project } from "ts-morph";
import { runMigration } from "./engine";
import type { MigrationConfig } from "./types";

const FIXTURES_DIR = resolve(__dirname, "__fixtures__");

function readFixture(...segments: string[]): string {
  return readFileSync(resolve(FIXTURES_DIR, ...segments), "utf8");
}

const CONFIG: MigrationConfig = {
  packageName: "brightframe",
  rules: [
    { legacyName: "Title", brightframeName: "Title", kind: "safe-rename" },
    {
      legacyName: "Button",
      brightframeName: "Btn",
      kind: "manual-review",
      note: "Legacy `Button` navigates internally; `Btn` has no routing of its own.",
    },
  ],
};

describe("runMigration", () => {
  it("rewrites a safe-rename import and its JSX references, in memory only", () => {
    const before = readFixture("safe-rename", "before", "Example.tsx");
    const after = readFixture("safe-rename", "after", "Example.tsx");

    const project = new Project({ useInMemoryFileSystem: true });
    const sourceFile = project.createSourceFile("/Example.tsx", before);

    const result = runMigration(project, CONFIG, { write: false });

    expect(sourceFile.getFullText()).toBe(after);
    expect(result.findings).toEqual([
      expect.objectContaining({
        kind: "safe-rename",
        legacyName: "Title",
        brightframeName: "Title",
      }),
    ]);
    // `changedFiles` reflects the in-memory transform regardless of `write` — it's
    // `project.saveSync()` (gated on `write`) that decides whether this reaches disk.
    expect(result.changedFiles).toEqual(["/Example.tsx"]);
  });

  it("leaves a manual-review import untouched and reports it instead of rewriting", () => {
    const before = readFixture("manual-review", "Example.tsx");

    const project = new Project({ useInMemoryFileSystem: true });
    const sourceFile = project.createSourceFile("/Example.tsx", before);

    const result = runMigration(project, CONFIG, { write: false });

    expect(sourceFile.getFullText()).toBe(before);

    const manualReview = result.findings.find((f) => f.kind === "manual-review");
    expect(manualReview).toEqual(
      expect.objectContaining({
        kind: "manual-review",
        legacyName: "Button",
        brightframeName: "Btn",
        detail: CONFIG.rules[1].note,
      }),
    );
  });

  it("reports a plain global CSS import without rewriting anything", () => {
    const before = readFixture("manual-review", "Example.tsx");

    const project = new Project({ useInMemoryFileSystem: true });
    project.createSourceFile("/Example.tsx", before);

    const result = runMigration(project, CONFIG, { write: false });

    const cssFinding = result.findings.find((f) => f.kind === "global-css-import");
    expect(cssFinding?.detail).toContain("./Example.css");
  });

  it("never persists a change unless write: true — the CLI's core safety property", () => {
    const before = readFixture("safe-rename", "before", "Example.tsx");

    const dryRunProject = new Project({ useInMemoryFileSystem: true });
    const dryRunFile = dryRunProject.createSourceFile("/Example.tsx", before);
    runMigration(dryRunProject, CONFIG, { write: false });
    expect(dryRunFile.isSaved()).toBe(false);

    const writeProject = new Project({ useInMemoryFileSystem: true });
    const writtenFile = writeProject.createSourceFile("/Example.tsx", before);
    runMigration(writeProject, CONFIG, { write: true });
    expect(writtenFile.isSaved()).toBe(true);
  });
});
