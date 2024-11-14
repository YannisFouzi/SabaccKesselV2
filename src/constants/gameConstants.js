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

// Types de résultats possibles pour une main
export const HAND_TYPES = {
  PURE_SABACC: "PURE_SABACC", // Paire de Sylops
  PAIR: "PAIR", // Paire normale ou Sylop + carte
  DIFFERENCE: "DIFFERENCE", // Main avec différence
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
    normalCards: [1, 2, 3, 4, 5, 6],
    sylopCount: 1,
    impostorCount: 3,
  },
  [CARD_FAMILIES.BLOOD]: {
    normalCards: [1, 2, 3, 4, 5, 6],
    sylopCount: 1,
    impostorCount: 3,
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

// Détermine si une carte est un Sylop
const isSylop = (card) => card.type === CARD_TYPES.SYLOP;

// Détermine la valeur finale d'une main
export const getHandValue = (hand) => {
  const [card1, card2] = hand;

  // Cas 1: Paire de Sylops (meilleure main possible)
  if (isSylop(card1) && isSylop(card2)) {
    return {
      type: HAND_TYPES.PURE_SABACC,
      value: 0,
      pairValue: 0,
    };
  }

  // Cas 2: Main avec un Sylop
  if (isSylop(card1)) {
    return {
      type: HAND_TYPES.PAIR,
      value: 0,
      pairValue: card2.value,
    };
  }
  if (isSylop(card2)) {
    return {
      type: HAND_TYPES.PAIR,
      value: 0,
      pairValue: card1.value,
    };
  }

  // Cas 3: Paire naturelle
  if (card1.value === card2.value) {
    return {
      type: HAND_TYPES.PAIR,
      value: 0,
      pairValue: card1.value,
    };
  }

  // Cas 4: Main avec différence
  return {
    type: HAND_TYPES.DIFFERENCE,
    value: Math.abs(card1.value - card2.value),
    pairValue: null,
  };
};

// Fonction pour comparer deux mains
export const compareHands = (hand1, hand2) => {
  const value1 = getHandValue(hand1);
  const value2 = getHandValue(hand2);

  // Si les types sont différents
  if (value1.type !== value2.type) {
    // PURE_SABACC > PAIR > DIFFERENCE
    const typeOrder = [
      HAND_TYPES.PURE_SABACC,
      HAND_TYPES.PAIR,
      HAND_TYPES.DIFFERENCE,
    ];
    const index1 = typeOrder.indexOf(value1.type);
    const index2 = typeOrder.indexOf(value2.type);
    if (index1 < index2) return 1;
    if (index1 > index2) return -1;
  }

  // Si même type
  switch (value1.type) {
    case HAND_TYPES.PURE_SABACC:
      return 0; // Égalité pour deux paires de Sylops

    case HAND_TYPES.PAIR:
      // Plus petite paire gagne TOUJOURS
      if (value1.pairValue < value2.pairValue) return 1; // hand1 gagne
      if (value1.pairValue > value2.pairValue) return -1; // hand2 gagne
      return 0; // égalité si même valeur

    case HAND_TYPES.DIFFERENCE:
      // D'abord comparer les différences
      if (value1.value < value2.value) return 1;
      if (value1.value > value2.value) return -1;

      // Si même différence, comparer les plus petites cartes
      const minCard1 = Math.min(
        hand1[0].value || Infinity,
        hand1[1].value || Infinity
      );
      const minCard2 = Math.min(
        hand2[0].value || Infinity,
        hand2[1].value || Infinity
      );

      if (minCard1 < minCard2) return 1;
      if (minCard1 > minCard2) return -1;

      // Si même petite carte, comparer les grandes cartes
      const maxCard1 = Math.max(hand1[0].value || 0, hand1[1].value || 0);
      const maxCard2 = Math.max(hand2[0].value || 0, hand2[1].value || 0);

      if (maxCard1 < maxCard2) return 1;
      if (maxCard1 > maxCard2) return -1;

      return 0;

    default:
      return 0;
  }
};
