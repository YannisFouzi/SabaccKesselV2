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

  // Trouver l'index du joueur actuel dans l'ordre des joueurs
  const currentPlayerIndex = players.findIndex((p) => p.id === playerId);

  // Calculer les indices des N-1 joueurs précédents
  let previousPlayerIndices = [];
  for (let i = 1; i <= players.length - 1; i++) {
    const index = (currentPlayerIndex - i + players.length) % players.length;
    previousPlayerIndices.push(index);
  }
  previousPlayerIndices.reverse(); // Pour avoir les actions dans l'ordre du tour

  // Tableau pour stocker les actions des joueurs précédents
  let lastTurnActions = [];

  // Pour chaque joueur précédent
  for (const prevIndex of previousPlayerIndices) {
    const prevPlayer = players[prevIndex];
    let playerActions = [];
    let isCollectingActions = false;
    let foundPreviousPlayer = false;

    // Parcourir l'historique à l'envers
    for (let i = history.length - 1; i >= 0; i--) {
      const action = history[i];

      // Si on trouve une action du joueur qu'on cherche
      if (action.playerId === prevPlayer.id) {
        if (!foundPreviousPlayer) {
          // On commence à collecter les actions
          isCollectingActions = true;
          foundPreviousPlayer = true;
        }

        if (isCollectingActions) {
          playerActions.unshift(action);
        }
      }
      // Si on trouve une action d'un autre joueur après avoir commencé à collecter
      else if (foundPreviousPlayer && isCollectingActions) {
        // C'est la fin du tour du joueur précédent
        isCollectingActions = false;
        break;
      }
    }

    // Ajouter les actions de ce joueur à la liste
    if (playerActions.length > 0) {
      lastTurnActions = [...lastTurnActions, ...playerActions];
    }
  }

  return lastTurnActions;
};
