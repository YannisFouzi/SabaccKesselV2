import { GAME_STATES, HAND_TYPES } from "../constants/gameConstants";

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
}) => {
  // Calculer les valeurs finales des mains
  const playerResults = players.map((player) => ({
    ...player,
    handValue: getHandValue(player.hand),
    initialTokens: startingTokens[player.id],
    tokensBet: startingTokens[player.id] - player.tokens,
  }));

  // Trouver la meilleure main
  let bestHand = playerResults[0];
  playerResults.slice(1).forEach((player) => {
    if (compareHands(player.hand, bestHand.hand) > 0) {
      bestHand = player;
    }
  });

  // Trouver tous les gagnants (peut y avoir égalité)
  const winners = playerResults.filter(
    (player) => compareHands(player.hand, bestHand.hand) === 0
  );

  // Appliquer les pertes de jetons et restituer les mises aux gagnants
  const updatedPlayers = playerResults.map((player) => {
    const isWinner = winners.some((w) => w.id === player.id);

    let finalTokens = player.initialTokens;

    if (!isWinner) {
      // Les perdants :
      // 1. Perdent leurs mises
      finalTokens -= player.tokensBet;

      // 2. Perdent des jetons de pénalité
      let penaltyTokens = 0;
      if (player.handValue.type === HAND_TYPES.PAIR) {
        penaltyTokens = 1;
      } else if (player.handValue.type === HAND_TYPES.DIFFERENCE) {
        penaltyTokens = player.handValue.value;
      }
      finalTokens = Math.max(0, finalTokens - penaltyTokens);
    }

    return {
      ...player,
      tokens: finalTokens,
    };
  });

  // Éliminer les joueurs sans jetons
  const remainingPlayers = updatedPlayers.filter((player) => player.tokens > 0);

  if (remainingPlayers.length <= 1) {
    setGameState(GAME_STATES.GAME_OVER);
    setWinners(remainingPlayers);
  } else {
    // Mettre à jour l'ordre des joueurs en retirant les joueurs éliminés
    const newPlayerOrder = playerOrder.filter((playerId) =>
      remainingPlayers.some((player) => player.id === playerId)
    );

    // Déterminer le joueur qui commence la prochaine manche
    const startingPlayerIndex = newPlayerOrder.findIndex(
      (id) => id === roundStartPlayer
    );
    const nextStarterIndex = (startingPlayerIndex + 1) % newPlayerOrder.length;
    const nextStarter = newPlayerOrder[nextStarterIndex];

    setPlayerOrder(newPlayerOrder);
    setRoundStartPlayer(nextStarter);
    setPlayers(remainingPlayers);
    setRound((prev) => prev + 1);
    setGameState(GAME_STATES.SETUP);
  }
};

export default endRound;
