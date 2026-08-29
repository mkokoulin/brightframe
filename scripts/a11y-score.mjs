#!/usr/bin/env node
// Accessibility quality score, per component. Complements (does not replace) the
// existing DOM-based checks — jest-axe per component, @storybook/addon-a11y on every
// real-browser story — by catching the category of gap those tools structurally can't:
// things that are only wrong in how a screen reader or keyboard user actually
// experiences a correctly-shaped DOM (missing focus trap on a role="dialog", a range
// input's aria-valuetext silently diverging from its visible formatted value, a counter
// with zero live-region feedback, ...). See the RULES array below for the full list
// and how to add one.
import { readdirSync, readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { Project, SyntaxKind } from "ts-morph";

const __dirname = dirname(fileURLToPath(import.meta.url));
const componentsDir = resolve(__dirname, "../src/components");
const isTestOrStory = /\.(test|stories)\.tsx?$/;

const project = new Project({ skipAddingFilesFromTsConfig: true });

// ── AST helpers ──────────────────────────────────────────────────────────

function jsxAttributes(el) {
  const opening = el.getKind() === SyntaxKind.JsxElement ? el.getOpeningElement() : el;
  return opening.getAttributes().filter((a) => a.getKind() === SyntaxKind.JsxAttribute);
}

function attrValueText(attr) {
  const init = attr.getInitializer();
  return init ? init.getText() : "true"; // boolean shorthand, e.g. `disabled`
}

/** True if `el` or any JSX ancestor carries aria-hidden, aria-label(ledby), or a role="img"/"presentation"/"none". */
function isHiddenOrNamed(el) {
  let node = el;
  while (node) {
    if (node.getKind() === SyntaxKind.JsxElement || node.getKind() === SyntaxKind.JsxSelfClosingElement) {
      for (const attr of jsxAttributes(node)) {
        const name = attr.getNameNode().getText();
        if (name === "aria-hidden" || name === "aria-label" || name === "aria-labelledby") return true;
        if (name === "role" && /img|presentation|none/.test(attrValueText(attr))) return true;
      }
    }
    node = node.getParent();
  }
  return false;
}

function tagName(el) {
  const opening = el.getKind() === SyntaxKind.JsxElement ? el.getOpeningElement() : el;
  return opening.getTagNameNode().getText();
}

/**
 * True if `node` sits inside a function that this module exports (directly, or as a
 * `const X = () => ...`). Private, unexported helper components (a file-local `PlusIcon`
 * used exactly once) are composed by a caller elsewhere in the *same* file — e.g.
 * wrapped in an `aria-hidden` span at the call site — which static per-node analysis
 * can't see across, since that's a runtime composition relationship, not a lexical one.
 * Restricting to exported functions avoids flagging that as a false positive while
 * still catching a genuinely unguarded `<svg>` in the file's own top-level markup.
 */
function isInsideExportedFunction(node) {
  let n = node.getParent();
  while (n) {
    if (n.getKind() === SyntaxKind.FunctionDeclaration || n.getKind() === SyntaxKind.VariableStatement) {
      return typeof n.hasExportKeyword === "function" && n.hasExportKeyword();
    }
    n = n.getParent();
  }
  return true;
}

function svgElements(sourceFile) {
  return [
    ...sourceFile.getDescendantsOfKind(SyntaxKind.JsxSelfClosingElement),
    ...sourceFile.getDescendantsOfKind(SyntaxKind.JsxElement),
  ].filter((el) => tagName(el) === "svg" && isInsideExportedFunction(el));
}

function clickableNonInteractiveElements(sourceFile) {
  return [
    ...sourceFile.getDescendantsOfKind(SyntaxKind.JsxSelfClosingElement),
    ...sourceFile.getDescendantsOfKind(SyntaxKind.JsxElement),
  ].filter((el) => {
    if (!["div", "span"].includes(tagName(el))) return false;
    const names = jsxAttributes(el).map((a) => a.getNameNode().getText());
    return names.includes("onClick") && !names.includes("role") && !names.includes("tabIndex");
  });
}

// ── Rules ────────────────────────────────────────────────────────────────
// Each `check` returns a violation count (0 = pass). Deduction is capped at 2x weight
// so one noisy rule can't alone drag a component to 0 — a second, independent finding
// still matters more than a tenth occurrence of the same one.

const RULES = [
  {
    id: "dialog-focus-trap",
    weight: 25,
    // aria-modal="true" is the signal, not role="dialog" alone — a non-modal dialog
    // (Popover's disclosure panel: role="dialog", no aria-modal) is correctly reachable
    // without a trap by design; trapping it would be a regression, not a fix.
    check: (ctx) => (ctx.tsx.includes('role="dialog"') && ctx.tsx.includes('aria-modal="true"') && !ctx.tsx.includes("useFocusTrap") ? 1 : 0),
    message: () =>
      'Renders role="dialog" aria-modal="true" content but never calls useFocusTrap (brightframe/a11y) — a keyboard user can Tab out of the dialog into the page behind it, and focus is never moved in on open or restored on close. Axe cannot verify this; it only checks static ARIA attributes.',
  },
  {
    id: "range-missing-valuetext",
    weight: 15,
    check: (ctx) => (ctx.tsx.includes('type="range"') && /\bformatValue\b/.test(ctx.tsx) && !ctx.tsx.includes("aria-valuetext") ? 1 : 0),
    message: () =>
      'Has a custom formatValue for a type="range" input but never sets aria-valuetext — screen readers announce the raw number, which can silently diverge from what sighted users see (e.g. "$50"/"50%" read as "50").',
  },
  {
    id: "silent-counter-feedback",
    weight: 15,
    check: (ctx) => (/increase|decrease|increment|decrement/i.test(ctx.tsx) && !ctx.tsx.includes("aria-live") ? 1 : 0),
    message: () =>
      "Has increment/decrement-style controls (an aria-label mentioning increase/decrease) but no aria-live region anywhere — a screen reader user gets no feedback that the displayed value actually changed.",
  },
  {
    id: "unguarded-looping-motion",
    weight: 10,
    check: (ctx) => (/animation[^;]*\binfinite\b/.test(ctx.css) && !ctx.css.includes("prefers-reduced-motion") ? 1 : 0),
    message: () =>
      "Has a CSS animation that loops (infinite) with no @media (prefers-reduced-motion: reduce) guard — a continuously-moving element that ignores the user's OS-level motion preference (WCAG 2.2.2).",
  },
  {
    id: "unlabeled-decorative-svg",
    weight: 10,
    check: (ctx) => ctx.svgs.filter((el) => !isHiddenOrNamed(el)).length,
    message: (n) =>
      `${n} <svg> icon${n === 1 ? "" : "s"} neither hidden from assistive tech (aria-hidden, on the icon or an ancestor) nor given an accessible name (aria-label/aria-labelledby, or role="img") — likely announced as a blank, unlabeled image.`,
  },
  {
    id: "unreachable-by-keyboard",
    weight: 25,
    check: (ctx) => ctx.clickableNonInteractive.length,
    message: (n) =>
      `${n} clickable <div>/<span> element${n === 1 ? "" : "s"} with onClick but no role/tabIndex — invisible to keyboard-only users entirely. Use a <button>, or add role="button", tabIndex={0}, and an Enter/Space keydown handler.`,
  },
];

// ── Scan ─────────────────────────────────────────────────────────────────

const componentNames = readdirSync(componentsDir, { withFileTypes: true })
  .filter((d) => d.isDirectory())
  .map((d) => d.name)
  .sort();

const results = [];

for (const name of componentNames) {
  const dir = join(componentsDir, name);
  const files = readdirSync(dir, { withFileTypes: true })
    .filter((f) => f.isFile())
    .map((f) => f.name);

  const tsxFiles = files.filter((f) => /\.tsx?$/.test(f) && !isTestOrStory.test(f));
  const cssFiles = files.filter((f) => f.endsWith(".module.css"));
  if (tsxFiles.length === 0) continue;

  const tsx = tsxFiles.map((f) => readFileSync(join(dir, f), "utf8")).join("\n");
  const css = cssFiles.map((f) => readFileSync(join(dir, f), "utf8")).join("\n");

  const svgs = [];
  const clickableNonInteractive = [];
  for (const f of tsxFiles) {
    const path = join(dir, f);
    const sourceFile = project.addSourceFileAtPath(path);
    svgs.push(...svgElements(sourceFile));
    clickableNonInteractive.push(...clickableNonInteractiveElements(sourceFile));
  }

  const ctx = { tsx, css, svgs, clickableNonInteractive };

  let score = 100;
  const findings = [];
  for (const rule of RULES) {
    const count = rule.check(ctx);
    if (count > 0) {
      score -= Math.min(rule.weight * count, rule.weight * 2);
      findings.push({ id: rule.id, count, message: rule.message(count) });
    }
  }
  score = Math.max(0, score);

  results.push({ name, score, findings });
}

// ── Report ───────────────────────────────────────────────────────────────

results.sort((a, b) => a.score - b.score || a.name.localeCompare(b.name));

console.table(
  results.map((r) => ({
    Component: r.name,
    Score: r.score,
    Findings: r.findings.map((f) => f.id).join(", ") || "—",
  })),
);

const flagged = results.filter((r) => r.findings.length > 0);
if (flagged.length > 0) {
  console.log(`\n${flagged.length} component(s) with findings:\n`);
  for (const r of flagged) {
    console.log(`${r.name} (${r.score}/100)`);
    for (const f of r.findings) console.log(`  - [${f.id}] ${f.message}`);
  }
} else {
  console.log("\nNo findings — every component clears every heuristic.");
}

const average = results.reduce((sum, r) => sum + r.score, 0) / results.length;
console.log(`\nOverall: ${average.toFixed(1)}/100 average across ${results.length} components.`);
console.log("This is a heuristic report, not a gate — it always exits 0. See the header comment in this file for the rule list.");
