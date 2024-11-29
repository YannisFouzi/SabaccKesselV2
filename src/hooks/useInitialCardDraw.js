import { useEffect, useState } from "react";
import { CARD_FAMILIES, CARD_TYPES } from "../constants/gameConstants";

export const useInitialCardDraw = (
  players,
  setGameState,
  GAME_STATES,
  setPlayerOrder
) => {
  const [availableCards, setAvailableCards] = useState([]);
  const [drawnCards, setDrawnCards] = useState({});
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(null);
  const [revealCards, setRevealCards] = useState(false);
  const [winner, setWinner] = useState(null);
  const [gameOrder, setGameOrder] = useState([]);
  const [showStartButton, setShowStartButton] = useState(false);

  useEffect(() => {
    const initialDeck = [
      {
        id: "sylop",
        type: CARD_TYPES.SYLOP,
        family: CARD_FAMILIES.SAND,
        value: null,
      },
      ...Array(players.length - 1)
        .fill()
        .map((_, index) => ({
          id: `normal-${index}`,
          type: CARD_TYPES.NORMAL,
          family: CARD_FAMILIES.SAND,
          value: index + 1,
        })),
    ].sort(() => Math.random() - 0.5);

    setAvailableCards(initialDeck);

    const randomStartIndex = Math.floor(Math.random() * players.length);
    setCurrentPlayerIndex(randomStartIndex);
  }, [players]);

  const handleCardSelect = (cardIndex) => {
    const selectedCard = availableCards[cardIndex];
    const currentPlayer = players[currentPlayerIndex];

    const newDrawnCards = {
      ...drawnCards,
      [currentPlayer.id]: selectedCard,
    };
    setDrawnCards(newDrawnCards);

    const remaining = availableCards.filter((_, index) => index !== cardIndex);
    setAvailableCards(remaining);

    const nextPlayerIndex = (currentPlayerIndex + 1) % players.length;

    if (Object.keys(newDrawnCards).length === players.length) {
      determineWinnerAndOrder(newDrawnCards);
    } else {
      setCurrentPlayerIndex(nextPlayerIndex);
    }
  };

  const determineWinnerAndOrder = (finalDrawnCards) => {
    setRevealCards(true);

    const winningPlayer = players.find(
      (player) => finalDrawnCards[player.id]?.type === CARD_TYPES.SYLOP
    );

    const winner = winningPlayer || players[0];
    setWinner(winner);

    const winnerIndex = players.findIndex((p) => p.id === winner.id);
    const order = [];

    for (let i = 0; i < players.length; i++) {
      const index = (winnerIndex + i) % players.length;
      order.push(players[index].id);
    }

    setGameOrder(order);
    setPlayerOrder(order);

    setTimeout(() => {
      setShowStartButton(true);
    }, 2000);
  };

  const handleStartGame = () => {
    setGameState(GAME_STATES.SETUP);
  };

  return {
    availableCards,
    drawnCards,
    currentPlayerIndex,
    revealCards,
    winner,
    gameOrder,
    showStartButton,
    handleCardSelect,
    handleStartGame,
  };
};
