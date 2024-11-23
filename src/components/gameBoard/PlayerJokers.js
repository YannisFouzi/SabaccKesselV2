import React from "react";

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

  return (
    <div className="mt-2">
      <div className="text-sm font-medium mb-1">Jokers :</div>
      <div className="flex space-x-2">
        {playerJokers.map((jokerId, index) => (
          <button
            key={`${jokerId}-${index}`}
            onClick={() => onUseJoker(player.id, jokerId, index)}
            disabled={!isCurrentPlayer || hasUsedJokerThisRound}
            className={`px-2 py-1 text-sm rounded ${
              isCurrentPlayer && !hasUsedJokerThisRound
                ? "bg-blue-100 hover:bg-blue-200"
                : "bg-gray-100"
            }`}
          >
            {jokerId}
          </button>
        ))}
      </div>
    </div>
  );
};

export default PlayerJokers;
