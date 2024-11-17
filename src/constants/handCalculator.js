// handCalculator.js
import { CARD_TYPES, HAND_TYPES } from "./cardDefinitions";

// Détermine si une carte est un Sylop
const isSylop = (card) => card.type === CARD_TYPES.SYLOP;

// Détermine la valeur finale d'une main
export const getHandValue = (hand) => {
  const [card1, card2] = hand;

  if (isSylop(card1) && isSylop(card2)) {
    return {
      type: HAND_TYPES.PURE_SABACC,
      value: 0,
      pairValue: 0,
    };
  }

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

  if (card1.value === card2.value) {
    return {
      type: HAND_TYPES.PAIR,
      value: 0,
      pairValue: card1.value,
    };
  }

  return {
    type: HAND_TYPES.DIFFERENCE,
    value: Math.abs(card1.value - card2.value),
    pairValue: null,
  };
};

export const compareHands = (hand1, hand2) => {
  const value1 = getHandValue(hand1);
  const value2 = getHandValue(hand2);

  if (value1.type !== value2.type) {
    const typeOrder = [
      HAND_TYPES.PURE_SABACC,
      HAND_TYPES.PAIR,
      HAND_TYPES.DIFFERENCE,
    ];
    return typeOrder.indexOf(value2.type) - typeOrder.indexOf(value1.type);
  }

  switch (value1.type) {
    case HAND_TYPES.PURE_SABACC:
      return 0;

    case HAND_TYPES.PAIR:
      if (value1.pairValue < value2.pairValue) return 1;
      if (value1.pairValue > value2.pairValue) return -1;
      return 0;

    case HAND_TYPES.DIFFERENCE:
      if (value1.value < value2.value) return 1;
      if (value1.value > value2.value) return -1;

      const sum1 = (hand1[0].value || 0) + (hand1[1].value || 0);
      const sum2 = (hand2[0].value || 0) + (hand2[1].value || 0);

      if (sum1 < sum2) return 1;
      if (sum1 > sum2) return -1;
      return 0;

    default:
      return 0;
  }
};
