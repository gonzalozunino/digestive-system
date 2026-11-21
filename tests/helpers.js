import { readdirSync } from "node:fs";
import { GENERIC_SCENERIES, AUTO_SCENERIES } from "../src/render/scenery.js";
import { prepareTopic } from "../src/topic/prepareTopic.js";

// Deterministic random numbers for tests (mulberry32).
export function seededRandom(seed = 1) {
  return () => {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Same steps as src/main.js: generic + topic sceneries, then prepareTopic. */
export const sceneryKeysFor = topicModule => Object.keys({ ...GENERIC_SCENERIES, ...topicModule.sceneries });
export const loadTopic = topicModule =>
  prepareTopic(topicModule, { sceneryKeys: sceneryKeysFor(topicModule), autoSceneries: AUTO_SCENERIES });

/** Every topic folder in topics/, as [id, module]. */
export async function allTopics() {
  const ids = readdirSync(new URL("../topics/", import.meta.url), { withFileTypes: true })
    .filter(entry => entry.isDirectory()).map(entry => entry.name);
  return Promise.all(ids.map(async id => [id, (await import(`../topics/${id}/index.js`)).default]));
}
