import React from "react";
import { GAME_STATES, INITIAL_DICE_STATES } from "../constants/gameConstants";
import useGameState from "../hooks/useGameState";
import DiceRollOverlay from "./gameBoard/DiceRollOverlay";
import EndRoundOverlay from "./gameBoard/EndRoundOverlay";
import GameDecks from "./gameBoard/GameDecks";
import GameOverScreen from "./gameBoard/GameOverScreen";
import InitialDiceRoll from "./gameBoard/InitialDiceRoll";
import PlayerHand from "./gameBoard/PlayerHand";
import PlayerTransitionScreen from "./gameBoard/PlayerTransitionScreen";
import RevealPhaseOverlay from "./gameBoard/RevealPhaseOverlay";
import GameTurn from "./GameTurn";

const GameBoard = ({ playerCount, tokenCount, onGameEnd }) => {
  const {
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
    drawCard,
    handleDiscard,
    passTurn,
    rollDice,
    selectImpostorValue,
    endRound,
    isGameOver,
    getHandValue,
    HAND_TYPES,
    compareHands,
    startingTokens,
    initialDiceState,
    initialDiceResults,
    playersToReroll,
    playerOrder,
    rollInitialDice,
    rerollResults,
    roundStartPlayer,
    isTransitioning,
    confirmTransition,
  } = useGameState(playerCount, tokenCount);

  // Vérification que le jeu est correctement initialisé
  if (!players || players.length === 0) {
    return <div>Chargement du jeu...</div>;
  }

  // Condition pour afficher l'écran de lancer de dés initial
  if (gameState === GAME_STATES.INITIAL_DICE_ROLL) {
    return (
      <InitialDiceRoll
        players={players}
        initialDiceState={initialDiceState}
        INITIAL_DICE_STATES={INITIAL_DICE_STATES}
        initialDiceResults={initialDiceResults}
        rerollResults={rerollResults}
        rollInitialDice={rollInitialDice}
        playersToReroll={playersToReroll}
        playerOrder={playerOrder}
      />
    );
  }

  const getPlayerPosition = (playerId) => {
    const playerIndex = players.findIndex((p) => p.id === playerId);
    const positions =
      playerCount === 3
        ? ["bottom", "top-left", "top-right"]
        : ["bottom", "left", "top", "right"];
    return positions[playerIndex];
  };

  const getPlayerPositionClasses = (position) => {
    switch (position) {
      case "bottom":
        return "bottom-0 left-1/2 transform -translate-x-1/2 mb-4";
      case "top":
        return "top-0 left-1/2 transform -translate-x-1/2 mt-4";
      case "left":
        return "left-0 top-1/2 transform -translate-y-1/2 ml-4";
      case "right":
        return "right-0 top-1/2 transform -translate-y-1/2 mr-4";
      case "top-left":
        return "top-1/4 left-1/4 transform -translate-x-1/2 -translate-y-1/2";
      case "top-right":
        return "top-1/4 right-1/4 transform translate-x-1/2 -translate-y-1/2";
      default:
        return "";
    }
  };

  // Si le jeu est terminé
  if (isGameOver) {
    return (
      <GameOverScreen
        winners={winners}
        players={players}
        playerOrder={playerOrder}
        roundStartPlayer={roundStartPlayer}
        onGameEnd={onGameEnd}
      />
    );
  }

  const getNextPlayer = () => {
    const nextIndex = (currentPlayerIndex + 1) % players.length;
    return players[nextIndex];
  };

  return (
    <div className="relative w-full h-screen bg-gray-100 overflow-hidden">
      {/* Zone d'information du tour */}
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-96 mt-4">
        <GameTurn
          gameState={gameState}
          currentPlayer={players[currentPlayerIndex]}
          players={players}
          roundNumber={round}
          turnNumber={turn}
          consecutivePasses={consecutivePasses}
          isCurrentPlayerTurn={gameState === GAME_STATES.PLAYER_TURN}
          pendingDrawnCard={pendingDrawnCard}
          onPass={passTurn}
          onChooseDiscard={handleDiscard}
          diceResults={diceResults}
          onRollDice={rollDice}
          currentPlayerTokens={players[currentPlayerIndex]?.tokens || 0}
          playerOrder={playerOrder}
          roundStartPlayer={roundStartPlayer}
        />
      </div>

      {/* Zone du centre avec les pioches */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <GameDecks
          visibleSandCard={sandDecks.visible[0]}
          visibleBloodCard={bloodDecks.visible[0]}
          onDrawCard={drawCard}
          currentPlayerTokens={players[currentPlayerIndex]?.tokens || 0}
          isCurrentPlayerTurn={
            gameState === GAME_STATES.PLAYER_TURN && !pendingDrawnCard
          }
        />
      </div>

      {/* Mains des joueurs */}
      {players.map((player) => (
        <div
          key={player.id}
          className={`absolute ${getPlayerPositionClasses(
            getPlayerPosition(player.id)
          )}`}
        >
          <PlayerHand
            player={player}
            isCurrentPlayer={player.id === players[currentPlayerIndex].id}
            isRevealPhase={gameState === GAME_STATES.REVEAL}
            pendingDrawnCard={pendingDrawnCard}
            onChooseDiscard={handleDiscard}
            selectedDiceValue={player.selectedDiceValue}
            onSelectDiceValue={selectImpostorValue}
            isTransitioning={isTransitioning}
          />
        </div>
      ))}

      {/* Overlay pour la phase de lancer de dés */}
      {gameState === GAME_STATES.DICE_ROLL && (
        <DiceRollOverlay
          pendingImpostors={pendingImpostors}
          currentImpostorIndex={currentImpostorIndex}
          players={players}
          diceResults={diceResults}
          handleImpostorValue={handleImpostorValue}
          rollDice={rollDice}
        />
      )}

      {/* Ajout de l'écran de transition */}
      {isTransitioning && (
        <PlayerTransitionScreen
          nextPlayer={getNextPlayer()}
          onReady={confirmTransition}
        />
      )}

      {/* Overlay pour la phase de révélation */}
      {gameState === GAME_STATES.REVEAL && (
        <RevealPhaseOverlay
          players={players}
          compareHands={compareHands}
          calculateHandValue={calculateHandValue}
          setGameState={setGameState}
          GAME_STATES={GAME_STATES}
        />
      )}

      {/* Overlay pour la fin de manche */}
      {gameState === GAME_STATES.END_ROUND && (
        <EndRoundOverlay
          round={round}
          players={players}
          compareHands={compareHands}
          getHandValue={getHandValue}
          startingTokens={startingTokens}
          HAND_TYPES={HAND_TYPES}
          setGameState={setGameState}
          endRound={endRound}
          GAME_STATES={GAME_STATES}
          roundStartPlayer={roundStartPlayer}
        />
      )}
    </div>
  );
};

export default GameBoard;
