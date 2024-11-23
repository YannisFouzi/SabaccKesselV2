import { useCallback, useEffect, useState } from "react";
import {
  GAME_STATES,
  HAND_TYPES,
  INITIAL_DICE_STATES,
  compareHands,
  getHandValue,
} from "../constants/gameConstants";
import calculateHandValue from "./calculateHandValue";
import initializeGameFn from "./initializeGame";
import { createGameActions } from "./useGameActions";

const useGameState = (initialPlayerCount, initialTokenCount) => {
  const [gameState, setGameState] = useState(GAME_STATES.JOKER_SELECTION);
  const [players, setPlayers] = useState(
    Array(initialPlayerCount)
      .fill(null)
      .map((_, index) => ({
        id: index + 1,
        name: `Joueur ${index + 1}`,
        tokens: initialTokenCount,
        hand: [],
      }))
  );
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [initialDiceState, setInitialDiceState] = useState(
    INITIAL_DICE_STATES.WAITING
  );
  const [initialDiceResults, setInitialDiceResults] = useState({});
  const [playersToReroll, setPlayersToReroll] = useState([]);
  const [playerOrder, setPlayerOrder] = useState([]);
  const [round, setRound] = useState(1);
  const [turn, setTurn] = useState(1);
  const [consecutivePasses, setConsecutivePasses] = useState(0);
  const [diceResults, setDiceResults] = useState(null);
  const [winners, setWinners] = useState([]);
  const [pendingDrawnCard, setPendingDrawnCard] = useState(null);
  const [pendingImpostors, setPendingImpostors] = useState([]);
  const [currentImpostorIndex, setCurrentImpostorIndex] = useState(0);
  const [startingTokens, setStartingTokens] = useState({});
  const [rerollResults, setRerollResults] = useState({});
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [roundStartPlayer, setRoundStartPlayer] = useState(null);
  const [actionHistory, setActionHistory] = useState([]);
  const [lastPlayerBeforeReveal, setLastPlayerBeforeReveal] = useState(null);
  const [sandDecks, setSandDecks] = useState({
    visible: [],
    hidden: [],
  });
  const [bloodDecks, setBloodDecks] = useState({
    visible: [],
    hidden: [],
  });
  const [selectedJokers, setSelectedJokers] = useState({});
  const [currentJokerSelectionPlayer, setCurrentJokerSelectionPlayer] =
    useState(0);
  const [usedJokersThisRound, setUsedJokersThisRound] = useState([]);

  const setters = {
    setGameState,
    setPlayers,
    setCurrentPlayerIndex,
    setInitialDiceState,
    setInitialDiceResults,
    setPlayersToReroll,
    setPlayerOrder,
    setRound,
    setTurn,
    setConsecutivePasses,
    setDiceResults,
    setWinners,
    setPendingDrawnCard,
    setPendingImpostors,
    setCurrentImpostorIndex,
    setStartingTokens,
    setRerollResults,
    setIsTransitioning,
    setRoundStartPlayer,
    setActionHistory,
    setLastPlayerBeforeReveal,
    setSandDecks,
    setBloodDecks,
    setSelectedJokers,
    setCurrentJokerSelectionPlayer,
  };

  const gameActions = createGameActions({
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
  });

  const initializeGame = useCallback(() => {
    const result = initializeGameFn({
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
      drawCardFromDeck: gameActions.drawCardFromDeck,
      roundStartPlayer,
    });
    setActionHistory([]);
    return result;
  }, [
    players,
    initialPlayerCount,
    initialTokenCount,
    playerOrder,
    round,
    roundStartPlayer,
    gameActions.drawCardFromDeck,
  ]);

  useEffect(() => {
    if (gameState === GAME_STATES.SETUP) {
      initializeGame();
    }
  }, [gameState, initializeGame]);

  useEffect(() => {
    if (
      gameState === GAME_STATES.INITIAL_DICE_ROLL &&
      playerOrder.length === players.length
    ) {
      setTimeout(() => {
        setGameState(GAME_STATES.SETUP);
      }, 3000);
    }
  }, [gameState, playerOrder, players.length]);

  const useJoker = useCallback((playerId, jokerId, jokerIndex) => {
    // Retirer le joker de la liste des jokers du joueur
    setSelectedJokers((prev) => {
      const playerJokers = [...prev[playerId]];
      playerJokers.splice(jokerIndex, 1);
      return {
        ...prev,
        [playerId]: playerJokers,
      };
    });

    // Marquer le joueur comme ayant utilisé un joker ce tour
    setUsedJokersThisRound((prev) => [...prev, playerId]);
  }, []);

  // Réinitialiser les jokers utilisés au début de chaque manche
  useEffect(() => {
    setUsedJokersThisRound([]);
  }, [round]);

  return {
    // État du jeu
    gameState,
    players,
    actionHistory,
    lastPlayerBeforeReveal,
    currentPlayerIndex,
    round,
    turn,
    consecutivePasses,
    diceResults,
    winners,
    pendingDrawnCard,
    sandDecks,
    bloodDecks,
    pendingImpostors,
    HAND_TYPES,
    currentImpostorIndex,
    initialTokenCount,
    startingTokens,
    initialDiceState,
    initialDiceResults,
    playersToReroll,
    playerOrder,
    rerollResults,
    roundStartPlayer,
    isTransitioning,
    selectedJokers,
    currentJokerSelectionPlayer,
    usedJokersThisRound,

    // Actions du jeu
    ...gameActions,
    initializeGame,
    setGameState,
    setDiceResults,
    calculateHandValue,
    compareHands,
    getHandValue,
    setSelectedJokers,
    setCurrentJokerSelectionPlayer,
    useJoker,

    // État de la partie
    isGameOver: gameState === GAME_STATES.GAME_OVER,
  };
};

export default useGameState;
