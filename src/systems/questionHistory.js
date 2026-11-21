// Remembers which questions of a topic were already asked on this device.
import { STORAGE_KEYS } from "../data/config.js";
import { isRepeatable } from "./questionPicker.js";

export function createQuestionHistory(storage, topicId) {
  const key = STORAGE_KEYS.seenQuestions(topicId);
  return {
    load: () => new Set(storage.get(key, [])),
    save: seen => storage.set(key, [...seen]),
    markAsked(question) {
      if (isRepeatable(question)) return;
      const seen = this.load();
      seen.add(question.id);
      this.save(seen);
    },
  };
}
