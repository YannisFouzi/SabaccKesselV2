export const passTurn = ({
  pendingDrawnCard,
  gameState,
  GAME_STATES,
  players,
  consecutivePasses,
  setConsecutivePasses,
  setGameState,
  nextPlayer,
  addToHistory,
  checkForImpostors, // Ajout de checkForImpostors comme paramètre
}) => {
  if (pendingDrawnCard) return false;
  if (gameState !== GAME_STATES.PLAYER_TURN) return false;

  setConsecutivePasses((prev) => {
    const newCount = prev + 1;
    // Si tous les joueurs ont passé
    if (newCount === players.length) {
      if (checkForImpostors()) {
        return 0;
      }
      // Passer directement à la révélation sans transition
      setGameState(GAME_STATES.REVEAL);
      return 0;
    }
    return newCount;
  });

  // Appeler nextPlayer seulement si ce n'est pas la fin de la manche
  if (consecutivePasses + 1 < players.length) {
    nextPlayer();
  }

  addToHistory({
    type: "PASS",
  });

  return true;
};
