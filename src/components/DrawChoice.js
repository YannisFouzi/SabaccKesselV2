import React from "react";
import { CARD_FAMILIES } from "../constants/gameConstants";

const DrawChoice = ({ drawnCard, currentHand, onChoiceSelect, onCancel }) => {
  // Trouver la carte de la même famille dans la main actuelle
  const sameTypeCard = currentHand.find(
    (card) => card.family === drawnCard.family
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
        <h3 className="text-xl font-bold mb-4 text-center">
          Choisissez la carte à défausser
        </h3>

        <div className="flex justify-center space-x-6 mb-6">
          {/* Carte piochée */}
          <div
            onClick={() => onChoiceSelect(drawnCard)}
            className="cursor-pointer transform hover:scale-105 transition-transform"
          >
            <div
              className={`
              w-32 h-48 border-2 rounded-lg flex flex-col items-center justify-between p-4
              ${
                drawnCard.family === CARD_FAMILIES.SAND
                  ? "bg-yellow-100 border-yellow-800"
                  : "bg-red-100 border-red-800"
              }
            `}
            >
              <div className="text-2xl font-bold">{drawnCard.value}</div>
              <div className="text-center">
                <div className="font-semibold">Nouvelle carte</div>
                <div className="text-sm">
                  {drawnCard.family === CARD_FAMILIES.SAND ? "Sable" : "Sang"}
                </div>
              </div>
            </div>
          </div>

          {/* Carte existante de la même famille */}
          <div
            onClick={() => onChoiceSelect(sameTypeCard)}
            className="cursor-pointer transform hover:scale-105 transition-transform"
          >
            <div
              className={`
              w-32 h-48 border-2 rounded-lg flex flex-col items-center justify-between p-4
              ${
                sameTypeCard.family === CARD_FAMILIES.SAND
                  ? "bg-yellow-100 border-yellow-800"
                  : "bg-red-100 border-red-800"
              }
            `}
            >
              <div className="text-2xl font-bold">{sameTypeCard.value}</div>
              <div className="text-center">
                <div className="font-semibold">Carte actuelle</div>
                <div className="text-sm">
                  {sameTypeCard.family === CARD_FAMILIES.SAND
                    ? "Sable"
                    : "Sang"}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center text-sm text-gray-600">
          Cliquez sur la carte que vous souhaitez défausser
        </div>
      </div>
    </div>
  );
};

export default DrawChoice;
