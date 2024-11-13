import React from "react";
import {
  CARD_FAMILIES,
  CARD_TYPES,
  GAME_STATES,
} from "../constants/gameConstants";
import useGameState from "../hooks/useGameState";
import GameDecks from "./GameDecks";
import GameTurn from "./GameTurn";
import PlayerHand from "./PlayerHand";

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
    sandDecks,
    bloodDecks,
    pendingDrawnCard,
    drawCard,
    handleDiscard,
    passTurn,
    rollDice,
    selectImpostorValue,
    isGameOver,
    winners,
    endRound,
    pendingImpostors,
    handleImpostorValue,
    currentImpostorIndex,
    calculateHandValue,
    compareHands,
  } = useGameState(playerCount, tokenCount);

  const getCurrentImpostorPlayer = () => {
    if (!pendingImpostors[currentImpostorIndex]) return null;
    const { playerId } = pendingImpostors[currentImpostorIndex];
    return players.find((player) => player.id === playerId);
  };

  // Vérification que le jeu est correctement initialisé
  if (!players || players.length === 0) {
    return <div>Chargement du jeu...</div>;
  }

  const getPlayerPosition = (index) => {
    const positions =
      playerCount === 3
        ? ["bottom", "top-left", "top-right"]
        : ["bottom", "left", "top", "right"];
    return positions[index];
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
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg max-w-md w-full text-center">
          <h2 className="text-2xl font-bold mb-4">Partie terminée !</h2>
          {winners && winners.length > 0 ? (
            winners.map((winner, index) => (
              <p key={index} className="text-lg mb-2">
                {winners.length > 1 ? "Gagnants :" : "Gagnant :"} {winner.name}
                <br />
                <span className="text-sm text-gray-600">
                  Jetons restants : {winner.tokens}
                </span>
              </p>
            ))
          ) : (
            <p className="text-lg mb-2">Pas de gagnant</p>
          )}
          <button
            onClick={() => {
              // Réinitialiser les états avant d'appeler onGameEnd
              onGameEnd(winners || []); // S'assurer qu'on passe winners
            }}
            className="mt-6 bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
          >
            Nouvelle partie
          </button>
        </div>
      </div>
    );
  }

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
      {players.map((player, index) => (
        <div
          key={player.id}
          className={`absolute ${getPlayerPositionClasses(
            getPlayerPosition(index)
          )}`}
        >
          <PlayerHand
            player={player}
            isCurrentPlayer={index === currentPlayerIndex}
            isRevealPhase={gameState === GAME_STATES.REVEAL}
            pendingDrawnCard={pendingDrawnCard}
            onChooseDiscard={handleDiscard}
            selectedDiceValue={player.selectedDiceValue}
            onSelectDiceValue={selectImpostorValue}
          />
        </div>
      ))}

      {/* Overlay pour la phase de lancer de dés */}
      {gameState === GAME_STATES.DICE_ROLL && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg text-center">
            <h3 className="text-xl font-bold mb-4">
              {pendingImpostors.length > 0 && (
                <>
                  <div>Phase des Imposteurs</div>
                  <div className="text-sm text-gray-600 mt-1">
                    {getCurrentImpostorPlayer()?.name} -
                    {pendingImpostors[currentImpostorIndex]?.family ===
                    CARD_FAMILIES.SAND
                      ? "Imposteur de Sable"
                      : "Imposteur de Sang"}
                  </div>
                </>
              )}
            </h3>

            {diceResults ? (
              <div className="flex flex-col items-center">
                <div className="flex justify-center space-x-4 mb-4">
                  <button
                    onClick={() => handleImpostorValue(diceResults[0])}
                    className="w-16 h-16 border-2 border-gray-400 rounded flex items-center justify-center text-2xl font-bold hover:bg-blue-100"
                  >
                    {diceResults[0]}
                  </button>
                  <button
                    onClick={() => handleImpostorValue(diceResults[1])}
                    className="w-16 h-16 border-2 border-gray-400 rounded flex items-center justify-center text-2xl font-bold hover:bg-blue-100"
                  >
                    {diceResults[1]}
                  </button>
                </div>
                <div className="text-sm text-gray-600">
                  Cliquez sur une valeur pour la sélectionner
                </div>
              </div>
            ) : (
              <button
                onClick={rollDice}
                className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-2 rounded-lg"
              >
                Lancer les dés
              </button>
            )}
          </div>
        </div>
      )}

      {/* Overlay pour la phase de révélation */}
      {gameState === GAME_STATES.REVEAL && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg max-w-2xl w-full">
            <h2 className="text-2xl font-bold mb-6 text-center">
              Révélation des cartes
            </h2>
            <div className="space-y-4">
              {players.map((player) => {
                // Calculer si c'est un gagnant
                const isWinner =
                  compareHands(player.hand, players[currentPlayerIndex].hand) >=
                  0;

                return (
                  <div
                    key={player.id}
                    className={`flex flex-col p-4 rounded transition-colors
                ${
                  isWinner
                    ? "bg-green-50 border-2 border-green-500"
                    : "bg-gray-50"
                }
              `}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <div className="font-medium flex items-center gap-2">
                        {player.name}
                        {isWinner && (
                          <span className="text-green-600 text-sm font-bold">
                            Gagnant
                          </span>
                        )}
                      </div>
                      <div>Jetons: {player.tokens}</div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="flex space-x-2">
                        {player.hand.map((card) => (
                          <div
                            key={card.id}
                            className={`
                        w-16 h-24 border rounded-lg flex flex-col items-center justify-center p-1
                        ${
                          card.family === CARD_FAMILIES.SAND
                            ? "bg-yellow-100 border-yellow-800"
                            : "bg-red-100 border-red-800"
                        }
                        ${isWinner ? "ring-2 ring-green-500" : ""}
                      `}
                          >
                            <div className="text-lg font-bold">
                              {card.type === CARD_TYPES.SYLOP
                                ? "S"
                                : card.type === CARD_TYPES.IMPOSTOR
                                ? card.value
                                : card.value}
                            </div>
                            <div className="text-xs mt-1">
                              {card.type === CARD_TYPES.SYLOP
                                ? "Sylop"
                                : card.type === CARD_TYPES.IMPOSTOR
                                ? "Imposteur"
                                : card.family === CARD_FAMILIES.SAND
                                ? "Sable"
                                : "Sang"}
                            </div>
                          </div>
                        ))}
                      </div>
                      <div
                        className={`text-sm ${
                          isWinner ? "text-green-600 font-bold" : ""
                        }`}
                      >
                        {calculateHandValue(player.hand) === 0
                          ? "Sabacc!"
                          : `Différence: ${calculateHandValue(player.hand)}`}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-6 text-center">
              <button
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg"
                onClick={() => setGameState(GAME_STATES.END_ROUND)}
              >
                Continuer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Overlay pour la fin de manche */}
      {gameState === GAME_STATES.END_ROUND && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg max-w-2xl w-full">
            <h2 className="text-2xl font-bold mb-6 text-center">
              Fin de la manche {round}
            </h2>
            <div className="space-y-4">
              {players.map((player) => (
                <div
                  key={player.id}
                  className="flex justify-between items-center p-4 bg-gray-50 rounded"
                >
                  <div className="flex items-center space-x-4">
                    <div className="font-medium">{player.name}</div>
                    <div className="text-sm text-gray-600">
                      {calculateHandValue(player.hand) === 0
                        ? "Sabacc!"
                        : `Différence: ${calculateHandValue(player.hand)}`}
                    </div>
                  </div>
                  <div className="text-sm font-medium">
                    Jetons restants: {player.tokens}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 text-center">
              <button
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg"
                onClick={endRound}
              >
                Commencer la nouvelle manche
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GameBoard;
