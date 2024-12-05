import React, { useEffect } from "react";
import { AVATAR_LIST } from "../../../constants/avatarConfig";
import { CARD_TYPES } from "../../../constants/cardDefinitions";
import { getCardImage } from "../../../constants/cardImages";
import { useFinalReveal } from "./useFinalReveal";

const FinalRevealOverlay = ({
  players,
  lastPlayerBeforeReveal,
  diceResults,
  compareHands,
  calculateHandValue,
  handleImpostorValue,
  rollDice,
  setGameState,
  GAME_STATES,
  setDiceResults,
  jokerEUsed,
}) => {
  const {
    currentRevealIndex,
    currentPlayer,
    orderedPlayers,
    unresolvedImpostors,
    bestHand,
    currentPlayerHasImpostor,
    handleImpostorValueAndNext,
    handleNextPlayer,
  } = useFinalReveal({
    players,
    lastPlayerBeforeReveal,
    diceResults,
    compareHands,
    calculateHandValue,
    handleImpostorValue,
    setDiceResults,
    setGameState,
    GAME_STATES,
  });

  useEffect(() => {
    if (jokerEUsed && currentPlayerHasImpostor()) {
      handleImpostorValueAndNext(6);
    }
  }, [
    currentRevealIndex,
    jokerEUsed,
    currentPlayerHasImpostor,
    handleImpostorValueAndNext,
  ]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-xl max-w-4xl w-full">
        <h2 className="text-2xl font-bold mb-6 text-center">
          Révélation des mains
        </h2>

        {jokerEUsed && (
          <div className="mb-6 p-4 bg-yellow-100 border-2 border-yellow-500 rounded-lg">
            <div className="text-lg flex items-center justify-center gap-2">
              <span>
                <span className="font-bold text-yellow-600">
                  "Fraude Majeure" actif :
                </span>{" "}
                Tous les imposteurs prennent automatiquement la valeur 6
              </span>
            </div>
          </div>
        )}

        {currentPlayerHasImpostor() && currentPlayer && !jokerEUsed && (
          <div className="mb-6 p-4 bg-yellow-50 rounded-lg">
            <div className="text-lg mb-4">
              {currentPlayer.name} doit choisir la valeur de son{" "}
              {unresolvedImpostors.length > 1
                ? unresolvedImpostors.indexOf(
                    unresolvedImpostors.find((imp) => !imp.value)
                  ) === 0
                  ? "premier"
                  : "deuxième"
                : ""}{" "}
              Imposteur
            </div>
            {!diceResults ? (
              <button
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                onClick={rollDice}
              >
                Lancer les dés
              </button>
            ) : (
              <div className="space-y-4">
                <div className="text-xl">
                  Résultats: {diceResults.join(" et ")}
                </div>
                <div className="flex gap-4">
                  {[...new Set(diceResults)].map((value, index) => (
                    <button
                      key={`${value}-${index}`}
                      className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
                      onClick={() => handleImpostorValueAndNext(value)}
                    >
                      Choisir {value}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {currentPlayerHasImpostor() && currentPlayer && jokerEUsed && (
          <div className="mb-6 p-4 bg-yellow-100 border-2 border-yellow-500 rounded-lg">
            <div className="text-lg flex items-center gap-2">
              <span className="text-2xl">🎭</span>
              <span>
                {currentPlayer.name} : L'imposteur prend automatiquement la
                valeur 6
                <span className="font-bold text-yellow-600">
                  {" "}
                  (Effet du Joker "Fraude Majeure" actif)
                </span>
              </span>
            </div>
          </div>
        )}

        <div className="space-y-4">
          {orderedPlayers.slice(0, currentRevealIndex + 1).map((player) => {
            if (!player) return null;
            const isWinner =
              bestHand && compareHands(player.hand, bestHand) === 0;

            return (
              <div key={player.id}>
                <div className="flex items-center gap-2">
                  <div className="w-36 font-medium flex items-center gap-2">
                    <img
                      src={
                        AVATAR_LIST.find(
                          (avatar) => avatar.id === player.avatar
                        )?.image
                      }
                      alt={`Avatar de ${player.name}`}
                      className="w-8 h-8 rounded-full"
                    />
                    <div className="flex flex-col truncate">
                      <span className="truncate">{player.name}</span>
                      {isWinner && currentRevealIndex >= players.length && (
                        <span className="text-green-600 text-sm font-bold truncate">
                          Gagnant
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-1">
                    {player.hand.map((card) => (
                      <div
                        key={card.id}
                        className="w-[80px] sm:w-[90px] md:w-[100px] aspect-[2/3]"
                      >
                        <img
                          src={getCardImage(
                            card.family,
                            card.type === CARD_TYPES.IMPOSTOR && card.value
                              ? CARD_TYPES.NORMAL
                              : card.type,
                            card.type === CARD_TYPES.IMPOSTOR && card.value
                              ? card.value
                              : card.type === CARD_TYPES.NORMAL
                              ? card.value
                              : null
                          )}
                          alt={`${card.type} ${card.value || ""}`}
                          className={`w-full h-full object-cover rounded-lg ${
                            isWinner && currentRevealIndex >= players.length
                              ? "ring-2 ring-green-500"
                              : ""
                          }`}
                        />
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center gap-2 ml-2">
                    <div
                      className={`text-sm ${
                        isWinner && currentRevealIndex >= players.length
                          ? "text-green-600 font-bold"
                          : ""
                      }`}
                    >
                      {calculateHandValue(player.hand) === 0
                        ? "Sabacc!"
                        : calculateHandValue(player.hand) === null
                        ? ""
                        : `Différence: ${calculateHandValue(player.hand)}`}
                    </div>
                    <div className="text-sm min-w-[80px]">
                      Jetons: {player.tokens}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-6 text-center">
          {currentRevealIndex < players.length - 1 ? (
            <button
              className={`px-6 py-2 rounded-lg ${
                currentPlayerHasImpostor() && diceResults && !jokerEUsed
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-500 hover:bg-blue-600"
              } text-white`}
              onClick={handleNextPlayer}
              disabled={
                (currentPlayerHasImpostor() && !jokerEUsed && !diceResults) || // cas initial
                (currentPlayerHasImpostor() && diceResults && !jokerEUsed) // dés lancés mais valeur non choisie
              }
            >
              Joueur suivant
            </button>
          ) : currentRevealIndex === players.length - 1 ? (
            <button
              className={`px-6 py-2 rounded-lg ${
                currentPlayerHasImpostor() && diceResults && !jokerEUsed
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-500 hover:bg-blue-600"
              } text-white`}
              onClick={handleNextPlayer}
              disabled={
                (currentPlayerHasImpostor() && !jokerEUsed && !diceResults) || // cas initial
                (currentPlayerHasImpostor() && diceResults && !jokerEUsed) // dés lancés mais valeur non choisie
              }
            >
              Révéler le gagnant
            </button>
          ) : (
            <button
              className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg"
              onClick={() => setGameState(GAME_STATES.END_ROUND)}
            >
              Voir les résultats
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default FinalRevealOverlay;
