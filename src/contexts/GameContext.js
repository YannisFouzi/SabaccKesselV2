import React, { createContext, useContext, useMemo } from "react";
import useGameState from "../hooks/useGameState";

// Créer le contexte
const GameContext = createContext();

// Hook pour utiliser le contexte
export const useGameContext = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error("useGameContext doit être utilisé dans un GameProvider");
  }
  return context;
};

// Provider du contexte
export const GameProvider = ({
  children,
  playerCount,
  tokenCount,
  playerNames,
  playerAvatars,
  withoutJokers,
}) => {
  // Utiliser le hook existant
  const gameState = useGameState(
    playerCount,
    tokenCount,
    playerNames,
    playerAvatars,
    withoutJokers
  );

  // Organiser les valeurs en groupes logiques pour optimiser les re-renders
  const gameInfo = useMemo(
    () => ({
      gameState: gameState.gameState,
      round: gameState.round,
      turn: gameState.turn,
      consecutivePasses: gameState.consecutivePasses,
      isGameOver: gameState.isGameOver,
      winners: gameState.winners,
      jokerEUsed: gameState.jokerEUsed,
    }),
    [
      gameState.gameState,
      gameState.round,
      gameState.turn,
      gameState.consecutivePasses,
      gameState.isGameOver,
      gameState.winners,
      gameState.jokerEUsed,
    ]
  );

  const playersInfo = useMemo(
    () => ({
      players: gameState.players,
      currentPlayerIndex: gameState.currentPlayerIndex,
      playerOrder: gameState.playerOrder,
      roundStartPlayer: gameState.roundStartPlayer,
      startingTokens: gameState.startingTokens,
    }),
    [
      gameState.players,
      gameState.currentPlayerIndex,
      gameState.playerOrder,
      gameState.roundStartPlayer,
      gameState.startingTokens,
    ]
  );

  const cardsInfo = useMemo(
    () => ({
      sandDecks: gameState.sandDecks,
      bloodDecks: gameState.bloodDecks,
      pendingDrawnCard: gameState.pendingDrawnCard,
      pendingImpostors: gameState.pendingImpostors,
      currentImpostorIndex: gameState.currentImpostorIndex,
      diceResults: gameState.diceResults,
    }),
    [
      gameState.sandDecks,
      gameState.bloodDecks,
      gameState.pendingDrawnCard,
      gameState.pendingImpostors,
      gameState.currentImpostorIndex,
      gameState.diceResults,
    ]
  );

  const jokersInfo = useMemo(
    () => ({
      selectedJokers: gameState.selectedJokers,
      currentJokerSelectionPlayer: gameState.currentJokerSelectionPlayer,
      usedJokersThisRound: gameState.usedJokersThisRound,
      hasUsedJokerA: gameState.hasUsedJokerA,
      hasUsedJokerB: gameState.hasUsedJokerB,
      hasUsedJokerC: gameState.hasUsedJokerC,
      hasUsedJokerD: gameState.hasUsedJokerD,
    }),
    [
      gameState.selectedJokers,
      gameState.currentJokerSelectionPlayer,
      gameState.usedJokersThisRound,
      gameState.hasUsedJokerA,
      gameState.hasUsedJokerB,
      gameState.hasUsedJokerC,
      gameState.hasUsedJokerD,
    ]
  );

  const gameActions = useMemo(
    () => ({
      // Actions de jeu
      drawCard: gameState.drawCard,
      handleDiscard: gameState.handleDiscard,
      passTurn: gameState.passTurn,
      rollDice: gameState.rollDice,
      selectImpostorValue: gameState.selectImpostorValue,
      handleImpostorValue: gameState.handleImpostorValue,
      endRound: gameState.endRound,
      useJoker: gameState.useJoker,

      // Actions d'état
      setGameState: gameState.setGameState,
      setDiceResults: gameState.setDiceResults,
      setSelectedJokers: gameState.setSelectedJokers,
      setCurrentJokerSelectionPlayer: gameState.setCurrentJokerSelectionPlayer,
      setPlayerOrder: gameState.setPlayerOrder,

      // Fonctions utilitaires
      calculateHandValue: gameState.calculateHandValue,
      compareHands: gameState.compareHands,
      getHandValue: gameState.getHandValue,
      getHistorySinceLastTurn: gameState.getHistorySinceLastTurn,

      // Actions de transition
      confirmTransition: gameState.confirmTransition,
    }),
    [
      gameState.drawCard,
      gameState.handleDiscard,
      gameState.passTurn,
      gameState.rollDice,
      gameState.selectImpostorValue,
      gameState.handleImpostorValue,
      gameState.endRound,
      gameState.useJoker,
      gameState.setGameState,
      gameState.setDiceResults,
      gameState.setSelectedJokers,
      gameState.setCurrentJokerSelectionPlayer,
      gameState.setPlayerOrder,
      gameState.calculateHandValue,
      gameState.compareHands,
      gameState.getHandValue,
      gameState.getHistorySinceLastTurn,
      gameState.confirmTransition,
    ]
  );

  const transitionInfo = useMemo(
    () => ({
      isTransitioning: gameState.isTransitioning,
      lastPlayerBeforeReveal: gameState.lastPlayerBeforeReveal,
      actionHistory: gameState.actionHistory,
    }),
    [
      gameState.isTransitioning,
      gameState.lastPlayerBeforeReveal,
      gameState.actionHistory,
    ]
  );

  // Valeur du contexte - organisée par groupes
  const contextValue = useMemo(
    () => ({
      // Informations du jeu
      ...gameInfo,

      // Informations des joueurs
      ...playersInfo,

      // Informations des cartes
      ...cardsInfo,

      // Informations des jokers
      ...jokersInfo,

      // Informations de transition
      ...transitionInfo,

      // Actions
      ...gameActions,

      // Types et constantes
      HAND_TYPES: gameState.HAND_TYPES,
      GAME_STATES: gameState.GAME_STATES || {},
    }),
    [
      gameInfo,
      playersInfo,
      cardsInfo,
      jokersInfo,
      transitionInfo,
      gameActions,
      gameState.HAND_TYPES,
      gameState.GAME_STATES,
    ]
  );

  return (
    <GameContext.Provider value={contextValue}>{children}</GameContext.Provider>
  );
};

