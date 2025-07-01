import { GAME_STATES, HAND_TYPES } from "../constants/gameConstants";

const calculatePenaltyTokens = (handValue) =>
  !handValue
    ? 0
    : handValue.type === HAND_TYPES.PAIR
    ? 1
    : handValue.type === HAND_TYPES.DIFFERENCE
    ? handValue.value
    : 0;

const calculatePlayerResults = (players, startingTokens, getHandValue) =>
  players.map((player) => {
    if (!player?.hand) {
      console.error("Player or player hand is undefined:", player);
      return {
        ...player,
        handValue: null,
        initialTokens: startingTokens[player?.id] || 0,
        tokensBet: 0,
      };
    }

    return {
      ...player,
      handValue: getHandValue(player.hand),
      initialTokens: startingTokens[player.id],
      tokensBet: startingTokens[player.id] - player.tokens,
    };
  });

const findBestHand = (playerResults, compareHands) => {
  const validPlayers = playerResults.filter((p) => p?.hand);
  return validPlayers.length === 0
    ? null
    : validPlayers.reduce(
        (best, current) =>
          compareHands(current.hand, best.hand) > 0 ? current : best,
        validPlayers[0]
      );
};

const findWinners = (playerResults, bestHand, compareHands) =>
  !bestHand
    ? []
    : playerResults.filter(
        (player) =>
          player?.hand && compareHands(player.hand, bestHand.hand) === 0
      );

const calculateFinalTokens = (player, isWinner) => {
  if (!player?.initialTokens) return 0;

  if (isWinner) return player.initialTokens;

  const penaltyTokens = calculatePenaltyTokens(player.handValue);
  return Math.max(0, player.initialTokens - player.tokensBet - penaltyTokens);
};

const calculateRoundResults = (
  players,
  startingTokens,
  getHandValue,
  compareHands
) => {
  const playerResults = calculatePlayerResults(
    players,
    startingTokens,
    getHandValue
  );
  const bestHand = findBestHand(playerResults, compareHands);
  const winners = findWinners(playerResults, bestHand, compareHands);

  return playerResults
    .map((player) => {
      if (!player) return null;

      const isWinner = winners.some((w) => w.id === player.id);
      const finalTokens = calculateFinalTokens(player, isWinner);

      return {
        ...player,
        tokens: finalTokens,
        isWinner,
        tokensBet: player.tokensBet || 0,
        penaltyTokens: isWinner ? 0 : calculatePenaltyTokens(player.handValue),
        isEliminated: finalTokens === 0,
      };
    })
    .filter(Boolean);
};

const getNextRoundStarter = (
  playerOrder,
  roundStartPlayer,
  remainingPlayers
) => {
  const newPlayerOrder = playerOrder.filter((playerId) =>
    remainingPlayers.some((player) => player.id === playerId)
  );

  const startingPlayerIndex = newPlayerOrder.findIndex(
    (id) => id === roundStartPlayer
  );
  return {
    nextStarter:
      newPlayerOrder[(startingPlayerIndex + 1) % newPlayerOrder.length],
    newPlayerOrder,
  };
};

const endRound = ({
  players,
  startingTokens,
  setGameState,
  setWinners,
  setPlayerOrder,
  setRoundStartPlayer,
  setPlayers,
  setRound,
  getHandValue,
  compareHands,
  playerOrder,
  roundStartPlayer,
  setLastPlayerBeforeReveal,
}) => {
  if (!Array.isArray(players) || !players.length) {
    console.error("Invalid players array:", players);
    return;
  }

  const roundResults = calculateRoundResults(
    players,
    startingTokens,
    getHandValue,
    compareHands
  );
  const remainingPlayers = roundResults.filter((player) => player?.tokens > 0);

  if (remainingPlayers.length <= 1) {
    setGameState(GAME_STATES.GAME_OVER);
    setWinners(remainingPlayers);
  } else {
    const { nextStarter, newPlayerOrder } = getNextRoundStarter(
      playerOrder,
      roundStartPlayer,
      remainingPlayers
    );

    setPlayerOrder(newPlayerOrder);
    setRoundStartPlayer(nextStarter);
    setPlayers(remainingPlayers);
    setRound((prev) => prev + 1);
    // Réinitialiser lastPlayerBeforeReveal pour la nouvelle manche
    setLastPlayerBeforeReveal(null);
    setGameState(GAME_STATES.SETUP);
  }

  return roundResults;
};

export { calculateRoundResults, endRound as default, getNextRoundStarter };
