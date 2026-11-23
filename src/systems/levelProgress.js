// Best progress of each level of a topic on this device: { best: 0..100, completed }.
import { STORAGE_KEYS } from "../data/config.js";

export function createLevelProgress(storage, topicId) {
  const key = STORAGE_KEYS.progress(topicId);
  const all = () => storage.get(key, {});
  return {
    get: levelId => ({ best: 0, completed: false, ...all()[levelId] }),

    /** Saves a run and tells whether it beat the previous best. */
    record(levelId, percent) {
      const data = all();
      const previous = { best: 0, completed: false, ...data[levelId] };
      const isNewBest = percent > previous.best;
      data[levelId] = { best: Math.max(previous.best, percent), completed: previous.completed || percent >= 100 };
      storage.set(key, data);
      return { isNewBest, ...data[levelId] };
    },
  };
}
