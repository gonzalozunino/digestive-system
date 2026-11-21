// Entry point: creates the modules and connects them. No game rules or drawing code here.
import { AUDIO, PHYSICS, STORAGE_KEYS, DEFAULT_DIFFICULTY } from "./data/config.js";
import { createStorage } from "./utils/storage.js";
import { startLoop } from "./core/loop.js";
import { Game } from "./game/Game.js";
import { STATES } from "./game/states.js";
import { Renderer } from "./render/Renderer.js";
import { AudioEngine } from "./audio/AudioEngine.js";
import { SoundEffects } from "./audio/SoundEffects.js";
import { MusicPlayer } from "./audio/MusicPlayer.js";
import { bindInput } from "./input/input.js";
import { byId } from "./ui/dom.js";
import { ScreenManager } from "./ui/ScreenManager.js";
import { HudView } from "./ui/HudView.js";
import { MenuView } from "./ui/MenuView.js";
import { LevelIntroView } from "./ui/LevelIntroView.js";
import { QuizView } from "./ui/QuizView.js";
import { PauseView } from "./ui/PauseView.js";
import { ResultsView } from "./ui/ResultsView.js";
import { RecordsView } from "./ui/RecordsView.js";
import { fitStageToWindow } from "./ui/stageScaler.js";

/* ---------- services ---------- */
const storage = createStorage();
const game = new Game({ storage });
const audio = new AudioEngine(AUDIO);
const sfx = new SoundEffects(audio);
const music = new MusicPlayer(audio);
const stage = byId("stage");
const renderer = new Renderer(byId("game-canvas"), byId("fx-canvas"));

/* ---------- preferences ---------- */
// Older versions stored the difficulty as a boolean ("easy?") under the same key.
const storedDifficulty = storage.get(STORAGE_KEYS.difficulty, DEFAULT_DIFFICULTY);
const preferences = {
  muted: storage.get(STORAGE_KEYS.muted, false),
  difficulty: typeof storedDifficulty === "boolean" ? (storedDifficulty ? "easy" : "normal") : storedDifficulty,
};

function setMuted(muted) {
  preferences.muted = muted;
  storage.set(STORAGE_KEYS.muted, muted);
  audio.setMuted(muted);
  hud.setMuted(muted);
}

function setDifficulty(key) {
  preferences.difficulty = key;
  storage.set(STORAGE_KEYS.difficulty, key);
  game.setDifficulty(key);
  menu.setDifficulty(key);
}

/* ---------- views ---------- */
const screens = new ScreenManager(["menu", "help", "level-intro", "quiz", "pause", "results", "records"]);
const hud = new HudView({
  onPause: () => (game.state === STATES.PAUSED ? game.resume() : game.pause()),
  onMute: () => setMuted(!preferences.muted),
});
const menu = new MenuView({
  onPlay: () => game.start(),
  onRecords: () => showRecords(),
  onHelp: () => screens.show("help"),
  onBack: () => (game.state === STATES.MENU ? screens.show("menu") : game.quit()),
  onDifficulty: setDifficulty,
});
const levelIntro = new LevelIntroView({ onStart: () => game.beginRun() });
const quiz = new QuizView({ onAnswer: index => game.answer(index), onContinue: () => game.continueAfterAnswer() });
const pause = new PauseView({ onResume: () => game.resume(), onQuit: () => game.quit() });
const records = new RecordsView();
const results = new ResultsView({
  onSave: name => showRecords(game.saveRecord(name)),
  onAgain: () => game.start(),
  onMenu: () => game.quit(),
});

function showRecords(highlightIndex = -1) {
  records.render(game.records.list(), highlightIndex);
  screens.show("records");
}

/* ---------- game events -> views and audio ---------- */
const SCREEN_FOR_STATE = {
  [STATES.MENU]: "menu", [STATES.LEVEL_INTRO]: "level-intro", [STATES.QUIZ]: "quiz",
  [STATES.PAUSED]: "pause", [STATES.OVER]: "results",
};

game.on("state", state => {
  if (state in SCREEN_FOR_STATE) screens.show(SCREEN_FOR_STATE[state]);
  else screens.hideAll();
  hud.setVisible(state !== STATES.MENU);
  if (state === STATES.PAUSED) pause.focus();
});
game.on("hud", snapshot => hud.update(snapshot));
game.on("progress", ratio => hud.setProgress(ratio));
game.on("levelIntro", info => levelIntro.show(info));
game.on("quiz:open", info => quiz.show(info));
game.on("quiz:answered", result => quiz.showResult(result));
game.on("gameOver", summary => results.show(summary, game.records.lastName()));
game.on("sound", name => sfx.play(name));
game.on("music", ({ action, track, tempo }) => (action === "start" ? music.start(track, tempo) : music.stop()));

/* ---------- input ---------- */
function handleAction(action, { index } = {}) {
  switch (action) {
    case "jump": return game.pressJump();
    case "jumpRelease": game.releaseJump(); return false;
    case "answer":
      if (game.state !== STATES.QUIZ || game.quizAnswered) return false;
      game.answer(index);
      return true;
    case "confirm": return game.continueAfterAnswer();
    case "pause":
      if (game.state === STATES.PLAYING) { game.pause(); return true; }
      if (game.state === STATES.PAUSED) { game.resume(); return true; }
      return false;
    case "mute": setMuted(!preferences.muted); return true;
    default: return false;
  }
}

bindInput({ stage, onAction: handleAction, onUserGesture: () => audio.unlock() });
stage.addEventListener("click", event => { if (event.target.closest("button")) sfx.play("click"); });
document.addEventListener("visibilitychange", () => { if (document.hidden) game.pause(); });
window.addEventListener("blur", () => game.pause());

/* ---------- start ---------- */
setMuted(preferences.muted);
setDifficulty(preferences.difficulty);
fitStageToWindow(stage);
screens.show("menu");
startLoop({
  update: dt => game.update(dt),
  render: () => renderer.render(game),
  step: PHYSICS.fixedStep,
  maxFrameTime: PHYSICS.maxFrameTime,
});
