import React, { useEffect, useState } from "react";
import { GAME_STATES } from "../constants/gameConstants";
import {
  GameProvider,
  useGameActions,
  useGameInfo,
} from "../contexts/GameContext";
import GameOverScreen from "./gameBoard/GameOverScreen";
import InitialCardDraw from "./gameBoard/InitialCardDraw";
import RoundTurnAnnouncement from "./gameBoard/RoundTurnAnnouncement";
import GameBoardMain from "./GameBoardMain";
import JokerSelection from "./JokerSelection";

// Composant interne qui utilise le contexte
const GameBoardContent = ({ onGameEnd }) => {
  const { gameState, round, turn, isGameOver, winners } = useGameInfo();
  const { setGameState, setPlayerOrder } = useGameActions();

  // Ajout d'un état pour gérer l'affichage de l'annonce
  const [showAnnouncement, setShowAnnouncement] = useState(false);
  const [announcementKey, setAnnouncementKey] = useState(0);

  // Effet pour déclencher l'animation à chaque changement de tour
  useEffect(() => {
    if (gameState === GAME_STATES.PLAYER_TURN) {
      setShowAnnouncement(true);
      setAnnouncementKey((prev) => prev + 1);

      // Masquer l'annonce après l'animation
      const timer = setTimeout(() => {
        setShowAnnouncement(false);
      }, 2500);

      return () => clearTimeout(timer);
    }
  }, [round, turn, gameState]);

  // Condition pour afficher l'écran de tirage de cartes initial
  if (gameState === GAME_STATES.INITIAL_DICE_ROLL) {
    return (
      <InitialCardDraw
        setGameState={setGameState}
        GAME_STATES={GAME_STATES}
        setPlayerOrder={setPlayerOrder}
      />
    );
  }

  // Condition pour afficher la sélection des jokers
  if (gameState === GAME_STATES.JOKER_SELECTION) {
    return <JokerSelection setGameState={setGameState} />;
  }

  // Si le jeu est terminé
  if (isGameOver) {
    return <GameOverScreen winners={winners} onGameEnd={onGameEnd} />;
  }

  return (
    <div className="relative">
      {/* Afficher l'annonce si showAnnouncement est true */}
      {showAnnouncement && (
        <RoundTurnAnnouncement
          key={announcementKey}
          round={round}
          turn={turn}
        />
      )}

      <GameBoardMain />
    </div>
  );
};

// Composant principal qui fournit le contexte
const GameBoard = ({
  playerCount,
  tokenCount,
  playerNames,
  playerAvatars,
  onGameEnd,
  withoutJokers,
}) => {
  return (
    <GameProvider
      playerCount={playerCount}
      tokenCount={tokenCount}
      playerNames={playerNames}
      playerAvatars={playerAvatars}
      withoutJokers={withoutJokers}
    >
      <GameBoardContent onGameEnd={onGameEnd} />
    </GameProvider>
  );
};

export default React.memo(GameBoard, (prevProps, nextProps) => {
  return (
    prevProps.playerCount === nextProps.playerCount &&
    prevProps.tokenCount === nextProps.tokenCount &&
    prevProps.withoutJokers === nextProps.withoutJokers &&
    JSON.stringify(prevProps.playerNames) ===
      JSON.stringify(nextProps.playerNames) &&
    JSON.stringify(prevProps.playerAvatars) ===
      JSON.stringify(nextProps.playerAvatars)
  );
});
