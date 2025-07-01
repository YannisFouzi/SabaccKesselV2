import React, { useCallback, useEffect, useMemo, useState } from "react";
import { getCardBack } from "../../constants/cardImages";
import LazyImage from "../LazyImage";

const GameDecks = ({
  visibleSandCard,
  visibleBloodCard,
  onDrawCard,
  currentPlayerTokens,
  isCurrentPlayerTurn,
  hasUsedJokerA,
  round,
  turn,
  consecutivePasses,
  jokerEUsed,
}) => {
  const [glowEffect, setGlowEffect] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setGlowEffect((prev) => !prev);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // Mémoriser les conditions
  const canDrawCard = useMemo(
    () => isCurrentPlayerTurn && (currentPlayerTokens > 0 || hasUsedJokerA),
    [isCurrentPlayerTurn, currentPlayerTokens, hasUsedJokerA]
  );

  // Mémoriser les infos d'état du jeu
  const gameInfo = useMemo(
    () => ({
      round,
      turn,
      consecutivePasses,
      jokerEUsed,
    }),
    [round, turn, consecutivePasses, jokerEUsed]
  );

  // Optimiser les callbacks
  const handleDrawSandVisible = useCallback(() => {
    onDrawCard("SAND", "VISIBLE");
  }, [onDrawCard]);

  const handleDrawSandHidden = useCallback(() => {
    onDrawCard("SAND", "HIDDEN");
  }, [onDrawCard]);

  const handleDrawBloodVisible = useCallback(() => {
    onDrawCard("BLOOD", "VISIBLE");
  }, [onDrawCard]);

  const handleDrawBloodHidden = useCallback(() => {
    onDrawCard("BLOOD", "HIDDEN");
  }, [onDrawCard]);

  const renderCard = useCallback(
    (card, family, type, onClick) => {
      return (
        <div className="relative w-[90px] sm:w-[110px] md:w-[130px] lg:w-[150px] transform hover:scale-105 transition-all duration-300">
          {card && (
            <>
              <div
                className={`absolute inset-0 ${
                  family === "SAND" ? "bg-amber-500" : "bg-red-500"
                } opacity-20 blur-lg ${glowEffect ? "animate-pulse" : ""}`}
              />
              <div
                className={`absolute inset-0 bg-black/40 blur-sm transform translate-y-2 ${
                  canDrawCard ? "hover:translate-y-1" : ""
                } transition-all duration-200`}
              />
            </>
          )}
          <div
            className={`relative p-2 sm:p-3 ${
              family === "SAND"
                ? "bg-gradient-to-br from-amber-900/80 to-amber-700/60"
                : "bg-gradient-to-br from-red-900/80 to-red-700/60"
            } backdrop-blur-xl border-2 ${
              family === "SAND" ? "border-amber-400/30" : "border-red-400/30"
            } shadow-2xl rounded-xl`}
          >
            <button
              onClick={onClick}
              disabled={!canDrawCard}
              className={`w-full aspect-[2/3] transform transition-all duration-300 ${
                canDrawCard
                  ? "hover:scale-105 hover:-translate-y-2 active:translate-y-0 hover:brightness-125"
                  : "opacity-50 grayscale"
              }`}
            >
              {type === "VISIBLE" && card ? (
                <LazyImage
                  family={family}
                  type={card.type}
                  value={card.type === "NORMAL" ? card.value : null}
                  alt={`Carte ${family === "SAND" ? "Sable" : "Sang"}`}
                  className="w-full h-full object-contain rounded-lg"
                  fallbackClassName="rounded-lg"
                />
              ) : (
                <LazyImage
                  loadImageFn={() => getCardBack(family)}
                  alt={`Pioche ${family === "SAND" ? "Sable" : "Sang"}`}
                  className="w-full h-full object-contain rounded-lg"
                />
              )}
            </button>
          </div>
        </div>
      );
    },
    [canDrawCard, glowEffect]
  );

  return (
    <div className="relative w-full max-w-6xl mx-auto p-6 sm:p-10 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 shadow-[inset_0_2px_40px_rgba(0,0,0,0.7)]">
      <div className="absolute inset-0 rounded-3xl opacity-10">
        <div className="absolute inset-0 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:20px_20px]" />
        <div className="absolute inset-0 bg-[linear-gradient(45deg,#fff3_1px,transparent_1px)] [background-size:30px_30px]" />
      </div>

      <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-blue-500/5 to-purple-500/5 pointer-events-none" />

      <div className="absolute top-6 left-1/2 -translate-x-1/2 bg-black/40 backdrop-blur-md px-6 sm:px-8 py-3 sm:py-4 rounded-2xl border border-white/20 shadow-2xl">
        <div className="flex items-center space-x-6 sm:space-x-10 text-white/90 text-sm sm:text-base">
          <div className="flex items-center space-x-2">
            <span className="text-cyan-400">◈</span>
            <span className="font-bold">Manche {gameInfo.round}</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-purple-400">◈</span>
            <span className="font-bold">Tour {gameInfo.turn}/3</span>
          </div>
          {gameInfo.consecutivePasses > 0 && (
            <div className="flex items-center space-x-2">
              <span className="text-yellow-400">⚡</span>
              <span className="font-bold">
                {gameInfo.consecutivePasses}{" "}
                {gameInfo.consecutivePasses === 1 ? "passe" : "passes"}
              </span>
            </div>
          )}
          {gameInfo.jokerEUsed && (
            <div className="flex items-center space-x-2">
              <span className="text-red-400">★</span>
              <span className="font-bold text-yellow-400">Imposteur = 6</span>
            </div>
          )}
        </div>
      </div>

      <div className="relative flex items-center justify-center mt-20 sm:mt-12">
        <div className="flex gap-2 sm:gap-3 md:gap-4 lg:gap-8 xl:gap-12 px-2 sm:px-4">
          {renderCard(
            visibleSandCard,
            "SAND",
            "VISIBLE",
            handleDrawSandVisible
          )}
          {renderCard(null, "SAND", "HIDDEN", handleDrawSandHidden)}
          {renderCard(null, "BLOOD", "HIDDEN", handleDrawBloodHidden)}
          {renderCard(
            visibleBloodCard,
            "BLOOD",
            "VISIBLE",
            handleDrawBloodVisible
          )}
        </div>
      </div>
    </div>
  );
};

// Mémorisation avec fonction de comparaison optimisée
export default React.memo(GameDecks, (prevProps, nextProps) => {
  return (
    prevProps.currentPlayerTokens === nextProps.currentPlayerTokens &&
    prevProps.isCurrentPlayerTurn === nextProps.isCurrentPlayerTurn &&
    prevProps.hasUsedJokerA === nextProps.hasUsedJokerA &&
    prevProps.round === nextProps.round &&
    prevProps.turn === nextProps.turn &&
    prevProps.consecutivePasses === nextProps.consecutivePasses &&
    prevProps.jokerEUsed === nextProps.jokerEUsed &&
    JSON.stringify(prevProps.visibleSandCard) ===
      JSON.stringify(nextProps.visibleSandCard) &&
    JSON.stringify(prevProps.visibleBloodCard) ===
      JSON.stringify(nextProps.visibleBloodCard)
  );
});
