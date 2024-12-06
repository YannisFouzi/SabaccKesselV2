import React from "react";
import { getCardImage } from "../../constants/cardImages";
import { CARD_TYPES } from "../../constants/gameConstants";

const DiscardChoice = ({
  pendingDrawnCard,
  currentPlayer,
  onChooseDiscard,
}) => {
  if (!pendingDrawnCard) return null;

  const sameTypeCard = currentPlayer.hand.find(
    (card) => card.family === pendingDrawnCard.family
  );

  if (!sameTypeCard) return null;

  return (
    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-full bg-black/80 backdrop-blur-sm p-4 rounded-xl border border-white/20 shadow-2xl z-50">
      <h3 className="text-xl font-bold text-center mb-4 text-white">
        Choisissez la carte à défausser
      </h3>

      <div className="flex space-x-8 mb-4">
        {/* Carte piochée */}
        <div className="text-center">
          <div
            onClick={() => onChooseDiscard(pendingDrawnCard)}
            className="cursor-pointer transform hover:scale-105 transition-transform"
          >
            <div className="w-32 h-48 rounded-lg flex flex-col items-center justify-between hover:shadow-lg">
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
            onClick={() => onChooseDiscard(sameTypeCard)}
            className="cursor-pointer transform hover:scale-105 transition-transform"
          >
            <div className="w-32 h-48 rounded-lg flex flex-col items-center justify-between hover:shadow-lg">
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
    </div>
  );
};

export default DiscardChoice;
