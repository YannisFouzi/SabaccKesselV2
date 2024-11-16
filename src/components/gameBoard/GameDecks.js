import React from "react";
import { CARD_FAMILIES, CARD_TYPES } from "../../constants/gameConstants";

const GameDecks = ({
  visibleSandCard,
  visibleBloodCard,
  onDrawCard,
  currentPlayerTokens,
  isCurrentPlayerTurn,
}) => {
  // Fonction pour gérer le clic sur une carte visible
  const handleVisibleCardClick = (card) => {
    if (!isCurrentPlayerTurn || currentPlayerTokens < 1) return;
    onDrawCard(card.family, true, card);
  };

  // Fonction pour gérer le clic sur une pioche cachée
  const handleHiddenDeckClick = (family) => {
    if (!isCurrentPlayerTurn || currentPlayerTokens < 1) return;
    onDrawCard(family, false);
  };

  // Composant pour une carte visible
  const VisibleCard = ({ card }) => (
    <div
      onClick={() => handleVisibleCardClick(card)}
      className={`
        w-24 h-36 border-2 rounded-lg flex flex-col items-center justify-center
        ${card.family === CARD_FAMILIES.SAND ? "bg-yellow-100" : "bg-red-100"}
        ${
          card.family === CARD_FAMILIES.SAND
            ? "border-yellow-800"
            : "border-red-800"
        }
        ${
          isCurrentPlayerTurn && currentPlayerTokens > 0
            ? "cursor-pointer hover:opacity-75"
            : "cursor-not-allowed opacity-50"
        }
      `}
    >
      <span className="text-2xl font-bold">
        {card.type === CARD_TYPES.SYLOP
          ? "S"
          : card.type === CARD_TYPES.IMPOSTOR
          ? "I"
          : card.value}
      </span>
      <span className="text-sm mt-2">
        {card.type === "SYLOP"
          ? "Sylop"
          : card.type === "IMPOSTOR"
          ? "Imposteur"
          : card.family === CARD_FAMILIES.SAND
          ? "Sable"
          : "Sang"}
      </span>
    </div>
  );

  // Composant pour une pioche cachée
  const HiddenDeck = ({ family }) => (
    <div
      onClick={() => handleHiddenDeckClick(family)}
      className={`
        w-24 h-36 border-2 rounded-lg flex items-center justify-center
        ${
          family === CARD_FAMILIES.SAND
            ? "bg-yellow-900 hover:bg-yellow-800"
            : "bg-red-900 hover:bg-red-800"
        }
        ${
          isCurrentPlayerTurn && currentPlayerTokens > 0
            ? "cursor-pointer"
            : "cursor-not-allowed opacity-50"
        }
      `}
    >
      <span className="text-white text-sm rotate-90">
        {family === CARD_FAMILIES.SAND ? "Sable" : "Sang"}
      </span>
    </div>
  );

  return (
    <div className="w-full p-8 flex flex-col items-center space-y-8">
      <h2 className="text-xl font-bold mb-4">Pioches</h2>

      {/* Pioches de Sable */}
      <div className="flex space-x-8 items-center">
        <div className="text-center">
          <h3 className="mb-2 text-yellow-800">Sable</h3>
          <div className="flex space-x-4">
            {visibleSandCard && <VisibleCard card={visibleSandCard} />}
            <HiddenDeck family={CARD_FAMILIES.SAND} />
          </div>
        </div>

        {/* Pioches de Sang */}
        <div className="text-center">
          <h3 className="mb-2 text-red-800">Sang</h3>
          <div className="flex space-x-4">
            {visibleBloodCard && <VisibleCard card={visibleBloodCard} />}
            <HiddenDeck family={CARD_FAMILIES.BLOOD} />
          </div>
        </div>
      </div>

      {/* Indicateur de jetons */}
      <div className="mt-4 text-center">
        <p
          className={`text-sm ${
            currentPlayerTokens < 1 ? "text-red-600" : "text-gray-600"
          }`}
        >
          {isCurrentPlayerTurn
            ? `Jetons disponibles: ${currentPlayerTokens}`
            : "En attente de votre tour"}
        </p>
      </div>
    </div>
  );
};

export default GameDecks;
