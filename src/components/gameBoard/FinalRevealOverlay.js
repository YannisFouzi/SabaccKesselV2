import React, { useMemo, useState } from "react";

const FinalRevealOverlay = ({
  players,
  lastPlayerBeforeReveal,
  currentPlayerIndex,
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
    console.log(
      "Original players:",
      players.map((p) => `${p.name} (${p.id})`)
    );
    console.log("Last player before reveal:", lastPlayerBeforeReveal);

    if (lastPlayerBeforeReveal === null) return players;

    // On cherche le prochain joueur après lastPlayerBeforeReveal
    const nextPlayerId =
      lastPlayerBeforeReveal === players.length
        ? 1
        : lastPlayerBeforeReveal + 1;
    const startingPlayerIndex = players.findIndex((p) => p.id === nextPlayerId);
    console.log("Next player should start at index:", startingPlayerIndex);

    // On réorganise les joueurs en commençant par celui qui suit le dernier
    const orderedPlayers = [];
    let currentIndex = startingPlayerIndex;

    // On ajoute les joueurs dans l'ordre en commençant par le startingPlayerIndex
    for (let i = 0; i < players.length; i++) {
      orderedPlayers.push(players[currentIndex]);
      currentIndex = (currentIndex + 1) % players.length;
    }

    console.log(
      "Final order:",
      orderedPlayers.map((p) => `${p.name} (${p.id})`)
    );
    return orderedPlayers;
  }, [players, lastPlayerBeforeReveal]);

  // Gestion des imposteurs
  const handleImpostorValueAndNext = (value) => {
    const success = handleImpostorValue(value);
    if (success && currentImpostorIndex + 1 >= pendingImpostors.length) {
      setRevealPhase("REVEAL");
    }
  };

  // Calcul du gagnant une fois tous les joueurs révélés
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

  // Vérifier si le joueur actuel a un imposteur à résoudre
  const currentPlayerHasImpostor = () => {
    if (currentRevealIndex >= players.length) return false;
    return pendingImpostors.some(
      (imp) =>
        imp.playerId === orderedPlayers[currentRevealIndex].id &&
        pendingImpostors[currentImpostorIndex]?.playerId ===
          orderedPlayers[currentRevealIndex].id
    );
  };

  // Passer au joueur suivant
  const handleNextPlayer = () => {
    if (currentRevealIndex < players.length) {
      setCurrentRevealIndex((prev) => prev + 1);
      setDiceResults(null); // Réinitialiser les dés pour le prochain joueur
    }
  };

  const bestHand = calculateWinner();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg max-w-4xl w-full">
        <h2 className="text-2xl font-bold mb-6 text-center">
          Révélation des mains
        </h2>

        {/* Interface de résolution des imposteurs */}
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

        {/* Affichage des joueurs révélés */}
        <div className="space-y-4">
          {orderedPlayers.slice(0, currentRevealIndex + 1).map((player) => {
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

        {/* Boutons de contrôle */}
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
