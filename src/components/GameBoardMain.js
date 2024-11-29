import React from "react";
import EndRoundOverlay from "./gameBoard/EndRoundOverlay";
import FinalRevealOverlay from "./gameBoard/FinalRevealOverlay";
import GameDecks from "./gameBoard/GameDecks";
import PlayerHand from "./gameBoard/PlayerHand";
import PlayerTransitionScreen from "./gameBoard/PlayerTransitionScreen";
import RemainingPlayers from "./gameBoard/RemainingPlayers";
import DiscardChoice from "./gameTurn/DiscardChoice";

const GameBoardMain = ({
  gameState,
  players,
  currentPlayerIndex,
  round,
  turn,
  consecutivePasses,
  diceResults,
  pendingDrawnCard,
  sandDecks,
  bloodDecks,
  handleImpostorValue,
  drawCard,
  handleDiscard,
  passTurn,
  rollDice,
  selectImpostorValue,
  compareHands,
  calculateHandValue,
  getHandValue,
  HAND_TYPES,
  startingTokens,
  setGameState,
  GAME_STATES,
  isTransitioning,
  confirmTransition,
  getHistorySinceLastTurn,
  playerOrder,
  roundStartPlayer,
  endRound,
  setDiceResults,
  lastPlayerBeforeReveal,
  selectedJokers,
  usedJokersThisRound,
  useJoker,
  hasUsedJokerA,
  jokerEUsed,
}) => {
  const getNextPlayer = () => {
    if (!players || players.length === 0) return null;
    const nextIndex = (currentPlayerIndex + 1) % players.length;
    return players[nextIndex];
  };

  const nextPlayer = getNextPlayer();
  const currentPlayer = players?.[currentPlayerIndex];

  if (!currentPlayer) return null;

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
        />
      </div>

      {/* Modal DiscardChoice avec z-index élevé */}
      {pendingDrawnCard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="transform -translate-y-16">
            <DiscardChoice
              pendingDrawnCard={pendingDrawnCard}
              currentPlayer={currentPlayer}
              onChooseDiscard={handleDiscard}
            />
          </div>
        </div>
      )}

      {/* Zone du bas avec la main du joueur et les informations */}
      <div className="flex-1 px-4 py-2 overflow-y-auto">
        <div className="max-w-[800px] mx-auto">
          <div className="flex flex-col md:flex-row items-start gap-6 mb-4">
            {/* Main du joueur avec jokers intégrés */}
            <div className="flex-1 w-full md:w-auto">
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
              />
            </div>

            {/* Joueurs restants */}
            <div className="w-full md:w-[180px] flex-shrink-0 order-first md:order-last">
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
        />
      )}

      {/* Overlay pour la phase de révélation */}
      {gameState === GAME_STATES.REVEAL && (
        <FinalRevealOverlay
          players={players}
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

export default GameBoardMain;
