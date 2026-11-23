// Entry point: loads the active topic, creates the modules and connects them.
// No game rules or drawing code here.
import topicModule from "./activeTopic.js";
import { AUDIO, PHYSICS, STORAGE_KEYS } from "./data/config.js";
import { GAME_NAME, TEXTS } from "./data/texts.js";
import { createStorage } from "./utils/storage.js";
import { format } from "./utils/text.js";
import { startLoop } from "./core/loop.js";
import { prepareTopic, TopicError } from "./topic/prepareTopic.js";
import { charactersFor } from "./characters/index.js";
import { Game } from "./game/Game.js";
import { STATES } from "./game/states.js";
import { Renderer } from "./render/Renderer.js";
import { GENERIC_SCENERIES, AUTO_SCENERIES } from "./render/scenery.js";
import { AudioEngine } from "./audio/AudioEngine.js";
import { SoundEffects } from "./audio/SoundEffects.js";
import { MusicPlayer } from "./audio/MusicPlayer.js";
import { bindInput } from "./input/input.js";
import { byId } from "./ui/dom.js";
import { ScreenManager } from "./ui/ScreenManager.js";
import { HudView } from "./ui/HudView.js";
import { MenuView } from "./ui/MenuView.js";
import { LevelSelectView } from "./ui/LevelSelectView.js";
import { LevelIntroView } from "./ui/LevelIntroView.js";
import { QuizView } from "./ui/QuizView.js";
import { PauseView } from "./ui/PauseView.js";
import { ResultsView } from "./ui/ResultsView.js";
import { RecordsView } from "./ui/RecordsView.js";
import { fitStageToWindow } from "./ui/stageScaler.js";

/* ---------- topic ---------- */
const sceneries = { ...GENERIC_SCENERIES, ...topicModule.sceneries };
let topic;
try {
  topic = prepareTopic(topicModule, { sceneryKeys: Object.keys(sceneries), autoSceneries: AUTO_SCENERIES });
} catch (error) {
  if (error instanceof TopicError) {
    document.body.textContent = `${TEXTS.topicError}\n\n- ${error.errors.join("\n- ")}`;
    document.body.classList.add("topic-error");
  }
  throw error;
}
const characters = charactersFor(topicModule);
document.title = format(TEXTS.documentTitle, { subject: topic.subject, game: GAME_NAME });

/* ---------- services ---------- */
const storage = createStorage();
const game = new Game({ topic, storage });
const audio = new AudioEngine(AUDIO);
const sfx = new SoundEffects(audio);
const music = new MusicPlayer(audio);
const stage = byId("stage");
const renderer = new Renderer(byId("game-canvas"), byId("fx-canvas"), { sceneries, character: characters[0] });

/* ---------- preferences ---------- */
const storedCharacter = storage.get(STORAGE_KEYS.character, null);
const preferences = {
  muted: storage.get(STORAGE_KEYS.muted, false),
  character: characters.find(c => c.id === storedCharacter) ?? characters[0],
};

function setMuted(muted) {
  preferences.muted = muted;
  storage.set(STORAGE_KEYS.muted, muted);
  audio.setMuted(muted);
  hud.setMuted(muted);
}

function setCharacter(id) {
  const character = characters.find(c => c.id === id) ?? characters[0];
  preferences.character = character;
  storage.set(STORAGE_KEYS.character, character.id);
  renderer.setCharacter(character);
  quiz.setCharacter(character);
  menu.setCharacter(character);
}

/* ---------- views ---------- */
const screens = new ScreenManager(["menu", "help", "levels", "level-intro", "quiz", "pause", "results", "records"]);
const hud = new HudView({
  onPause: () => (game.state === STATES.PAUSED ? game.resume() : game.pause()),
  onMute: () => setMuted(!preferences.muted),
});
const menu = new MenuView({ topic, characters }, {
  onPlay: () => showLevels(),
  onRecords: () => showRecords(),
  onHelp: () => screens.show("help"),
  onBack: () => (game.state === STATES.MENU ? screens.show("menu") : game.quit()),
  onCharacter: setCharacter,
});
const levelSelect = new LevelSelectView({ onPick: index => game.start(index) });
const levelIntro = new LevelIntroView({ onStart: () => game.beginRun() });
const quiz = new QuizView({ onAnswer: index => game.answer(index), onContinue: () => game.continueAfterAnswer() });
const pause = new PauseView({ onResume: () => game.resume(), onQuit: () => showLevels() });
const records = new RecordsView(topic.levels);
const results = new ResultsView({
  onSave: name => showRecords(game.saveRecord(name)),
  onAgain: () => game.start(game.levelIndex),
  onNext: () => game.start(game.levelIndex + 1),
  onLevels: () => showLevels(),
});

/** Leaves any level in progress and opens the level selection. */
function showLevels() {
  if (game.state !== STATES.MENU) game.quit();
  levelSelect.render(topic.levels, id => game.levelProgress.get(id));
  screens.show("levels");
}

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
game.on("levelIntro", info => levelIntro.show(info, preferences.character.id === topic.heroId));
game.on("quiz:open", info => quiz.show(info));
game.on("quiz:answered", result => quiz.showResult(result));
game.on("gameOver", summary => results.show(summary, { character: preferences.character, lastName: game.records.lastName() }));
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
setCharacter(preferences.character.id);
fitStageToWindow(stage);
screens.show("menu");
startLoop({
  update: dt => game.update(dt),
  render: () => renderer.render(game),
  step: PHYSICS.fixedStep,
  maxFrameTime: PHYSICS.maxFrameTime,
});
