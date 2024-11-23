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
    <div className="flex gap-16 items-center justify-center">
      {/* Sable Visible */}
      <div className="relative">
        {visibleSandCard && (
          <button
            onClick={() => canDrawCard && onDrawCard("SAND", "VISIBLE")}
            disabled={!canDrawCard}
            className={`transform transition-transform ${
              canDrawCard ? "hover:scale-105" : "opacity-50"
            }`}
          >
            <img
              src={getCardImage(
                "SAND",
                visibleSandCard.type,
                visibleSandCard.type === "NORMAL" ? visibleSandCard.value : null
              )}
              alt="Carte Sable visible"
              className="w-32 h-48"
            />
          </button>
        )}
      </div>

      {/* Sable Invisible */}
      <button
        onClick={() => canDrawCard && onDrawCard("SAND", "HIDDEN")}
        disabled={!canDrawCard}
        className={`transform transition-transform ${
          canDrawCard ? "hover:scale-105" : "opacity-50"
        }`}
      >
        <img
          src={getCardBack("SAND")}
          alt="Pioche Sable"
          className="w-32 h-48"
        />
      </button>

      {/* Sang Invisible */}
      <button
        onClick={() => canDrawCard && onDrawCard("BLOOD", "HIDDEN")}
        disabled={!canDrawCard}
        className={`transform transition-transform ${
          canDrawCard ? "hover:scale-105" : "opacity-50"
        }`}
      >
        <img
          src={getCardBack("BLOOD")}
          alt="Pioche Sang"
          className="w-32 h-48"
        />
      </button>

      {/* Sang Visible */}
      <div className="relative">
        {visibleBloodCard && (
          <button
            onClick={() => canDrawCard && onDrawCard("BLOOD", "VISIBLE")}
            disabled={!canDrawCard}
            className={`transform transition-transform ${
              canDrawCard ? "hover:scale-105" : "opacity-50"
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
              className="w-32 h-48"
            />
          </button>
        )}
      </div>
    </div>
  );
};

export default GameDecks;
