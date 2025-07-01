import { useCallback, useEffect, useMemo, useState } from "react";

export const useFinalReveal = ({
  players,
  playerOrder,
  lastPlayerBeforeReveal,
  compareHands,
  handleImpostorValue,
  setDiceResults,
}) => {
  const [currentRevealIndex, setCurrentRevealIndex] = useState(0);
  const [currentPlayerImpostorIndex, setCurrentPlayerImpostorIndex] =
    useState(0);
  const [, setRevealPhase] = useState("IMPOSTORS");

  const orderedPlayers = useMemo(() => {
    if (
      !players ||
      players.length === 0 ||
      !playerOrder ||
      playerOrder.length === 0
    )
      return [];

    if (lastPlayerBeforeReveal === null) {
      // Utiliser l'ordre de jeu pour organiser les joueurs
      return playerOrder
        .map((playerId) => players.find((p) => p.id === playerId))
        .filter(Boolean);
    }

    // Trouver l'index du joueur qui a terminé le tour dans playerOrder
    const lastPlayerIndex = playerOrder.findIndex(
      (id) => id === lastPlayerBeforeReveal
    );

    if (lastPlayerIndex === -1) {
      return playerOrder
        .map((playerId) => players.find((p) => p.id === playerId))
        .filter(Boolean);
    }

    // Le joueur suivant commence la révélation
    const startingPlayerIndex = (lastPlayerIndex + 1) % playerOrder.length;

    const orderedPlayers = [];
    for (let i = 0; i < playerOrder.length; i++) {
      const currentIndex = (startingPlayerIndex + i) % playerOrder.length;
      const playerId = playerOrder[currentIndex];
      const player = players.find((p) => p.id === playerId);
      if (player) {
        orderedPlayers.push(player);
      }
    }

    return orderedPlayers;
  }, [players, playerOrder, lastPlayerBeforeReveal]);

  const getCurrentPlayerUnresolvedImpostors = useCallback(() => {
    if (currentRevealIndex >= orderedPlayers.length) return [];
    const currentPlayer = orderedPlayers[currentRevealIndex];
    if (!currentPlayer) return [];

    return currentPlayer.hand
      .filter((card) => card.type === "IMPOSTOR" && !card.value)
      .sort((a, b) => a.id - b.id);
  }, [currentRevealIndex, orderedPlayers]);

  const currentPlayerHasImpostor = useCallback(() => {
    const unresolvedImpostors = getCurrentPlayerUnresolvedImpostors();
    return unresolvedImpostors.length > currentPlayerImpostorIndex;
  }, [getCurrentPlayerUnresolvedImpostors, currentPlayerImpostorIndex]);

  const hasMoreUnresolvedImpostors = () => {
    for (let i = currentRevealIndex; i < orderedPlayers.length; i++) {
      const player = orderedPlayers[i];
      const unresolvedImpostors = player.hand.filter(
        (card) => card.type === "IMPOSTOR" && !card.value
      );

      if (i === currentRevealIndex) {
        if (unresolvedImpostors.length > currentPlayerImpostorIndex)
          return true;
      } else {
        if (unresolvedImpostors.length > 0) return true;
      }
    }
    return false;
  };

  const handleImpostorValueAndNext = (value) => {
    const currentPlayer = orderedPlayers[currentRevealIndex];
    const unresolvedImpostors = getCurrentPlayerUnresolvedImpostors();
    const currentImpostor = unresolvedImpostors[currentPlayerImpostorIndex];

    if (currentImpostor) {
      const success = handleImpostorValue({
        value,
        playerId: currentPlayer.id,
        cardId: currentImpostor.id,
      });

      if (success) {
        setTimeout(() => {
          const updatedUnresolvedImpostors =
            getCurrentPlayerUnresolvedImpostors();

          if (currentPlayerImpostorIndex < updatedUnresolvedImpostors.length) {
            setDiceResults(null);
          } else if (hasMoreUnresolvedImpostors()) {
            handleNextPlayer();
          } else {
            setRevealPhase("REVEAL");
          }
        }, 0);
      }
    }
  };

  const calculateWinner = () => {
    if (currentRevealIndex < players.length) return null;

    let bestHand = orderedPlayers[0].hand;
    orderedPlayers.slice(1).forEach((p) => {
      if (compareHands(p.hand, bestHand) > 0) {
        bestHand = p.hand;
      }
    });
    return bestHand;
  };

  const handleNextPlayer = () => {
    if (currentRevealIndex < players.length) {
      setCurrentRevealIndex((prev) => prev + 1);
      setCurrentPlayerImpostorIndex(0);
      setDiceResults(null);
    }
  };

  useEffect(() => {
    if (currentPlayerHasImpostor()) {
      setDiceResults(null);
    }
  }, [
    currentRevealIndex,
    currentPlayerImpostorIndex,
    currentPlayerHasImpostor,
    setDiceResults,
  ]);

  const currentPlayer = orderedPlayers[currentRevealIndex];
  const unresolvedImpostors = getCurrentPlayerUnresolvedImpostors();
  const bestHand = calculateWinner();

  return {
    currentRevealIndex,
    currentPlayer,
    orderedPlayers,
    unresolvedImpostors,
    bestHand,
    currentPlayerHasImpostor,
    handleImpostorValueAndNext,
    handleNextPlayer,
  };
};
