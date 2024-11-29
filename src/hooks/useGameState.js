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
import { createUseJoker } from "./useJoker";

const useGameState = (
  initialPlayerCount,
  initialTokenCount,
  playerNames,
  playerAvatars,
  withoutJokers
) => {
  const [gameState, setGameState] = useState(
    withoutJokers ? GAME_STATES.INITIAL_DICE_ROLL : GAME_STATES.JOKER_SELECTION
  );
  const [players, setPlayers] = useState(() =>
    Array(initialPlayerCount)
      .fill(null)
      .map((_, index) => ({
        id: index + 1,
        name: playerNames?.[index] || `Joueur ${index + 1}`,
        avatar: playerAvatars?.[index],
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
  const [hasUsedJokerA, setHasUsedJokerA] = useState(false);
  const [hasUsedJokerB, setHasUsedJokerB] = useState(false);
  const [hasUsedJokerC, setHasUsedJokerC] = useState(false);
  const [hasUsedJokerD, setHasUsedJokerD] = useState(false);
  const [jokerEUsed, setJokerEUsed] = useState(false);

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

  const updateTokensForNewRound = useCallback(() => {
    const newStartingTokens = {};
    players.forEach((player) => {
      newStartingTokens[player.id] = player.tokens;
    });
    setStartingTokens(newStartingTokens);
  }, [players]);

  const initializeGame = useCallback(() => {
    // Réinitialiser tous les états nécessaires
    setDiceResults(null);
    setPendingDrawnCard(null);
    setPendingImpostors([]);
    setConsecutivePasses(0);
    setCurrentImpostorIndex(0);
    setActionHistory([]);
    setLastPlayerBeforeReveal(null);
    setIsTransitioning(false);
    setJokerEUsed(false);

    // Créer une copie des joueurs avec leurs mains vidées
    const updatedPlayers = players.map((player) => ({
      ...player,
      hand: [], // Vider la main de chaque joueur
    }));

    // Initialiser les decks et distribuer les cartes
    const result = initializeGameFn({
      players: updatedPlayers, // Utiliser les joueurs mis à jour
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
      setJokerEUsed,
      round,
      drawCardFromDeck: gameActions.drawCardFromDeck,
      roundStartPlayer,
    });

    // Si ce n'est pas la première manche, mettre à jour les jetons
    if (round > 1) {
      updateTokensForNewRound();
    }

    return result;
  }, [
    players,
    initialPlayerCount,
    initialTokenCount,
    playerOrder,
    round,
    roundStartPlayer,
    gameActions.drawCardFromDeck,
    updateTokensForNewRound,
  ]);

  useEffect(() => {
    if (gameState === GAME_STATES.SETUP) {
      // Réinitialiser les decks
      setSandDecks({
        visible: [],
        hidden: [],
      });
      setBloodDecks({
        visible: [],
        hidden: [],
      });

      initializeGame();
    }
  }, [gameState, initializeGame]);

  useEffect(() => {
    if (gameState === GAME_STATES.INITIAL_DICE_ROLL && !playerOrder.length) {
      // Si on est au lancer de dés initial et qu'il n'y a pas d'ordre des joueurs
      setInitialDiceState(INITIAL_DICE_STATES.WAITING);
    } else if (gameState === GAME_STATES.JOKER_SELECTION && round === 1) {
      // Si on est à la sélection des jokers pour la première manche
      setCurrentJokerSelectionPlayer(0);
      setSelectedJokers({});
    } else if (
      gameState === GAME_STATES.JOKER_SELECTION &&
      playerOrder.length > 0
    ) {
      // Une fois que les jokers sont sélectionnés, passer à SETUP
      setGameState(GAME_STATES.SETUP);
    }
  }, [gameState, playerOrder, round]);

  useEffect(() => {
    if (withoutJokers && gameState === GAME_STATES.JOKER_SELECTION) {
      // Si withoutJokers est activé et qu'on est sur la sélection des jokers,
      // passer directement au lancer de dés
      setGameState(GAME_STATES.INITIAL_DICE_ROLL);
    }
  }, [withoutJokers, gameState]);

  const addToHistory = useCallback(
    (action) => {
      const currentPlayer = players[currentPlayerIndex];
      setActionHistory((prev) => [
        ...prev,
        {
          ...action,
          playerName: currentPlayer.name,
          playerId: currentPlayer.id,
        },
      ]);
    },
    [currentPlayerIndex, players]
  );

  const drawCard = useCallback(
    (family, type) => {
      const currentPlayer = players[currentPlayerIndex];
      const deck = family === "SAND" ? sandDecks : bloodDecks;
      const deckType = type === "VISIBLE" ? "visible" : "hidden";
      const card = deck[deckType][0];

      if (!card) return;

      // Vérifier si le joueur utilise le Joker A
      const isUsingJokerA = hasUsedJokerA;

      // Si le joueur n'utilise pas le Joker A, vérifier s'il a assez de jetons
      if (!isUsingJokerA && currentPlayer.tokens <= 0) return;

      // Mettre à jour les jetons du joueur seulement s'il n'utilise pas le Joker A
      if (!isUsingJokerA) {
        setPlayers((prevPlayers) =>
          prevPlayers.map((player) =>
            player.id === currentPlayer.id
              ? { ...player, tokens: player.tokens - 1 }
              : player
          )
        );
      }

      // Réinitialiser l'utilisation du Joker A
      setHasUsedJokerA(false);

      // Réinitialiser le compteur de passes consécutives
      setConsecutivePasses(0);

      setPendingDrawnCard(card);
      addToHistory({
        type: `DRAW_${type}`,
        card: card,
      });

      // Mettre à jour le deck
      if (family === "SAND") {
        setSandDecks((prev) => ({
          ...prev,
          [deckType]: prev[deckType].slice(1),
        }));
      } else {
        setBloodDecks((prev) => ({
          ...prev,
          [deckType]: prev[deckType].slice(1),
        }));
      }
    },
    [
      players,
      currentPlayerIndex,
      sandDecks,
      bloodDecks,
      hasUsedJokerA,
      addToHistory,
    ]
  );

  const useJoker = createUseJoker({
    players,
    startingTokens,
    setPlayers,
    setStartingTokens,
    setSelectedJokers,
    setUsedJokersThisRound,
    setHasUsedJokerA,
    setHasUsedJokerB,
    setHasUsedJokerC,
    setHasUsedJokerD,
    setJokerEUsed,
    addToHistory,
  });

  // Réinitialiser les jokers utilisés au début de chaque tour
  useEffect(() => {
    setUsedJokersThisRound([]);
    setHasUsedJokerA(false);
    setHasUsedJokerB(false);
    setHasUsedJokerC(false);
    setHasUsedJokerD(false);
  }, [turn]);

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
    hasUsedJokerA,
    hasUsedJokerB,
    hasUsedJokerC,
    hasUsedJokerD,
    jokerEUsed,

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
    addToHistory,
    drawCard,
    setJokerEUsed,
    setPlayerOrder,

    // État de la partie
    isGameOver: gameState === GAME_STATES.GAME_OVER,
  };
};

export default useGameState;
