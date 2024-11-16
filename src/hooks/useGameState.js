import { useEffect, useState } from "react";
import {
  CARD_TYPES,
  GAME_STATES,
  HAND_TYPES,
  INITIAL_DICE_STATES,
  compareHands,
  getHandValue,
} from "../constants/gameConstants";
import checkForTiesFn from "./checkForTies";
import createAndShuffleDecksFn from "./createAndShuffleDecks";
import drawCardFn from "./drawCard";
import endRoundFn from "./endRound";
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
  // Suivre le joueur qui commence la manche
  const [roundStartPlayer, setRoundStartPlayer] = useState(null);

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
  }, [gameState]); // On écoute les changements de gameState

  // Fonction utilitaire pour tirer une carte d'un paquet
  const drawCardFromDeck = (deck) => {
    if (!deck || deck.length === 0) return null;
    return deck.shift();
  };

  // Initialisation du jeu et nouvelle manche
  const initializeGame = () =>
    initializeGameFn({
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

  // Passer au joueur suivant
  const nextPlayer = () => {
    setIsTransitioning(true); // Activer l'écran de transition avant de changer de joueur
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
  const drawCard = (family, isVisible, card = null) =>
    drawCardFn({
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

  // Gestion de la défausse
  const handleDiscard = (cardToDiscard) =>
    handleDiscardFn({
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

  // Passer son tour
  const passTurn = () => {
    // On vérifie uniquement qu'il n'y a pas de carte en attente
    // et qu'on est dans la bonne phase du jeu
    if (pendingDrawnCard) return false;
    if (gameState !== GAME_STATES.PLAYER_TURN) return false;

    setConsecutivePasses((prev) => {
      const newCount = prev + 1;
      // Si tous les joueurs ont passé
      if (newCount === players.length) {
        // Vérifier les imposteurs avant la révélation
        if (checkForImpostors()) {
          return 0;
        }
        setGameState(GAME_STATES.REVEAL);
        return 0;
      }
      return newCount;
    });

    nextPlayer();
    return true;
  };

  // Lancer les dés
  const rollDice = () => {
    if (gameState !== GAME_STATES.DICE_ROLL) return false;

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

    // Scanner les joueurs dans l'ordre (1, 2, 3...)
    players
      .sort((a, b) => a.id - b.id) // Trier les joueurs par ID
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
      setGameState(GAME_STATES.DICE_ROLL);
      return true;
    }

    return false;
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

  // Calculer la valeur d'une main
  const calculateHandValue = (hand) => {
    if (hand.length !== 2) return Infinity;

    const [card1, card2] = hand;

    // Pour les sylops
    if (card1.type === CARD_TYPES.SYLOP && card2.type === CARD_TYPES.SYLOP) {
      return 0; // Sabacc pur
    }
    if (card1.type === CARD_TYPES.SYLOP || card2.type === CARD_TYPES.SYLOP) {
      return 0; // Le sylop prend la valeur de l'autre carte
    }

    // Pour les imposteurs
    if (
      (card1.type === CARD_TYPES.IMPOSTOR && !card1.value) ||
      (card2.type === CARD_TYPES.IMPOSTOR && !card2.value)
    ) {
      return null; // Valeur non encore déterminée
    }

    return Math.abs(card1.value - card2.value);
  };

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

    // État de la partie
    isGameOver: gameState === GAME_STATES.GAME_OVER,
  };
};

export default useGameState;
