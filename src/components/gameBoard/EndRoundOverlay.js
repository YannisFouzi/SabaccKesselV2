import React from "react";
import { calculateRoundResults } from "../../hooks/endRound";

const EndRoundOverlay = ({
  round,
  players,
  startingTokens,
  endRound,
  roundStartPlayer,
  getHandValue,
  compareHands,
}) => {
  const roundResults = calculateRoundResults(
    players,
    startingTokens,
    getHandValue,
    compareHands
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg max-w-2xl w-full">
        <h2 className="text-2xl font-bold mb-6 text-center">
          Fin de la manche {round}
        </h2>
        <div className="space-y-4">
          {roundResults.map(
            (player) =>
              player && (
                <div
                  key={player.id}
                  className={`p-4 rounded-lg border-2 ${
                    player.isWinner
                      ? "bg-green-50 border-green-500"
                      : player.isEliminated
                      ? "bg-red-50 border-red-500"
                      : "bg-gray-50 border-gray-200"
                  }`}
                >
                  <div className="flex flex-col space-y-2">
                    <div className="flex justify-between items-center">
                      <div className="font-bold text-lg flex items-center gap-2">
                        {player.name}
                        {player.isWinner && (
                          <span className="text-green-600 text-sm">
                            Gagnant
                          </span>
                        )}
                        {player.isEliminated && (
                          <span className="text-red-600 text-sm">Éliminé</span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 text-sm">
                      <span className="font-medium">Jetons au début:</span>
                      <span>{startingTokens[player.id]}</span>
                    </div>

                    <div className="flex flex-col space-y-1 text-sm">
                      {player.tokensBet > 0 && (
                        <div className="flex items-center space-x-2">
                          <span className="text-amber-600">Jetons misés:</span>
                          <span className="text-amber-600">
                            -{player.tokensBet}
                          </span>
                        </div>
                      )}

                      {player.isWinner
                        ? player.tokensBet > 0 && (
                            <div className="flex items-center space-x-2">
                              <span className="text-green-600">
                                Jetons récupérés:
                              </span>
                              <span className="text-green-600">
                                +{player.tokensBet}
                              </span>
                            </div>
                          )
                        : player.penaltyTokens > 0 && (
                            <div className="flex items-center space-x-2">
                              <span className="text-red-600">Pénalité:</span>
                              <span className="text-red-600">
                                -{player.penaltyTokens}
                              </span>
                            </div>
                          )}
                    </div>

                    <div className="flex items-center space-x-2 font-bold mt-2">
                      <span>Jetons finaux:</span>
                      <span
                        className={
                          player.isEliminated
                            ? "text-red-600"
                            : player.isWinner
                            ? "text-green-600"
                            : ""
                        }
                      >
                        {player.tokens}
                      </span>
                    </div>
                  </div>
                </div>
              )
          )}
        </div>

        {players.length > 1 && (
          <div className="mt-4 text-center text-blue-600">
            {`${
              players.find((p) => p?.id === roundStartPlayer)?.name
            } commencera la prochaine manche`}
          </div>
        )}

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
  );
};

export default EndRoundOverlay;
