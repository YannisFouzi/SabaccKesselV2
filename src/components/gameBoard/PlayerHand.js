import React from "react";
import { getCardBack, getCardImage } from "../../constants/cardImages";
import { CARD_TYPES, JOKERS } from "../../constants/gameConstants";
import PlayerIdentity from "../PlayerIdentity";

// Importation dynamique des images des jokers
const jokerImages = {};
Object.keys(JOKERS).forEach((key) => {
  jokerImages[key] = require(`../../assets/img/jokers/joker-${key}.png`);
});

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
  selectedJokers = {},
  onUseJoker,
  hasUsedJokerThisRound,
}) => {
  if (!player) {
    return null;
  }

  const hand = player.hand || [];
  const playerJokers = selectedJokers[player.id] || [];

  const handleJokerClick = (jokerId, index) => {
    if (!hasUsedJokerThisRound && isCurrentPlayer) {
      onUseJoker(player.id, jokerId, index);
    }
  };

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

      {/* Nouvelle disposition en deux colonnes */}
      <div className="flex justify-between items-center w-full">
        {/* Colonne de gauche - Cartes du joueur */}
        <div className="flex-1 flex items-center justify-center">
          <div className="relative flex -space-x-4 transform rotate-2">
            {hand.map((card, index) => (
              <div
                key={card.id}
                className={`
                  relative transform 
                  ${index === 0 ? "-rotate-6" : "rotate-6"}
                  hover:translate-y-[-1rem] transition-transform duration-200
                `}
              >
                <Card card={card} />
              </div>
            ))}
          </div>
        </div>

        {/* Colonne de droite - Jokers */}
        <div className="flex-1 flex items-center justify-center">
          <div className="relative flex -space-x-2 transform -rotate-2">
            {playerJokers.map((jokerId, index) => (
              <div
                key={`${jokerId}-${index}`}
                className={`
                  relative transform 
                  ${
                    index === 0
                      ? "-rotate-3"
                      : index === 1
                      ? "rotate-0"
                      : "rotate-3"
                  }
                  hover:translate-y-[-1rem] transition-transform duration-200
                `}
              >
                <button
                  onClick={() => handleJokerClick(jokerId, index)}
                  disabled={hasUsedJokerThisRound}
                  className={`
                    w-16 h-24 rounded-lg overflow-hidden
                    ${hasUsedJokerThisRound ? "opacity-50" : "hover:opacity-75"}
                    transition-all duration-200
                    ${isCurrentPlayer ? "ring-2 ring-blue-500" : ""}
                  `}
                >
                  <img
                    src={jokerImages[jokerId]}
                    alt={JOKERS[jokerId].title}
                    className="w-full h-full object-contain"
                  />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Informations du joueur et boutons d'action */}
      <div className="flex flex-col gap-2">
        {/* Infos joueur */}
        <div className="flex justify-between items-center">
          <PlayerIdentity
            player={player}
            className={`${isCurrentPlayer ? "text-yellow-400" : "text-white"}`}
          />
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

        {/* Bouton passer le tour */}
        {isCurrentPlayer && !pendingDrawnCard && (
          <button
            onClick={onPass}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Passer le tour
          </button>
        )}
      </div>
    </div>
  );
};

export default PlayerHand;
