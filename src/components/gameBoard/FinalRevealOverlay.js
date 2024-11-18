import React, { useCallback, useEffect, useMemo, useState } from "react";

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
}) => {
  const [currentRevealIndex, setCurrentRevealIndex] = useState(0);
  const [currentPlayerImpostorIndex, setCurrentPlayerImpostorIndex] =
    useState(0);
  const [, setRevealPhase] = useState("IMPOSTORS");

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

  const getCurrentPlayerUnresolvedImpostors = useCallback(() => {
    if (currentRevealIndex >= orderedPlayers.length) return [];
    const currentPlayer = orderedPlayers[currentRevealIndex];
    if (!currentPlayer) return [];

    return currentPlayer.hand
      .filter((card) => card.type === "IMPOSTOR" && !card.value)
      .sort((a, b) => a.id - b.id); // Assurer un ordre constant
  }, [currentRevealIndex, orderedPlayers]);

  const currentPlayerHasImpostor = useCallback(() => {
    const unresolvedImpostors = getCurrentPlayerUnresolvedImpostors();
    return unresolvedImpostors.length > currentPlayerImpostorIndex;
  }, [getCurrentPlayerUnresolvedImpostors, currentPlayerImpostorIndex]);

  const handleImpostorValueAndNext = (value) => {
    const currentPlayer = orderedPlayers[currentRevealIndex];
    const unresolvedImpostors = getCurrentPlayerUnresolvedImpostors();
    const currentImpostor = unresolvedImpostors[currentPlayerImpostorIndex];

    if (currentImpostor) {
      const success = handleImpostorValue({
        value,
        playerId: currentPlayer.id,
        cardId: currentImpostor.id,
      });

      if (success) {
        // Attendre que le state soit mis à jour avant de vérifier
        setTimeout(() => {
          const updatedUnresolvedImpostors =
            getCurrentPlayerUnresolvedImpostors();

          if (currentPlayerImpostorIndex < updatedUnresolvedImpostors.length) {
            // Il reste encore des imposteurs à résoudre pour ce joueur
            setDiceResults(null);
          } else if (hasMoreUnresolvedImpostors()) {
            // Passer au joueur suivant car celui-ci a fini
            handleNextPlayer();
          } else {
            // Tous les imposteurs sont résolus
            setRevealPhase("REVEAL");
          }
        }, 0);
      }
    }
  };

  const hasMoreUnresolvedImpostors = () => {
    for (let i = currentRevealIndex; i < orderedPlayers.length; i++) {
      const player = orderedPlayers[i];
      const unresolvedImpostors = player.hand.filter(
        (card) => card.type === "IMPOSTOR" && !card.value
      );

      if (i === currentRevealIndex) {
        if (unresolvedImpostors.length > currentPlayerImpostorIndex)
          return true;
      } else {
        if (unresolvedImpostors.length > 0) return true;
      }
    }
    return false;
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
      setCurrentPlayerImpostorIndex(0);
      setDiceResults(null);
    }
  };

  useEffect(() => {
    if (currentPlayerHasImpostor()) {
      setDiceResults(null);
    }
  }, [
    currentRevealIndex,
    currentPlayerImpostorIndex,
    currentPlayerHasImpostor,
    setDiceResults,
  ]);

  const bestHand = calculateWinner();

  const currentPlayer = orderedPlayers[currentRevealIndex];
  const unresolvedImpostors = getCurrentPlayerUnresolvedImpostors();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg max-w-4xl w-full">
        <h2 className="text-2xl font-bold mb-6 text-center">
          Révélation des mains
        </h2>

        {currentPlayerHasImpostor() && currentPlayer && (
          <div className="mb-6 p-4 bg-yellow-50 rounded-lg">
            <div className="text-lg mb-4">
              {currentPlayer.name} doit choisir la valeur de son Imposteur{" "}
              {currentPlayerImpostorIndex + 1} sur {unresolvedImpostors.length}
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
              disabled={currentPlayerHasImpostor()}
            >
              Joueur suivant
            </button>
          ) : currentRevealIndex === players.length - 1 ? (
            <button
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg"
              onClick={handleNextPlayer}
              disabled={currentPlayerHasImpostor()}
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
