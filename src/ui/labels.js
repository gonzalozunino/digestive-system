// Formatting shared by several views.
import { DIFFICULTY_LABELS, TEXTS } from "../data/texts.js";
import { format } from "../utils/text.js";

/** "😠 Difícil" */
export const difficultyLabel = key => format(TEXTS.difficulty, DIFFICULTY_LABELS[key]);
