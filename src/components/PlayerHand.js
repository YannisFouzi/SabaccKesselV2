import React from "react";
import { CARD_FAMILIES, CARD_TYPES } from "../constants/gameConstants";

const PlayerHand = ({
  player,
  isCurrentPlayer,
  isRevealPhase,
  pendingDrawnCard,
  onChooseDiscard,
  selectedDiceValue,
  onSelectDiceValue,
}) => {
  const { hand, tokens, name } = player;

  // Composant pour une carte
  const Card = ({ card }) => {
    const isBloodCard = card.family === CARD_FAMILIES.BLOOD;

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
          relative w-24 h-36 border-2 rounded-lg flex flex-col items-center justify-between p-2
          ${
            isBloodCard
              ? "bg-red-100 border-red-800"
              : "bg-yellow-100 border-yellow-800"
          }
          ${canInteract ? "cursor-pointer hover:opacity-75" : "cursor-default"}
          ${!isRevealPhase && !isCurrentPlayer ? "transform rotate-180" : ""}
        `}
        onClick={() => (canInteract ? onChooseDiscard(card) : null)}
      >
        <div className="text-2xl font-bold">
          {!isRevealPhase && !isCurrentPlayer
            ? "?"
            : card.type === CARD_TYPES.SYLOP
            ? "S"
            : card.type === CARD_TYPES.IMPOSTOR
            ? "I"
            : card.value}
        </div>

        <div className="text-xs text-center">
          {!isRevealPhase && !isCurrentPlayer
            ? ""
            : card.type === CARD_TYPES.SYLOP
            ? "Sylop"
            : card.type === CARD_TYPES.IMPOSTOR
            ? "Imposteur"
            : isBloodCard
            ? "Sang"
            : "Sable"}
        </div>

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
    <div
      className={`
      p-4 rounded-lg 
      ${isCurrentPlayer ? "bg-blue-100" : "bg-gray-100"}
    `}
    >
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-bold">{name}</h3>
        <span className="text-sm">Jetons: {tokens}</span>
      </div>

      <div className="flex justify-center space-x-4">
        {/* Trier les cartes : Sable à gauche, Sang à droite */}
        {hand
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
          .map((card) => (
            <Card key={card.id} card={card} />
          ))}
      </div>
    </div>
  );
};

export default PlayerHand;
