export * from "./cardDefinitions";
export * from "./gameConfig";
export * from "./handCalculator";

export const JOKERS = {
  A: {
    id: "A",
    quantity: 3,
    title: "Tirage Gratuit",
    description: "Vous ne payez pas de frais de pioche lors de ce tour.",
    enabled: true,
  },
  B: {
    id: "B",
    quantity: 2,
    title: "Remboursement",
    description: "Récupèrez 2 jetons de mise.",
    enabled: true,
  },
  C: {
    id: "C",
    quantity: 1,
    title: "Remboursement Extra",
    description: "Récupère 3 jetons de mise.",
    enabled: true,
  },
  D: {
    id: "D",
    quantity: 1,
    title: "Détournement de fonds",
    description:
      "Prenez 1 jeton de mise dans chaque pot adverse et ajoutez-les à votre pot.",
    enabled: true,
  },
  E: {
    id: "E",
    quantity: 1,
    title: "Fraude Majeure",
    description:
      "La valeur de l'imposteur est de 6 points jusqu'au prochain dévoilement de carte.",
    enabled: true,
  },
  F: {
    id: "F",
    quantity: 1,
    title: "Falsification de comptes",
    description: "Inversez les rangs de sabacc jusqu'au prochain dévoilement.",
    enabled: false,
  },
  G: {
    id: "G",
    quantity: 1,
    title: "Rabais",
    description:
      "La valeur du Sylop est de 0 point jusqu'au prochain dévoilement de carte.",
    enabled: false,
  },
  H: {
    id: "H",
    quantity: 1,
    title: "Sabacc supérieur",
    description:
      "Lancez 2 dés. Choisissez l'un des résultats : il s'agira de la nouvelle valeur du meilleur sabacc.",
    enabled: false,
  },
  I: {
    id: "I",
    quantity: 3,
    title: "Taxe générale",
    description: "On prélève 1 jeton de mise à tous les autres joueurs.",
    enabled: false,
  },
  J: {
    id: "J",
    quantity: 2,
    title: "Taxe ciblée",
    description: "Désignez un joueur. On lui prélève 2 jetons de mise.",
    enabled: false,
  },
  K: {
    id: "K",
    quantity: 1,
    title: "Audit Général",
    description:
      "On prélève 2 jetons de mise à tous les autres joueur ayant passé leur tour.",
    enabled: false,
  },
  L: {
    id: "L",
    quantity: 1,
    title: "Audit ciblé",
    description:
      "Désignez un joueur qui a passé son tour. On lui prélève 3 jetons de mise.",
    enabled: false,
  },
  M: {
    id: "M",
    quantity: 2,
    title: "Embargo",
    description: "Le joueur suivant passe son tour.",
    enabled: false,
  },
  N: {
    id: "N",
    quantity: 1,
    title: "Immunité",
    description:
      "Vous protège des effets des autres jetons d'action jusqu'au prochain dévoilement des cartes.",
    enabled: false,
  },
  O: {
    id: "O",
    quantity: 2,
    title: "Épuisement",
    description:
      "Désignez un joueur. Il doit défausser sa main et en piocher une nouvelle.",
    enabled: false,
  },
  P: {
    id: "P",
    quantity: 2,
    title: "Transaction directe",
    description: "Désignez un joueur. Vous échangez vos mains.",
    enabled: false,
  },
};

export const GAME_STATES = {
  JOKER_SELECTION: "JOKER_SELECTION",
  INITIAL_DICE_ROLL: "INITIAL_DICE_ROLL",
  SETUP: "SETUP",
  PLAYER_TURN: "PLAYER_TURN",
  REVEAL: "REVEAL",
  END_ROUND: "END_ROUND",
  GAME_OVER: "GAME_OVER",
  USE_JOKER: "USE_JOKER",
};

export const GAME_CONFIG = {
  MIN_PLAYERS: 2,
  MAX_PLAYERS: 6,
  MIN_TOKENS: 4,
  MAX_TOKENS: 100,
  MAX_NAME_LENGTH: 20,
};
