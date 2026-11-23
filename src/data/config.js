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
  padVelocity: 1000,   // jump pads launch ~185px high
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

/**
 * Level difficulties, easiest first. Every level has one (topics set `difficulty` on each level).
 *   hearts       lives at the start          speedFactor  x SPEED.base
 *   gapTiles     space between patterns      patterns     obstacle patterns before each question
 *   questions    question portals            musicTempo   x the level's music tempo
 * Which obstacle patterns appear is set in data/obstaclePatterns.js (OBSTACLE_POOLS).
 */
export const DIFFICULTY = {
  facil:         { hearts: 5, speedFactor: 0.85, gapTiles: [6, 9],     patterns: 4, questions: 3, musicTempo: 0.92 },
  normal:        { hearts: 4, speedFactor: 0.95, gapTiles: [5.5, 8.5], patterns: 5, questions: 3, musicTempo: 1 },
  dificil:       { hearts: 3, speedFactor: 1.05, gapTiles: [5, 8],     patterns: 5, questions: 3, musicTempo: 1.04 },
  "muy-dificil": { hearts: 3, speedFactor: 1.12, gapTiles: [5, 7.5],   patterns: 6, questions: 4, musicTempo: 1.08 },
  extremo:       { hearts: 2, speedFactor: 1.2,  gapTiles: [5, 7],     patterns: 6, questions: 4, musicTempo: 1.12 },
  demonio:       { hearts: 2, speedFactor: 1.28, gapTiles: [5.5, 7],   patterns: 7, questions: 5, musicTempo: 1.16 },
};
export const DIFFICULTY_ORDER = Object.keys(DIFFICULTY);

export const SPEED = { base: 400 };

/** How a level is laid out along the x axis (px unless noted). */
export const LAYOUT = {
  startX: 700,
  extraPatternsPerSection: 1,  // each section between questions gets this many more patterns than the last
  beforePortal: 160,
  afterPortal: 560,            // obstacle-free run after a question
  heartAfterQuestion: 1,       // which question is followed by a heart pickup (0-based)
  heartOffset: 260,
  beforeGoal: 200,
};

export const ITEM_SIZES = {
  pad: { w: 40, h: 10 },
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
  levelComplete: 200,
};

export const TIMING = {
  shakeDecay: 40,
  hitShake: 14,
  wrongAnswerShake: 10,
  deathDelay: 0.9,
  victoryDelay: 0.7,
};

export const QUIZ = {
  sequenceQuestionChance: 0.35,  // in levels with general questions: chance of a generated sequence/category one
};

export const RECORDS = { max: 10, nameMaxLength: 12 };

export const AUDIO = { masterVolume: 0.8, musicVolume: 0.32, sfxVolume: 0.6 };

/** Preferences are shared by all topics; records, level progress and question history are per topic. */
export const STORAGE_KEYS = {
  muted: "tr.muted",
  character: "tr.character",
  lastName: "tr.lastName",
  records: topicId => `tr.${topicId}.records.v2`,
  progress: topicId => `tr.${topicId}.progress`,
  seenQuestions: topicId => `tr.${topicId}.seen`,
};
