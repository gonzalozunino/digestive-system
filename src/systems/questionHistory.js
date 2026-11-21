// Remembers which questions were already asked on this device.
import { STORAGE_KEYS } from "../data/config.js";
import { isRepeatable } from "./questionPicker.js";

export function createQuestionHistory(storage) {
  return {
    load: () => new Set(storage.get(STORAGE_KEYS.seenQuestions, [])),
    save: seen => storage.set(STORAGE_KEYS.seenQuestions, [...seen]),
    markAsked(question) {
      if (isRepeatable(question)) return;
      const seen = this.load();
      seen.add(question.id);
      this.save(seen);
    },
  };
}
