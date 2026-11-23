// High-score table of a topic, stored on the device. A record is { name, score, levelId, percent, t }.
import { RECORDS, STORAGE_KEYS } from "../data/config.js";

export function createRecords(storage, topicId) {
  const key = STORAGE_KEYS.records(topicId);
  return {
    list: () => storage.get(key, []),
    lastName: () => storage.get(STORAGE_KEYS.lastName, ""),

    /** Saves a record and returns its position in the table, or -1 if it did not make it. */
    add({ name, score, levelId, percent, now = Date.now() }) {
      const record = { name, score, levelId, percent, t: now };
      const all = [...this.list(), record].sort((a, b) => b.score - a.score || a.t - b.t);
      const top = all.slice(0, RECORDS.max);
      storage.set(key, top);
      storage.set(STORAGE_KEYS.lastName, name);
      return top.indexOf(record);
    },
  };
}
