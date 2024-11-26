import React from "react";
import { getCardBack, getCardImage } from "../../constants/cardImages";
import { CARD_TYPES } from "../../constants/gameConstants";
import PlayerIdentity from "../PlayerIdentity";

const PlayerHand = ({
  player,
  isCurrentPlayer,
  isRevealPhase,
  pendingDrawnCard,
  onChooseDiscard,
  selectedDiceValue,
  onSelectDiceValue,
  isTransitioning,
  startingTokens,
  onPass,
  currentPlayerTokens,
  players,
  consecutivePasses,
}) => {
  if (!player) {
    return null;
  }

  const hand = player.hand || [];

  // Composant pour une carte
  const Card = ({ card }) => {
    // On ne peut interagir avec une carte que si :
    // - C'est le joueur actif
    // - Une carte a été piochée
    // - La carte est de la même famille que la carte piochée
    const canInteract =
      isCurrentPlayer &&
      pendingDrawnCard &&
      card.family === pendingDrawnCard.family;

    return (
      <div
        className={`
          relative w-[100px] sm:w-[120px] md:w-[140px]
          aspect-[2/3]
          cursor-pointer 
          transition-transform 
          hover:scale-105
          ${canInteract ? "cursor-pointer hover:opacity-75" : "cursor-default"}
          ${
            (!isRevealPhase && !isCurrentPlayer) || isTransitioning
              ? "transform rotate-180"
              : ""
          }
        `}
        onClick={() => (canInteract ? onChooseDiscard(card) : null)}
      >
        {(!isRevealPhase && !isCurrentPlayer) || isTransitioning ? (
          <img
            src={getCardBack(card.family)}
            alt="Carte cachée"
            className="w-full h-full object-cover rounded-lg"
          />
        ) : (
          <img
            src={getCardImage(
              card.family,
              card.type,
              card.type === CARD_TYPES.NORMAL ? card.value : null
            )}
            alt={`${card.type} ${card.value || ""}`}
            className="w-full h-full object-cover rounded-lg"
          />
        )}

        {/* Interface de sélection de la valeur pour un imposteur */}
        {card.type === CARD_TYPES.IMPOSTOR &&
          isRevealPhase &&
          !selectedDiceValue &&
          isCurrentPlayer && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <select
                className="bg-white p-1 text-sm"
                onChange={(e) =>
                  onSelectDiceValue(card.id, parseInt(e.target.value))
                }
                value=""
              >
                <option value="">Choisir</option>
                {[1, 2, 3, 4, 5, 6].map((value) => (
                  <option key={value} value={value}>
                    {value}
                  </option>
                ))}
              </select>
            </div>
          )}
      </div>
    );
  };

  return (
    <div className="relative flex flex-col gap-4">
      {/* Alerte de révélation imminente */}
      {players?.length > 0 && consecutivePasses === players.length - 1 && (
        <div className="w-full flex justify-center mb-4">
          <div className="bg-red-500/80 backdrop-blur-sm px-6 py-2 rounded-lg shadow-lg text-white font-bold flex items-center space-x-2 animate-pulse">
            <span>⚠️</span>
            <span>Un pass de plus et les mains seront révélées !</span>
          </div>
        </div>
      )}

      <div className="flex items-center gap-4">
        <div
          className={`flex-grow ${isCurrentPlayer ? "border-blue-500" : ""}`}
        >
          <div className="relative">
            <PlayerIdentity
              player={player}
              className={`mb-2 ${
                isCurrentPlayer ? "text-yellow-400" : "text-white"
              }`}
            />
            <div className="flex justify-between items-center mb-2">
              <div className="font-medium">{player.name}</div>
              <div className="text-sm">
                {player.tokens} jetons
                {typeof startingTokens[player.id] !== "undefined" &&
                  startingTokens[player.id] !== player.tokens && (
                    <span className="text-red-500 ml-1">
                      (-{startingTokens[player.id] - player.tokens})
                    </span>
                  )}
              </div>
            </div>

            <div className="flex space-x-4">
              {hand.map((card) => (
                <Card key={card.id} card={card} />
              ))}
              {pendingDrawnCard && isCurrentPlayer && (
                <Card card={pendingDrawnCard} isPending={true} />
              )}
            </div>
          </div>
        </div>

        {/* Bouton Passer le tour */}
        {isCurrentPlayer && !pendingDrawnCard && !isRevealPhase && (
          <div className="flex-shrink-0 ml-4">
            <button
              onClick={onPass}
              className={`
                relative overflow-hidden
                bg-gradient-to-r from-indigo-600 to-blue-600 
                hover:from-indigo-700 hover:to-blue-700
                text-white px-6 py-3 rounded-xl shadow-lg 
                transform transition-all duration-200 
                hover:-translate-y-0.5 active:translate-y-0
                font-bold
                flex flex-col items-center gap-2
                ${currentPlayerTokens === 0 ? "animate-pulse" : ""}
              `}
            >
              <span>Passer son tour</span>
              {currentPlayerTokens === 0 && (
                <div className="text-amber-300 text-xs font-normal">
                  Plus de jetons !
                </div>
              )}
              {/* Effet de brillance */}
              <div
                className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0"
                style={{
                  transform: "translateX(-100%)",
                  animation: "shimmer 2s infinite",
                }}
              />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// Ajout des styles d'animation
const style = document.createElement("style");
style.textContent = `
  @keyframes shimmer {
    100% {
      transform: translateX(100%);
    }
  }
`;
document.head.appendChild(style);

export default PlayerHand;
