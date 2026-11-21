// Turns a topic module into the complete, validated content the game uses, filling in defaults.
// The result is plain data: drawing code (sceneries, hero) stays with the renderer and the UI.
import { STAGE_TRACKS } from "../data/music.js";
import { validateTopic } from "./validateTopic.js";
import { COLLECTIBLE_NAMES, DEFAULT_COLLECTIBLE, DEFAULT_FINISH, DEFAULT_QUESTION_WORDING, DEFAULT_STAGE_EMOJI } from "./defaults.js";

export class TopicError extends Error {
  constructor(errors) {
    super(`Topic is not valid:\n- ${errors.join("\n- ")}`);
    this.errors = errors;
  }
}

function collectibleFor(stage) {
  const style = stage.collectible?.style ?? DEFAULT_COLLECTIBLE.style;
  return { ...DEFAULT_COLLECTIBLE, names: [COLLECTIBLE_NAMES[style]], ...stage.collectible };
}

/**
 * @param topic the topic module's default export
 * @param {{sceneryKeys: string[], autoSceneries: string[]}} options
 *   sceneryKeys: every scenery the topic may use; autoSceneries: used in order for stages without one
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
    finish: { ...DEFAULT_FINISH, ...topic.finish },
    questionWording: { ...DEFAULT_QUESTION_WORDING, ...topic.questionWording },
    stages: topic.stages.map((stage, index) => ({
      id: stage.id,
      index,
      name: stage.name,
      shortName: stage.shortName ?? stage.name,
      emoji: stage.emoji ?? DEFAULT_STAGE_EMOJI,
      intro: stage.intro,
      heroNote: stage.heroNote ?? null,
      heroTint: stage.heroTint ?? null,
      scenery: stage.scenery ?? autoSceneries[index % autoSceneries.length],
      collectible: collectibleFor(stage),
      music: stage.music ?? STAGE_TRACKS[index % STAGE_TRACKS.length],
      questions: stage.questions ?? [],
    })),
    generalQuestions: topic.generalQuestions ?? [],
    concepts: topic.concepts ?? [],
    sequence: topic.sequence ?? [],
    categories: topic.categories ?? [],
  };
}
