import { INITIAL_DICE_STATES } from "../constants/gameConstants";

const checkForTies = ({
  results,
  finalizeTurnOrder,
  setPlayersToReroll,
  setInitialDiceState,
  setInitialDiceResults,
}) => {
  const sums = Object.entries(results).map(([id, roll]) => ({
    playerId: parseInt(id),
    sum: roll.sum,
  }));

  const minSum = Math.min(...sums.map((s) => s.sum));
  const playersWithMinSum = sums
    .filter((s) => s.sum === minSum)
    .map((s) => s.playerId);

  if (playersWithMinSum.length === 1) {
    finalizeTurnOrder(playersWithMinSum[0], results);
  } else {
    setPlayersToReroll(playersWithMinSum);
    setInitialDiceState(INITIAL_DICE_STATES.REROLL_NEEDED);
    const newResults = { ...results };
    setInitialDiceResults(newResults);
  }
};

export default checkForTies;
