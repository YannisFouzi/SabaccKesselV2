import React from "react";
import {
  CARD_FAMILIES,
  CARD_TYPES,
  GAME_STATES,
} from "../constants/gameConstants";

const GameTurn = ({
  gameState,
  currentPlayer,
  players,
  roundNumber,
  turnNumber,
  consecutivePasses,
  isCurrentPlayerTurn,
  pendingDrawnCard,
  onPass,
  onChooseDiscard,
  diceResults,
  onRollDice,
  currentPlayerTokens,
}) => {
  // Vérification de sécurité pour les props requises
  if (!players?.length || !currentPlayer) {
    return null;
  }

  // Rendu des informations de la manche
  const renderRoundInfo = () => (
    <div className="text-center mb-4">
      <div className="flex justify-between items-center px-4">
        <div className="text-lg font-bold">Manche {roundNumber}</div>
        <div className="text-sm text-gray-600">
          Tour {turnNumber}/3 {/* Affiche clairement le numéro du tour */}
        </div>
      </div>
      {consecutivePasses > 0 && (
        <div className="text-sm text-amber-600 mt-2">
          {consecutivePasses}{" "}
          {consecutivePasses > 1 ? "passes consécutifs" : "pass consécutif"}
          {consecutivePasses === players.length - 1 && (
            <div className="font-bold mt-1">
              Un pass de plus et les mains seront révélées !
            </div>
          )}
        </div>
      )}
    </div>
  );

  // Rendu du choix de défausse après pioche
  const renderDiscardChoice = () => {
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
                  className={`
                    w-32 h-48 border-2 rounded-lg p-4 flex flex-col items-center justify-between
                    ${
                      pendingDrawnCard.family === CARD_FAMILIES.SAND
                        ? "bg-yellow-100 border-yellow-800"
                        : "bg-red-100 border-red-800"
                    }
                    hover:shadow-lg
                  `}
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
                  className={`
                    w-32 h-48 border-2 rounded-lg p-4 flex flex-col items-center justify-between
                    ${
                      sameTypeCard.family === CARD_FAMILIES.SAND
                        ? "bg-yellow-100 border-yellow-800"
                        : "bg-red-100 border-red-800"
                    }
                    hover:shadow-lg
                  `}
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

  // Rendu des dés
  const renderDiceRoll = () => {
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

  // Rendu de l'interface principale du tour
  const renderTurnInterface = () => {
    if (pendingDrawnCard) {
      return (
        <div className="text-center mb-4">
          <div className="text-xl font-bold">
            Choisissez une carte à défausser
          </div>
        </div>
      );
    }

    return (
      <div className="text-center mb-4">
        <div className="text-xl font-bold mb-3">
          {isCurrentPlayerTurn
            ? "À votre tour"
            : `Tour de ${currentPlayer.name}`}
        </div>

        {isCurrentPlayerTurn && (
          <div className="space-y-3">
            {currentPlayerTokens > 0 ? (
              <>
                <p className="text-gray-600">
                  Piochez une carte (coût: 1 jeton) ou passez votre tour
                </p>
                <div className="text-sm text-green-600">
                  Jetons disponibles: {currentPlayerTokens}
                </div>
              </>
            ) : (
              <p className="text-amber-600">
                Plus de jetons disponibles ! Vous devez passer votre tour.
              </p>
            )}

            {/* Le bouton de passe est toujours actif, même sans jetons */}
            <button
              onClick={onPass}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg"
            >
              Passer le tour
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-4 bg-white rounded-lg shadow">
      {renderRoundInfo()}
      {renderTurnInterface()}
      {renderDiceRoll()}
      {renderDiscardChoice()}

      <div className="mt-6 text-sm text-gray-600 border-t pt-4">
        <h4 className="font-bold mb-2">Rappel des règles :</h4>
        <ul className="list-disc list-inside space-y-1">
          <li>Piocher coûte 1 jeton</li>
          <li>
            Après avoir pioché, vous devez défausser une carte de la même
            famille
          </li>
          <li>
            Les cartes de sang vont à droite, les cartes de sable à gauche
          </li>
          {consecutivePasses > 0 && (
            <li className="text-amber-600">
              Si tous les joueurs passent, les cartes seront révélées
            </li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default GameTurn;
