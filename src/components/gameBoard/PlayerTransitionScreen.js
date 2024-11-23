import { Shield } from "lucide-react";
import React from "react";
import { getCardBack, getCardImage } from "../../constants/cardImages";

const ActionHistory = ({ actions, usedJokers }) => {
  const renderCardImage = (card) => {
    return (
      <img
        src={
          card.isHidden
            ? getCardBack(card.family)
            : getCardImage(
                card.family,
                card.type,
                card.type === "NORMAL" ? card.value : null
              )
        }
        alt={`Carte ${card.family === "SAND" ? "Sable" : "Sang"}`}
        className="inline-block w-8 h-12 mx-1 align-middle"
      />
    );
  };

  // Regrouper les actions par joueur
  const groupedActions = actions.reduce((acc, action) => {
    if (!acc[action.playerName]) {
      acc[action.playerName] = [];
    }
    let description = "";
    if (action.type === "DRAW_VISIBLE") {
      description = (
        <>a pioché {renderCardImage({ ...action.card, isHidden: false })}</>
      );
    } else if (action.type === "DRAW_HIDDEN") {
      description = (
        <>a pioché {renderCardImage({ ...action.card, isHidden: true })}</>
      );
    } else if (action.type === "DISCARD") {
      description = (
        <>a défaussé {renderCardImage({ ...action.card, isHidden: false })}</>
      );
    } else if (action.type === "PASS") {
      description = "a passé son tour";
    } else if (action.type === "USE_JOKER") {
      description = (
        <>
          a utilisé le joker <span className="font-bold">{action.jokerId}</span>
        </>
      );
    }
    acc[action.playerName].push(description);
    return acc;
  }, {});

  return (
    <div className="mb-6 text-left">
      <h3 className="text-lg font-semibold mb-2 text-gray-700">
        Actions depuis votre dernier tour :
      </h3>
      {Object.keys(groupedActions).length > 0 ? (
        <div className="space-y-2">
          {Object.entries(groupedActions).map(
            ([playerName, actions], index) => (
              <div
                key={index}
                className="p-3 bg-gray-50 rounded-lg border border-gray-200"
              >
                <span className="font-medium text-blue-600">{playerName}</span>
                <span className="text-gray-600"> : </span>
                {actions.map((action, actionIndex) => (
                  <span key={actionIndex} className="inline-flex items-center">
                    {actionIndex > 0 && " et "}
                    {action}
                  </span>
                ))}
              </div>
            )
          )}
        </div>
      ) : (
        <p className="text-gray-500 italic">Aucune action à afficher</p>
      )}
    </div>
  );
};

const PlayerTransitionScreen = ({
  nextPlayer,
  onReady,
  actionHistory,
  usedJokers,
}) => {
  return (
    <div className="fixed inset-0 bg-gray-900 z-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-xl max-w-2xl w-full">
        <Shield className="w-16 h-16 mx-auto mb-4 text-blue-500" />

        <h2 className="text-2xl font-bold mb-6 text-center">
          Au tour de {nextPlayer.name}
        </h2>

        <ActionHistory actions={actionHistory} usedJokers={usedJokers} />

        <button
          onClick={onReady}
          className="w-full bg-blue-500 text-white py-4 rounded-lg text-lg font-semibold hover:bg-blue-600 transition-colors"
        >
          Commencer mon tour
        </button>
      </div>
    </div>
  );
};

export default PlayerTransitionScreen;
