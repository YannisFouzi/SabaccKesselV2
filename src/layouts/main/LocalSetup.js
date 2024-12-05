import React from "react";
import PlayerNameInput from "../../components/PlayerNameInput";
import TokenSelector from "../../components/TokenSelector";
import ValidationMessages from "../../components/ValidationMessages";
import { AVATAR_LIST } from "../../constants/avatarConfig";
import { GAME_CONFIG } from "../../constants/gameConstants";
import { generateRandomName } from "../../utils/nameGenerator";

const LocalSetup = ({
  playerCount,
  playerNames,
  playerAvatars,
  tokenCount,
  withoutJokers,
  hasAttemptedStart,
  isConfigValid,
  handleNameChange,
  handleAvatarChange,
  handleAddPlayer,
  handleRemovePlayer,
  setTokenCount,
  setWithoutJokers,
  setGameMode,
  setGameStarted,
  setPlayerCount,
  setPlayerNames,
  setPlayerAvatars,
  setHasAttemptedStart,
}) => {
  return (
    <div className="min-h-screen h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 overflow-y-auto">
      <div className="flex items-center justify-center p-4 min-h-full">
        <div className="w-full max-w-2xl bg-white/10 backdrop-blur-md p-4 sm:p-8 rounded-2xl shadow-xl border border-white/20 my-4 sm:my-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6 sm:mb-8 text-center">
            Configuration de la partie
          </h2>

          <div className="space-y-6 mb-6 sm:mb-8">
            <div className="flex justify-end mb-2">
              <button
                onClick={() => {
                  const newNames = [...playerNames];
                  const newAvatars = [...playerAvatars];
                  const usedAvatars = new Set();

                  for (let i = 0; i < playerCount; i++) {
                    // Générer un nom aléatoire s'il n'est pas déjà défini
                    if (!newNames[i]) {
                      newNames[i] = generateRandomName();
                    }

                    // Choisir un avatar aléatoire non utilisé
                    let availableAvatars = AVATAR_LIST.filter(
                      (avatar) => !usedAvatars.has(avatar.id)
                    );
                    if (availableAvatars.length === 0) {
                      availableAvatars = AVATAR_LIST;
                    }
                    const randomAvatar =
                      availableAvatars[
                        Math.floor(Math.random() * availableAvatars.length)
                      ];
                    newAvatars[i] = randomAvatar.id;
                    usedAvatars.add(randomAvatar.id);
                  }

                  setPlayerNames(newNames);
                  setPlayerAvatars(newAvatars);
                }}
                className="px-4 py-2 rounded-lg text-sm font-medium
                  bg-gradient-to-r from-amber-500 to-orange-500 
                  hover:from-amber-600 hover:to-orange-600
                  text-white shadow-md
                  transform transition-all duration-200 
                  hover:-translate-y-0.5 active:translate-y-0"
              >
                🎲 Aléatoire
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {Array(playerCount || GAME_CONFIG.MIN_PLAYERS)
                .fill(null)
                .map((_, index) => (
                  <div key={index} className="relative">
                    <PlayerNameInput
                      index={index}
                      name={playerNames[index] || ""}
                      avatar={playerAvatars[index]}
                      onChange={handleNameChange}
                      onAvatarChange={handleAvatarChange}
                      placeholder={`Joueur ${index + 1}`}
                      playerAvatars={playerAvatars}
                    />
                    {index >= GAME_CONFIG.MIN_PLAYERS && (
                      <button
                        onClick={() => handleRemovePlayer(index)}
                        className="absolute -right-2 -top-2 bg-red-500/20 hover:bg-red-500/30 
                          text-red-400 p-1 rounded-full transition-all duration-200
                          border border-red-500/30"
                        title="Supprimer ce joueur"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                ))}

              {(playerCount || GAME_CONFIG.MIN_PLAYERS) <
                GAME_CONFIG.MAX_PLAYERS && (
                <button
                  onClick={handleAddPlayer}
                  className="h-[72px] border-2 border-dashed border-green-500/30 
                    rounded-xl transition-all duration-200
                    bg-green-500/10 hover:bg-green-500/20
                    flex flex-col items-center justify-center gap-2
                    text-green-400 hover:text-green-300"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-light">+</span>
                    <span className="text-sm">Ajouter un joueur</span>
                  </div>
                </button>
              )}
            </div>
          </div>

          <div className="mb-6 sm:mb-8">
            <TokenSelector
              value={tokenCount}
              onChange={(value) => setTokenCount(value)}
            />
          </div>

          <div className="mb-6 flex justify-center">
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={withoutJokers}
                onChange={(e) => setWithoutJokers(e.target.checked)}
              />
              <div
                className="w-11 h-6 bg-gray-500/30 peer-focus:outline-none rounded-full peer 
                            peer-checked:after:translate-x-full peer-checked:after:border-white 
                            after:content-[''] after:absolute after:top-[2px] after:left-[2px] 
                            after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all
                            peer-checked:bg-purple-600"
              ></div>
              <span className="ml-3 text-sm font-medium text-white">
                Sans Jokers
              </span>
            </label>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 sm:space-x-4">
            <button
              onClick={() => {
                setGameMode(null);
                setPlayerCount(GAME_CONFIG.MIN_PLAYERS);
                setTokenCount(null);
                setPlayerNames(Array(GAME_CONFIG.MIN_PLAYERS).fill(""));
                setPlayerAvatars(Array(GAME_CONFIG.MIN_PLAYERS).fill(null));
              }}
              className="w-full sm:flex-1 py-3 px-6 rounded-xl text-lg font-bold
                bg-white/10 text-white
                hover:bg-white/20 transition-all duration-200"
            >
              Retour
            </button>
            <button
              onClick={() => {
                setHasAttemptedStart(true);
                if (isConfigValid) {
                  setGameStarted(true);
                }
              }}
              disabled={!isConfigValid}
              className="w-full sm:flex-1 py-3 px-6 rounded-xl text-lg font-bold
                bg-gradient-to-r from-purple-600 to-blue-600 
                hover:from-purple-700 hover:to-blue-700
                text-white shadow-lg
                transform transition-all duration-200 
                hover:-translate-y-0.5 active:translate-y-0
                disabled:opacity-50 disabled:cursor-not-allowed
                disabled:hover:transform-none"
            >
              {(() => {
                if (isConfigValid) return "Étape suivante";

                // Vérifier d'abord les noms manquants
                const missingNames = playerNames
                  .slice(0, playerCount)
                  .filter((name) => !name.trim()).length;
                if (missingNames > 0) {
                  return `Remplir ${missingNames} nom${
                    missingNames > 1 ? "s" : ""
                  } manquant${missingNames > 1 ? "s" : ""}`;
                }

                // Ensuite, vérifier les avatars
                const missingAvatars = playerAvatars
                  .slice(0, playerCount)
                  .filter((avatar) => !avatar).length;
                if (missingAvatars > 0) {
                  return `Choisir ${missingAvatars} avatar${
                    missingAvatars > 1 ? "s" : ""
                  } manquant${missingAvatars > 1 ? "s" : ""}`;
                }

                // Enfin, vérifier les jetons
                if (!tokenCount) {
                  return "Définir le nombre de jetons";
                }

                return "Étape suivante";
              })()}
            </button>
          </div>

          <div className="mt-4">
            <ValidationMessages
              playerNames={playerNames}
              playerCount={playerCount || GAME_CONFIG.MIN_PLAYERS}
              playerAvatars={playerAvatars}
              showErrors={hasAttemptedStart}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocalSetup;
