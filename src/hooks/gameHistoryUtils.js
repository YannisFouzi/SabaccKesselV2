export const getHistorySinceLastTurn = (
  playerId,
  actionHistory,
  players,
  round,
  turn
) => {
  // Vérifications de sécurité
  if (!playerId || !actionHistory || actionHistory.length === 0) return [];
  if (!players || players.length === 0) return [];

  // Copie du tableau d'historique pour éviter les mutations
  const history = [...actionHistory];

  // Si c'est la première manche et le premier tour
  if (round === 1 && turn === 1) {
    return history.filter((action) => action.playerId !== playerId);
  }

  // Pour les autres tours
  const currentPlayerActions = history.filter(
    (action) => action.playerId === playerId
  );

  // Si le joueur n'a pas encore joué
  if (currentPlayerActions.length === 0) {
    return history.filter((action) => action.playerId !== playerId);
  }

  // Trouve le dernier index où le joueur a joué
  const lastActionIndex = history.findIndex(
    (action) => action.playerId === playerId
  );

  // Si on ne trouve pas d'action précédente du joueur, retourner tout l'historique sauf ses actions
  if (lastActionIndex === -1) {
    return history.filter((action) => action.playerId !== playerId);
  }

  // Retourne toutes les actions depuis la dernière action du joueur, en excluant ses propres actions
  return history
    .slice(lastActionIndex + 1)
    .filter((action) => action.playerId !== playerId);
};
