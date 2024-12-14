export const CARD_TYPES = {
  NORMAL: "NORMAL",
  SYLOP: "SYLOP",
  IMPOSTOR: "IMPOSTOR",
};

export const CARD_FAMILIES = {
  SAND: "SAND",
  BLOOD: "BLOOD",
};

export const HAND_TYPES = {
  PURE_SABACC: "PURE_SABACC", // Paire de Sylops
  PAIR: "PAIR", // Paire normale ou Sylop + carte
  DIFFERENCE: "DIFFERENCE", // Main avec différence
};

export const DECK_STRUCTURE = {
  [CARD_FAMILIES.SAND]: {
    normalCards: [1, 1, 1, 2, 2, 2, 3, 3, 3, 4, 4, 4, 5, 5, 5, 6, 6, 6],
    sylopCount: 1,
    impostorCount: 3,
  },
  [CARD_FAMILIES.BLOOD]: {
    normalCards: [1, 1, 1, 2, 2, 2, 3, 3, 3, 4, 4, 4, 5, 5, 5, 6, 6, 6],
    sylopCount: 1,
    impostorCount: 3,
  },
};
