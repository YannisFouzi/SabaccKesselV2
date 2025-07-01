import {
  CARD_TYPES,
  GAME_STATES,
  INITIAL_DICE_STATES,
  compareHands,
  getHandValue,
} from "../constants/gameConstants";
import checkForTiesFn from "./checkForTies";
import drawCardFn from "./drawCard";
import endRoundFn from "./endRound";
import { getHistorySinceLastTurn as getHistorySinceLastTurnUtil } from "./gameHistoryUtils";
import { passTurn as passTurnUtil } from "./gameTurnUtils";
import handleDiscardFn from "./handleDiscard";
import handleImpostorValueFn from "./handleImpostorValue";
import rollInitialDiceFn from "./rollInitialDice";

export const createGameActions = ({
  gameState,
  players,
  currentPlayerIndex,
  pendingDrawnCard,
  sandDecks,
  bloodDecks,
  consecutivePasses,
  diceResults,
  turn,
  round,
  startingTokens,
  initialDiceState,
  initialDiceResults,
  rerollResults,
  playersToReroll,
  roundStartPlayer,
  playerOrder,
  actionHistory,
  setters,
}) => {
  const addToHistory = (action) => {
    const currentPlayer = players[currentPlayerIndex];
    if (!currentPlayer) return;

    setters.setActionHistory((prev) => [
      ...prev,
      {
        ...action,
        playerName: currentPlayer.name,
        playerId: currentPlayer.id,
        timestamp: Date.now(),
      },
    ]);
  };

  const getHistorySinceLastTurn = (playerId) => {
    return getHistorySinceLastTurnUtil(
      playerId,
      actionHistory,
      players,
      round,
      turn
    );
  };

  const checkForTies = (results) =>
    checkForTiesFn({
      results,
      finalizeTurnOrder,
      setPlayersToReroll: setters.setPlayersToReroll,
      setInitialDiceState: setters.setInitialDiceState,
      setInitialDiceResults: setters.setInitialDiceResults,
    });

  const finalizeTurnOrder = (firstPlayerId, results) => {
    const playerCount = players.length;
    const order = [];

    for (let i = 0; i < playerCount; i++) {
      const nextPlayerId = ((firstPlayerId - 1 + i) % playerCount) + 1;
      order.push(nextPlayerId);
    }

    setters.setPlayerOrder(order);
    setters.setRoundStartPlayer(firstPlayerId);
    setters.setInitialDiceState(INITIAL_DICE_STATES.COMPLETED);
    setters.setInitialDiceResults(results);
  };

  const rollInitialDice = rollInitialDiceFn({
    gameState,
    initialDiceState,
    initialDiceResults,
    rerollResults,
    playersToReroll,
    players,
    setInitialDiceResults: setters.setInitialDiceResults,
    setRerollResults: setters.setRerollResults,
    checkForTies,
    setPlayersToReroll: setters.setPlayersToReroll,
    finalizeTurnOrder,
  });

  const drawCardFromDeck = (deck) => {
    if (!deck || deck.length === 0) return null;
    return deck.shift();
  };

  const checkForImpostors = () => {
    const impostorsToHandle = [];

    players
      .sort((a, b) => a.id - b.id)
      .forEach((player) => {
        player.hand.forEach((card) => {
          if (card.type === CARD_TYPES.IMPOSTOR && !card.value) {
            impostorsToHandle.push({
              playerId: player.id,
              cardId: card.id,
              family: card.family,
            });
          }
        });
      });

    if (impostorsToHandle.length > 0) {
      setters.setPendingImpostors(impostorsToHandle);
      setters.setCurrentImpostorIndex(0);
      setters.setDiceResults(null);
    }

    return impostorsToHandle.length > 0;
  };

  const nextPlayer = () => {
    if (gameState === GAME_STATES.END_ROUND) {
      return;
    }

    const currentPlayerIdIndex = playerOrder.findIndex(
      (id) => players[currentPlayerIndex].id === id
    );
    const nextPlayerIdIndex = (currentPlayerIdIndex + 1) % playerOrder.length;

    // Si on revient au joueur qui a commencé la manche
    if (
      nextPlayerIdIndex ===
      playerOrder.findIndex((id) => id === roundStartPlayer)
    ) {
      if (turn >= 3) {
        setters.setLastPlayerBeforeReveal(players[currentPlayerIndex].id);
        checkForImpostors();
        setters.setGameState(GAME_STATES.REVEAL);
        return;
      }
    }

    setters.setIsTransitioning(true);
  };

  const confirmTransition = () => {
    const currentPlayerIdIndex = playerOrder.findIndex(
      (id) => players[currentPlayerIndex].id === id
    );
    const nextPlayerIdIndex = (currentPlayerIdIndex + 1) % playerOrder.length;
    const nextPlayerId = playerOrder[nextPlayerIdIndex];
    const nextPlayerIndex = players.findIndex((p) => p.id === nextPlayerId);

    // Si on revient au joueur qui a commencé la manche
    if (
      nextPlayerIdIndex ===
      playerOrder.findIndex((id) => id === roundStartPlayer)
    ) {
      const currentTurnNumber = turn;

      if (currentTurnNumber < 3) {
        const nextTurnNumber = currentTurnNumber + 1;
        setters.setTurn(nextTurnNumber);
      } else {
        if (checkForImpostors()) {
          setters.setIsTransitioning(false);
          return;
        }
        setters.setGameState(GAME_STATES.REVEAL);
      }
    }

    setters.setCurrentPlayerIndex(nextPlayerIndex);
    setters.setIsTransitioning(false);
  };

  const drawCard = (family, isVisible, card = null) => {
    const result = drawCardFn({
      family,
      isVisible,
      card,
      pendingDrawnCard,
      currentPlayerIndex,
      players,
      sandDecks,
      bloodDecks,
      setPlayers: setters.setPlayers,
      setPendingDrawnCard: setters.setPendingDrawnCard,
      setConsecutivePasses: setters.setConsecutivePasses,
      setSandDecks: setters.setSandDecks,
      setBloodDecks: setters.setBloodDecks,
      gameState,
    });

    if (result) {
      addToHistory({
        type: isVisible ? "DRAW_VISIBLE" : "DRAW_HIDDEN",
        card: card || { family },
      });
    }

    return result;
  };

  const handleDiscard = (cardToDiscard) => {
    const result = handleDiscardFn({
      cardToDiscard,
      pendingDrawnCard,
      players,
      currentPlayerIndex,
      setPlayers: setters.setPlayers,
      setSandDecks: setters.setSandDecks,
      setBloodDecks: setters.setBloodDecks,
      setPendingDrawnCard: setters.setPendingDrawnCard,
      nextPlayer,
    });

    if (result) {
      addToHistory({
        type: "DISCARD",
        card: cardToDiscard,
      });
    }

    return result;
  };

  const passTurn = () =>
    passTurnUtil({
      pendingDrawnCard,
      gameState,
      GAME_STATES,
      players,
      consecutivePasses,
      setConsecutivePasses: setters.setConsecutivePasses,
      setGameState: setters.setGameState,
      nextPlayer,
      addToHistory,
      checkForImpostors,
      currentPlayerIndex,
      setLastPlayerBeforeReveal: setters.setLastPlayerBeforeReveal,
    });

  const rollDice = () => {
    if (gameState !== GAME_STATES.REVEAL) return false;

    const dice1 = Math.floor(Math.random() * 6) + 1;
    const dice2 = Math.floor(Math.random() * 6) + 1;
    setters.setDiceResults([dice1, dice2]);
    return true;
  };

  const selectImpostorValue = (cardId, value) => {
    if (!diceResults || !diceResults.includes(value)) return false;

    setters.setPlayers(
      players.map((player) => ({
        ...player,
        hand: player.hand.map((card) =>
          card.id === cardId ? { ...card, value } : card
        ),
      }))
    );

    return true;
  };

  const handleImpostorValue = ({ value, playerId, cardId }) => {
    const impostorData = handleImpostorValueFn({ value, playerId, cardId });

    setters.setPlayers(
      players.map((player) => {
        if (player.id === impostorData.playerId) {
          return {
            ...player,
            hand: player.hand.map((card) =>
              card.id === impostorData.cardId
                ? { ...card, value: impostorData.value }
                : card
            ),
          };
        }
        return player;
      })
    );

    setters.setDiceResults(null);
    return true;
  };

  const endRound = () =>
    endRoundFn({
      players,
      startingTokens,
      setGameState: setters.setGameState,
      setWinners: setters.setWinners,
      setPlayerOrder: setters.setPlayerOrder,
      setRoundStartPlayer: setters.setRoundStartPlayer,
      setPlayers: setters.setPlayers,
      setRound: setters.setRound,
      getHandValue,
      compareHands,
      playerOrder,
      roundStartPlayer,
      setLastPlayerBeforeReveal: setters.setLastPlayerBeforeReveal,
    });

  return {
    addToHistory,
    getHistorySinceLastTurn,
    checkForTies,
    finalizeTurnOrder,
    rollInitialDice,
    drawCardFromDeck,
    checkForImpostors,
    nextPlayer,
    confirmTransition,
    drawCard,
    handleDiscard,
    passTurn,
    rollDice,
    selectImpostorValue,
    handleImpostorValue,
    endRound,
  };
};
