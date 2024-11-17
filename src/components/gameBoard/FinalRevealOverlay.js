import React, { useEffect, useMemo, useState } from "react";

const FinalRevealOverlay = ({
  players,
  lastPlayerBeforeReveal,
  pendingImpostors,
  currentImpostorIndex,
  diceResults,
  compareHands,
  calculateHandValue,
  handleImpostorValue,
  rollDice,
  setGameState,
  GAME_STATES,
  setDiceResults,
}) => {
  const [currentRevealIndex, setCurrentRevealIndex] = useState(0);
  const [revealPhase, setRevealPhase] = useState(
    pendingImpostors.length > 0 ? "IMPOSTORS" : "REVEAL"
  );

  // Réorganiser les joueurs pour commencer par celui qui suit le joueur actuel
  const orderedPlayers = useMemo(() => {
    if (!players || players.length === 0) return [];

    const filteredPlayers = players.filter((p) => p);

    if (lastPlayerBeforeReveal === null) return filteredPlayers;

    const nextPlayerId =
      lastPlayerBeforeReveal === filteredPlayers.length
        ? 1
        : lastPlayerBeforeReveal + 1;

    const startingPlayerIndex = filteredPlayers.findIndex(
      (p) => p.id === nextPlayerId
    );
    if (startingPlayerIndex === -1) return filteredPlayers;

    const orderedPlayers = [];
    let currentIndex = startingPlayerIndex;

    for (let i = 0; i < filteredPlayers.length; i++) {
      orderedPlayers.push(filteredPlayers[currentIndex]);
      currentIndex = (currentIndex + 1) % filteredPlayers.length;
    }

    return orderedPlayers;
  }, [players, lastPlayerBeforeReveal]);

  // Réorganiser les pendingImpostors pour correspondre à l'ordre des joueurs
  const orderedPendingImpostors = useMemo(() => {
    const impostorMap = new Map(
      pendingImpostors.map((imp) => [imp.playerId, imp])
    );

    return orderedPlayers
      .map((player) => impostorMap.get(player.id))
      .filter((imp) => imp !== undefined);
  }, [orderedPlayers, pendingImpostors]);

  const currentPlayerHasImpostor = () => {
    if (currentRevealIndex >= players.length) return false;

    const currentPlayer = orderedPlayers[currentRevealIndex];
    if (!currentPlayer) return false;

    const hasUnresolvedImpostor =
      currentPlayer.id ===
      orderedPendingImpostors[currentImpostorIndex]?.playerId;

    const hasImpostorCard = currentPlayer.hand.some(
      (card) => card.type === "IMPOSTOR" && !card.value
    );

    return hasUnresolvedImpostor && hasImpostorCard;
  };

  const handleImpostorValueAndNext = (value) => {
    const success = handleImpostorValue(value);
    if (success && currentImpostorIndex + 1 >= orderedPendingImpostors.length) {
      setRevealPhase("REVEAL");
    }
  };

  const calculateWinner = () => {
    if (currentRevealIndex < players.length) return null;

    let bestHand = orderedPlayers[0].hand;
    orderedPlayers.slice(1).forEach((p) => {
      if (compareHands(p.hand, bestHand) > 0) {
        bestHand = p.hand;
      }
    });
    return bestHand;
  };

  const handleNextPlayer = () => {
    if (currentRevealIndex < players.length) {
      setCurrentRevealIndex((prev) => prev + 1);
    }
  };

  useEffect(() => {
    if (currentPlayerHasImpostor()) {
      setDiceResults(null);
    }
  }, [currentRevealIndex]);

  const bestHand = calculateWinner();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg max-w-4xl w-full">
        <h2 className="text-2xl font-bold mb-6 text-center">
          Révélation des mains
        </h2>

        {currentPlayerHasImpostor() && (
          <div className="mb-6 p-4 bg-yellow-50 rounded-lg">
            <div className="text-lg mb-4">
              {orderedPlayers[currentRevealIndex].name} doit choisir la valeur
              de son Imposteur
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
                  {diceResults.map((value) => (
                    <button
                      key={value}
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

        {/* Rest of the component remains the same */}
        <div className="space-y-4">
          {orderedPlayers.slice(0, currentRevealIndex + 1).map((player) => {
            if (!player) return null;
            const isWinner =
              bestHand && compareHands(player.hand, bestHand) === 0;

            return (
              <div
                key={player.id}
                className={`flex flex-col p-4 rounded transition-colors ${
                  isWinner
                    ? "bg-green-50 border-2 border-green-500"
                    : "bg-gray-50"
                }`}
              >
                <div className="flex justify-between items-center mb-2">
                  <div className="font-medium flex items-center gap-2">
                    {player.name}
                    {isWinner && currentRevealIndex >= players.length && (
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
                        className={`w-16 h-24 border rounded-lg flex flex-col items-center justify-center p-1 ${
                          card.family === "SAND"
                            ? "bg-yellow-100 border-yellow-800"
                            : "bg-red-100 border-red-800"
                        } ${
                          isWinner && currentRevealIndex >= players.length
                            ? "ring-2 ring-green-500"
                            : ""
                        }`}
                      >
                        <div className="text-lg font-bold">
                          {card.type === "SYLOP"
                            ? "S"
                            : card.type === "IMPOSTOR"
                            ? card.value || "?"
                            : card.value}
                        </div>
                        <div className="text-xs mt-1">
                          {card.type === "SYLOP"
                            ? "Sylop"
                            : card.type === "IMPOSTOR"
                            ? "Imposteur"
                            : card.family === "SAND"
                            ? "Sable"
                            : "Sang"}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div
                    className={`text-sm ${
                      isWinner && currentRevealIndex >= players.length
                        ? "text-green-600 font-bold"
                        : ""
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
          {currentRevealIndex < players.length - 1 ? (
            <button
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg"
              onClick={handleNextPlayer}
              disabled={currentPlayerHasImpostor() && !diceResults}
            >
              Joueur suivant
            </button>
          ) : currentRevealIndex === players.length - 1 ? (
            <button
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg"
              onClick={handleNextPlayer}
              disabled={currentPlayerHasImpostor() && !diceResults}
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
