import React, { createContext, useContext, useMemo } from "react";
import useGameState from "../hooks/useGameState";

// Créer le contexte
const GameContext = createContext();

// Hook pour utiliser le contexte
export const useGameContext = (allowNull = false) => {
  const context = useContext(GameContext);
  if (!context && !allowNull) {
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
export const useGameInfo = (allowNull = false) => {
  const context = useGameContext(allowNull);
  if (!context) {
    return {
      gameState: null,
      round: 0,
      turn: 0,
      consecutivePasses: 0,
      isGameOver: false,
      winners: [],
      jokerEUsed: false,
    };
  }
  const {
    gameState,
    round,
    turn,
    consecutivePasses,
    isGameOver,
    winners,
    jokerEUsed,
  } = context;
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

export const usePlayersInfo = (allowNull = false) => {
  const context = useGameContext(allowNull);
  if (!context) {
    return {
      players: [],
      currentPlayerIndex: 0,
      playerOrder: [],
      roundStartPlayer: 0,
      startingTokens: 0,
    };
  }
  const {
    players,
    currentPlayerIndex,
    playerOrder,
    roundStartPlayer,
    startingTokens,
  } = context;
  return {
    players,
    currentPlayerIndex,
    playerOrder,
    roundStartPlayer,
    startingTokens,
  };
};

export const useCardsInfo = (allowNull = false) => {
  const context = useGameContext(allowNull);
  if (!context) {
    return {
      sandDecks: { visible: [], hidden: [] },
      bloodDecks: { visible: [], hidden: [] },
      pendingDrawnCard: null,
      pendingImpostors: [],
      currentImpostorIndex: 0,
      diceResults: [],
      lastPlayerBeforeReveal: null,
    };
  }
  const {
    sandDecks,
    bloodDecks,
    pendingDrawnCard,
    pendingImpostors,
    currentImpostorIndex,
    diceResults,
    lastPlayerBeforeReveal,
  } = context;
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

export const useJokersInfo = (allowNull = false) => {
  const context = useGameContext(allowNull);
  if (!context) {
    return {
      selectedJokers: {},
      currentJokerSelectionPlayer: 0,
      usedJokersThisRound: [],
      hasUsedJokerA: false,
      hasUsedJokerB: false,
      hasUsedJokerC: false,
      hasUsedJokerD: false,
    };
  }
  const {
    selectedJokers,
    currentJokerSelectionPlayer,
    usedJokersThisRound,
    hasUsedJokerA,
    hasUsedJokerB,
    hasUsedJokerC,
    hasUsedJokerD,
  } = context;
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

export const useGameActions = (allowNull = false) => {
  const context = useGameContext(allowNull);
  if (!context) {
    return {
      drawCard: () => {},
      handleDiscard: () => {},
      passTurn: () => {},
      rollDice: () => {},
      selectImpostorValue: () => {},
      handleImpostorValue: () => {},
      endRound: () => {},
      useJoker: () => {},
      setGameState: () => {},
      setDiceResults: () => {},
      setSelectedJokers: () => {},
      setCurrentJokerSelectionPlayer: () => {},
      setPlayerOrder: () => {},
      calculateHandValue: () => 0,
      compareHands: () => 0,
      getHandValue: () => 0,
      getHistorySinceLastTurn: () => [],
      confirmTransition: () => {},
      isTransitioning: false,
      actionHistory: [],
    };
  }
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
  } = context;

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
