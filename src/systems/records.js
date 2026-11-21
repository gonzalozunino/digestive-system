// High-score table of a topic, stored on the device.
// A record is { name, score, reachedStage, t }: reachedStage is a stage index, or the number of
// stages when the player finished.
import { RECORDS, STORAGE_KEYS } from "../data/config.js";

export function createRecords(storage, topicId) {
  const key = STORAGE_KEYS.records(topicId);
  return {
    list: () => storage.get(key, []),
    lastName: () => storage.get(STORAGE_KEYS.lastName, ""),

    /** Saves a record and returns its position in the table, or -1 if it did not make it. */
    add({ name, score, reachedStage, now = Date.now() }) {
      const record = { name, score, reachedStage, t: now };
      const all = [...this.list(), record].sort((a, b) => b.score - a.score || a.t - b.t);
      const top = all.slice(0, RECORDS.max);
      storage.set(key, top);
      storage.set(STORAGE_KEYS.lastName, name);
      return top.indexOf(record);
    },
  };
}
