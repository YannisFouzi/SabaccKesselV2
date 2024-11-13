// Types de cartes
export const CARD_TYPES = {
  NORMAL: "NORMAL",
  SYLOP: "SYLOP",
  IMPOSTOR: "IMPOSTOR",
};

// Familles de cartes
export const CARD_FAMILIES = {
  SAND: "SAND",
  BLOOD: "BLOOD",
};

// Configuration du jeu
export const GAME_CONFIG = {
  MIN_PLAYERS: 3,
  MAX_PLAYERS: 4,
  MIN_TOKENS: 4,
  MAX_TOKENS: 12,
  ROUNDS_PER_TURN: 3,
  CARDS_PER_HAND: 2,
};

// Structure des cartes du jeu
export const DECK_STRUCTURE = {
  [CARD_FAMILIES.SAND]: {
    normalCards: [1, 2, 3, 4, 5, 6], // Cartes normales de 1 à 6
    sylopCount: 1, // Un sylop par famille
    impostorCount: 3, // Trois imposteurs par famille
  },
  [CARD_FAMILIES.BLOOD]: {
    normalCards: [1, 2, 3, 4, 5, 6], // Cartes normales de 1 à 6
    sylopCount: 1, // Un sylop par famille
    impostorCount: 3, // Trois imposteurs par famille
  },
};

// États possibles du jeu
export const GAME_STATES = {
  SETUP: "SETUP",
  PLAYER_TURN: "PLAYER_TURN",
  DICE_ROLL: "DICE_ROLL",
  REVEAL: "REVEAL",
  END_ROUND: "END_ROUND",
  GAME_OVER: "GAME_OVER",
};

// Actions possibles pendant le tour d'un joueur
export const PLAYER_ACTIONS = {
  DRAW_VISIBLE: "DRAW_VISIBLE",
  DRAW_HIDDEN: "DRAW_HIDDEN",
  PASS: "PASS",
};

// Fonction pour calculer la différence entre deux cartes
export const calculateHandValue = (card1, card2) => {
  // Pour les sylops, la valeur est la même que l'autre carte
  if (card1.type === CARD_TYPES.SYLOP) {
    return 0; // Une paire parfaite
  }
  if (card2.type === CARD_TYPES.SYLOP) {
    return 0; // Une paire parfaite
  }

  // Pour les imposteurs, la valeur sera déterminée par les dés
  // pendant la phase de révélation
  if (
    card1.type === CARD_TYPES.IMPOSTOR ||
    card2.type === CARD_TYPES.IMPOSTOR
  ) {
    return null; // La valeur sera déterminée plus tard
  }

  return Math.abs(card1.value - card2.value);
};

// Fonction pour vérifier si une main est un Sabacc
export const isSabacc = (card1, card2) => {
  // Si l'une des cartes est un imposteur, on ne peut pas encore savoir
  if (
    card1.type === CARD_TYPES.IMPOSTOR ||
    card2.type === CARD_TYPES.IMPOSTOR
  ) {
    return null;
  }

  // Un Sabacc pur est une paire de sylops
  if (card1.type === CARD_TYPES.SYLOP && card2.type === CARD_TYPES.SYLOP) {
    return "PURE";
  }

  // Un Sabacc normal est quand la différence est de 0
  return calculateHandValue(card1, card2) === 0;
};

// Fonction pour comparer deux mains
export const compareHands = (hand1, hand2) => {
  const value1 = calculateHandValue(hand1.card1, hand1.card2);
  const value2 = calculateHandValue(hand2.card1, hand2.card2);

  // Si les deux mains sont des Sabaccs
  if (
    isSabacc(hand1.card1, hand1.card2) &&
    isSabacc(hand2.card1, hand2.card2)
  ) {
    // Le Sabacc pur gagne toujours
    if (isSabacc(hand1.card1, hand1.card2) === "PURE") return 1;
    if (isSabacc(hand2.card1, hand2.card2) === "PURE") return -1;
    return 0; // Égalité pour les Sabaccs normaux
  }

  // Si une seule main est un Sabacc
  if (isSabacc(hand1.card1, hand1.card2)) return 1;
  if (isSabacc(hand2.card1, hand2.card2)) return -1;

  // Sinon, on compare les différences
  if (value1 < value2) return 1;
  if (value1 > value2) return -1;

  // En cas d'égalité de différence, on compare les valeurs des cartes
  const minHand1 = Math.min(hand1.card1.value, hand1.card2.value);
  const minHand2 = Math.min(hand2.card1.value, hand2.card2.value);

  return minHand1 < minHand2 ? 1 : minHand1 > minHand2 ? -1 : 0;
};
