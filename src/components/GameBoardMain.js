import React, { useState } from "react";
import { GAME_STATES } from "../constants/gameConstants";
import {
  useCardsInfo,
  useGameActions,
  useGameInfo,
  useJokersInfo,
  usePlayersInfo,
} from "../contexts/GameContext";
import EndRoundOverlay from "./gameBoard/finalReveal/EndRoundOverlay";
import FinalRevealOverlay from "./gameBoard/finalReveal/FinalRevealOverlay";
import GameDecks from "./gameBoard/GameDecks";
import PlayerHand from "./gameBoard/PlayerHand";
import PlayerTransitionScreen from "./gameBoard/PlayerTransitionScreen";
import RemainingPlayers from "./gameBoard/RemainingPlayers";
import DiscardChoice from "./gameTurn/DiscardChoice";

const GameBoardMain = () => {
  const [previewCardId, setPreviewCardId] = useState(null);

  // Utiliser les hooks du context
  const { gameState, round, turn, consecutivePasses, jokerEUsed } =
    useGameInfo();
  const {
    players,
    currentPlayerIndex,
    playerOrder,
    roundStartPlayer,
    startingTokens,
  } = usePlayersInfo();
  const {
    sandDecks,
    bloodDecks,
    pendingDrawnCard,
    diceResults,
    lastPlayerBeforeReveal,
  } = useCardsInfo();
  const { selectedJokers, usedJokersThisRound, hasUsedJokerA } =
    useJokersInfo();
  const {
    drawCard,
    handleDiscard,
    passTurn,
    rollDice,
    selectImpostorValue,
    handleImpostorValue,
    compareHands,
    calculateHandValue,
    getHandValue,
    setGameState,
    setDiceResults,
    endRound,
    useJoker,
    isTransitioning,
    confirmTransition,
    getHistorySinceLastTurn,
  } = useGameActions();

  const currentPlayer = players?.[currentPlayerIndex];

  const getNextPlayer = () => {
    if (
      !players ||
      players.length === 0 ||
      !playerOrder ||
      playerOrder.length === 0 ||
      !currentPlayer
    )
      return null;

    const currentPlayerIdIndex = playerOrder.findIndex(
      (id) => id === currentPlayer.id
    );
    const nextPlayerIdIndex = (currentPlayerIdIndex + 1) % playerOrder.length;
    return players.find((p) => p.id === playerOrder[nextPlayerIdIndex]);
  };

  const nextPlayer = getNextPlayer();

  if (!currentPlayer) return null;

  const handlePreviewChange = (cardId, newCard) => {
    setPreviewCardId(cardId);
  };

  return (
    <div className="relative w-full min-h-screen bg-gray-100 flex flex-col overflow-hidden">
      {/* Zone du centre avec les pioches */}
      <div className="flex-shrink-0 flex items-center justify-center px-4 py-4">
        <GameDecks
          visibleSandCard={sandDecks.visible[sandDecks.visible.length - 1]}
          visibleBloodCard={bloodDecks.visible[bloodDecks.visible.length - 1]}
          onDrawCard={drawCard}
          currentPlayerTokens={currentPlayer.tokens}
          isCurrentPlayerTurn={
            gameState === GAME_STATES.PLAYER_TURN && !pendingDrawnCard
          }
          hasUsedJokerA={hasUsedJokerA}
          round={round}
          turn={turn}
          consecutivePasses={consecutivePasses}
          players={players}
          jokerEUsed={jokerEUsed}
        />
      </div>

      {/* Zone du bas avec la main du joueur et les informations */}
      <div className="flex-1 px-4 py-2 overflow-y-auto">
        <div className="max-w-[800px] mx-auto">
          <div className="flex flex-col md:flex-row items-start gap-6 mb-4">
            {/* Main du joueur avec jokers intégrés */}
            <div className="flex-1 w-full md:w-auto relative">
              {pendingDrawnCard && (
                <DiscardChoice
                  pendingDrawnCard={pendingDrawnCard}
                  currentPlayer={currentPlayer}
                  onChooseDiscard={handleDiscard}
                  onPreviewChange={handlePreviewChange}
                />
              )}
              <PlayerHand
                player={currentPlayer}
                isCurrentPlayer={true}
                isRevealPhase={gameState === GAME_STATES.REVEAL}
                pendingDrawnCard={pendingDrawnCard}
                onChooseDiscard={handleDiscard}
                selectedDiceValue={currentPlayer.selectedDiceValue}
                onSelectDiceValue={selectImpostorValue}
                isTransitioning={isTransitioning}
                startingTokens={startingTokens}
                onPass={passTurn}
                currentPlayerTokens={currentPlayer.tokens}
                players={players}
                consecutivePasses={consecutivePasses}
                selectedJokers={selectedJokers}
                onUseJoker={useJoker}
                usedJokersThisRound={usedJokersThisRound}
                previewCardId={previewCardId}
              />
            </div>

            {/* Joueurs restants */}
            <div className="w-full md:w-[350px] flex-shrink-0 order-first md:order-last">
              <RemainingPlayers
                players={players}
                currentPlayerIndex={currentPlayerIndex}
                startingTokens={startingTokens}
                selectedJokers={selectedJokers}
                onUseJoker={useJoker}
                usedJokersThisRound={usedJokersThisRound}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Ajout de l'écran de transition */}
      {isTransitioning && nextPlayer && (
        <PlayerTransitionScreen
          nextPlayer={nextPlayer}
          onReady={confirmTransition}
          actionHistory={getHistorySinceLastTurn(getNextPlayer()?.id)}
          usedJokers={usedJokersThisRound}
          players={players}
        />
      )}

      {/* Overlay pour la phase de révélation */}
      {gameState === GAME_STATES.REVEAL && (
        <FinalRevealOverlay
          players={players}
          playerOrder={playerOrder}
          lastPlayerBeforeReveal={lastPlayerBeforeReveal}
          diceResults={diceResults}
          compareHands={compareHands}
          calculateHandValue={calculateHandValue}
          handleImpostorValue={handleImpostorValue}
          rollDice={rollDice}
          setGameState={setGameState}
          GAME_STATES={GAME_STATES}
          setDiceResults={setDiceResults}
          jokerEUsed={jokerEUsed}
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
          setGameState={setGameState}
          endRound={endRound}
          GAME_STATES={GAME_STATES}
          roundStartPlayer={roundStartPlayer}
          playerOrder={playerOrder}
        />
      )}
    </div>
  );
};

export default React.memo(GameBoardMain);
