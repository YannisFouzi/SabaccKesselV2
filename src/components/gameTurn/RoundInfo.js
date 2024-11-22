import React from "react";

const RoundInfo = ({
  roundNumber,
  turnNumber,
  roundStartPlayer,
  players,
  playerOrder,
  currentPlayer,
  consecutivePasses,
}) => {
  return (
    <div className="text-center mb-4">
      <div className="flex justify-between items-center px-4">
        <div className="text-lg font-bold">Manche {roundNumber}</div>
        <div className="text-sm text-gray-600">Tour {turnNumber}/3</div>
      </div>

      {/* Information sur qui commence la manche */}
      {/* <div className="text-sm text-blue-600 mt-1 mb-2">
        {players.find((p) => p.id === roundStartPlayer)?.name} commence cette
        manche
      </div> */}

      {/* Ajout de l'ordre des joueurs avec mise en évidence du joueur qui commence */}
      {/* <div className="text-sm text-gray-600">
        <div className="flex justify-center items-center space-x-2 flex-wrap">
          {playerOrder.map((playerId, index) => {
            const player = players.find((p) => p.id === playerId);
            const isCurrentTurn = player.id === currentPlayer.id;
            const isRoundStarter = player.id === roundStartPlayer;
            return (
              <div
                key={playerId}
                className={`flex items-center ${
                  isCurrentTurn ? "text-blue-600 font-bold" : ""
                } ${isRoundStarter ? "underline" : ""}`}
              >
                {index > 0 && <span className="mx-1">→</span>}
                <span>{player.name}</span>
              </div>
            );
          })}
        </div>
      </div> */}

      {consecutivePasses > 0 && (
        <div className="text-sm text-amber-600 mt-2">
          {consecutivePasses}{" "}
          {consecutivePasses > 1 ? "passes consécutifs" : "pass consécutif"}
          {consecutivePasses === players.length - 1 && (
            <div className="font-bold mt-1">
              Un pass de plus et les mains seront révélées !
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default RoundInfo;
