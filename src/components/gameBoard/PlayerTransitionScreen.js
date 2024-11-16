import { Shield } from "lucide-react";
import React from "react";

const PlayerTransitionScreen = ({ nextPlayer, onReady }) => {
  return (
    <div className="fixed inset-0 bg-gray-900 z-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full text-center">
        <Shield className="w-16 h-16 mx-auto mb-4 text-blue-500" />

        <h2 className="text-2xl font-bold mb-6">
          Au tour de {nextPlayer.name}
        </h2>

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
