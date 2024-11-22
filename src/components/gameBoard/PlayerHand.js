import React from "react";
import jetonImage from "../../assets/img/jeton.png";
import jetonKoImage from "../../assets/img/jeton_ko.png";
import { getCardBack, getCardImage } from "../../constants/cardImages";
import { CARD_FAMILIES, CARD_TYPES } from "../../constants/gameConstants";

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
  const { hand, tokens, name, id } = player;
  const totalTokens = startingTokens[id] || 0;
  const tokensBet = Math.max(0, totalTokens - tokens);
  const usedTokens = Math.max(0, totalTokens - tokens - tokensBet);

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
    <div className="bg-blue-50 p-4 rounded-lg">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 mb-4">
        <span className="font-bold text-sm sm:text-base">{name}</span>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
          {/* Tous les jetons dans une seule ligne */}
          <div className="flex items-center gap-1">
            <span className="text-sm">Jetons:</span>
            <div className="flex items-center gap-1.5">
              {/* Jetons disponibles */}
              {tokens > 0 &&
                [...Array(tokens)].map((_, index) => (
                  <img
                    key={`available-${index}`}
                    src={jetonImage}
                    alt="Jeton disponible"
                    className="w-6 h-6 sm:w-7 sm:h-7"
                  />
                ))}
              {/* Jetons utilisés (indisponibles) */}
              {usedTokens > 0 &&
                [...Array(usedTokens)].map((_, index) => (
                  <img
                    key={`used-${index}`}
                    src={jetonKoImage}
                    alt="Jeton indisponible"
                    className="w-6 h-6 sm:w-7 sm:h-7"
                  />
                ))}
              {/* Jetons misés directement à la suite */}
              {tokensBet > 0 &&
                [...Array(tokensBet)].map((_, index) => (
                  <img
                    key={`bet-${index}`}
                    src={jetonKoImage}
                    alt="Jeton misé"
                    className="w-6 h-6 sm:w-7 sm:h-7"
                  />
                ))}
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-2 justify-center">
        {hand &&
          hand
            .sort((a, b) => {
              if (
                a.family === CARD_FAMILIES.SAND &&
                b.family === CARD_FAMILIES.BLOOD
              )
                return -1;
              if (
                a.family === CARD_FAMILIES.BLOOD &&
                b.family === CARD_FAMILIES.SAND
              )
                return 1;
              return 0;
            })
            .map((card) => <Card key={card.id} card={card} />)}
      </div>
    </div>
  );
};

export default PlayerHand;
