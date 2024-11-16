import { CARD_FAMILIES, GAME_STATES } from "../constants/gameConstants";

const drawCard = ({
  family,
  isVisible,
  card = null,
  pendingDrawnCard,
  currentPlayerIndex,
  players,
  sandDecks,
  bloodDecks,
  setPlayers,
  setPendingDrawnCard,
  setConsecutivePasses,
  setSandDecks,
  setBloodDecks,
  gameState,
}) => {
  const currentPlayer = players[currentPlayerIndex];

  // Vérifications préalables
  if (pendingDrawnCard) return false;
  if (currentPlayer.tokens < 1) return false;
  if (gameState !== GAME_STATES.PLAYER_TURN) return false;

  let drawnCard = card;

  if (isVisible) {
    if (family === CARD_FAMILIES.SAND) {
      setSandDecks((prev) => ({
        ...prev,
        visible: [],
      }));
    } else {
      setBloodDecks((prev) => ({
        ...prev,
        visible: [],
      }));
    }
  } else {
    const sourceDeck =
      family === CARD_FAMILIES.SAND ? sandDecks.hidden : bloodDecks.hidden;
    if (sourceDeck.length === 0) return false;

    drawnCard = sourceDeck[0];
    if (family === CARD_FAMILIES.SAND) {
      setSandDecks((prev) => ({
        ...prev,
        hidden: prev.hidden.slice(1),
      }));
    } else {
      setBloodDecks((prev) => ({
        ...prev,
        hidden: prev.hidden.slice(1),
      }));
    }
  }

  // Déduire un jeton du joueur
  setPlayers(
    players.map((player) =>
      player.id === currentPlayer.id
        ? { ...player, tokens: player.tokens - 1 }
        : player
    )
  );

  setPendingDrawnCard(drawnCard);
  setConsecutivePasses(0);
  return true;
};

export default drawCard;
