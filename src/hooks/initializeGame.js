import { GAME_STATES } from "../constants/gameConstants";

const initializeGame = ({
  players,
  initialPlayerCount,
  initialTokenCount,
  playerOrder,
  setPlayers,
  setSandDecks,
  setBloodDecks,
  setCurrentPlayerIndex,
  setRoundStartPlayer,
  setPendingDrawnCard,
  setDiceResults,
  setConsecutivePasses,
  setTurn,
  setStartingTokens,
  setGameState,
  round,
  createAndShuffleDecks,
  drawCardFromDeck,
}) => {
  // Création ou récupération des joueurs avec copie profonde
  const newPlayers =
    players.length > 0
      ? players.map((player) => ({
          ...player,
          tokens: player.tokens, // Conserver les jetons actuels
        }))
      : Array(initialPlayerCount)
          .fill(null)
          .map((_, index) => ({
            id: index + 1,
            name: `Joueur ${index + 1}`,
            tokens: initialTokenCount,
          }));

  // Si un ordre de joueurs est défini, les organiser dans cet ordre
  if (playerOrder.length > 0) {
    const orderedPlayers = playerOrder.map((id) =>
      newPlayers.find((p) => p.id === id)
    );

    newPlayers.length = 0;
    newPlayers.push(...orderedPlayers);
  }

  // Stocker les jetons initiaux de chaque joueur
  const newStartingTokens = {};
  newPlayers.forEach((player) => {
    newStartingTokens[player.id] = player.tokens;
  });
  setStartingTokens(newStartingTokens);

  // Mélanger et créer les paquets
  const { sandDeck, bloodDeck } = createAndShuffleDecks();

  // Distribution des nouvelles cartes
  newPlayers.forEach((player) => {
    player.hand = [drawCardFromDeck(sandDeck), drawCardFromDeck(bloodDeck)];
  });

  // Mise en place des pioches visibles
  setSandDecks({
    visible: [drawCardFromDeck(sandDeck)],
    hidden: sandDeck,
  });

  setBloodDecks({
    visible: [drawCardFromDeck(bloodDeck)],
    hidden: bloodDeck,
  });

  if (round > 1) {
    // Utiliser le roundStartPlayer défini dans la manche précédente
    setCurrentPlayerIndex(newPlayers.findIndex((p) => p.id === playerOrder[0]));
  } else {
    // Première manche : le joueur ayant obtenu le score le plus bas commence
    setCurrentPlayerIndex(0);
    setRoundStartPlayer(playerOrder[0]);
  }

  // Réinitialisation des états
  setPendingDrawnCard(null);
  setDiceResults(null);
  setConsecutivePasses(0);
  setTurn(1);
  setPlayers(newPlayers);

  // Passer à l'état PLAYER_TURN
  setGameState(GAME_STATES.PLAYER_TURN);
};

export default initializeGame;
