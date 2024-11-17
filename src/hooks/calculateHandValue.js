// calculateHandValue.js

import { CARD_TYPES } from "../constants/gameConstants";

const calculateHandValue = (hand) => {
  if (hand.length !== 2) return Infinity;

  const [card1, card2] = hand;

  // Pour les sylops
  if (card1.type === CARD_TYPES.SYLOP && card2.type === CARD_TYPES.SYLOP) {
    return 0; // Sabacc pur
  }
  if (card1.type === CARD_TYPES.SYLOP || card2.type === CARD_TYPES.SYLOP) {
    return 0; // Le sylop prend la valeur de l'autre carte
  }

  // Pour les imposteurs
  if (
    (card1.type === CARD_TYPES.IMPOSTOR && !card1.value) ||
    (card2.type === CARD_TYPES.IMPOSTOR && !card2.value)
  ) {
    return null; // Valeur non encore déterminée
  }

  return Math.abs(card1.value - card2.value);
};

export default calculateHandValue;
