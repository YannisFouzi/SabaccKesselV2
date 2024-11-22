import React from "react";
import { getCardBack, getCardImage } from "../../constants/cardImages";
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
        w-16 h-24 sm:w-20 sm:h-32 md:w-24 md:h-36
        rounded-lg flex flex-col items-center justify-center
        ${
          isCurrentPlayerTurn && currentPlayerTokens > 0
            ? "cursor-pointer hover:opacity-75"
            : "cursor-not-allowed opacity-50"
        }
      `}
    >
      <img
        src={getCardImage(
          card.family,
          card.type,
          card.type === CARD_TYPES.NORMAL ? card.value : null
        )}
        alt={`${card.family} ${card.type} ${card.value || ""}`}
        className="w-full h-full rounded-lg object-contain"
      />
    </div>
  );

  // Composant pour une pioche cachée
  const HiddenDeck = ({ family }) => (
    <div
      onClick={() => handleHiddenDeckClick(family)}
      className={`
        w-16 h-24 sm:w-20 sm:h-32 md:w-24 md:h-36
        rounded-lg flex flex-col items-center justify-center
        ${
          isCurrentPlayerTurn && currentPlayerTokens > 0
            ? "cursor-pointer hover:opacity-75"
            : "cursor-not-allowed opacity-50"
        }
      `}
    >
      <img
        src={getCardBack(family)}
        alt={`${family} deck`}
        className="w-full h-full rounded-lg object-contain"
      />
    </div>
  );

  return (
    <div className="w-full p-8 flex flex-col items-center space-y-8">
      <h2 className="text-xl font-bold mb-4">Pioches</h2>

      {/* Pioches de Sable */}
      <div className="flex space-x-8 items-center">
        <div className="text-center">
          <div className="flex space-x-4">
            {visibleSandCard && <VisibleCard card={visibleSandCard} />}
            <HiddenDeck family={CARD_FAMILIES.SAND} />
          </div>
        </div>

        {/* Pioches de Sang */}
        <div className="text-center">
          <div className="flex space-x-4">
            {visibleBloodCard && <VisibleCard card={visibleBloodCard} />}
            <HiddenDeck family={CARD_FAMILIES.BLOOD} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameDecks;
