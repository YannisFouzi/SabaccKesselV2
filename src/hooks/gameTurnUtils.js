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
  checkForImpostors,
  currentPlayerIndex,
  setLastPlayerBeforeReveal,
}) => {
  if (pendingDrawnCard) return false;
  if (gameState !== GAME_STATES.PLAYER_TURN) return false;

  const newCount = consecutivePasses + 1;

  // Si tous les joueurs ont passé
  if (newCount === players.length) {
    // Stocker l'ID du joueur actuel au lieu de son index
    setLastPlayerBeforeReveal(players[currentPlayerIndex].id);

    checkForImpostors();
    setGameState(GAME_STATES.REVEAL);
    setConsecutivePasses(0);
    return true;
  }

  // Si ce n'est pas la fin, on incrémente le compteur et on passe au joueur suivant
  setConsecutivePasses(newCount);
  nextPlayer();

  addToHistory({
    type: "PASS",
  });

  return true;
};
