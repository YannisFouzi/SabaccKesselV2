import React from "react";

const TurnInterface = ({
  pendingDrawnCard,
  isCurrentPlayerTurn,
  currentPlayer,
  currentPlayerTokens,
  onPass,
  playerOrder,
  players,
}) => {
  if (pendingDrawnCard) {
    return (
      <div className="text-center mb-4">
        <div className="text-xl font-bold">
          Choisissez une carte à défausser
        </div>
      </div>
    );
  }

  // Trouver le prochain joueur dans l'ordre
  const currentPlayerIndex = playerOrder.findIndex(
    (id) => id === currentPlayer.id
  );
  const nextPlayerIndex = (currentPlayerIndex + 1) % players.length;
  const nextPlayer = players.find((p) => p.id === playerOrder[nextPlayerIndex]);

  return (
    <div className="text-center mb-4">
      {isCurrentPlayerTurn && (
        <div className="space-y-3">
          {currentPlayerTokens > 0 ? (
            <></>
          ) : (
            <p className="text-amber-600">
              Plus de jetons disponibles ! Vous devez passer votre tour.
            </p>
          )}

          {/* Le bouton de passe est toujours actif */}
          <button
            onClick={onPass}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg"
          >
            Passer le tour
          </button>

          {/* Indication du prochain joueur */}
          {/* <div className="text-sm text-gray-600 mt-2">
            Prochain joueur : {nextPlayer.name}
          </div> */}
        </div>
      )}
    </div>
  );
};

export default TurnInterface;
