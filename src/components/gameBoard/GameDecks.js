import React from "react";
import { getCardBack, getCardImage } from "../../constants/cardImages";

const GameDecks = ({
  visibleSandCard,
  visibleBloodCard,
  onDrawCard,
  currentPlayerTokens,
  isCurrentPlayerTurn,
  hasUsedJokerA,
}) => {
  const canDrawCard =
    isCurrentPlayerTurn && (currentPlayerTokens > 0 || hasUsedJokerA);

  return (
    <div className="relative w-full max-w-5xl mx-auto p-8 rounded-3xl bg-gradient-to-br from-emerald-900 via-emerald-800 to-emerald-900 shadow-[inset_0_2px_20px_rgba(0,0,0,0.5)]">
      <div className="absolute inset-0 rounded-3xl opacity-5">
        <div className="absolute inset-0 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />
        <div className="absolute inset-0 bg-[linear-gradient(45deg,#fff2_1px,transparent_1px)] [background-size:24px_24px]" />
      </div>

      <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />

      <div className="relative flex gap-16 items-center justify-center">
        <div className="flex gap-8">
          <div className="relative">
            <div className="absolute inset-0 rounded-lg bg-black/20 blur-sm transform translate-y-1" />
            <div className="relative bg-gradient-to-br from-amber-100/10 to-amber-200/10 rounded-lg p-2 backdrop-blur-sm border border-white/10 shadow-xl">
              {visibleSandCard ? (
                <button
                  onClick={() => canDrawCard && onDrawCard("SAND", "VISIBLE")}
                  disabled={!canDrawCard}
                  className={`transform transition-all duration-200 ${
                    canDrawCard
                      ? "hover:scale-105 hover:-translate-y-1 active:translate-y-0 hover:brightness-110"
                      : "opacity-50"
                  }`}
                >
                  <img
                    src={getCardImage(
                      "SAND",
                      visibleSandCard.type,
                      visibleSandCard.type === "NORMAL"
                        ? visibleSandCard.value
                        : null
                    )}
                    alt="Carte Sable visible"
                    className="w-32 h-48 rounded-lg shadow-md"
                  />
                </button>
              ) : (
                <div className="w-32 h-48 rounded-lg bg-amber-900/20 shadow-inner" />
              )}
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 rounded-lg bg-black/20 blur-sm transform translate-y-1" />
            <div className="relative bg-gradient-to-br from-amber-100/10 to-amber-200/10 rounded-lg p-2 backdrop-blur-sm border border-white/10 shadow-xl">
              <button
                onClick={() => canDrawCard && onDrawCard("SAND", "HIDDEN")}
                disabled={!canDrawCard}
                className={`transform transition-all duration-200 ${
                  canDrawCard
                    ? "hover:scale-105 hover:-translate-y-1 active:translate-y-0 hover:brightness-110"
                    : "opacity-50"
                }`}
              >
                <img
                  src={getCardBack("SAND")}
                  alt="Pioche Sable"
                  className="w-32 h-48 rounded-lg shadow-md"
                />
              </button>
            </div>
          </div>
        </div>

        <div className="flex gap-8">
          <div className="relative">
            <div className="absolute inset-0 rounded-lg bg-black/20 blur-sm transform translate-y-1" />
            <div className="relative bg-gradient-to-br from-red-100/10 to-red-200/10 rounded-lg p-2 backdrop-blur-sm border border-white/10 shadow-xl">
              <button
                onClick={() => canDrawCard && onDrawCard("BLOOD", "HIDDEN")}
                disabled={!canDrawCard}
                className={`transform transition-all duration-200 ${
                  canDrawCard
                    ? "hover:scale-105 hover:-translate-y-1 active:translate-y-0 hover:brightness-110"
                    : "opacity-50"
                }`}
              >
                <img
                  src={getCardBack("BLOOD")}
                  alt="Pioche Sang"
                  className="w-32 h-48 rounded-lg shadow-md"
                />
              </button>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 rounded-lg bg-black/20 blur-sm transform translate-y-1" />
            <div className="relative bg-gradient-to-br from-red-100/10 to-red-200/10 rounded-lg p-2 backdrop-blur-sm border border-white/10 shadow-xl">
              {visibleBloodCard ? (
                <button
                  onClick={() => canDrawCard && onDrawCard("BLOOD", "VISIBLE")}
                  disabled={!canDrawCard}
                  className={`transform transition-all duration-200 ${
                    canDrawCard
                      ? "hover:scale-105 hover:-translate-y-1 active:translate-y-0 hover:brightness-110"
                      : "opacity-50"
                  }`}
                >
                  <img
                    src={getCardImage(
                      "BLOOD",
                      visibleBloodCard.type,
                      visibleBloodCard.type === "NORMAL"
                        ? visibleBloodCard.value
                        : null
                    )}
                    alt="Carte Sang visible"
                    className="w-32 h-48 rounded-lg shadow-md"
                  />
                </button>
              ) : (
                <div className="w-32 h-48 rounded-lg bg-red-900/20 shadow-inner" />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameDecks;
