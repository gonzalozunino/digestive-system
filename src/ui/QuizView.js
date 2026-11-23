// The question card: the character, prompt, four answer buttons and the feedback after answering.
import { byId, focusSoon } from "./dom.js";
import { MASCOT_LINES, TEXTS } from "../data/texts.js";
import { pickOne } from "../utils/random.js";
import { format } from "../utils/text.js";

export class QuizView {
  constructor({ onAnswer, onContinue }) {
    this.counter = byId("quiz-counter");
    this.streak = byId("quiz-streak");
    this.mascot = byId("quiz-mascot");
    this.say = byId("quiz-say");
    this.prompt = byId("quiz-prompt");
    this.answers = byId("quiz-answers");
    this.feedback = byId("quiz-feedback");
    this.feedbackTitle = byId("quiz-feedback-title");
    this.feedbackText = byId("quiz-feedback-text");
    this.continueButton = byId("quiz-continue");
    this.onAnswer = onAnswer;
    this.character = null;
    this.continueButton.addEventListener("click", onContinue);
  }

  /** The character that reacts to the answers. */
  setCharacter(character) { this.character = character; }

  show({ question, number, total, level, streak }) {
    this.counter.textContent = format(TEXTS.quizCounter, { number, total, emoji: level.emoji, level: level.shortName });
    this.streak.textContent = streak >= 2 ? format(TEXTS.streak, { streak }) : "";
    this.prompt.textContent = question.prompt;
    this.#setMascot("think", MASCOT_LINES.ask);
    this.answers.replaceChildren(...question.options.map((option, i) => this.#answerButton(option.text, i)));
    this.feedback.hidden = true;
  }

  showResult({ chosenIndex, correctIndex, correct, points, streak, explanation, correctText, outOfHearts }) {
    [...this.answers.children].forEach((button, i) => {
      button.disabled = true;
      if (i === correctIndex) button.classList.add("answer--right");
      else if (i === chosenIndex) button.classList.add("answer--wrong");
      else button.classList.add("answer--dimmed");
    });

    this.feedbackTitle.replaceChildren();
    if (correct) {
      this.#setMascot("wow", MASCOT_LINES.correct);
      this.feedbackTitle.append(TEXTS.correctTitle + " ", this.#span(`+${points}`, "feedback__points"));
      if (streak >= 2) this.feedbackTitle.append(" ", this.#span(format(TEXTS.streak, { streak }), "feedback__streak"));
    } else {
      this.#setMascot("sad", MASCOT_LINES.wrong);
      this.feedbackTitle.append(TEXTS.wrongTitle + " ", this.#span(correctText, "feedback__answer"));
    }
    this.feedbackText.textContent = TEXTS.explanationPrefix + explanation;
    this.continueButton.textContent = outOfHearts ? TEXTS.seeResults : TEXTS.continue;
    this.feedback.hidden = false;
    focusSoon(this.continueButton);
  }

  #answerButton(text, index) {
    const button = document.createElement("button");
    button.className = `answer answer--${index + 1}`;
    const key = document.createElement("b");
    key.className = "answer__key";
    key.textContent = String(index + 1);
    const label = document.createElement("span");
    label.textContent = text;
    button.append(key, label);
    button.addEventListener("click", () => this.onAnswer(index));
    return button;
  }

  #setMascot(mood, lines) {
    this.mascot.innerHTML = this.character.portrait(mood);
    this.say.textContent = pickOne(lines);
  }

  #span(text, className) {
    const span = document.createElement("span");
    span.className = className;
    span.textContent = text;
    return span;
  }
}
