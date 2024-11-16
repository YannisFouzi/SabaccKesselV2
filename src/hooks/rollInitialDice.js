import { GAME_STATES, INITIAL_DICE_STATES } from "../constants/gameConstants";

const rollInitialDice =
  ({
    gameState,
    initialDiceState,
    initialDiceResults,
    rerollResults,
    playersToReroll,
    players,
    setInitialDiceResults,
    setRerollResults,
    checkForTies,
    setPlayersToReroll,
    finalizeTurnOrder,
  }) =>
  (playerId) => {
    if (gameState !== GAME_STATES.INITIAL_DICE_ROLL) return false;

    const dice1 = Math.floor(Math.random() * 6) + 1;
    const dice2 = Math.floor(Math.random() * 6) + 1;
    const sum = dice1 + dice2;

    if (initialDiceState === INITIAL_DICE_STATES.REROLL_NEEDED) {
      setRerollResults((prev) => ({
        ...prev,
        [playerId]: { dice1, dice2, sum },
      }));
    } else {
      setInitialDiceResults((prev) => ({
        ...prev,
        [playerId]: { dice1, dice2, sum },
      }));
    }

    if (initialDiceState !== INITIAL_DICE_STATES.REROLL_NEEDED) {
      const updatedResults = {
        ...initialDiceResults,
        [playerId]: { dice1, dice2, sum },
      };

      if (Object.keys(updatedResults).length === players.length) {
        checkForTies(updatedResults);
      }
    } else {
      const updatedRerolls = {
        ...rerollResults,
        [playerId]: { dice1, dice2, sum },
      };

      if (Object.keys(updatedRerolls).length === playersToReroll.length) {
        const newSums = Object.entries(updatedRerolls).map(([id, roll]) => ({
          playerId: parseInt(id),
          sum: roll.sum,
        }));

        const minSum = Math.min(...newSums.map((s) => s.sum));
        const winners = newSums
          .filter((s) => s.sum === minSum)
          .map((s) => s.playerId);

        if (winners.length === 1) {
          finalizeTurnOrder(winners[0], initialDiceResults);
        } else {
          setPlayersToReroll(winners);
          setRerollResults({});
        }
      }
    }

    return true;
  };

export default rollInitialDice;
