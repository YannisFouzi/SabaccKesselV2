import React from "react";
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
  return (
    <div className="bg-white p-2 sm:p-3 rounded-lg shadow-lg w-full">
      <h3 className="font-bold mb-2 text-xs sm:text-sm">Joueurs restants</h3>
      <ul className="flex flex-row md:flex-col gap-4 md:gap-2">
        {players
          .filter((player, index) => index !== currentPlayerIndex)
          .map((player) => {
            const tokensBet = startingTokens[player.id] - player.tokens;
            return (
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
                        betTokens={tokensBet}
                      />
                    </div>
                    <span className="text-xs text-gray-600 ml-2 whitespace-nowrap">
                      {player.tokens}
                    </span>
                  </div>
                  {tokensBet > 0 && (
                    <div className="flex items-center justify-between w-full text-amber-600">
                      <div className="flex items-center">
                        <TokenDisplay count={tokensBet} type="bet" />
                      </div>
                      <span className="text-xs ml-2 whitespace-nowrap">
                        {tokensBet} misés
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
            );
          })}
      </ul>
    </div>
  );
};

export default RemainingPlayers;
