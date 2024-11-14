import { useEffect, useState } from "react";
import {
  CARD_FAMILIES,
  CARD_TYPES,
  DECK_STRUCTURE,
  GAME_STATES,
  HAND_TYPES,
  compareHands,
  getHandValue,
} from "../constants/gameConstants";

const useGameState = (initialPlayerCount, initialTokenCount) => {
  // États du jeu
  const [gameState, setGameState] = useState(GAME_STATES.SETUP);
  const [players, setPlayers] = useState([]);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [round, setRound] = useState(1);
  const [turn, setTurn] = useState(1);
  const [consecutivePasses, setConsecutivePasses] = useState(0);
  const [diceResults, setDiceResults] = useState(null);
  const [winners, setWinners] = useState([]);
  const [pendingDrawnCard, setPendingDrawnCard] = useState(null);
  const [pendingImpostors, setPendingImpostors] = useState([]);
  const [currentImpostorIndex, setCurrentImpostorIndex] = useState(0);
  const [startingTokens, setStartingTokens] = useState({});

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

  // Création et mélange des paquets
  const createAndShuffleDecks = () => {
    const createDeck = (family) => {
      const deck = [];
      const structure = DECK_STRUCTURE[family];

      // Ajout des cartes normales
      structure.normalCards.forEach((value) => {
        deck.push({
          id: `${family}-normal-${value}-${Date.now()}`, // Ajout de timestamp pour l'unicité
          type: CARD_TYPES.NORMAL,
          family,
          value,
        });
      });

      // Ajout des sylops
      for (let i = 0; i < structure.sylopCount; i++) {
        deck.push({
          id: `${family}-sylop-${i}-${Date.now()}`,
          type: CARD_TYPES.SYLOP,
          family,
          value: null,
        });
      }

      // Ajout des imposteurs
      for (let i = 0; i < structure.impostorCount; i++) {
        deck.push({
          id: `${family}-impostor-${i}-${Date.now()}`,
          type: CARD_TYPES.IMPOSTOR,
          family,
          value: null,
        });
      }

      // Mélange du paquet
      return deck.sort(() => Math.random() - 0.5);
    };

    return {
      sandDeck: createDeck(CARD_FAMILIES.SAND),
      bloodDeck: createDeck(CARD_FAMILIES.BLOOD),
    };
  };

  // Fonction utilitaire pour tirer une carte d'un paquet
  const drawCardFromDeck = (deck) => {
    if (!deck || deck.length === 0) return null;
    return deck.shift();
  };

  // Initialisation du jeu et nouvelle manche
  const initializeGame = () => {
    // Création ou récupération des joueurs avec copie profonde
    const newPlayers =
      players.length > 0
        ? players.map((player) => ({
            ...player,
            tokens: player.tokens, // Conserver les jetons actuels
          }))
        : Array(initialPlayerCount)
            .fill(null)
            .map((_, index) => ({
              id: index + 1,
              name: `Joueur ${index + 1}`,
              tokens: initialTokenCount,
            }));

    // Stocker les jetons de début de manche
    const newStartingTokens = {};
    newPlayers.forEach((player) => {
      newStartingTokens[player.id] = player.tokens;
    });
    setStartingTokens(newStartingTokens);

    // Distribution des nouvelles cartes
    const { sandDeck, bloodDeck } = createAndShuffleDecks();

    // Distribution des nouvelles cartes
    newPlayers.forEach((player) => {
      player.hand = [drawCardFromDeck(sandDeck), drawCardFromDeck(bloodDeck)];
    });

    // Mise en place des pioches visibles
    setSandDecks({
      visible: [drawCardFromDeck(sandDeck)],
      hidden: sandDeck,
    });

    setBloodDecks({
      visible: [drawCardFromDeck(bloodDeck)],
      hidden: bloodDeck,
    });

    // Réinitialisation de tous les états nécessaires
    setPendingDrawnCard(null);
    setDiceResults(null);
    setConsecutivePasses(0);
    setCurrentPlayerIndex(0);
    setTurn(1);
    setPlayers(newPlayers);

    // Passer à l'état PLAYER_TURN
    setGameState(GAME_STATES.PLAYER_TURN);
  };

  // Passer au joueur suivant
  const nextPlayer = () => {
    const nextIndex = (currentPlayerIndex + 1) % players.length;

    if (nextIndex === 0) {
      // Si on a fait le tour complet
      if (turn >= 3) {
        // Vérifier d'abord les imposteurs avant de passer à la révélation
        if (checkForImpostors()) {
          // Si il y a des imposteurs, la phase de dés sera déclenchée
          // et la révélation viendra après
          return;
        }
        setGameState(GAME_STATES.REVEAL);
      } else {
        // Incrémenter le tour avant de changer de joueur
        setTurn((prevTurn) => prevTurn + 1);
      }
    }

    setCurrentPlayerIndex(nextIndex);
  };

  // Pioche d'une carte
  const drawCard = (family, isVisible, card = null) => {
    const currentPlayer = players[currentPlayerIndex];

    // Vérifications préalables
    if (pendingDrawnCard) return false;
    if (currentPlayer.tokens < 1) return false;
    if (gameState !== GAME_STATES.PLAYER_TURN) return false;

    let drawnCard = card;

    if (isVisible) {
      if (family === CARD_FAMILIES.SAND) {
        setSandDecks((prev) => ({
          ...prev,
          visible: [],
        }));
      } else {
        setBloodDecks((prev) => ({
          ...prev,
          visible: [],
        }));
      }
    } else {
      const sourceDeck =
        family === CARD_FAMILIES.SAND ? sandDecks.hidden : bloodDecks.hidden;
      if (sourceDeck.length === 0) return false;

      drawnCard = sourceDeck[0];
      if (family === CARD_FAMILIES.SAND) {
        setSandDecks((prev) => ({
          ...prev,
          hidden: prev.hidden.slice(1),
        }));
      } else {
        setBloodDecks((prev) => ({
          ...prev,
          hidden: prev.hidden.slice(1),
        }));
      }
    }

    // Déduire le jeton
    setPlayers(
      players.map((player) =>
        player.id === currentPlayer.id
          ? { ...player, tokens: player.tokens - 1 }
          : player
      )
    );

    setPendingDrawnCard(drawnCard);
    setConsecutivePasses(0);
    return true;
  };

  // Gestion de la défausse
  const handleDiscard = (cardToDiscard) => {
    if (!pendingDrawnCard || !cardToDiscard) return false;

    const currentPlayer = players[currentPlayerIndex];

    // Si on défausse la carte piochée
    if (cardToDiscard.id === pendingDrawnCard.id) {
      // Mettre la carte dans la pioche visible correspondante
      if (cardToDiscard.family === CARD_FAMILIES.SAND) {
        setSandDecks((prev) => ({
          ...prev,
          visible: [cardToDiscard],
        }));
      } else {
        setBloodDecks((prev) => ({
          ...prev,
          visible: [cardToDiscard],
        }));
      }
    }
    // Si on défausse une carte de la main
    else {
      // Remplacer la carte défaussée par la carte piochée
      const updatedHand = currentPlayer.hand.map((card) =>
        card.id === cardToDiscard.id ? pendingDrawnCard : card
      );

      // Mettre la carte défaussée dans la pioche visible
      if (cardToDiscard.family === CARD_FAMILIES.SAND) {
        setSandDecks((prev) => ({
          ...prev,
          visible: [cardToDiscard],
        }));
      } else {
        setBloodDecks((prev) => ({
          ...prev,
          visible: [cardToDiscard],
        }));
      }

      setPlayers(
        players.map((player) =>
          player.id === currentPlayer.id
            ? { ...player, hand: updatedHand }
            : player
        )
      );
    }

    setPendingDrawnCard(null);
    nextPlayer();
    return true;
  };

  // Passer son tour
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

    players.forEach((player) => {
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
  // Gérer la sélection de la valeur pour un imposteur
  const handleImpostorValue = (value) => {
    if (!pendingImpostors[currentImpostorIndex]) return false;

    const { playerId, cardId } = pendingImpostors[currentImpostorIndex];

    // Mettre à jour la valeur de l'imposteur
    setPlayers(
      players.map((player) => {
        if (player.id === playerId) {
          return {
            ...player,
            hand: player.hand.map((card) =>
              card.id === cardId ? { ...card, value } : card
            ),
          };
        }
        return player;
      })
    );

    // Passer à l'imposteur suivant ou terminer
    if (currentImpostorIndex + 1 < pendingImpostors.length) {
      setCurrentImpostorIndex((prev) => prev + 1);
      setDiceResults(null); // Réinitialiser les dés pour le prochain lancer
    } else {
      // Ajouter un petit délai avant de passer à la révélation
      setTimeout(() => {
        setGameState(GAME_STATES.REVEAL);
        setPendingImpostors([]);
        setCurrentImpostorIndex(0);
        setDiceResults(null);
      }, 1000);
    }

    return true;
  };

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
  const endRound = () => {
    // Calculer les valeurs finales des mains
    const playerResults = players.map((player) => ({
      ...player,
      handValue: getHandValue(player.hand),
      initialTokens: startingTokens[player.id],
      tokensBet: startingTokens[player.id] - player.tokens,
    }));

    // Trouver la meilleure main
    let bestHand = playerResults[0];
    playerResults.slice(1).forEach((player) => {
      if (compareHands(player.hand, bestHand.hand) > 0) {
        bestHand = player;
      }
    });

    // Trouver tous les gagnants (peut y avoir égalité)
    const winners = playerResults.filter(
      (player) => compareHands(player.hand, bestHand.hand) === 0
    );

    // Appliquer les pertes de jetons et restituer les mises aux gagnants
    const updatedPlayers = playerResults.map((player) => {
      const isWinner = winners.some((w) => w.id === player.id);

      // On part des jetons de début de manche
      let finalTokens = player.initialTokens;

      if (isWinner) {
        // Les gagnants gardent tous leurs jetons (pas de perte de mise)
        finalTokens = player.initialTokens;
      } else {
        // Les perdants :
        // 1. Perdent leurs mises
        finalTokens -= player.tokensBet;

        // 2. Perdent des jetons de pénalité
        let penaltyTokens = 0;
        if (player.handValue.type === HAND_TYPES.PAIR) {
          penaltyTokens = 1;
        } else if (player.handValue.type === HAND_TYPES.DIFFERENCE) {
          penaltyTokens = player.handValue.value;
        }
        finalTokens = Math.max(0, finalTokens - penaltyTokens);
      }

      return {
        ...player,
        tokens: finalTokens,
      };
    });

    // Éliminer les joueurs sans jetons
    const remainingPlayers = updatedPlayers.filter(
      (player) => player.tokens > 0
    );

    if (remainingPlayers.length <= 1) {
      setGameState(GAME_STATES.GAME_OVER);
      setWinners(remainingPlayers);
    } else {
      setPlayers(remainingPlayers);
      setRound((prev) => prev + 1);
      setGameState(GAME_STATES.SETUP);
    }
  };

  return {
    // État du jeu
    gameState,
    setGameState,
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
    handleImpostorValue,
    currentImpostorIndex,
    calculateHandValue,
    startingTokens,

    // Actions du jeu
    drawCard,
    handleDiscard,
    passTurn,
    rollDice,
    selectImpostorValue,
    endRound,
    getHandValue,
    HAND_TYPES,
    compareHands,
    initialTokenCount,

    // État de la partie
    isGameOver: gameState === GAME_STATES.GAME_OVER,
  };
};

export default useGameState;
