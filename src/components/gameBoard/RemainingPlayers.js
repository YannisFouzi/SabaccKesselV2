import React, { useMemo } from "react";
import PlayerIdentity from "../PlayerIdentity";
import PlayerJokers from "./PlayerJokers";
import { TokenDisplay, TokensRow } from "./TokenComponents";

const RemainingPlayers = ({
  players,
  currentPlayerIndex,
  startingTokens,
  selectedJokers,
  onUseJoker,
  usedJokersThisRound,
}) => {
  // Mémoriser la liste des autres joueurs
  const otherPlayers = useMemo(
    () =>
      players?.filter((player, index) => index !== currentPlayerIndex) || [],
    [players, currentPlayerIndex]
  );

  // Mémoriser les données calculées pour chaque joueur
  const playersData = useMemo(
    () =>
      otherPlayers.map((player) => ({
        ...player,
        tokensBet: startingTokens[player.id] - player.tokens,
      })),
    [otherPlayers, startingTokens]
  );

  return (
    <div className="bg-white p-2 sm:p-3 rounded-lg shadow-lg w-full">
      <h3 className="font-bold mb-2 text-xs sm:text-sm">Joueurs restants</h3>
      <ul className="flex flex-row md:flex-col gap-4 md:gap-2">
        {playersData.map((player) => (
          <li key={player.id} className="flex flex-col gap-1 w-full">
            <PlayerIdentity
              player={player}
              className="text-gray-700 text-xs sm:text-sm"
            />
            <div className="flex flex-col gap-1">
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center">
                  <TokensRow
                    availableTokens={player.tokens}
                    betTokens={player.tokensBet}
                  />
                </div>
                <span className="text-xs text-gray-600 ml-2 whitespace-nowrap">
                  {player.tokens}
                </span>
              </div>
              {player.tokensBet > 0 && (
                <div className="flex items-center justify-between w-full text-amber-600">
                  <div className="flex items-center">
                    <TokenDisplay count={player.tokensBet} type="bet" />
                  </div>
                  <span className="text-xs ml-2 whitespace-nowrap">
                    {player.tokensBet} misés
                  </span>
                </div>
              )}
            </div>
            <PlayerJokers
              player={player}
              selectedJokers={selectedJokers}
              isCurrentPlayer={false}
              onUseJoker={onUseJoker}
              usedJokersThisRound={usedJokersThisRound}
            />
          </li>
        ))}
      </ul>
    </div>
  );
};

// Mémorisation avec fonction de comparaison optimisée
export default React.memo(RemainingPlayers, (prevProps, nextProps) => {
  return (
    prevProps.currentPlayerIndex === nextProps.currentPlayerIndex &&
    prevProps.players?.length === nextProps.players?.length &&
    JSON.stringify(
      prevProps.players?.map((p) => ({ id: p.id, tokens: p.tokens }))
    ) ===
      JSON.stringify(
        nextProps.players?.map((p) => ({ id: p.id, tokens: p.tokens }))
      ) &&
    JSON.stringify(prevProps.startingTokens) ===
      JSON.stringify(nextProps.startingTokens) &&
    JSON.stringify(prevProps.selectedJokers) ===
      JSON.stringify(nextProps.selectedJokers) &&
    JSON.stringify(prevProps.usedJokersThisRound) ===
      JSON.stringify(nextProps.usedJokersThisRound)
  );
});
