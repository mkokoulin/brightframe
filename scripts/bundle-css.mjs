import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const distDir = resolve(__dirname, "../dist");

// `style.css` / the "style" field is documented as "compiled component
// styles" (README: "tokens.css and style.css are required, separately") —
// so it excludes tokens.css/fonts.css, which ship as their own exports.
const excluded = new Set(["tokens.css", "fonts.css", "brightframe.css"]);

const cssFiles = readdirSync(distDir)
  .filter((f) => f.endsWith(".css") && !excluded.has(f))
  .sort();

const bundle = cssFiles.map((f) => readFileSync(resolve(distDir, f), "utf8")).join("\n");

writeFileSync(resolve(distDir, "brightframe.css"), bundle);
console.log(`bundled ${cssFiles.length} component stylesheets -> dist/brightframe.css`);
