const handleImpostorValue = ({
  value,
  pendingImpostors,
  currentImpostorIndex,
  players,
  setPlayers,
  setCurrentImpostorIndex,
  setPendingImpostors,
  setGameState,
  setDiceResults,
  GAME_STATES,
}) => {
  if (!pendingImpostors[currentImpostorIndex]) return false;

  const { playerId, cardId } = pendingImpostors[currentImpostorIndex];

  // Mise à jour de la valeur de l'imposteur
  setPlayers(
    players.map((player) => {
      if (player.id === playerId) {
        return {
          ...player,
          hand: player.hand.map((card) =>
            card.id === cardId ? { ...card, value } : card
          ),
        };
      }
      return player;
    })
  );

  // Passer à l'imposteur suivant ou terminer
  if (currentImpostorIndex + 1 < pendingImpostors.length) {
    setCurrentImpostorIndex((prev) => prev + 1);
    setDiceResults(null); // Réinitialiser les dés pour le prochain lancer
  } else {
    // Ajouter un délai avant de passer à l'état suivant
    setTimeout(() => {
      setGameState(GAME_STATES.REVEAL);
      setPendingImpostors([]);
      setCurrentImpostorIndex(0);
      setDiceResults(null);
    }, 1000);
  }

  return true;
};

export default handleImpostorValue;
