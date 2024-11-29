import React from "react";
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
  return (
    <div className="bg-white p-2 sm:p-3 rounded-lg shadow-lg">
      <h3 className="font-bold mb-2 text-xs sm:text-sm">Joueurs restants</h3>
      <ul className="flex flex-row md:flex-col gap-4 md:gap-2 overflow-x-auto md:overflow-x-visible">
        {players
          .filter((player, index) => index !== currentPlayerIndex)
          .map((player) => {
            const tokensBet = startingTokens[player.id] - player.tokens;
            return (
              <li
                key={player.id}
                className="flex-shrink-0 md:flex-shrink flex flex-col gap-1"
              >
                <span className="font-semibold text-xs sm:text-sm">
                  {player.name}
                </span>
                <TokensRow
                  availableTokens={player.tokens}
                  betTokens={tokensBet}
                />
                {tokensBet > 0 && (
                  <div className="flex items-center gap-1 text-amber-600">
                    <TokenDisplay count={tokensBet} type="bet" />
                    <span className="text-xs">misés</span>
                  </div>
                )}
                <PlayerJokers
                  player={player}
                  selectedJokers={selectedJokers}
                  isCurrentPlayer={false}
                  onUseJoker={onUseJoker}
                  usedJokersThisRound={usedJokersThisRound}
                />
              </li>
            );
          })}
      </ul>
    </div>
  );
};

export default RemainingPlayers;
