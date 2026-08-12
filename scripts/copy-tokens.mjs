import { copyFileSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const src = resolve(__dirname, "../src/tokens.css");
const dest = resolve(__dirname, "../dist/tokens.css");

mkdirSync(dirname(dest), { recursive: true });
copyFileSync(src, dest);
console.log("copied tokens.css -> dist/tokens.css");
