// Turns a topic module into the complete, validated content the game uses, filling in defaults.
// The result is plain data: drawing code (sceneries, hero) stays with the renderer and the UI.
import { LEVEL_TRACKS } from "../data/music.js";
import { validateTopic, difficultyOf } from "./validateTopic.js";
import { COLLECTIBLE_NAMES, DEFAULT_COLLECTIBLE, DEFAULT_FINISH, DEFAULT_QUESTION_WORDING, DEFAULT_LEVEL_EMOJI } from "./defaults.js";

export class TopicError extends Error {
  constructor(errors) {
    super(`Topic is not valid:\n- ${errors.join("\n- ")}`);
    this.errors = errors;
  }
}

function collectibleFor(level) {
  const style = level.collectible?.style ?? DEFAULT_COLLECTIBLE.style;
  return { ...DEFAULT_COLLECTIBLE, names: [COLLECTIBLE_NAMES[style]], ...level.collectible };
}

/**
 * @param topic the topic module's default export
 * @param {{sceneryKeys: string[], autoSceneries: string[]}} options
 *   sceneryKeys: every scenery the topic may use; autoSceneries: used in order for levels without one
 */
export function prepareTopic(topic, { sceneryKeys, autoSceneries }) {
  const errors = validateTopic(topic, { sceneryKeys });
  if (errors.length) throw new TopicError(errors);

  return {
    id: topic.id,
    subject: topic.subject,
    pitch: topic.pitch,
    collectHelp: topic.collectHelp ?? DEFAULT_COLLECTIBLE.hint,
    heroId: topic.hero?.id ?? null,
    questionWording: { ...DEFAULT_QUESTION_WORDING, ...topic.questionWording },
    levels: topic.levels.map((level, index) => ({
      id: level.id,
      index,
      name: level.name,
      shortName: level.shortName ?? level.name,
      emoji: level.emoji ?? DEFAULT_LEVEL_EMOJI,
      intro: level.intro,
      difficulty: difficultyOf(level, index),
      general: Boolean(level.general),
      heroNote: level.heroNote ?? null,
      heroTint: level.heroTint ?? null,
      scenery: level.scenery ?? autoSceneries[index % autoSceneries.length],
      collectible: collectibleFor(level),
      music: level.music ?? LEVEL_TRACKS[index % LEVEL_TRACKS.length],
      finish: { ...DEFAULT_FINISH, ...topic.finish, ...level.finish },
      questions: level.questions ?? [],
    })),
    generalQuestions: topic.generalQuestions ?? [],
    concepts: topic.concepts ?? [],
    sequence: topic.sequence ?? [],
    categories: topic.categories ?? [],
  };
}
