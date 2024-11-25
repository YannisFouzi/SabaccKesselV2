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

      {/* Flèche pointant vers le joker */}
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
  const [selectedJoker, setSelectedJoker] = useState(null);

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
      if (selectedJoker?.id === jokerId) {
        setSelectedJoker(null);
      } else {
        setSelectedJoker({ id: jokerId, index });
      }
    }
  };

  const handleUseJoker = () => {
    if (selectedJoker) {
      onUseJoker(player.id, selectedJoker.id, selectedJoker.index);
      setSelectedJoker(null);
    }
  };

  return (
    <div className="mt-2 relative">
      <div className="text-sm font-medium mb-2">Jetons d'action :</div>

      <div className="flex space-x-2">
        {playerJokers.map((jokerId, index) => {
          const joker = { ...JOKERS[jokerId], id: jokerId };
          const isSelected = selectedJoker?.id === jokerId;

          return (
            <div key={`${jokerId}-${index}`} className="relative">
              <button
                onClick={() => handleJokerClick(jokerId, index)}
                disabled={hasUsedJokerThisRound}
                className={`
                  relative
                  w-16 h-24 rounded-lg overflow-hidden
                  transition-all duration-200
                  ${
                    !hasUsedJokerThisRound
                      ? "active:scale-95 cursor-pointer"
                      : "opacity-50 cursor-not-allowed"
                  }
                  ${isSelected ? "ring-2 ring-blue-500 ring-offset-2" : ""}
                  bg-gradient-to-br from-purple-100 to-blue-100
                  border-2 border-white/50 shadow-lg
                `}
              >
                <img
                  src={jokerImages[jokerId]}
                  alt={`Joker ${jokerId}`}
                  className="w-full h-full object-contain p-1"
                />
              </button>

              {isSelected && (
                <JokerBubble
                  joker={joker}
                  onClose={() => setSelectedJoker(null)}
                  onUse={handleUseJoker}
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
