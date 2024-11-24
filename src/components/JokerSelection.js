import React, { useState } from "react";
import { GAME_STATES, JOKERS } from "../constants/gameConstants";
import ComingSoonRibbon from "./ComingSoonRibbon";

const JokerSelection = ({
  players,
  currentJokerSelectionPlayer,
  selectedJokers,
  setSelectedJokers,
  setCurrentJokerSelectionPlayer,
  setGameState,
}) => {
  const [currentSelection, setCurrentSelection] = useState([]);
  const currentPlayer = players[currentJokerSelectionPlayer];

  const handleJokerSelect = (jokerId) => {
    if (!JOKERS[jokerId].enabled) return;

    // Compter combien de fois ce joker est déjà sélectionné
    const currentJokerCount = currentSelection.filter(
      (j) => j === jokerId
    ).length;

    // Si on clique sur un joker déjà sélectionné
    if (currentJokerCount > 0) {
      // Si on n'a pas atteint la quantité maximale et qu'on a encore de la place
      if (
        currentJokerCount < JOKERS[jokerId].quantity &&
        currentSelection.length < 3
      ) {
        setCurrentSelection([...currentSelection, jokerId]);
        return;
      }
      // Sinon, on retire la dernière occurrence
      const index = currentSelection.lastIndexOf(jokerId);
      if (index !== -1) {
        const newSelection = [...currentSelection];
        newSelection.splice(index, 1);
        setCurrentSelection(newSelection);
      }
      return;
    }

    // Si on clique sur un nouveau joker et qu'on a de la place
    if (currentSelection.length < 3) {
      setCurrentSelection([...currentSelection, jokerId]);
    }
  };

  const handleConfirmSelection = () => {
    if (currentSelection.length !== 3) return;

    // Sauvegarder la sélection pour le joueur actuel
    setSelectedJokers((prev) => ({
      ...prev,
      [currentPlayer.id]: currentSelection,
    }));

    if (currentJokerSelectionPlayer === players.length - 1) {
      // Tous les joueurs ont sélectionné leurs jokers
      setGameState(GAME_STATES.INITIAL_DICE_ROLL);
    } else {
      // Passer au joueur suivant
      setCurrentJokerSelectionPlayer(currentJokerSelectionPlayer + 1);
      setCurrentSelection([]);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg max-w-4xl w-full">
        <h2 className="text-2xl font-bold text-center mb-6">
          {currentPlayer.name}, sélectionnez 3 jokers
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
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
                  className={`p-4 rounded border ${
                    !joker.enabled
                      ? "bg-gray-200"
                      : selectedCount > 0
                      ? "bg-blue-200"
                      : "bg-blue-100"
                  }`}
                >
                  <div className="font-bold">
                    {joker.title || `Joker ${key}`}
                  </div>
                  <div className="text-xs text-gray-600 mt-1">
                    {joker.description}
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-sm">Stock: {joker.quantity}</span>
                    <div className="flex items-center space-x-2">
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
                        className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          canRemove
                            ? "bg-red-500 hover:bg-red-600 text-white"
                            : "bg-gray-300 cursor-not-allowed"
                        }`}
                      >
                        -
                      </button>
                      <span className="w-6 text-center font-bold">
                        {selectedCount}
                      </span>
                      <button
                        onClick={() => {
                          if (canAdd) {
                            setCurrentSelection([...currentSelection, key]);
                          }
                        }}
                        disabled={!canAdd}
                        className={`w-8 h-8 rounded-full flex items-center justify-center ${
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

        <div className="space-y-4">
          <div className="text-center">
            Sélection actuelle:{" "}
            {currentSelection.map((j, i) => (
              <span key={i} className="mx-1">
                {JOKERS[j].title || `Joker ${j}`}
              </span>
            ))}
          </div>

          <button
            onClick={handleConfirmSelection}
            disabled={currentSelection.length !== 3}
            className="w-full bg-blue-500 text-white py-2 px-4 rounded disabled:bg-gray-400"
          >
            Confirmer la sélection ({currentSelection.length}/3)
          </button>
        </div>
      </div>
    </div>
  );
};

export default JokerSelection;
