import { readFileSync, readdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const componentsDir = resolve(__dirname, "../src/components");

// Any of these hook calls means the file can only run as a Client Component —
// React Server Components have no hook dispatcher at all, not even for useMemo/useCallback.
const HOOK_PATTERN =
  /\b(useState|useEffect|useLayoutEffect|useContext|useReducer|useRef|useMemo|useCallback|useImperativeHandle|useId|useSyncExternalStore|createContext)\s*\(/;

// A DOM event handler attribute declared in the file's own JSX also requires a Client
// Component boundary, even with zero hooks (e.g. a purely-props-driven onClick).
const JSX_HANDLER_PATTERN = /\bon[A-Z]\w*=\{/;

const skip = /\.(test|stories)\.tsx?$/;
// Barrel files only re-export — they never call hooks themselves, so scanning them
// is harmless, but excluding them keeps the file list this prints focused on files
// that could actually need the fix.
const isBarrel = /^index\.ts$/;

const missing = [];

for (const dir of readdirSync(componentsDir, { withFileTypes: true })) {
  if (!dir.isDirectory()) continue;
  const compDir = resolve(componentsDir, dir.name);
  for (const file of readdirSync(compDir, { withFileTypes: true })) {
    if (!file.isFile() || !/\.tsx?$/.test(file.name) || skip.test(file.name) || isBarrel.test(file.name)) continue;
    const path = resolve(compDir, file.name);
    const src = readFileSync(path, "utf8");

    const needsDirective = HOOK_PATTERN.test(src) || JSX_HANDLER_PATTERN.test(src);
    const hasDirective = /^["']use client["'];?\s*$/m.test(src.split("\n").slice(0, 3).join("\n"));

    if (needsDirective && !hasDirective) {
      missing.push(`src/components/${dir.name}/${file.name}`);
    }
  }
}

if (missing.length > 0) {
  console.error(
    `\n${missing.length} component file(s) use hooks or declare DOM event handlers in their own JSX but are missing a "use client" directive:\n`,
  );
  for (const file of missing) console.error(`  - ${file}`);
  console.error(
    '\nAdd \'"use client";\' as the very first line of each file above (before imports). See docs/rsc.md.\n',
  );
  process.exit(1);
}

console.log("check-use-client: all client-only component files are correctly marked.");
