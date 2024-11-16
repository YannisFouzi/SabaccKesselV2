import React from "react";
import { CARD_FAMILIES } from "../constants/gameConstants";

const DiceRollOverlay = ({
  pendingImpostors,
  currentImpostorIndex,
  players,
  diceResults,
  handleImpostorValue,
  rollDice,
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg text-center">
        <h3 className="text-xl font-bold mb-4">
          {pendingImpostors.length > 0 && (
            <>
              <div>Phase des Imposteurs</div>
              <div className="text-sm text-gray-600 mt-1">
                {
                  players.find(
                    (p) =>
                      p.id === pendingImpostors[currentImpostorIndex]?.playerId
                  )?.name
                }{" "}
                -
                {pendingImpostors[currentImpostorIndex]?.family ===
                CARD_FAMILIES.SAND
                  ? " Imposteur de Sable"
                  : " Imposteur de Sang"}
              </div>
            </>
          )}
        </h3>

        <div className="space-y-4 mb-4">
          {players
            .sort((a, b) => a.id - b.id)
            .map((player) => (
              <div
                key={player.id}
                className={`p-4 rounded-lg border ${
                  player.id === pendingImpostors[currentImpostorIndex]?.playerId
                    ? "border-purple-500 bg-purple-50"
                    : "border-gray-200"
                }`}
              >
                <div className="flex justify-between items-center">
                  <span className="font-medium">{player.name}</span>
                  <div className="flex space-x-2">
                    {player.hand.map((card) => (
                      <div
                        key={card.id}
                        className={`w-12 h-16 border rounded flex items-center justify-center ${
                          card.family === CARD_FAMILIES.SAND
                            ? "bg-yellow-100 border-yellow-800"
                            : "bg-red-100 border-red-800"
                        }`}
                      >
                        {card.type === CARD_FAMILIES.IMPOSTOR && !card.value
                          ? "I"
                          : card.value || "?"}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
        </div>

        {diceResults ? (
          <div className="flex flex-col items-center">
            <div className="flex justify-center space-x-4 mb-4">
              <button
                onClick={() => handleImpostorValue(diceResults[0])}
                className="w-16 h-16 border-2 border-gray-400 rounded flex items-center justify-center text-2xl font-bold hover:bg-blue-100"
              >
                {diceResults[0]}
              </button>
              <button
                onClick={() => handleImpostorValue(diceResults[1])}
                className="w-16 h-16 border-2 border-gray-400 rounded flex items-center justify-center text-2xl font-bold hover:bg-blue-100"
              >
                {diceResults[1]}
              </button>
            </div>
            <div className="text-sm text-gray-600">
              Cliquez sur une valeur pour la sélectionner
            </div>
          </div>
        ) : (
          <button
            onClick={rollDice}
            className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-2 rounded-lg"
          >
            Lancer les dés
          </button>
        )}
      </div>
    </div>
  );
};

export default DiceRollOverlay;
