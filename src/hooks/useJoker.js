import { GAME_STATES } from "../constants/gameConstants";

export const createUseJoker = ({
  players,
  startingTokens,
  setPlayers,
  setStartingTokens,
  setSelectedJokers,
  setUsedJokersThisRound,
  setHasUsedJokerA,
  setHasUsedJokerB,
  setHasUsedJokerC,
  setHasUsedJokerD,
  setJokerEUsed,
  addToHistory,
}) => {
  return (playerId, jokerId, jokerIndex) => {
    if (jokerId === "E") {
      setJokerEUsed(true);
    }

    const player = players.find((p) => p.id === playerId);
    if (!player) return;

    if (jokerId === "A") {
      setHasUsedJokerA(true);
    } else if (jokerId === "B") {
      const tokensBet = startingTokens[playerId] - player.tokens;
      const tokensToRecover = Math.min(2, tokensBet);

      if (tokensToRecover > 0) {
        setPlayers((prevPlayers) =>
          prevPlayers.map((p) =>
            p.id === playerId ? { ...p, tokens: p.tokens + tokensToRecover } : p
          )
        );
        setHasUsedJokerB(true);
      }
    } else if (jokerId === "C") {
      const tokensBet = startingTokens[playerId] - player.tokens;
      const tokensToRecover = Math.min(3, tokensBet);

      if (tokensToRecover > 0) {
        setPlayers((prevPlayers) =>
          prevPlayers.map((p) =>
            p.id === playerId ? { ...p, tokens: p.tokens + tokensToRecover } : p
          )
        );
        setHasUsedJokerC(true);
      }
    } else if (jokerId === "D") {
      setStartingTokens((prevStartingTokens) => {
        const updatedStartingTokens = { ...prevStartingTokens };
        let totalTokensStolen = 0;

        players.forEach((p) => {
          if (p.id !== playerId) {
            const tokensBet = prevStartingTokens[p.id] - p.tokens;
            if (tokensBet > 0) {
              updatedStartingTokens[p.id] = prevStartingTokens[p.id] - 1;
              totalTokensStolen++;
            }
          }
        });

        if (totalTokensStolen > 0) {
          updatedStartingTokens[playerId] =
            prevStartingTokens[playerId] + totalTokensStolen;
        }

        return updatedStartingTokens;
      });

      setHasUsedJokerD(true);
    }

    setSelectedJokers((prev) => {
      const playerJokers = [...prev[playerId]];
      playerJokers.splice(jokerIndex, 1);
      return {
        ...prev,
        [playerId]: playerJokers,
      };
    });

    setUsedJokersThisRound((prev) => [...prev, playerId]);

    addToHistory({
      type: GAME_STATES.USE_JOKER,
      playerName: player.name,
      jokerId: jokerId,
    });
  };
};
