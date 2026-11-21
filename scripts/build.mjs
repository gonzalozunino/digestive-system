// Bundles the game into a single self-contained HTML file that works when opened directly.
//   npm run build                         -> dist/<topic>.html for the topic in src/activeTopic.js
//   npm run build -- --topic=sistema-solar -> dist/sistema-solar.html
import { build } from "esbuild";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { topicFromArgs, activeTopicSource } from "./topicOption.mjs";

const chosenTopic = topicFromArgs();

/** Swaps src/activeTopic.js for the topic given with --topic. */
const topicPlugin = {
  name: "active-topic",
  setup(b) {
    if (!chosenTopic) return;
    b.onLoad({ filter: /[\\/]src[\\/]activeTopic\.js$/ }, () => ({
      contents: activeTopicSource(chosenTopic), resolveDir: resolve("src"), loader: "js",
    }));
  },
};

const bundle = async (entry, options = {}) => {
  const result = await build({ entryPoints: [entry], bundle: true, minify: true, write: false, ...options });
  return result.outputFiles[0].text;
};

const js = await bundle("src/main.js", { format: "iife", target: "es2022", plugins: [topicPlugin] });
const css = await bundle("styles/main.css");
const topicId = chosenTopic ?? (await readFile("src/activeTopic.js", "utf8")).match(/topics\/([a-z0-9-]+)\//)[1];

let html = await readFile("index.html", "utf8");
const inline = (pattern, replacement) => {
  if (!pattern.test(html)) throw new Error(`index.html: could not find ${pattern}`);
  html = html.replace(pattern, () => replacement);
};
inline(/<link rel="stylesheet" href="styles\/main\.css">/, `<style>${css}</style>`);
inline(/<script type="module" src="src\/main\.js"><\/script>/, `<script>${js.replace(/<\/script/gi, "<\\/script")}</script>`);

await mkdir("dist", { recursive: true });
const output = `dist/${topicId}.html`;
await writeFile(output, html);
console.log(`${output} (${(html.length / 1024).toFixed(0)} KB)`);
