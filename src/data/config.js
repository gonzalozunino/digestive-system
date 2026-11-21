// Game tuning. Change numbers here, not in gameplay code.

/** Logical canvas size; the stage is scaled to fit the window. */
export const VIEW = { width: 960, height: 540 };

export const WORLD = {
  groundY: 452,        // y of the floor line
  tile: 40,            // size of one obstacle tile in px
  playerScreenX: 230,  // where the player sits horizontally on screen
  menuScrollSpeed: 120,
};

export const PHYSICS = {
  gravity: 2700,
  jumpVelocity: 770,   // ~110px high, ~0.57s in the air
  jumpBuffer: 0.14,    // a jump pressed slightly before landing still counts
  airSpinTime: 0.57,   // one full turn per jump
  fixedStep: 1 / 120,
  maxFrameTime: 0.1,
};

export const PLAYER = {
  size: 36,
  invulnerableTime: 1.6,
  landingTolerance: 12,               // px above a block's top that still counts as landing
  spikeHitbox: { insetX: 12, insetTop: 14 },
  playerHitbox: { insetX: 6, insetBottom: 4 },
  blockSideInset: 2,
};

// obstacleBoost: how many stages ahead the obstacle mix starts (harder patterns earlier).
export const DIFFICULTY = {
  easy:   { hearts: 5, speedFactor: 0.85, gapTiles: [6, 9],   musicTempo: 0.92, obstacleBoost: 0 },
  normal: { hearts: 3, speedFactor: 1,    gapTiles: [5, 8],   musicTempo: 1,    obstacleBoost: 0 },
  hard:   { hearts: 2, speedFactor: 1.15, gapTiles: [5, 7.5], musicTempo: 1.08, obstacleBoost: 1 },
};
export const DEFAULT_DIFFICULTY = "easy";

// Speed grows with each stage, up to `maxStageSteps` stages (topics may have many stages).
export const SPEED = { base: 400, perStage: 38, maxStageSteps: 4 };

/** How a stage is laid out along the x axis (px unless noted). */
export const LAYOUT = {
  startX: 700,
  questionsPerStage: 3,
  patternsBeforeQuestion: 4,   // + stage index + question index
  patternsBeforeGoal: 4,       // + stage index
  gapShrinkPerStage: 0.04,
  beforePortal: 160,
  afterPortal: 560,            // obstacle-free run after a question
  heartAfterQuestion: 1,       // which question is followed by a heart pickup (0-based)
  heartOffset: 260,
  beforeGoal: 200,
};

export const ITEM_SIZES = {
  collectibleRadius: 11,
  heartRadius: 15,
  heartLift: 70,
  portal: { w: 70, h: 170 },
  goal: { w: 90, h: 200 },
};

export const SCORING = {
  collectible: 10,
  heartWhenFull: 50,
  correctAnswer: 100,
  streakBonus: 50,     // extra points per answer already in the streak
  stageComplete: 200,
};

export const TIMING = {
  shakeDecay: 40,
  hitShake: 14,
  wrongAnswerShake: 10,
  deathDelay: 0.9,
  nextStageDelay: 0.9,
  victoryDelay: 0.7,
};

export const QUIZ = {
  sequenceQuestionChance: 0.35,  // chance the general slot uses a generated sequence/category question
};

export const RECORDS = { max: 10, nameMaxLength: 12 };

export const AUDIO = { masterVolume: 0.8, musicVolume: 0.32, sfxVolume: 0.6 };

/** Preferences are shared by all topics; records and question history are kept per topic. */
export const STORAGE_KEYS = {
  muted: "tr.muted",
  difficulty: "tr.difficulty",
  character: "tr.character",
  lastName: "tr.lastName",
  records: topicId => `tr.${topicId}.records`,
  seenQuestions: topicId => `tr.${topicId}.seen`,
};
