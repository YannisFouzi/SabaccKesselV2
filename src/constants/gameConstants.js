export * from "./cardDefinitions";
export * from "./gameConfig";
export * from "./handCalculator";

export const JOKERS = {
  A: { id: "A", quantity: 3 },
  B: { id: "B", quantity: 2 },
  C: { id: "C", quantity: 1 },
  D: { id: "D", quantity: 1 },
  E: { id: "E", quantity: 1 },
  F: { id: "F", quantity: 1 },
  G: { id: "G", quantity: 1 },
  H: { id: "H", quantity: 1 },
  I: { id: "I", quantity: 3 },
  J: { id: "J", quantity: 2 },
  K: { id: "K", quantity: 1 },
  L: { id: "L", quantity: 1 },
  M: { id: "M", quantity: 2 },
  N: { id: "N", quantity: 2 },
  O: { id: "O", quantity: 1 },
  P: { id: "P", quantity: 1 },
};

export const GAME_STATES = {
  JOKER_SELECTION: "JOKER_SELECTION",
  INITIAL_DICE_ROLL: "INITIAL_DICE_ROLL",
  SETUP: "SETUP",
  PLAYER_TURN: "PLAYER_TURN",
  REVEAL: "REVEAL",
  END_ROUND: "END_ROUND",
  GAME_OVER: "GAME_OVER",
};
