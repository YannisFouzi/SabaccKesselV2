import { useEffect, useState } from "react";
import {
  CARD_TYPES,
  GAME_STATES,
  HAND_TYPES,
  INITIAL_DICE_STATES,
  compareHands,
  getHandValue,
} from "../constants/gameConstants";
import calculateHandValue from "./calculateHandValue";
import checkForTiesFn from "./checkForTies";
import createAndShuffleDecksFn from "./createAndShuffleDecks";
import drawCardFn from "./drawCard";
import endRoundFn from "./endRound";
import { getHistorySinceLastTurn as getHistorySinceLastTurnUtil } from "./gameHistoryUtils";
import { passTurn as passTurnUtil } from "./gameTurnUtils";
import handleDiscardFn from "./handleDiscard";
import handleImpostorValueFn from "./handleImpostorValue";
import initializeGameFn from "./initializeGame";
import rollInitialDiceFn from "./rollInitialDice";

const useGameState = (initialPlayerCount, initialTokenCount) => {
  const [gameState, setGameState] = useState(GAME_STATES.INITIAL_DICE_ROLL);
  const [players, setPlayers] = useState(
    Array(initialPlayerCount)
      .fill(null)
      .map((_, index) => ({
        id: index + 1,
        name: `Joueur ${index + 1}`,
        tokens: initialTokenCount,
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

  // Fonction pour obtenir l'historique depuis le dernier tour d'un joueur
  const getHistorySinceLastTurn = (playerId) => {
    return getHistorySinceLastTurnUtil(
      playerId,
      actionHistory,
      players,
      round,
      turn
    );
  };

  const addToHistory = (action) => {
    const currentPlayer = players[currentPlayerIndex];
    if (!currentPlayer) return;

    setActionHistory((prev) => [
      ...prev,
      {
        ...action,
        playerName: currentPlayer.name,
        playerId: currentPlayer.id,
        timestamp: Date.now(),
      },
    ]);
  };

  // Fonction pour vérifier les égalités
  const checkForTies = (results) =>
    checkForTiesFn({
      results,
      finalizeTurnOrder,
      setPlayersToReroll,
      setInitialDiceState,
      setInitialDiceResults,
    });

  // Fonction pour finaliser l'ordre des tours
  const finalizeTurnOrder = (firstPlayerId, results) => {
    const playerCount = players.length;
    const order = [];

    for (let i = 0; i < playerCount; i++) {
      const nextPlayerId = ((firstPlayerId - 1 + i) % playerCount) + 1;
      order.push(nextPlayerId);
    }

    setPlayerOrder(order);
    setRoundStartPlayer(firstPlayerId); // On initialise le premier joueur
    setInitialDiceState(INITIAL_DICE_STATES.COMPLETED);
    setInitialDiceResults(results);

    setTimeout(() => {
      setGameState(GAME_STATES.SETUP);
    }, 2000);
  };

  // lancer les dés initiaux
  const rollInitialDice = rollInitialDiceFn({
    gameState,
    initialDiceState,
    initialDiceResults,
    rerollResults,
    playersToReroll,
    players,
    setInitialDiceResults,
    setRerollResults,
    checkForTies,
    setPlayersToReroll,
    finalizeTurnOrder,
  });

  // État des pioches
  const [sandDecks, setSandDecks] = useState({
    visible: [],
    hidden: [],
  });

  const [bloodDecks, setBloodDecks] = useState({
    visible: [],
    hidden: [],
  });

  // Initialisation du jeu et nouvelle manche
  useEffect(() => {
    if (gameState === GAME_STATES.SETUP) {
      initializeGame();
    }
  }, [gameState]);

  // Fonction utilitaire pour tirer une carte d'un paquet
  const drawCardFromDeck = (deck) => {
    if (!deck || deck.length === 0) return null;
    return deck.shift();
  };

  // Initialisation du jeu et nouvelle manche
  const initializeGame = () => {
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
      createAndShuffleDecks: createAndShuffleDecksFn,
      drawCardFromDeck,
      roundStartPlayer,
    });
    setActionHistory([]); // Réinitialiser l'historique
    return result;
  };

  // Passer au joueur suivant
  const nextPlayer = () => {
    console.log("nextPlayer called", {
      currentPlayerIndex,
      gameState,
      turn,
    });

    if (gameState === GAME_STATES.END_ROUND) {
      return;
    }

    const nextIndex = (currentPlayerIndex + 1) % players.length;
    console.log("nextIndex calculated", nextIndex);

    if (nextIndex === 0 && turn >= 3) {
      console.log("Setting lastPlayerBeforeReveal to", currentPlayerIndex);
      setLastPlayerBeforeReveal(currentPlayerIndex);
      checkForImpostors();
      setGameState(GAME_STATES.REVEAL);
      return;
    }

    setIsTransitioning(true);
  };

  // Confirmer la transition
  const confirmTransition = () => {
    const nextIndex = (currentPlayerIndex + 1) % players.length;

    if (nextIndex === 0) {
      if (turn >= 3) {
        if (checkForImpostors()) {
          setIsTransitioning(false);
          return;
        }
        setGameState(GAME_STATES.REVEAL);
      } else {
        setTurn((prevTurn) => prevTurn + 1);
      }
    }

    setCurrentPlayerIndex(nextIndex);
    setIsTransitioning(false);
  };

  // Pioche d'une carte
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
      setPlayers,
      setPendingDrawnCard,
      setConsecutivePasses,
      setSandDecks,
      setBloodDecks,
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

  // Gestion de la défausse
  const handleDiscard = (cardToDiscard) => {
    const result = handleDiscardFn({
      cardToDiscard,
      pendingDrawnCard,
      players,
      currentPlayerIndex,
      setPlayers,
      setSandDecks,
      setBloodDecks,
      setPendingDrawnCard,
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

  // Passer son tour
  const passTurn = () =>
    passTurnUtil({
      pendingDrawnCard,
      gameState,
      GAME_STATES,
      players,
      consecutivePasses,
      setConsecutivePasses,
      setGameState,
      nextPlayer,
      addToHistory,
      checkForImpostors,
      currentPlayerIndex,
      setLastPlayerBeforeReveal,
    });

  // Lancer les dés
  const rollDice = () => {
    // On autorise le lancer si nous sommes en phase REVEAL
    if (gameState !== GAME_STATES.REVEAL) return false;

    const dice1 = Math.floor(Math.random() * 6) + 1;
    const dice2 = Math.floor(Math.random() * 6) + 1;
    setDiceResults([dice1, dice2]);
    return true;
  };

  // Sélectionner la valeur d'un imposteur
  const selectImpostorValue = (cardId, value) => {
    if (!diceResults || !diceResults.includes(value)) return false;

    setPlayers(
      players.map((player) => ({
        ...player,
        hand: player.hand.map((card) =>
          card.id === cardId ? { ...card, value } : card
        ),
      }))
    );

    return true;
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
      setPendingImpostors(impostorsToHandle);
      setCurrentImpostorIndex(0);
      setDiceResults(null);
    }

    return impostorsToHandle.length > 0;
  };

  // Gérer la sélection de la valeur pour un imposteur
  const handleImpostorValue = (value) =>
    handleImpostorValueFn({
      value,
      pendingImpostors,
      currentImpostorIndex,
      players,
      setPlayers,
      setCurrentImpostorIndex,
      setPendingImpostors,
      setGameState,
      setDiceResults,
      GAME_STATES,
    });

  // Modification de la fonction endRound
  const endRound = () =>
    endRoundFn({
      players,
      startingTokens,
      setGameState,
      setWinners,
      setPlayerOrder,
      setRoundStartPlayer,
      setPlayers,
      setRound,
      getHandValue,
      compareHands,
      playerOrder,
      roundStartPlayer,
    });

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

    // Actions du jeu
    drawCard,
    handleDiscard,
    initializeGame,
    passTurn,
    rollDice,
    selectImpostorValue,
    endRound,
    getHandValue,
    calculateHandValue,
    handleImpostorValue,
    setGameState,
    compareHands,
    rollInitialDice,
    confirmTransition,
    getHistorySinceLastTurn,
    setDiceResults,

    // État de la partie
    isGameOver: gameState === GAME_STATES.GAME_OVER,
  };
};

export default useGameState;
