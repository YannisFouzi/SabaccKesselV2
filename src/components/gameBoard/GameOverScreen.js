import React from "react";
import PlayerIdentity from "../PlayerIdentity";

const GameOverScreen = ({
  winners,
  players,
  playerOrder,
  roundStartPlayer,
  onGameEnd,
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg max-w-md w-full text-center">
        <h2 className="text-2xl font-bold mb-4">Partie terminée !</h2>
        {winners && winners.length > 0 ? (
          winners.map((winner, index) => (
            <div key={index} className="text-lg mb-2">
              {winners.length > 1 ? "Gagnants :" : "Gagnant :"}
              <PlayerIdentity player={winner} size="large" className="mt-2" />
              <span className="text-sm text-gray-600 block mt-1">
                Jetons restants : {winner.tokens}
              </span>
            </div>
          ))
        ) : (
          <p className="text-lg mb-2">Pas de gagnant</p>
        )}
        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-600 mb-2">
            Ordre de jeu de la partie :
          </p>
          <div className="flex justify-center space-x-2 flex-wrap">
            {playerOrder.map((playerId, index) => {
              const player = players.find((p) => p.id === playerId);
              return (
                <div key={playerId} className="flex items-center">
                  {index > 0 && <span className="mx-1">→</span>}
                  <span
                    className={`font-medium ${
                      playerId === roundStartPlayer ? "text-blue-600" : ""
                    }`}
                  >
                    {player?.name}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <button
          onClick={() => {
            onGameEnd(winners || []);
          }}
          className="mt-6 bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
        >
          Nouvelle partie
        </button>
      </div>
    </div>
  );
};

export default GameOverScreen;
