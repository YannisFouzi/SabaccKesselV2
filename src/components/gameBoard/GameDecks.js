import React from "react";
import { getCardBack, getCardImage } from "../../constants/cardImages";

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
  players,
}) => {
  const canDrawCard =
    isCurrentPlayerTurn && (currentPlayerTokens > 0 || hasUsedJokerA);

  const renderCard = (card, family, type, onClick) => (
    <div className="relative">
      <div className="absolute inset-0 rounded-lg bg-black/20 blur-sm transform translate-y-1" />
      <div
        className={`relative bg-gradient-to-br from-${
          family === "SAND" ? "amber" : "red"
        }-100/10 to-${
          family === "SAND" ? "amber" : "red"
        }-200/10 rounded-lg p-2 backdrop-blur-sm border border-white/10 shadow-xl`}
      >
        {card ? (
          <button
            onClick={() => canDrawCard && onClick()}
            disabled={!canDrawCard}
            className={`transform transition-all duration-200 ${
              canDrawCard
                ? "hover:scale-105 hover:-translate-y-1 active:translate-y-0 hover:brightness-110"
                : "opacity-50"
            }`}
          >
            <img
              src={
                type === "VISIBLE"
                  ? getCardImage(
                      family,
                      card.type,
                      card.type === "NORMAL" ? card.value : null
                    )
                  : getCardBack(family)
              }
              alt={`${type === "VISIBLE" ? "Carte" : "Pioche"} ${
                family === "SAND" ? "Sable" : "Sang"
              }`}
              className="w-32 h-48 rounded-lg shadow-md"
            />
          </button>
        ) : (
          <div
            className={`w-32 h-48 rounded-lg bg-${
              family === "SAND" ? "amber" : "red"
            }-900/20 shadow-inner`}
          />
        )}
      </div>
    </div>
  );

  return (
    <div className="relative w-full max-w-5xl mx-auto p-8 rounded-3xl bg-gradient-to-br from-emerald-900 via-emerald-800 to-emerald-900 shadow-[inset_0_2px_20px_rgba(0,0,0,0.5)]">
      <div className="absolute inset-0 rounded-3xl opacity-5">
        <div className="absolute inset-0 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />
        <div className="absolute inset-0 bg-[linear-gradient(45deg,#fff2_1px,transparent_1px)] [background-size:24px_24px]" />
      </div>

      <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />

      <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-black/30 backdrop-blur-sm px-6 py-3 rounded-full border border-white/10 shadow-lg">
        <div className="flex items-center space-x-8 text-white/90">
          <div className="flex items-center">
            <span className="text-yellow-400 mr-2">🎯</span>
            <span className="font-bold">Manche {round}</span>
          </div>
          <div className="flex items-center">
            <span className="text-yellow-400 mr-2">🎲</span>
            <span className="font-bold">Tour {turn}/3</span>
          </div>
          {consecutivePasses > 0 && (
            <div className="flex items-center">
              <span className="text-yellow-400 mr-2">⏭️</span>
              <span className="font-bold">
                {consecutivePasses}{" "}
                {consecutivePasses === 1 ? "passe" : "passes"}
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="relative flex gap-16 items-center justify-center mt-8">
        <div className="flex gap-8">
          {renderCard(visibleSandCard, "SAND", "VISIBLE", () =>
            onDrawCard("SAND", "VISIBLE")
          )}
          {renderCard({ type: "HIDDEN" }, "SAND", "HIDDEN", () =>
            onDrawCard("SAND", "HIDDEN")
          )}
        </div>

        <div className="flex gap-8">
          {renderCard({ type: "HIDDEN" }, "BLOOD", "HIDDEN", () =>
            onDrawCard("BLOOD", "HIDDEN")
          )}
          {renderCard(visibleBloodCard, "BLOOD", "VISIBLE", () =>
            onDrawCard("BLOOD", "VISIBLE")
          )}
        </div>
      </div>
    </div>
  );
};

export default GameDecks;
