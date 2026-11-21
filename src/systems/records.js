// High-score table stored on the device.
// A record is { name, score, reachedLevel, t }: reachedLevel is a level index, or LEVELS.length when finished.
// Records saved by older versions have a `reached` text instead.
import { RECORDS, STORAGE_KEYS } from "../data/config.js";

export function createRecords(storage) {
  return {
    list: () => storage.get(STORAGE_KEYS.records, []),
    lastName: () => storage.get(STORAGE_KEYS.lastName, ""),

    /** Saves a record and returns its position in the table, or -1 if it did not make it. */
    add({ name, score, reachedLevel, now = Date.now() }) {
      const record = { name, score, reachedLevel, t: now };
      const all = [...this.list(), record].sort((a, b) => b.score - a.score || a.t - b.t);
      const top = all.slice(0, RECORDS.max);
      storage.set(STORAGE_KEYS.records, top);
      storage.set(STORAGE_KEYS.lastName, name);
      return top.indexOf(record);
    },
  };
}
