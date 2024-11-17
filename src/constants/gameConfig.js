export const GAME_CONFIG = {
  MIN_PLAYERS: 3,
  MAX_PLAYERS: 4,
  MIN_TOKENS: 4,
  MAX_TOKENS: 12,
  ROUNDS_PER_TURN: 3,
  CARDS_PER_HAND: 2,
};

export const GAME_STATES = {
  INITIAL_DICE_ROLL: "INITIAL_DICE_ROLL",
  SETUP: "SETUP",
  PLAYER_TURN: "PLAYER_TURN",
  DICE_ROLL: "DICE_ROLL",
  REVEAL: "REVEAL",
  END_ROUND: "END_ROUND",
  GAME_OVER: "GAME_OVER",
  ROUND_START: "ROUND_START",
};

export const INITIAL_DICE_STATES = {
  WAITING: "WAITING",
  ROLLING: "ROLLING",
  REROLL_NEEDED: "REROLL_NEEDED",
  COMPLETED: "COMPLETED",
};

export const PLAYER_ACTIONS = {
  DRAW_VISIBLE: "DRAW_VISIBLE",
  DRAW_HIDDEN: "DRAW_HIDDEN",
  PASS: "PASS",
};