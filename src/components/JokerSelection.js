import React, { useState } from "react";
import { AVATAR_LIST } from "../constants/avatarConfig";
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
  standalone = false,
}) => {
  const [currentSelection, setCurrentSelection] = useState([]);
  const currentPlayer = players[currentJokerSelectionPlayer];

  const handleConfirmSelection = () => {
    if (currentSelection.length !== 3) return;

    if (standalone) {
      setSelectedJokers(currentSelection);
    } else {
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
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50">
      <div className="w-full h-full flex flex-col">
        {/* En-tête fixe */}
        <h2 className="text-xl md:text-2xl font-bold text-center p-4 bg-white border-b flex items-center justify-center gap-3">
          <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200">
            <img
              src={
                AVATAR_LIST.find((avatar) => avatar.id === currentPlayer.avatar)
                  ?.image
              }
              alt={`Avatar de ${currentPlayer.name}`}
              className="w-full h-full object-cover"
            />
          </div>
          <span>{currentPlayer.name}, sélectionnez 3 jetons d'action</span>
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
                      <div className="w-20 h-20 mx-auto mb-2 relative">
                        {[...Array(joker.quantity)].map((_, index) => (
                          <img
                            key={index}
                            src={jokerImages[key]}
                            alt={`Joker ${key}`}
                            className={`w-full h-full object-contain absolute top-0 left-0 origin-bottom transition-opacity duration-300`}
                            style={{
                              transform: `rotate(${
                                -30 + (index * 60) / (joker.quantity - 1)
                              }deg)`,
                              zIndex: index,
                              opacity:
                                index >= joker.quantity - selectedCount
                                  ? 0.3
                                  : 1,
                            }}
                          />
                        ))}
                      </div>
                      <div className="font-bold text-center text-sm mb-1">
                        {joker.title || `Joker ${key}`}
                      </div>
                      <div className="text-xs text-gray-600 mb-2 text-center h-12 overflow-y-auto">
                        {joker.description}
                      </div>
                      <div className="flex items-center justify-between bg-white rounded-lg p-2 shadow-md">
                        <div className="flex items-center gap-3 w-full">
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
                            className={`
                              flex-1 h-10 rounded-lg
                              flex items-center justify-center 
                              transform transition-all duration-200
                              text-base font-bold
                              ${
                                canRemove
                                  ? "bg-gradient-to-r from-red-500 to-red-600 text-white shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
                                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
                              }
                            `}
                          >
                            Retirer
                          </button>
                          <button
                            onClick={() => {
                              if (canAdd) {
                                setCurrentSelection([...currentSelection, key]);
                              }
                            }}
                            disabled={!canAdd}
                            className={`
                              flex-1 h-10 rounded-lg
                              flex items-center justify-center 
                              transform transition-all duration-200
                              text-base font-bold
                              ${
                                canAdd
                                  ? "bg-gradient-to-r from-green-500 to-green-600 text-white shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
                                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
                              }
                            `}
                          >
                            Ajouter
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
            className={`
              w-full py-4 px-6 rounded-xl text-lg font-bold
              transition-all duration-200 transform
              ${
                currentSelection.length === 3
                  ? "bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 text-white shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 active:shadow-md"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }
              relative overflow-hidden
            `}
          >
            <div className="relative z-10 flex items-center justify-center">
              {currentSelection.length === 3 ? (
                <>
                  <span>Confirmer la sélection</span>
                </>
              ) : (
                <>
                  <span className="mr-2">🎲</span>
                  <span>
                    Sélectionnez {3 - currentSelection.length} joker
                    {3 - currentSelection.length > 1 ? "s" : ""} de plus
                  </span>
                </>
              )}
            </div>
            {currentSelection.length === 3 && (
              <div
                className="absolute inset-0 bg-gradient-to-r from-purple-400 to-blue-300 opacity-20"
                style={{
                  backgroundSize: "200% 100%",
                  animation: "shimmer 2s linear infinite",
                }}
              />
            )}
          </button>
        </div>

        <style jsx>{`
          @keyframes shimmer {
            0% {
              background-position: 100% 0;
            }
            100% {
              background-position: -100% 0;
            }
          }
        `}</style>
      </div>
    </div>
  );
};

export default JokerSelection;
