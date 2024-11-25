import React from "react";
import jetonImage from "../assets/img/jeton.png";
import jetonKoImage from "../assets/img/jeton_ko.png";
import EndRoundOverlay from "./gameBoard/EndRoundOverlay";
import FinalRevealOverlay from "./gameBoard/FinalRevealOverlay";
import GameDecks from "./gameBoard/GameDecks";
import PlayerHand from "./gameBoard/PlayerHand";
import PlayerJokers from "./gameBoard/PlayerJokers";
import PlayerTransitionScreen from "./gameBoard/PlayerTransitionScreen";

const TokenDisplay = ({ count, type = "available" }) => {
  return (
    <div className="flex items-center gap-1">
      <img
        src={type === "available" ? jetonImage : jetonImage}
        alt="Jeton"
        className="w-4 h-4 sm:w-5 sm:h-5"
      />
      <span className="text-xs sm:text-sm">{count}</span>
    </div>
  );
};

const TokensRow = ({ availableTokens, betTokens }) => {
  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-1">
        {[...Array(availableTokens)].map((_, index) => (
          <img
            key={index}
            src={jetonImage}
            alt="Jeton disponible"
            className="w-4 h-4 sm:w-5 sm:h-5"
          />
        ))}
      </div>
      {betTokens > 0 && (
        <div className="flex items-center gap-1">
          {[...Array(betTokens)].map((_, index) => (
            <img
              key={index}
              src={jetonKoImage}
              alt="Jeton misé"
              className="w-4 h-4 sm:w-5 sm:h-5"
            />
          ))}
        </div>
      )}
    </div>
  );
};

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
    <div className="relative w-full min-h-screen bg-gray-100 flex flex-col justify-between overflow-hidden">
      {/* Zone d'information du tour */}
      {/* <div className="w-full px-4 py-2">
        <div className="mx-auto max-w-md">
          <GameTurn
            gameState={gameState}
            currentPlayer={currentPlayer}
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
            currentPlayerTokens={currentPlayer.tokens}
            playerOrder={playerOrder}
            roundStartPlayer={roundStartPlayer}
          />
        </div>
      </div>
*/}
      {/* Zone du centre avec les pioches */}
      <div className="flex-1 flex items-center justify-center px-4">
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

      {/* Zone du bas avec la main du joueur et les joueurs restants */}
      <div className="w-full px-4 py-2">
        <div className="flex flex-row items-start justify-center gap-4">
          <div className="flex-shrink-0 max-w-[80%]">
            <div className="flex flex-col gap-2">
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
              />
              <PlayerJokers
                player={currentPlayer}
                selectedJokers={selectedJokers}
                isCurrentPlayer={true}
                onUseJoker={useJoker}
                usedJokersThisRound={usedJokersThisRound}
              />
            </div>
          </div>

          <div className="flex-shrink-0 w-[20%] min-w-[100px] max-w-[150px] bg-white p-2 sm:p-3 rounded-lg shadow-lg">
            <h3 className="font-bold mb-2 text-xs sm:text-sm">
              Joueurs restants
            </h3>
            <ul className="space-y-2">
              {players
                .filter((player, index) => index !== currentPlayerIndex)
                .map((player) => {
                  const tokensBet = startingTokens[player.id] - player.tokens;
                  return (
                    <li key={player.id} className="flex flex-col gap-1">
                      <span className="font-semibold text-xs sm:text-sm">
                        {player.name}
                      </span>
                      <TokensRow
                        availableTokens={player.tokens}
                        betTokens={tokensBet}
                      />
                      {tokensBet > 0 && (
                        <div className="flex items-center gap-1 text-amber-600">
                          <TokenDisplay count={tokensBet} type="bet" />
                          <span className="text-xs">misés</span>
                        </div>
                      )}
                      <PlayerJokers
                        player={player}
                        selectedJokers={selectedJokers}
                        isCurrentPlayer={false}
                        onUseJoker={useJoker}
                        usedJokersThisRound={usedJokersThisRound}
                      />
                    </li>
                  );
                })}
            </ul>
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
