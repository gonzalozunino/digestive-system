// Tiny static server for development (ES modules do not load from file://).
//   npm run dev                          -> topic from src/activeTopic.js
//   npm run dev -- --topic=sistema-solar -> another topic, without editing files
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { extname, join, normalize } from "node:path";
import { topicFromArgs, activeTopicSource } from "./topicOption.mjs";

const PORT = Number(process.env.PORT) || 8000;
const ROOT = process.cwd();
const TYPES = { ".html": "text/html", ".js": "text/javascript", ".mjs": "text/javascript", ".css": "text/css", ".svg": "image/svg+xml", ".png": "image/png", ".json": "application/json" };
const chosenTopic = topicFromArgs();

createServer(async (req, res) => {
  const path = normalize(decodeURIComponent(new URL(req.url, "http://x").pathname)).replace(/^(\.\.[/\\])+/, "");
  const file = join(ROOT, path.endsWith("/") ? path + "index.html" : path);
  try {
    const body = chosenTopic && path === "/src/activeTopic.js" ? activeTopicSource(chosenTopic) : await readFile(file);
    res.writeHead(200, { "Content-Type": TYPES[extname(file)] ?? "application/octet-stream", "Cache-Control": "no-store" });
    res.end(body);
  } catch {
    res.writeHead(404).end("Not found");
  }
}).listen(PORT, () => console.log(`Trivia Runner${chosenTopic ? ` (${chosenTopic})` : ""}: http://localhost:${PORT}`));
