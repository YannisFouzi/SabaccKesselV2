import React, { useState } from "react";
import { GAME_STATES, JOKERS } from "../constants/gameConstants";

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
    if (currentSelection.length >= 3) return;

    // Vérifier si le joueur a déjà sélectionné le maximum de ce type de joker
    const jokerCount = currentSelection.filter((j) => j === jokerId).length;
    if (jokerCount >= JOKERS[jokerId].quantity) return;

    setCurrentSelection([...currentSelection, jokerId]);
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
      <div className="bg-white p-8 rounded-lg max-w-2xl w-full">
        <h2 className="text-2xl font-bold text-center mb-6">
          {currentPlayer.name}, sélectionnez 3 jokers
        </h2>

        <div className="grid grid-cols-4 gap-4 mb-6">
          {Object.entries(JOKERS).map(([key, joker]) => {
            const selectedCount = currentSelection.filter(
              (j) => j === key
            ).length;
            const isDisabled =
              selectedCount >= joker.quantity || currentSelection.length >= 3;

            return (
              <button
                key={key}
                onClick={() => handleJokerSelect(key)}
                disabled={isDisabled}
                className={`p-4 rounded border ${
                  isDisabled ? "bg-gray-200" : "bg-blue-100 hover:bg-blue-200"
                }`}
              >
                <div className="font-bold">Joker {key}</div>
                <div className="text-sm">
                  {selectedCount}/{joker.quantity}
                </div>
              </button>
            );
          })}
        </div>

        <div className="space-y-4">
          <div className="text-center">
            Sélection actuelle:{" "}
            {currentSelection.map((j) => `Joker ${j}`).join(", ")}
          </div>

          <button
            onClick={handleConfirmSelection}
            disabled={currentSelection.length !== 3}
            className="w-full bg-blue-500 text-white py-2 px-4 rounded disabled:bg-gray-400"
          >
            Confirmer la sélection
          </button>
        </div>
      </div>
    </div>
  );
};

export default JokerSelection;
