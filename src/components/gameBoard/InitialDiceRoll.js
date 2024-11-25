import React, { useState } from "react";
import DiceFace from "./DiceFace";

const DiceAnimation = ({ value, isRolling, isReroll }) => (
  <div
    className={`relative w-16 h-16 rounded-2xl flex items-center justify-center
      ${
        isRolling
          ? "animate-dice-roll"
          : "transform transition-all duration-300"
      }
    `}
  >
    {/* Fond brillant */}
    <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-sm" />

    {/* Bordure lumineuse */}
    <div
      className={`absolute inset-0 rounded-2xl ${
        isReroll ? "animate-pulse-green" : ""
      } 
      ${isRolling ? "animate-pulse-blue" : ""}`}
    >
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/30 to-transparent" />
    </div>

    {/* Contenu du dé */}
    <div className="relative flex items-center justify-center w-full h-full">
      {isRolling ? (
        <span className="animate-bounce">🎲</span>
      ) : (
        <div
          className={`w-full h-full ${
            isReroll ? "text-emerald-400" : "text-white"
          }`}
        >
          <DiceFace value={value} />
        </div>
      )}
    </div>
  </div>
);

const InitialDiceRoll = ({
  players,
  initialDiceState,
  INITIAL_DICE_STATES,
  initialDiceResults,
  rerollResults,
  rollInitialDice,
  playersToReroll,
  playerOrder,
}) => {
  const [rollingPlayerId, setRollingPlayerId] = useState(null);

  const handleRoll = (playerId) => {
    setRollingPlayerId(playerId);
    setTimeout(() => {
      rollInitialDice(playerId);
      setRollingPlayerId(null);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 p-8 rounded-2xl max-w-3xl w-full shadow-2xl border border-white/10">
        {/* Effet de grille en arrière-plan */}
        <div className="absolute inset-0 rounded-2xl opacity-10">
          <div className="absolute inset-0 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />
          <div className="absolute inset-0 bg-[linear-gradient(45deg,#fff2_1px,transparent_1px)] [background-size:24px_24px]" />
        </div>

        <h2 className="text-4xl font-bold text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-amber-600">
          Lancer de dés initial
        </h2>

        {initialDiceState === INITIAL_DICE_STATES.REROLL_NEEDED && (
          <div className="text-center mb-6 py-3 px-4 rounded-xl bg-amber-500/20 border border-amber-500/30 backdrop-blur-sm">
            <span className="text-xl mr-2">⚠️</span>
            <span className="text-amber-400 font-medium">
              Égalité détectée ! Les joueurs suivants doivent relancer les dés
            </span>
          </div>
        )}

        <div className="space-y-4">
          {players.map((player) => {
            const shouldRoll =
              initialDiceState === INITIAL_DICE_STATES.REROLL_NEEDED
                ? playersToReroll.includes(player.id)
                : !initialDiceResults[player.id];

            const initialResult = initialDiceResults[player.id];
            const rerollResult = rerollResults[player.id];
            const isRolling = rollingPlayerId === player.id;

            return (
              <div
                key={player.id}
                className={`p-6 rounded-xl border transition-all duration-300
                  ${
                    shouldRoll
                      ? "border-blue-500/50 bg-blue-500/5"
                      : "border-white/10 bg-white/5"
                  }
                  backdrop-blur-sm hover:bg-white/10
                `}
              >
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div className="font-medium text-white flex items-center gap-3">
                    <span className="text-xl">👤</span>
                    <span className="text-lg">{player.name}</span>
                    {shouldRoll &&
                      initialDiceState ===
                        INITIAL_DICE_STATES.REROLL_NEEDED && (
                        <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 text-sm">
                          doit relancer
                        </span>
                      )}
                  </div>

                  <div className="flex items-center gap-6">
                    {initialResult && (
                      <div
                        className={`flex gap-4 items-center ${
                          shouldRoll ? "opacity-30" : ""
                        }`}
                      >
                        <DiceAnimation
                          value={initialResult.dice1}
                          isRolling={isRolling}
                        />
                        <DiceAnimation
                          value={initialResult.dice2}
                          isRolling={isRolling}
                        />
                        <span className="font-bold text-white/90 text-xl ml-2">
                          = {initialResult.sum}
                        </span>
                      </div>
                    )}

                    {rerollResult && (
                      <div className="flex gap-4 items-center">
                        <DiceAnimation
                          value={rerollResult.dice1}
                          isRolling={isRolling}
                          isReroll
                        />
                        <DiceAnimation
                          value={rerollResult.dice2}
                          isRolling={isRolling}
                          isReroll
                        />
                        <span className="font-bold text-emerald-400 text-xl ml-2">
                          = {rerollResult.sum}
                        </span>
                      </div>
                    )}

                    {shouldRoll && (
                      <button
                        onClick={() => handleRoll(player.id)}
                        disabled={isRolling}
                        className="bg-gradient-to-r from-blue-500 to-indigo-600 
                          text-white px-6 py-3 rounded-xl font-medium
                          hover:from-blue-600 hover:to-indigo-700
                          transform transition-all duration-200
                          hover:-translate-y-0.5 active:translate-y-0
                          shadow-lg hover:shadow-xl
                          flex items-center gap-2
                          disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <span className="text-xl">🎲</span>
                        <span>
                          {initialDiceState ===
                          INITIAL_DICE_STATES.REROLL_NEEDED
                            ? "Relancer"
                            : "Lancer les dés"}
                        </span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {initialDiceState === INITIAL_DICE_STATES.COMPLETED && (
          <div className="mt-8 text-center space-y-6">
            <div className="text-2xl font-medium text-white/90">
              <span className="mr-2">🎯</span>
              Ordre de jeu déterminé
            </div>
            <div className="flex flex-wrap justify-center items-center gap-3 py-4">
              {playerOrder.map((playerId, index) => {
                const player = players.find((p) => p.id === playerId);
                return (
                  <div key={playerId} className="flex items-center">
                    {index > 0 && <span className="mx-3 text-white/40">→</span>}
                    <div className="px-4 py-2 rounded-lg bg-gradient-to-br from-white/10 to-white/5 text-white font-medium border border-white/10 backdrop-blur-sm">
                      {player.name}
                    </div>
                  </div>
                );
              })}
            </div>
            <button
              onClick={() => rollInitialDice()}
              className="bg-gradient-to-r from-green-500 to-emerald-600 
                text-white px-8 py-3 rounded-xl font-medium text-lg
                hover:from-green-600 hover:to-emerald-700
                transform transition-all duration-200
                hover:-translate-y-0.5 active:translate-y-0
                shadow-lg hover:shadow-xl
                mx-auto
                flex items-center gap-2"
            >
              <span>🎮</span>
              Commencer la partie
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// Ajout des styles d'animation
const style = document.createElement("style");
style.textContent = `
  @keyframes dice-roll {
    0% { transform: rotate(0deg) scale(1); }
    25% { transform: rotate(90deg) scale(1.1); }
    50% { transform: rotate(180deg) scale(1); }
    75% { transform: rotate(270deg) scale(1.1); }
    100% { transform: rotate(360deg) scale(1); }
  }
  .animate-dice-roll {
    animation: dice-roll 0.6s ease infinite;
  }
  
  @keyframes pulse-green {
    0% { box-shadow: 0 0 0 0 rgba(52, 211, 153, 0.7); }
    70% { box-shadow: 0 0 0 10px rgba(52, 211, 153, 0); }
    100% { box-shadow: 0 0 0 0 rgba(52, 211, 153, 0); }
  }
  .animate-pulse-green {
    animation: pulse-green 2s infinite;
  }
  
  @keyframes pulse-blue {
    0% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.7); }
    70% { box-shadow: 0 0 0 10px rgba(59, 130, 246, 0); }
    100% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0); }
  }
  .animate-pulse-blue {
    animation: pulse-blue 1s infinite;
  }
`;
document.head.appendChild(style);

export default InitialDiceRoll;
