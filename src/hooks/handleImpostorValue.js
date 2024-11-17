const handleImpostorValue = ({
  value,
  pendingImpostors,
  currentImpostorIndex,
  players,
  setPlayers,
  setCurrentImpostorIndex,
  setDiceResults,
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

  // Passer à l'imposteur suivant
  setCurrentImpostorIndex((prev) => prev + 1);
  setDiceResults(null);

  return true;
};

export default handleImpostorValue;
