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
}) => {
  if (pendingDrawnCard) return false;
  if (gameState !== GAME_STATES.PLAYER_TURN) return false;

  const newCount = consecutivePasses + 1;

  // Si tous les joueurs ont passé
  if (newCount === players.length) {
    checkForImpostors(); // On vérifie d'abord les imposteurs
    setGameState(GAME_STATES.REVEAL); // On passe directement à la révélation
    setConsecutivePasses(0); // On réinitialise le compteur
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
