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
  const [hasUsedJokerA, setHasUsedJokerA] = useState(false);
  const [hasUsedJokerB, setHasUsedJokerB] = useState(false);
  const [hasUsedJokerC, setHasUsedJokerC] = useState(false);
  const [hasUsedJokerD, setHasUsedJokerD] = useState(false);

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

  const useJoker = useCallback(
    (playerId, jokerId, jokerIndex) => {
      const player = players.find((p) => p.id === playerId);
      if (!player) return;

      if (jokerId === "A") {
        setHasUsedJokerA(true);
      } else if (jokerId === "B") {
        // Calculer les jetons misés
        const tokensBet = startingTokens[playerId] - player.tokens;
        // Récupérer jusqu'à 2 jetons
        const tokensToRecover = Math.min(2, tokensBet);

        if (tokensToRecover > 0) {
          setPlayers((prevPlayers) =>
            prevPlayers.map((p) =>
              p.id === playerId
                ? { ...p, tokens: p.tokens + tokensToRecover }
                : p
            )
          );
          setHasUsedJokerB(true);
        }
      } else if (jokerId === "C") {
        // Calculer les jetons misés
        const tokensBet = startingTokens[playerId] - player.tokens;
        // Récupérer jusqu'à 2 jetons
        const tokensToRecover = Math.min(3, tokensBet);

        if (tokensToRecover > 0) {
          setPlayers((prevPlayers) =>
            prevPlayers.map((p) =>
              p.id === playerId
                ? { ...p, tokens: p.tokens + tokensToRecover }
                : p
            )
          );
          setHasUsedJokerC(true);
        }
      } else if (jokerId === "D") {
        // Pour chaque adversaire
        setStartingTokens((prevStartingTokens) => {
          const updatedStartingTokens = { ...prevStartingTokens };
          let totalTokensStolen = 0;

          // Parcourir tous les joueurs
          players.forEach((p) => {
            if (p.id !== playerId) {
              const tokensBet = prevStartingTokens[p.id] - p.tokens;
              if (tokensBet > 0) {
                // Augmenter le startingTokens de l'adversaire pour simuler un jeton de mise en moins
                updatedStartingTokens[p.id] = prevStartingTokens[p.id] - 1;
                totalTokensStolen++;
              }
            }
          });

          // Diminuer le startingTokens du joueur actif pour simuler l'ajout des jetons volés à sa mise
          if (totalTokensStolen > 0) {
            updatedStartingTokens[playerId] =
              prevStartingTokens[playerId] + totalTokensStolen;
          }

          return updatedStartingTokens;
        });

        setHasUsedJokerD(true);
      }

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

      // Ajouter l'action à l'historique
      addToHistory({
        type: "USE_JOKER",
        playerName: player.name,
        jokerId: jokerId,
      });
    },
    [players, addToHistory, startingTokens]
  );

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

    // État de la partie
    isGameOver: gameState === GAME_STATES.GAME_OVER,
  };
};

export default useGameState;
