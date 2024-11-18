import React from "react";
import GameTurn from "./GameTurn";
import EndRoundOverlay from "./gameBoard/EndRoundOverlay";
import FinalRevealOverlay from "./gameBoard/FinalRevealOverlay";
import GameDecks from "./gameBoard/GameDecks";
import PlayerHand from "./gameBoard/PlayerHand";
import PlayerTransitionScreen from "./gameBoard/PlayerTransitionScreen";

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
}) => {
  const getNextPlayer = () => {
    if (!players || players.length === 0) return null;
    const nextIndex = (currentPlayerIndex + 1) % players.length;
    return players[nextIndex];
  };

  const nextPlayer = getNextPlayer();

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

      {/* Affichage de la main du joueur actif et des joueurs restants */}
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 mb-4 flex space-x-8 items-start">
        <div>
          <PlayerHand
            player={players[currentPlayerIndex]}
            isCurrentPlayer={true}
            isRevealPhase={gameState === GAME_STATES.REVEAL}
            pendingDrawnCard={pendingDrawnCard}
            onChooseDiscard={handleDiscard}
            selectedDiceValue={players[currentPlayerIndex]?.selectedDiceValue}
            onSelectDiceValue={selectImpostorValue}
            isTransitioning={isTransitioning}
          />
        </div>
        <div className="bg-white p-4 rounded-lg shadow-lg">
          <h3 className="font-bold mb-2">Joueurs restants</h3>
          <ul>
            {players.map((player) => (
              <li key={player.id} className="mb-1">
                {player.name}: {player.tokens} jetons
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Ajout de l'écran de transition */}
      {isTransitioning && nextPlayer && (
        <PlayerTransitionScreen
          nextPlayer={nextPlayer}
          onReady={confirmTransition}
          actionHistory={getHistorySinceLastTurn(getNextPlayer()?.id)}
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
