// Reads `--topic=<id>` from the command line and checks that topics/<id>/index.js exists.
import { existsSync } from "node:fs";

export function topicFromArgs(argv = process.argv.slice(2)) {
  const arg = argv.find(a => a.startsWith("--topic="));
  if (!arg) return null;
  const id = arg.slice("--topic=".length);
  if (!/^[a-z0-9-]+$/.test(id) || !existsSync(`topics/${id}/index.js`)) {
    throw new Error(`Topic "${id}" not found: expected topics/${id}/index.js`);
  }
  return id;
}

/** Module source that replaces src/activeTopic.js when a topic is chosen on the command line. */
export const activeTopicSource = id => `export { default } from "../topics/${id}/index.js";\n`;
