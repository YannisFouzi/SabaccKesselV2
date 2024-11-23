import React from "react";
import { getCardBack, getCardImage } from "../../constants/cardImages";
import { CARD_TYPES } from "../../constants/gameConstants";

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
}) => {
  if (!player) {
    return null;
  }

  const hand = player.hand || [];

  const totalTokens = startingTokens[player.id] || 0;
  const tokensBet = Math.max(0, totalTokens - player.tokens);
  const usedTokens = Math.max(0, totalTokens - player.tokens - tokensBet);

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
          relative w-20 h-32 sm:w-24 sm:h-36 md:w-28 md:h-40 
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
            className="w-full h-full rounded-lg"
          />
        ) : (
          <img
            src={getCardImage(
              card.family,
              card.type,
              card.type === CARD_TYPES.NORMAL ? card.value : null
            )}
            alt={`${card.type} ${card.value || ""}`}
            className="w-full h-full rounded-lg"
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
    <div className={`relative ${isCurrentPlayer ? "border-blue-500" : ""}`}>
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
  );
};

export default PlayerHand;
