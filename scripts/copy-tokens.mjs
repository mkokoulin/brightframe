import { copyFileSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const files = ["tokens.css", "fonts.css"];

for (const file of files) {
  const src = resolve(__dirname, "../src", file);
  const dest = resolve(__dirname, "../dist", file);
  mkdirSync(dirname(dest), { recursive: true });
  copyFileSync(src, dest);
  console.log(`copied ${file} -> dist/${file}`);
}
