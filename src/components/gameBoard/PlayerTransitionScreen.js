import { Shield } from "lucide-react";
import React from "react";

const ActionHistory = ({ actions }) => {
  return (
    <div className="mb-6 text-left">
      <h3 className="text-lg font-semibold mb-2 text-gray-700">
        Actions depuis votre dernier tour :
      </h3>
      {actions.length > 0 ? (
        <div className="space-y-2">
          {actions.map((action, index) => (
            <div
              key={index}
              className="p-3 bg-gray-50 rounded-lg border border-gray-200"
            >
              <span className="font-medium text-blue-600">
                {action.playerName}
              </span>
              <span className="text-gray-600"> : </span>
              {action.type === "DRAW_VISIBLE" && (
                <span>
                  a pioché la carte{" "}
                  {action.card.family === "SAND" ? "Sable" : "Sang"}{" "}
                  {action.card.type === "NORMAL"
                    ? action.card.value
                    : action.card.type}{" "}
                  visible
                </span>
              )}
              {action.type === "DRAW_HIDDEN" && (
                <span>
                  a pioché une carte{" "}
                  {action.card.family === "SAND" ? "Sable" : "Sang"} de la pile
                  cachée
                </span>
              )}
              {action.type === "DISCARD" && (
                <span>
                  a défaussé une carte{" "}
                  {action.card.family === "SAND" ? "Sable" : "Sang"}{" "}
                  {action.card.type === "NORMAL"
                    ? action.card.value
                    : action.card.type}
                </span>
              )}
              {action.type === "PASS" && <span>a passé son tour</span>}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 italic">Aucune action à afficher</p>
      )}
    </div>
  );
};

const PlayerTransitionScreen = ({ nextPlayer, onReady, actionHistory }) => {
  return (
    <div className="fixed inset-0 bg-gray-900 z-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-xl max-w-2xl w-full">
        <Shield className="w-16 h-16 mx-auto mb-4 text-blue-500" />

        <h2 className="text-2xl font-bold mb-6 text-center">
          Au tour de {nextPlayer.name}
        </h2>

        <ActionHistory actions={actionHistory} />

        <div className="mb-8 space-y-4">
          <p className="text-gray-600">
            {nextPlayer.name}, préparez-vous à jouer votre tour.
          </p>
          <p className="text-amber-600 font-medium">
            Les autres joueurs ne doivent pas voir l'écran.
          </p>
        </div>

        <button
          onClick={onReady}
          className="w-full bg-blue-500 text-white py-4 rounded-lg text-lg font-semibold hover:bg-blue-600 transition-colors"
        >
          Je suis {nextPlayer.name} - Commencer mon tour
        </button>
      </div>
    </div>
  );
};

export default PlayerTransitionScreen;
