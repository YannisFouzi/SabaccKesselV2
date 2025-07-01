import React from "react";
import { CARD_TYPES } from "../../../constants/cardDefinitions";
import {
  calculateRoundResults,
  getNextRoundStarter,
} from "../../../hooks/endRound";
import LazyImage from "../../LazyImage";
import PlayerIdentity from "../../PlayerIdentity";

const EndRoundOverlay = ({
  round,
  players,
  startingTokens,
  endRound,
  roundStartPlayer,
  getHandValue,
  compareHands,
  playerOrder,
}) => {
  const roundResults = calculateRoundResults(
    players,
    startingTokens,
    getHandValue,
    compareHands
  );

  const remainingPlayers = roundResults.filter((p) => p.tokens > 0);
  const { nextStarter } = getNextRoundStarter(
    playerOrder,
    roundStartPlayer,
    remainingPlayers
  );
  const nextStarterPlayer = players.find((p) => p?.id === nextStarter);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg max-w-4xl w-full">
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
                  <div className="flex items-center">
                    <div className="w-16 flex-shrink-0 mr-1">
                      <div className="font-bold text-2xl flex items-center">
                        <PlayerIdentity
                          player={player}
                          className={
                            player.isEliminated ? "text-red-400" : "text-black"
                          }
                          avatarClassName="w-12 h-12"
                        />
                      </div>
                      {(player.isWinner || player.isEliminated) && (
                        <div className="text-lg">
                          {player.isWinner && (
                            <span className="text-green-600">Gagnant</span>
                          )}
                          {player.isEliminated && (
                            <span className="text-red-600">Éliminé</span>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="flex-1 flex justify-center">
                      {player.hand.map((card) => (
                        <div
                          key={card.id}
                          className="w-[55px] sm:w-[65px] md:w-[75px] aspect-[2/3]"
                        >
                          <LazyImage
                            family={card.family}
                            type={
                              card.type === CARD_TYPES.IMPOSTOR && card.value
                                ? CARD_TYPES.NORMAL
                                : card.type
                            }
                            value={
                              card.type === CARD_TYPES.IMPOSTOR && card.value
                                ? card.value
                                : card.type === CARD_TYPES.NORMAL
                                ? card.value
                                : null
                            }
                            alt={`${card.type} ${card.value || ""}`}
                            className={`w-full h-full object-cover rounded-lg ${
                              player.isWinner ? "ring-2 ring-green-500" : ""
                            }`}
                          />
                        </div>
                      ))}
                    </div>

                    <div className="w-28 flex-shrink-0 flex items-center gap-2 text-lg ml-1">
                      <span className="font-medium">
                        {startingTokens[player.id]}
                      </span>

                      {player.tokensBet > 0 && (
                        <>
                          <span className="text-amber-600 font-bold">
                            -{player.tokensBet}
                          </span>
                          {player.isWinner && (
                            <span className="text-green-600 font-bold">
                              +{player.tokensBet}
                            </span>
                          )}
                        </>
                      )}

                      {!player.isWinner && player.penaltyTokens > 0 && (
                        <span className="text-red-600 font-bold">
                          -{player.penaltyTokens}
                        </span>
                      )}

                      <span className="font-bold text-xl">→</span>

                      <span
                        className={`font-bold text-xl ${
                          player.isEliminated
                            ? "text-red-600"
                            : player.isWinner
                            ? "text-green-600"
                            : ""
                        }`}
                      >
                        {player.tokens}
                      </span>
                    </div>
                  </div>
                </div>
              )
          )}
        </div>

        {players.length > 1 && nextStarterPlayer && (
          <div className="mt-4 text-center text-blue-600">
            {`${nextStarterPlayer.name} commencera la prochaine manche`}
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
