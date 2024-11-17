import {
  CARD_FAMILIES,
  CARD_TYPES,
  DECK_STRUCTURE,
} from "../constants/gameConstants";

const createAndShuffleDecks = () => {
  const createDeck = (family) => {
    const deck = [];
    const structure = DECK_STRUCTURE[family];

    // Ajout des cartes normales
    structure.normalCards.forEach((value) => {
      deck.push({
        id: `${family}-normal-${value}-${Date.now()}`,
        type: CARD_TYPES.NORMAL,
        family,
        value,
      });
    });

    // Ajout des Sylops
    for (let i = 0; i < structure.sylopCount; i++) {
      deck.push({
        id: `${family}-sylop-${i}-${Date.now()}`,
        type: CARD_TYPES.SYLOP,
        family,
        value: null,
      });
    }

    // Ajout des Imposteurs
    for (let i = 0; i < structure.impostorCount; i++) {
      deck.push({
        id: `${family}-impostor-${i}-${Date.now()}`,
        type: CARD_TYPES.IMPOSTOR,
        family,
        value: null,
      });
    }

    // Mélanger le paquet
    return deck.sort(() => Math.random() - 0.5);
  };

  return {
    sandDeck: createDeck(CARD_FAMILIES.SAND),
    bloodDeck: createDeck(CARD_FAMILIES.BLOOD),
  };
};

export default createAndShuffleDecks;
