import React, { useState } from "react";
import { JOKERS } from "../../constants/gameConstants";

// Importation dynamique des images des jokers
const jokerImages = {};
Object.keys(JOKERS).forEach((key) => {
  jokerImages[key] = require(`../../assets/img/jokers/joker-${key}.png`);
});

const JokerBubble = ({ joker, onClose, onUse, position }) => (
  <div
    className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-64 z-50"
    style={{ ...position }}
  >
    <div className="bg-gray-900/95 rounded-xl p-3 shadow-xl backdrop-blur-sm">
      <div className="flex items-center gap-3 mb-2">
        <img
          src={jokerImages[joker.id]}
          alt={joker.title}
          className="w-10 h-10 object-contain"
        />
        <h3 className="text-white font-bold">{joker.title}</h3>
      </div>

      <p className="text-gray-300 text-sm mb-3">{joker.description}</p>

      <div className="flex justify-end gap-2">
        <button
          onClick={onClose}
          className="px-3 py-1 rounded-lg bg-gray-700 hover:bg-gray-600 text-white text-sm transition-colors"
        >
          Annuler
        </button>
        <button
          onClick={onUse}
          className="px-3 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-sm transition-colors"
        >
          Utiliser
        </button>
      </div>

      <div className="absolute bottom-0 left-1/2 w-3 h-3 -mb-1.5 -translate-x-1/2 rotate-45 bg-gray-900"></div>
    </div>
  </div>
);

const PlayerJokers = ({
  player,
  selectedJokers,
  isCurrentPlayer,
  onUseJoker,
  usedJokersThisRound,
}) => {
  const [selectedJokerInstanceId, setSelectedJokerInstanceId] = useState(null);

  if (!player || !selectedJokers[player.id]) {
    return null;
  }

  const playerJokers = selectedJokers[player.id];
  const hasUsedJokerThisRound = usedJokersThisRound.includes(player.id);

  if (!isCurrentPlayer) {
    return (
      <div className="mt-1">
        <div className="text-xs text-gray-600">
          Jokers restants : {playerJokers.length}
        </div>
      </div>
    );
  }

  const handleJokerClick = (jokerId, index) => {
    if (!hasUsedJokerThisRound) {
      const instanceId = `${jokerId}-${index}`;
      if (selectedJokerInstanceId === instanceId) {
        setSelectedJokerInstanceId(null);
      } else {
        setSelectedJokerInstanceId(instanceId);
      }
    }
  };

  const handleUseJoker = (jokerId, index) => {
    onUseJoker(player.id, jokerId, index);
    setSelectedJokerInstanceId(null);
  };

  return (
    <div className="mt-2 relative">
      <div className="text-sm font-medium mb-2">Jetons d'action :</div>
      <div className="flex flex-wrap gap-2">
        {playerJokers.map((jokerId, index) => {
          const joker = JOKERS[jokerId];
          const instanceId = `${jokerId}-${index}`;
          const isSelected = selectedJokerInstanceId === instanceId;

          return (
            <div key={instanceId} className="relative">
              <button
                onClick={() => handleJokerClick(jokerId, index)}
                disabled={hasUsedJokerThisRound}
                className={`w-10 h-10 rounded-lg overflow-hidden 
                  ${hasUsedJokerThisRound ? "opacity-50" : "hover:opacity-75"} 
                  transition-all duration-200
                  ${isSelected ? "ring-2 ring-blue-500" : ""}`}
              >
                <img
                  src={jokerImages[jokerId]}
                  alt={joker.title}
                  className="w-full h-full object-contain"
                />
              </button>

              {isSelected && (
                <JokerBubble
                  joker={joker}
                  onClose={() => setSelectedJokerInstanceId(null)}
                  onUse={() => handleUseJoker(jokerId, index)}
                />
              )}
            </div>
          );
        })}
      </div>

      {hasUsedJokerThisRound && (
        <div className="mt-2 text-sm text-amber-600">
          Vous avez déjà utilisé un jeton d'action ce tour-ci
        </div>
      )}
    </div>
  );
};

export default PlayerJokers;
