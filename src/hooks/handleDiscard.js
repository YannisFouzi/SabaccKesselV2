import { CARD_FAMILIES } from "../constants/gameConstants";

const handleDiscard = ({
  cardToDiscard,
  pendingDrawnCard,
  players,
  currentPlayerIndex,
  setPlayers,
  setSandDecks,
  setBloodDecks,
  setPendingDrawnCard,
  nextPlayer,
}) => {
  if (!pendingDrawnCard || !cardToDiscard) return false;

  const currentPlayer = players[currentPlayerIndex];

  // Si on défausse la carte piochée
  if (cardToDiscard.id === pendingDrawnCard.id) {
    if (cardToDiscard.family === CARD_FAMILIES.SAND) {
      setSandDecks((prev) => ({
        ...prev,
        visible: [cardToDiscard],
      }));
    } else {
      setBloodDecks((prev) => ({
        ...prev,
        visible: [cardToDiscard],
      }));
    }
  } else {
    // Si on défausse une carte de la main, remplacer par la carte piochée
    const updatedHand = currentPlayer.hand.map((card) =>
      card.id === cardToDiscard.id ? pendingDrawnCard : card
    );

    // Placer la carte défaussée dans la pioche visible correspondante
    if (cardToDiscard.family === CARD_FAMILIES.SAND) {
      setSandDecks((prev) => ({
        ...prev,
        visible: [cardToDiscard],
      }));
    } else {
      setBloodDecks((prev) => ({
        ...prev,
        visible: [cardToDiscard],
      }));
    }

    setPlayers(
      players.map((player) =>
        player.id === currentPlayer.id
          ? { ...player, hand: updatedHand }
          : player
      )
    );
  }

  setPendingDrawnCard(null);
  nextPlayer(); // Passer au joueur suivant
  return true;
};

export default handleDiscard;
