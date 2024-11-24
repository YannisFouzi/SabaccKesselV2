import React from "react";
import { JOKERS } from "../../constants/gameConstants";

// Importation dynamique des images des jokers
const jokerImages = {};
Object.keys(JOKERS).forEach((key) => {
  jokerImages[key] = require(`../../assets/img/jokers/joker-${key}.png`);
});

const PlayerJokers = ({
  player,
  selectedJokers,
  isCurrentPlayer,
  onUseJoker,
  usedJokersThisRound,
}) => {
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

  return (
    <div className="mt-2">
      <div className="text-sm font-medium mb-1">Jokers :</div>
      <div className="flex space-x-2">
        {playerJokers.map((jokerId, index) => (
          <button
            key={`${jokerId}-${index}`}
            onClick={() => onUseJoker(player.id, jokerId, index)}
            disabled={hasUsedJokerThisRound}
            className={`relative p-2 text-sm rounded min-w-[80px] ${
              !hasUsedJokerThisRound
                ? "bg-blue-100 hover:bg-blue-200"
                : "bg-gray-100"
            }`}
          >
            <div className="w-12 h-12 mx-auto mb-1">
              <img
                src={jokerImages[jokerId]}
                alt={`Joker ${jokerId}`}
                className="w-full h-full object-contain"
              />
            </div>
            <span className="block text-xs">{JOKERS[jokerId].title}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default PlayerJokers;
