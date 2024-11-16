import React from "react";

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
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg max-w-2xl w-full">
        <h2 className="text-2xl font-bold text-center mb-6">
          Lancer de dés initial
        </h2>

        <div className="space-y-6">
          {initialDiceState === INITIAL_DICE_STATES.REROLL_NEEDED && (
            <div className="text-center mb-4 text-amber-600">
              Égalité détectée ! Les joueurs suivants doivent relancer les dés
            </div>
          )}

          <div className="grid gap-4">
            {players.map((player) => {
              const shouldRoll =
                initialDiceState === INITIAL_DICE_STATES.REROLL_NEEDED
                  ? playersToReroll.includes(player.id)
                  : !initialDiceResults[player.id];

              const initialResult = initialDiceResults[player.id];
              const rerollResult = rerollResults[player.id];

              return (
                <div
                  key={player.id}
                  className={`p-4 rounded-lg border-2 ${
                    shouldRoll
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 bg-gray-50"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">
                      {player.name}
                      {shouldRoll &&
                        initialDiceState ===
                          INITIAL_DICE_STATES.REROLL_NEEDED && (
                          <span className="ml-2 text-blue-600 text-sm">
                            (doit relancer)
                          </span>
                        )}
                    </span>
                    <div className="flex items-center space-x-4">
                      {initialResult && (
                        <div
                          className={`flex space-x-2 ${
                            shouldRoll ? "opacity-30" : ""
                          }`}
                        >
                          <div className="w-10 h-10 border-2 border-gray-400 rounded flex items-center justify-center text-lg font-bold">
                            {initialResult.dice1}
                          </div>
                          <div className="w-10 h-10 border-2 border-gray-400 rounded flex items-center justify-center text-lg font-bold">
                            {initialResult.dice2}
                          </div>
                          <span className="font-bold">
                            = {initialResult.sum}
                          </span>
                        </div>
                      )}

                      {rerollResult && (
                        <div className="flex space-x-2">
                          <div className="w-10 h-10 border-2 border-green-400 rounded flex items-center justify-center text-lg font-bold">
                            {rerollResult.dice1}
                          </div>
                          <div className="w-10 h-10 border-2 border-green-400 rounded flex items-center justify-center text-lg font-bold">
                            {rerollResult.dice2}
                          </div>
                          <span className="font-bold text-green-600">
                            = {rerollResult.sum}
                          </span>
                        </div>
                      )}

                      {shouldRoll && (
                        <button
                          onClick={() => rollInitialDice(player.id)}
                          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                        >
                          {initialDiceState ===
                          INITIAL_DICE_STATES.REROLL_NEEDED
                            ? "Relancer"
                            : "Lancer les dés"}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            {initialDiceState === INITIAL_DICE_STATES.REROLL_NEEDED && (
              <div className="text-center mt-4 text-amber-600">
                <strong>Égalité !</strong> Les joueurs avec le plus petit score
                (
                {Math.min(
                  ...Object.values(initialDiceResults).map((r) => r.sum)
                )}
                ) doivent relancer.
              </div>
            )}
          </div>

          {initialDiceState === INITIAL_DICE_STATES.COMPLETED && (
            <div className="mt-6 text-center">
              <div className="text-lg font-medium mb-4">
                Ordre de jeu déterminé :
              </div>
              <div className="flex justify-center space-x-4">
                {playerOrder.map((playerId, index) => {
                  const player = players.find((p) => p.id === playerId);
                  return (
                    <div key={playerId} className="flex items-center">
                      {index > 0 && <span className="mx-2">→</span>}
                      <span className="font-medium">{player.name}</span>
                    </div>
                  );
                })}
              </div>
              <div className="text-sm text-gray-600 mt-4">
                La partie va commencer...
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InitialDiceRoll;
