import React from "react";
import DiscardChoice from "./gameTurn/DiscardChoice";
import RoundInfo from "./gameTurn/RoundInfo";
import TurnInterface from "./gameTurn/TurnInterface";

const GameTurn = ({
  currentPlayer,
  players,
  roundNumber,
  turnNumber,
  consecutivePasses,
  isCurrentPlayerTurn,
  pendingDrawnCard,
  onPass,
  onChooseDiscard,
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

      <DiscardChoice
        pendingDrawnCard={pendingDrawnCard}
        currentPlayer={currentPlayer}
        onChooseDiscard={onChooseDiscard}
      />
    </div>
  );
};

export default GameTurn;
