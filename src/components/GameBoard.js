import React, { useEffect } from "react";
import { GAME_STATES, INITIAL_DICE_STATES } from "../constants/gameConstants";
import useGameState from "../hooks/useGameState";
import GameOverScreen from "./gameBoard/GameOverScreen";
import InitialDiceRoll from "./gameBoard/InitialDiceRoll";
import GameBoardMain from "./GameBoardMain";
import JokerSelection from "./JokerSelection";

const GameBoard = ({
  playerCount,
  tokenCount,
  playerNames,
  playerAvatars,
  onGameEnd,
}) => {
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
    getHistorySinceLastTurn,
    setDiceResults,
    lastPlayerBeforeReveal,
    selectedJokers,
    currentJokerSelectionPlayer,
    setSelectedJokers,
    setCurrentJokerSelectionPlayer,
    usedJokersThisRound,
    useJoker,
    jokerEUsed,
  } = useGameState(playerCount, tokenCount, playerNames, playerAvatars);

  // Ajout d'un debug pour vérifier les données
  useEffect(() => {
    console.log("Players with avatars:", players);
  }, [players]);

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
        setGameState={setGameState}
      />
    );
  }

  // Ajout de la condition pour afficher la sélection des jokers
  if (gameState === GAME_STATES.JOKER_SELECTION) {
    return (
      <JokerSelection
        players={players}
        currentJokerSelectionPlayer={currentJokerSelectionPlayer}
        selectedJokers={selectedJokers}
        setSelectedJokers={setSelectedJokers}
        setCurrentJokerSelectionPlayer={setCurrentJokerSelectionPlayer}
        setGameState={setGameState}
      />
    );
  }

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

  return (
    <GameBoardMain
      gameState={gameState}
      players={players}
      currentPlayerIndex={currentPlayerIndex}
      round={round}
      turn={turn}
      consecutivePasses={consecutivePasses}
      diceResults={diceResults}
      pendingDrawnCard={pendingDrawnCard}
      sandDecks={sandDecks}
      bloodDecks={bloodDecks}
      pendingImpostors={pendingImpostors}
      handleImpostorValue={handleImpostorValue}
      currentImpostorIndex={currentImpostorIndex}
      drawCard={drawCard}
      handleDiscard={handleDiscard}
      passTurn={passTurn}
      rollDice={rollDice}
      selectImpostorValue={selectImpostorValue}
      compareHands={compareHands}
      calculateHandValue={calculateHandValue}
      getHandValue={getHandValue}
      HAND_TYPES={HAND_TYPES}
      startingTokens={startingTokens}
      setGameState={setGameState}
      GAME_STATES={GAME_STATES}
      isTransitioning={isTransitioning}
      confirmTransition={confirmTransition}
      getHistorySinceLastTurn={getHistorySinceLastTurn}
      playerOrder={playerOrder}
      roundStartPlayer={roundStartPlayer}
      endRound={endRound}
      setDiceResults={setDiceResults}
      lastPlayerBeforeReveal={lastPlayerBeforeReveal}
      selectedJokers={selectedJokers}
      usedJokersThisRound={usedJokersThisRound}
      useJoker={useJoker}
      jokerEUsed={jokerEUsed}
    />
  );
};

export default GameBoard;
