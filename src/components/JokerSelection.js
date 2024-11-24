import React, { useState } from "react";
import { GAME_STATES, JOKERS } from "../constants/gameConstants";
import ComingSoonRibbon from "./ComingSoonRibbon";

// Importation dynamique des images des jokers
const jokerImages = {};
Object.keys(JOKERS).forEach((key) => {
  jokerImages[key] = require(`../assets/img/jokers/joker-${key}.png`);
});

const JokerSelection = ({
  players,
  currentJokerSelectionPlayer,
  setSelectedJokers,
  setCurrentJokerSelectionPlayer,
  setGameState,
}) => {
  const [currentSelection, setCurrentSelection] = useState([]);
  const currentPlayer = players[currentJokerSelectionPlayer];

  const handleConfirmSelection = () => {
    if (currentSelection.length !== 3) return;

    setSelectedJokers((prev) => ({
      ...prev,
      [currentPlayer.id]: currentSelection,
    }));

    if (currentJokerSelectionPlayer === players.length - 1) {
      setGameState(GAME_STATES.INITIAL_DICE_ROLL);
    } else {
      setCurrentJokerSelectionPlayer(currentJokerSelectionPlayer + 1);
      setCurrentSelection([]);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50">
      <div className="w-full h-full flex flex-col">
        {/* En-tête fixe */}
        <h2 className="text-xl md:text-2xl font-bold text-center p-4 bg-white border-b">
          {currentPlayer.name}, sélectionnez 3 jokers
        </h2>

        {/* Zone scrollable */}
        <div className="flex-1 overflow-y-auto bg-white">
          <div className="p-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3">
              {Object.entries(JOKERS).map(([key, joker]) => {
                const selectedCount = currentSelection.filter(
                  (j) => j === key
                ).length;
                const canAdd =
                  joker.enabled &&
                  selectedCount < joker.quantity &&
                  currentSelection.length < 3;
                const canRemove = selectedCount > 0;

                return (
                  <div key={key} className="relative">
                    {!joker.enabled && <ComingSoonRibbon />}
                    <div
                      className={`p-2 rounded border ${
                        !joker.enabled
                          ? "bg-gray-200"
                          : selectedCount > 0
                          ? "bg-blue-200"
                          : "bg-blue-100"
                      }`}
                    >
                      <div className="w-20 h-20 mx-auto mb-2">
                        <img
                          src={jokerImages[key]}
                          alt={`Joker ${key}`}
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <div className="font-bold text-center text-sm mb-1">
                        {joker.title || `Joker ${key}`}
                      </div>
                      <div className="text-xs text-gray-600 mb-2 text-center h-12 overflow-y-auto">
                        {joker.description}
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span>Stock: {joker.quantity}</span>
                        <div className="flex items-center space-x-1">
                          <button
                            onClick={() => {
                              const newSelection = [...currentSelection];
                              const index = newSelection.lastIndexOf(key);
                              if (index !== -1) {
                                newSelection.splice(index, 1);
                                setCurrentSelection(newSelection);
                              }
                            }}
                            disabled={!canRemove}
                            className={`w-6 h-6 rounded-full flex items-center justify-center ${
                              canRemove
                                ? "bg-red-500 hover:bg-red-600 text-white"
                                : "bg-gray-300 cursor-not-allowed"
                            }`}
                          >
                            -
                          </button>
                          <span className="w-4 text-center font-bold">
                            {selectedCount}
                          </span>
                          <button
                            onClick={() => {
                              if (canAdd) {
                                setCurrentSelection([...currentSelection, key]);
                              }
                            }}
                            disabled={!canAdd}
                            className={`w-6 h-6 rounded-full flex items-center justify-center ${
                              canAdd
                                ? "bg-green-500 hover:bg-green-600 text-white"
                                : "bg-gray-300 cursor-not-allowed"
                            }`}
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Pied de page fixe */}
        <div className="bg-white border-t p-4 space-y-4">
          <div className="text-center">
            <div className="font-bold mb-2">Sélection actuelle:</div>
            <div className="flex flex-wrap justify-center gap-2">
              {currentSelection.map((j, i) => (
                <span
                  key={i}
                  className="inline-block bg-blue-100 px-2 py-1 rounded"
                >
                  {JOKERS[j].title || `Joker ${j}`}
                </span>
              ))}
            </div>
          </div>

          <button
            onClick={handleConfirmSelection}
            disabled={currentSelection.length !== 3}
            className="w-full bg-blue-500 text-white py-3 px-4 rounded-lg text-lg font-bold disabled:bg-gray-400"
          >
            Confirmer la sélection ({currentSelection.length}/3)
          </button>
        </div>
      </div>
    </div>
  );
};

export default JokerSelection;
