// Randomness helpers. Every function accepts an optional `rng` (returns [0,1)) so tests can be deterministic.

export const randomBetween = (min, max, rng = Math.random) => min + rng() * (max - min);

export const pickOne = (items, rng = Math.random) => items[Math.floor(rng() * items.length)];

export function shuffle(items, rng = Math.random) {
  const result = items.slice();
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}