// Hooks spécialisés pour des parties spécifiques du state
export const useGameInfo = () => {
  const {
    gameState,
    round,
    turn,
    consecutivePasses,
    isGameOver,
    winners,
    jokerEUsed,
  } = useGameContext();
  return {
    gameState,
    round,
    turn,
    consecutivePasses,
    isGameOver,
    winners,
    jokerEUsed,
  };
};

export const usePlayersInfo = () => {
  const {
    players,
    currentPlayerIndex,
    playerOrder,
    roundStartPlayer,
    startingTokens,
  } = useGameContext();
  return {
    players,
    currentPlayerIndex,
    playerOrder,
    roundStartPlayer,
    startingTokens,
  };
};

export const useCardsInfo = () => {
  const {
    sandDecks,
    bloodDecks,
    pendingDrawnCard,
    pendingImpostors,
    currentImpostorIndex,
    diceResults,
    lastPlayerBeforeReveal,
  } = useGameContext();
  return {
    sandDecks,
    bloodDecks,
    pendingDrawnCard,
    pendingImpostors,
    currentImpostorIndex,
    diceResults,
    lastPlayerBeforeReveal,
  };
};

export const useJokersInfo = () => {
  const {
    selectedJokers,
    currentJokerSelectionPlayer,
    usedJokersThisRound,
    hasUsedJokerA,
    hasUsedJokerB,
    hasUsedJokerC,
    hasUsedJokerD,
  } = useGameContext();
  return {
    selectedJokers,
    currentJokerSelectionPlayer,
    usedJokersThisRound,
    hasUsedJokerA,
    hasUsedJokerB,
    hasUsedJokerC,
    hasUsedJokerD,
  };
};

export const useGameActions = () => {
  const {
    drawCard,
    handleDiscard,
    passTurn,
    rollDice,
    selectImpostorValue,
    handleImpostorValue,
    endRound,
    useJoker,
    setGameState,
    setDiceResults,
    setSelectedJokers,
    setCurrentJokerSelectionPlayer,
    setPlayerOrder,
    calculateHandValue,
    compareHands,
    getHandValue,
    getHistorySinceLastTurn,
    confirmTransition,
    isTransitioning,
    actionHistory,
  } = useGameContext();

  return {
    drawCard,
    handleDiscard,
    passTurn,
    rollDice,
    selectImpostorValue,
    handleImpostorValue,
    endRound,
    useJoker,
    setGameState,
    setDiceResults,
    setSelectedJokers,
    setCurrentJokerSelectionPlayer,
    setPlayerOrder,
    calculateHandValue,
    compareHands,
    getHandValue,
    getHistorySinceLastTurn,
    confirmTransition,
    isTransitioning,
    actionHistory,
  };
};
