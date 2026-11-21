import { test } from "node:test";
import assert from "node:assert/strict";
import { GENERIC_CHARACTERS, charactersFor } from "../src/characters/index.js";
import digestive from "../topics/sistema-digestivo/index.js";
import miniTopic from "./fixtures/miniTopic.js";

/** A canvas context that accepts any drawing call. */
const fakeContext = () => new Proxy({}, { get: (target, key) => (key in target ? target[key] : () => {}), set: (t, k, v) => ((t[k] = v), true) });

const everyCharacter = [...GENERIC_CHARACTERS, digestive.hero];

for (const character of everyCharacter) {
  test(`character ${character.id} follows the character interface`, () => {
    for (const key of ["id", "name", "tagline", "color"]) assert.ok(character[key], key);
    for (const mood of ["happy", "think", "sad", "wow"]) assert.match(character.portrait(mood), /^<svg[\s\S]*<\/svg>$/);
    for (const grounded of [true, false]) character.draw(fakeContext(), { radius: 18, grounded, time: 1, tint: "#fff" });
  });
}

test("a topic's own hero comes first; topics without one use the generic characters", () => {
  assert.equal(charactersFor(digestive)[0].id, "bolo");
  assert.equal(charactersFor(digestive).length, GENERIC_CHARACTERS.length + 1);
  assert.deepEqual(charactersFor(miniTopic), GENERIC_CHARACTERS);
  assert.equal(new Set(everyCharacter.map(c => c.id)).size, everyCharacter.length);
});
