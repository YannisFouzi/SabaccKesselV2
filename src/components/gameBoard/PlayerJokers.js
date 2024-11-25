import React, { useState } from "react";
import { JOKERS } from "../../constants/gameConstants";

// Importation dynamique des images des jokers
const jokerImages = {};
Object.keys(JOKERS).forEach((key) => {
  jokerImages[key] = require(`../../assets/img/jokers/joker-${key}.png`);
});

const JokerModal = ({ joker, onClose, onUse }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
    <div className="bg-white rounded-xl p-4 max-w-sm w-full mx-4 shadow-2xl">
      <div className="flex items-center gap-4 mb-4">
        <img
          src={jokerImages[joker.id]}
          alt={joker.title}
          className="w-16 h-16 object-contain"
        />
        <h3 className="text-lg font-bold">{joker.title}</h3>
      </div>

      <p className="text-gray-600 mb-6">{joker.description}</p>

      <div className="flex justify-end gap-3">
        <button
          onClick={onClose}
          className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition-colors"
        >
          Annuler
        </button>
        <button
          onClick={onUse}
          className="px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white transition-colors"
        >
          Utiliser
        </button>
      </div>
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
      setSelectedJoker({ id: jokerId, index });
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
          return (
            <button
              key={`${jokerId}-${index}`}
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
          );
        })}
      </div>

      {hasUsedJokerThisRound && (
        <div className="mt-2 text-sm text-amber-600">
          Vous avez déjà utilisé un jeton d'action ce tour-ci
        </div>
      )}

      {selectedJoker && (
        <JokerModal
          joker={{ ...JOKERS[selectedJoker.id], id: selectedJoker.id }}
          onClose={() => setSelectedJoker(null)}
          onUse={handleUseJoker}
        />
      )}
    </div>
  );
};

export default PlayerJokers;
