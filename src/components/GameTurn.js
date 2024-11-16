import React from "react";
import DiceRoll from "./gameTurn/DiceRoll";
import DiscardChoice from "./gameTurn/DiscardChoice";
import RoundInfo from "./gameTurn/RoundInfo";
import TurnInterface from "./gameTurn/TurnInterface";

const GameTurn = ({
  gameState,
  currentPlayer,
  players,
  roundNumber,
  turnNumber,
  consecutivePasses,
  isCurrentPlayerTurn,
  pendingDrawnCard,
  onPass,
  onChooseDiscard,
  diceResults,
  onRollDice,
  currentPlayerTokens,
  playerOrder,
  roundStartPlayer,
}) => {
  // Vérification de sécurité pour les props requises
  if (!players?.length || !currentPlayer) {
    return null;
  }

  return (
    <div className="w-full max-w-2xl mx-auto p-4 bg-white rounded-lg shadow">
      <RoundInfo
        roundNumber={roundNumber}
        turnNumber={turnNumber}
        roundStartPlayer={roundStartPlayer}
        players={players}
        playerOrder={playerOrder}
        currentPlayer={currentPlayer}
        consecutivePasses={consecutivePasses}
      />
      <TurnInterface
        pendingDrawnCard={pendingDrawnCard}
        isCurrentPlayerTurn={isCurrentPlayerTurn}
        currentPlayer={currentPlayer}
        currentPlayerTokens={currentPlayerTokens}
        onPass={onPass}
        playerOrder={playerOrder}
        players={players}
      />
      <DiceRoll
        gameState={gameState}
        diceResults={diceResults}
        onRollDice={onRollDice}
      />
      <DiscardChoice
        pendingDrawnCard={pendingDrawnCard}
        currentPlayer={currentPlayer}
        onChooseDiscard={onChooseDiscard}
      />

      <div className="mt-6 text-sm text-gray-600 border-t pt-4">
        <h4 className="font-bold mb-2">Rappel des règles :</h4>
        <ul className="list-disc list-inside space-y-1">
          <li>Piocher coûte 1 jeton</li>
          <li>
            Après avoir pioché, vous devez défausser une carte de la même
            famille
          </li>
          <li>
            Les cartes de sang vont à droite, les cartes de sable à gauche
          </li>
          {consecutivePasses > 0 && (
            <li className="text-amber-600">
              Si tous les joueurs passent, les cartes seront révélées
            </li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default GameTurn;
