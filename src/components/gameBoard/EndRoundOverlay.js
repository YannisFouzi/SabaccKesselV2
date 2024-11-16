import React from "react";

const EndRoundOverlay = ({
  round,
  players,
  compareHands,
  getHandValue,
  startingTokens,
  HAND_TYPES,
  endRound,
  roundStartPlayer,
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg max-w-2xl w-full">
        <h2 className="text-2xl font-bold mb-6 text-center">
          Fin de la manche {round}
        </h2>
        <div className="space-y-4">
          {(() => {
            // Trouver la meilleure main
            let bestHand = players[0].hand;
            players.slice(1).forEach((p) => {
              if (compareHands(p.hand, bestHand) > 0) {
                bestHand = p.hand;
              }
            });

            return players.map((player) => {
              const handValue = getHandValue(player.hand);
              const isWinner = compareHands(player.hand, bestHand) === 0;

              const tokensBet = startingTokens[player.id] - player.tokens;
              let penaltyTokens = 0;

              if (!isWinner) {
                if (handValue.type === HAND_TYPES.PAIR) {
                  penaltyTokens = 1;
                } else if (handValue.type === HAND_TYPES.DIFFERENCE) {
                  penaltyTokens = handValue.value;
                }
              }

              const finalTokens = isWinner
                ? player.tokens + tokensBet
                : Math.max(0, player.tokens - penaltyTokens);

              const isEliminated = finalTokens === 0;

              return (
                <div
                  key={player.id}
                  className={`p-4 rounded-lg border-2 ${
                    isWinner
                      ? "bg-green-50 border-green-500"
                      : isEliminated
                      ? "bg-red-50 border-red-500"
                      : "bg-gray-50 border-gray-200"
                  }`}
                >
                  <div className="flex flex-col space-y-2">
                    <div className="flex justify-between items-center">
                      <div className="font-bold text-lg flex items-center gap-2">
                        {player.name}
                        {isWinner && (
                          <span className="text-green-600 text-sm">
                            Gagnant
                          </span>
                        )}
                        {isEliminated && (
                          <span className="text-red-600 text-sm">Éliminé</span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 text-sm">
                      <span className="font-medium">Jetons au début:</span>
                      <span>{startingTokens[player.id]}</span>
                    </div>

                    <div className="flex flex-col space-y-1 text-sm">
                      {tokensBet > 0 && (
                        <div className="flex items-center space-x-2">
                          <span className="text-amber-600">Jetons misés:</span>
                          <span className="text-amber-600">-{tokensBet}</span>
                        </div>
                      )}

                      {isWinner
                        ? tokensBet > 0 && (
                            <div className="flex items-center space-x-2">
                              <span className="text-green-600">
                                Jetons récupérés:
                              </span>
                              <span className="text-green-600">
                                +{tokensBet}
                              </span>
                            </div>
                          )
                        : penaltyTokens > 0 && (
                            <div className="flex items-center space-x-2">
                              <span className="text-red-600">Pénalité:</span>
                              <span className="text-red-600">
                                -{penaltyTokens}
                              </span>
                            </div>
                          )}
                    </div>

                    <div className="flex items-center space-x-2 font-bold mt-2">
                      <span>Jetons finaux:</span>
                      <span
                        className={
                          isEliminated
                            ? "text-red-600"
                            : isWinner
                            ? "text-green-600"
                            : ""
                        }
                      >
                        {finalTokens}
                      </span>
                    </div>
                  </div>
                </div>
              );
            });
          })()}
        </div>
        {players.length > 1 && (
          <div className="mt-4 text-center text-blue-600">
            {`${
              players.find((p) => p.id === roundStartPlayer)?.name
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
