import React, { useState } from "react";
import { getCardImage } from "../../constants/cardImages";
import { CARD_TYPES } from "../../constants/gameConstants";

const DiscardChoice = ({
  pendingDrawnCard,
  currentPlayer,
  onChooseDiscard,
  onPreviewChange = () => {},
}) => {
  const [selectedCard, setSelectedCard] = useState(null);
  const [isConfirming, setIsConfirming] = useState(false);

  if (!pendingDrawnCard) return null;

  const sameTypeCard = currentPlayer.hand.find(
    (card) => card.family === pendingDrawnCard.family
  );

  if (!sameTypeCard) return null;

  const handleCardClick = (card) => {
    setSelectedCard(card);
    setIsConfirming(true);
    if (card === sameTypeCard) {
      onPreviewChange(sameTypeCard.id, pendingDrawnCard);
    } else {
      onPreviewChange(null, null);
    }
  };

  const handleConfirm = () => {
    onChooseDiscard(selectedCard);
    onPreviewChange(null, null);
  };

  const handleCancel = () => {
    setSelectedCard(null);
    setIsConfirming(false);
    onPreviewChange(null, null);
  };

  return (
    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-full bg-black/80 backdrop-blur-sm p-4 rounded-xl border border-white/20 shadow-2xl z-50">
      <h3 className="text-xl font-bold text-center mb-4 text-white">
        {isConfirming
          ? "Cette carte va être défaussée"
          : "Choisissez la carte à défausser"}
      </h3>

      {isConfirming ? (
        <div className="flex flex-col items-center space-y-4">
          <div className="w-32 h-48 rounded-lg">
            <img
              src={getCardImage(
                selectedCard.family,
                selectedCard.type,
                selectedCard.type === CARD_TYPES.NORMAL
                  ? selectedCard.value
                  : null
              )}
              alt={`Carte à défausser ${selectedCard.type}`}
              className="w-full h-full rounded-lg opacity-50"
            />
          </div>
          <div className="flex space-x-4">
            <button
              onClick={handleConfirm}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              OK
            </button>
            <button
              onClick={handleCancel}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Annuler
            </button>
          </div>
        </div>
      ) : (
        <div className="flex space-x-8 mb-4">
          {/* Carte piochée */}
          <div className="text-center">
            <div
              onClick={() => handleCardClick(pendingDrawnCard)}
              className="cursor-pointer transform hover:scale-105 transition-transform"
            >
              <div className="w-32 h-48 rounded-lg">
                <img
                  src={getCardImage(
                    pendingDrawnCard.family,
                    pendingDrawnCard.type,
                    pendingDrawnCard.type === CARD_TYPES.NORMAL
                      ? pendingDrawnCard.value
                      : null
                  )}
                  alt={`Nouvelle carte ${pendingDrawnCard.type}`}
                  className="w-full h-full rounded-lg"
                />
              </div>
              <p className="mt-2 text-white">Nouvelle carte</p>
            </div>
          </div>

          {/* Carte de la main */}
          <div className="text-center">
            <div
              onClick={() => handleCardClick(sameTypeCard)}
              className="cursor-pointer transform hover:scale-105 transition-transform"
            >
              <div className="w-32 h-48 rounded-lg">
                <img
                  src={getCardImage(
                    sameTypeCard.family,
                    sameTypeCard.type,
                    sameTypeCard.type === CARD_TYPES.NORMAL
                      ? sameTypeCard.value
                      : null
                  )}
                  alt={`Carte actuelle ${sameTypeCard.type}`}
                  className="w-full h-full rounded-lg"
                />
              </div>
              <p className="mt-2 text-white">Carte actuelle</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DiscardChoice;
