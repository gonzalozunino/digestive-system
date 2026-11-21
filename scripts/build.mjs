// Bundles the game into a single self-contained file: dist/index.html.
// That file works when opened directly (no server needed) and is easy to share.
import { build } from "esbuild";
import { mkdir, readFile, writeFile } from "node:fs/promises";

const bundle = async (entry, options = {}) => {
  const result = await build({ entryPoints: [entry], bundle: true, minify: true, write: false, ...options });
  return result.outputFiles[0].text;
};

const js = await bundle("src/main.js", { format: "iife", target: "es2022" });
const css = await bundle("styles/main.css");
let html = await readFile("index.html", "utf8");

const inline = (pattern, replacement) => {
  if (!pattern.test(html)) throw new Error(`index.html: could not find ${pattern}`);
  html = html.replace(pattern, () => replacement);
};
inline(/<link rel="stylesheet" href="styles\/main\.css">/, `<style>${css}</style>`);
inline(/<script type="module" src="src\/main\.js"><\/script>/, `<script>${js.replace(/<\/script/gi, "<\\/script")}</script>`);

await mkdir("dist", { recursive: true });
await writeFile("dist/index.html", html);
console.log(`dist/index.html (${(html.length / 1024).toFixed(0)} KB)`);
