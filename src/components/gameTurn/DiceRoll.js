import React from "react";
import { GAME_STATES } from "../../constants/gameConstants";

const DiceRoll = ({ gameState, diceResults, onRollDice }) => {
  if (gameState !== GAME_STATES.DICE_ROLL) return null;

  return (
    <div className="text-center mt-4">
      <h3 className="text-lg font-bold mb-2">Phase de lancer de dés</h3>
      {diceResults ? (
        <div>
          <div className="flex justify-center space-x-4">
            <div className="w-16 h-16 border-2 border-gray-400 rounded flex items-center justify-center text-2xl font-bold">
              {diceResults[0]}
            </div>
            <div className="w-16 h-16 border-2 border-gray-400 rounded flex items-center justify-center text-2xl font-bold">
              {diceResults[1]}
            </div>
          </div>
          <div className="text-sm text-gray-600 mt-2">
            Ces valeurs seront utilisées pour les cartes Imposteur
          </div>
        </div>
      ) : (
        <button
          onClick={onRollDice}
          className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-2 rounded-lg"
        >
          Lancer les dés
        </button>
      )}
    </div>
  );
};

export default DiceRoll;
