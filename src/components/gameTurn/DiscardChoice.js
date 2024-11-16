import React from "react";
import { CARD_FAMILIES, CARD_TYPES } from "../../constants/gameConstants";

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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-xl">
        <h3 className="text-xl font-bold text-center mb-4">
          Choisissez la carte à défausser
          <span className="text-sm block mt-1 text-gray-600">
            {pendingDrawnCard.family === CARD_FAMILIES.SAND
              ? "(Famille : Sable)"
              : "(Famille : Sang)"}
          </span>
        </h3>

        <div className="flex space-x-8 mb-4">
          {/* Carte piochée */}
          <div className="text-center">
            <div
              onClick={() => onChooseDiscard(pendingDrawnCard)}
              className="cursor-pointer transform hover:scale-105 transition-transform"
            >
              <div
                className={`w-32 h-48 border-2 rounded-lg p-4 flex flex-col items-center justify-between ${
                  pendingDrawnCard.family === CARD_FAMILIES.SAND
                    ? "bg-yellow-100 border-yellow-800"
                    : "bg-red-100 border-red-800"
                } hover:shadow-lg`}
              >
                <span className="text-2xl font-bold">
                  {pendingDrawnCard.type === CARD_TYPES.SYLOP
                    ? "S"
                    : pendingDrawnCard.type === CARD_TYPES.IMPOSTOR
                    ? "I"
                    : pendingDrawnCard.value}
                </span>
                <div className="text-center">
                  <div className="font-medium">Nouvelle carte</div>
                  <div className="text-sm mt-1">
                    {pendingDrawnCard.type === CARD_TYPES.SYLOP
                      ? "Sylop"
                      : pendingDrawnCard.type === CARD_TYPES.IMPOSTOR
                      ? "Imposteur"
                      : "Normale"}
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-2 text-sm text-gray-600">
              Cliquez pour défausser cette carte
            </div>
          </div>

          {/* Carte de la main */}
          <div className="text-center">
            <div
              onClick={() => onChooseDiscard(sameTypeCard)}
              className="cursor-pointer transform hover:scale-105 transition-transform"
            >
              <div
                className={`w-32 h-48 border-2 rounded-lg p-4 flex flex-col items-center justify-between ${
                  sameTypeCard.family === CARD_FAMILIES.SAND
                    ? "bg-yellow-100 border-yellow-800"
                    : "bg-red-100 border-red-800"
                } hover:shadow-lg`}
              >
                <span className="text-2xl font-bold">
                  {sameTypeCard.type === CARD_TYPES.SYLOP
                    ? "S"
                    : sameTypeCard.type === CARD_TYPES.IMPOSTOR
                    ? "I"
                    : sameTypeCard.value}
                </span>
                <div className="text-center">
                  <div className="font-medium">Carte actuelle</div>
                  <div className="text-sm mt-1">
                    {sameTypeCard.type === CARD_TYPES.SYLOP
                      ? "Sylop"
                      : sameTypeCard.type === CARD_TYPES.IMPOSTOR
                      ? "Imposteur"
                      : "Normale"}
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-2 text-sm text-gray-600">
              Cliquez pour défausser cette carte
            </div>
          </div>
        </div>

        <div className="text-center mt-4 text-sm text-gray-600">
          Choisissez la carte à défausser. L'autre carte restera dans votre
          main.
        </div>
      </div>
    </div>
  );
};

export default DiscardChoice;
