import React, { useState } from "react";
import { getCardBack, getCardImage } from "../../constants/cardImages";
import { CARD_TYPES } from "../../constants/gameConstants";
import PlayerIdentity from "../PlayerIdentity";
import PlayerJokers from "./PlayerJokers";

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
  players,
  consecutivePasses,
  selectedJokers,
  onUseJoker,
  usedJokersThisRound,
  previewCardId,
  previewCard,
}) => {
  const [selectPosition, setSelectPosition] = useState(null);

  if (!player) {
    return null;
  }

  const hand = player.hand || [];

  // Composant pour une carte
  const Card = ({ card: originalCard }) => {
    // Si la carte est celle qui doit être prévisualisée, on utilise la carte de prévisualisation
    const card =
      previewCardId === originalCard.id ? pendingDrawnCard : originalCard;

    const canInteract =
      isCurrentPlayer &&
      pendingDrawnCard &&
      originalCard.family === pendingDrawnCard.family;

    const handleCardClick = (event) => {
      if (canInteract) {
        onChooseDiscard(originalCard);
      }
      if (
        card.type === CARD_TYPES.IMPOSTOR &&
        isRevealPhase &&
        !selectedDiceValue &&
        isCurrentPlayer
      ) {
        const rect = event.currentTarget.getBoundingClientRect();
        setSelectPosition({
          x: rect.left + rect.width / 2,
          y: rect.top - 10,
        });
      }
    };

    return (
      <div
        style={{ position: "relative", zIndex: 9999 }}
        className={`
          w-[100px] sm:w-[120px] md:w-[140px]
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
        onClick={handleCardClick}
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
            className={`w-full h-full object-cover rounded-lg transition-all duration-300`}
          />
        )}

        {/* Interface de sélection de la valeur pour un imposteur */}
        {card.type === CARD_TYPES.IMPOSTOR &&
          isRevealPhase &&
          !selectedDiceValue &&
          isCurrentPlayer &&
          selectPosition && (
            <div
              className="fixed z-[9999]"
              style={{
                left: selectPosition.x,
                top: selectPosition.y,
                transform: "translate(-50%, -100%)",
              }}
            >
              <div className="bg-gray-900/95 rounded-xl p-3 shadow-xl backdrop-blur-sm">
                <select
                  className="bg-white p-2 rounded text-sm min-w-[100px]"
                  onChange={(e) => {
                    onSelectDiceValue(card.id, parseInt(e.target.value));
                    setSelectPosition(null);
                  }}
                  value=""
                >
                  <option value="">Choisir</option>
                  {[1, 2, 3, 4, 5, 6].map((value) => (
                    <option key={value} value={value}>
                      {value}
                    </option>
                  ))}
                </select>
                <div className="absolute bottom-0 left-1/2 w-3 h-3 -mb-1.5 -translate-x-1/2 rotate-45 bg-gray-900"></div>
              </div>
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

      {/* Cartes en haut */}
      <div className="flex justify-center min-w-0">
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

      {/* Jokers au milieu - ne les afficher que si le joueur a des jokers sélectionnés */}
      {selectedJokers?.[player.id]?.length > 0 && (
        <div className="w-full flex justify-center">
          <div className="w-[180px]">
            <PlayerJokers
              player={player}
              selectedJokers={selectedJokers}
              isCurrentPlayer={isCurrentPlayer}
              onUseJoker={onUseJoker}
              usedJokersThisRound={usedJokersThisRound}
            />
          </div>
        </div>
      )}

      {/* Informations du joueur et boutons d'action en bas */}
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

      {/* Style global pour permettre le débordement */}
      <style jsx global>{`
        #root,
        body,
        .overflow-y-auto {
          overflow: visible !important;
        }
      `}</style>
    </div>
  );
};

export default PlayerHand;
