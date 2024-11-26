import React, { useState } from "react";
import ComingSoonRibbon from "./components/ComingSoonRibbon";
import GameBoard from "./components/GameBoard";
import PlayerNameInput from "./components/PlayerNameInput";
import TokenSelector from "./components/TokenSelector";
import ValidationMessages from "./components/ValidationMessages";
import { GAME_CONFIG } from "./constants/gameConstants";

const App = () => {
  const [gameMode, setGameMode] = useState(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [playerCount, setPlayerCount] = useState(GAME_CONFIG.MIN_PLAYERS);
  const [tokenCount, setTokenCount] = useState(null);
  const [gameHistory, setGameHistory] = useState([]);
  const [gameKey, setGameKey] = useState(0);
  const [playerNames, setPlayerNames] = useState(
    Array(GAME_CONFIG.MIN_PLAYERS).fill("")
  );
  const [playerAvatars, setPlayerAvatars] = useState(
    Array(GAME_CONFIG.MIN_PLAYERS).fill(null)
  );
  const [hasAttemptedStart, setHasAttemptedStart] = useState(false);
  const [withoutJokers, setWithoutJokers] = useState(false);

  // Fonction de validation des noms
  const validatePlayerName = (name) => {
    return (
      name.trim() !== "" &&
      name.length <= GAME_CONFIG.MAX_NAME_LENGTH &&
      /^[a-zA-Z0-9\s-_]+$/.test(name)
    );
  };

  // Mise à jour de la fonction de changement de nom
  const handleNameChange = (index, value) => {
    const newNames = [...playerNames];
    newNames[index] = value.slice(0, GAME_CONFIG.MAX_NAME_LENGTH);
    setPlayerNames(newNames);
  };

  // Nouvelle fonction pour gérer le changement d'avatar
  const handleAvatarChange = (index, avatarId) => {
    const newAvatars = [...playerAvatars];
    newAvatars[index] = avatarId;
    setPlayerAvatars(newAvatars);
  };

  // Mise à jour de la validation de configuration
  const isConfigValid =
    playerCount &&
    tokenCount &&
    playerNames.length === playerCount &&
    playerNames.every((name) => validatePlayerName(name)) &&
    playerAvatars.length === playerCount &&
    playerAvatars.every((avatar) => avatar !== null && avatar !== undefined);

  // Fonction pour démarrer le jeu
  const handleStartGame = () => {
    if (isConfigValid) {
      setGameMode("local");
      setGameStarted(true);
    }
  };

  const handleGameEnd = (winners = []) => {
    if (winners.length > 0) {
      setGameHistory((prev) => [
        ...prev,
        {
          date: new Date(),
          winners: winners.map((w) => w.name),
          playerCount,
          tokenCount,
        },
      ]);
    }

    setGameStarted(false);
    setGameKey((prev) => prev + 1);
    setGameMode(null);
  };

  // Fonction pour ajouter un joueur
  const handleAddPlayer = () => {
    if (playerCount < GAME_CONFIG.MAX_PLAYERS) {
      const newCount = playerCount + 1;
      setPlayerCount(newCount);
      setPlayerNames((prev) => [...prev, ""]);
      setPlayerAvatars((prev) => [...prev, null]);
    }
  };

  // Fonction pour supprimer un joueur
  const handleRemovePlayer = (indexToRemove) => {
    if (playerCount > GAME_CONFIG.MIN_PLAYERS) {
      setPlayerCount(playerCount - 1);
      setPlayerNames((prev) =>
        prev.filter((_, index) => index !== indexToRemove)
      );
      setPlayerAvatars((prev) =>
        prev.filter((_, index) => index !== indexToRemove)
      );
    }
  };

  // Menu principal
  const renderMainMenu = () => (
    <div className="h-full min-h-[100dvh] bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 flex flex-col">
      <div className="flex-1 overflow-y-auto">
        <div className="container mx-auto px-4 py-8 pb-8">
          {/* En-tête du jeu */}
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-white mb-4">
              Sabacc de Kessel
            </h1>
            <p className="text-lg text-blue-200 max-w-2xl mx-auto">
              Plongez dans l'univers de Star Wars avec ce jeu de cartes
              légendaire
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {/* Section Modes de jeu */}
            <div className="space-y-6">
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-white/20">
                <h2 className="text-3xl font-bold text-white mb-6 flex items-center">
                  <span className="mr-3">🎮</span>
                  Modes de jeu
                </h2>

                {/* Mode Local - Simplifié */}
                <button
                  onClick={() => setGameMode("local")}
                  className="w-full py-4 px-6 rounded-xl text-lg font-bold
                    bg-gradient-to-r from-purple-600 to-blue-600 
                    hover:from-purple-700 hover:to-blue-700
                    text-white shadow-lg
                    transform transition-all duration-200 
                    hover:-translate-y-0.5 active:translate-y-0
                    flex items-center justify-center space-x-2"
                >
                  <span>Partie locale</span>
                  <span>🎲</span>
                </button>

                {/* Mode Multi - Inchangé */}
                <div className="relative mt-4">
                  <ComingSoonRibbon />
                  <button
                    className="relative w-full py-4 px-6 rounded-xl text-lg font-bold
                      bg-gray-500/50 text-gray-300 cursor-not-allowed
                      flex items-center justify-center space-x-2"
                    disabled
                  >
                    <span>🌐</span>
                    <span>Partie en ligne</span>
                    <span>🎮</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Section Règles */}
            <div className="space-y-6">
              {/* Règles de base */}
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-white/20">
                <h3 className="text-2xl font-bold text-white mb-4 flex items-center">
                  <span className="mr-3">📜</span>
                  Règles de base
                </h3>
                <ul className="space-y-3 text-blue-100">
                  <li className="flex items-center">
                    <span className="mr-2">🎯</span>
                    Une manche se joue en 3 tours
                  </li>
                  <li className="flex items-center">
                    <span className="mr-2">💰</span>
                    Piocher une carte coûte un jeton
                  </li>
                  <li className="flex items-center">
                    <span className="mr-2">⚖️</span>
                    Vous devez toujours avoir une carte de chaque famille
                  </li>
                  <li className="flex items-center">
                    <span className="mr-2">↔️</span>
                    Les cartes de sang vont à droite, les cartes de sable à
                    gauche
                  </li>
                </ul>
              </div>

              {/* Cartes spéciales */}
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-white/20">
                <h3 className="text-2xl font-bold text-white mb-4 flex items-center">
                  <span className="mr-3">✨</span>
                  Cartes spéciales
                </h3>
                <ul className="space-y-3 text-blue-100">
                  <li className="flex items-center">
                    <span className="mr-2">🔄</span>
                    Sylop : Adopte la même valeur que l'autre carte de votre
                    main
                  </li>
                  <li className="flex items-center">
                    <span className="mr-2">🎲</span>
                    Imposteur : Adopte la valeur de l'un des deux dés lancés
                  </li>
                  <li className="flex items-center">
                    <span className="mr-2">👑</span>
                    Une paire de sylops forme un "Sabacc pur", la meilleure main
                    possible
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Footer */}
          <footer className="text-center mt-12 text-blue-200/60 text-sm">
            <p>
              © 2024 Sabacc de Kessel - Un jeu inspiré de l'univers Star Wars -
              Développé par{" "}
              <a
                href="https://fouzi-dev.fr"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-200/80 hover:text-blue-200/100"
              >
                fouzi-dev.fr
              </a>
            </p>
          </footer>
        </div>
      </div>
    </div>
  );

  // Configuration du mode local
  const renderLocalSetup = () => (
    <div className="min-h-screen h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 overflow-y-auto">
      <div className="flex items-center justify-center p-4 min-h-full">
        <div className="w-full max-w-2xl bg-white/10 backdrop-blur-md p-4 sm:p-8 rounded-2xl shadow-xl border border-white/20 my-4 sm:my-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6 sm:mb-8 text-center">
            Configuration de la partie
          </h2>

          {/* Section des joueurs */}
          <div className="space-y-6 mb-6 sm:mb-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Liste des joueurs */}
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

              {/* Bouton d'ajout de joueur */}
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

          {/* Sélection du nombre de jetons */}
          <div className="mb-6 sm:mb-8">
            <TokenSelector
              value={tokenCount}
              onChange={(value) => setTokenCount(value)}
            />
          </div>

          {/* Ajout du toggle switch avant les boutons de navigation */}
          <div className="mb-6">
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

          {/* Boutons de navigation - Adapter pour mobile */}
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
              Commencer la partie
            </button>
          </div>

          {/* Messages de validation */}
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

  // Règles du jeu
  const renderRules = () => (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Règles du Sabacc de Kessel</h2>
            <button
              onClick={() => setGameMode(null)}
              className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
            >
              Retour au menu
            </button>
          </div>

          <div className="space-y-6">
            <section>
              <h3 className="text-xl font-semibold mb-3">Règles de base</h3>
              <ul className="list-disc list-inside space-y-2">
                <li>
                  Les mains sont constituées de deux cartes, une de chaque
                  famille : sable et sang
                </li>
                <li>Les cartes ont une valeur allant de 1 à 6 points</li>
                <li>
                  L'objectif est de réduire la différence entre les valeurs de
                  vos cartes
                </li>
                <li>
                  Une main de Sabacc est une paire dont la différence est nulle
                </li>
              </ul>
            </section>

            <section>
              <h3 className="text-xl font-semibold mb-3">Déroulement du jeu</h3>
              <ul className="list-disc list-inside space-y-2">
                <li>Une manche se joue en 3 tours</li>
                <li>Piocher une carte coûte un jeton</li>
                <li>Vous devez toujours avoir une carte de chaque famille</li>
                <li>
                  Les cartes de sang vont à droite, les cartes de sable à gauche
                </li>
                <li>
                  Si tous les joueurs passent leur tour consécutivement, les
                  mains sont révélées
                </li>
              </ul>
            </section>

            <section>
              <h3 className="text-xl font-semibold mb-3">Cartes spéciales</h3>
              <ul className="list-disc list-inside space-y-2">
                <li>
                  Sylop : Adopte la même valeur que l'autre carte de votre main
                </li>
                <li>
                  Imposteur : Adopte la valeur de l'un des deux dés lancés
                </li>
                <li>
                  Une paire de sylops forme un "Sabacc pur", c'est la meilleure
                  main possible
                </li>
              </ul>
            </section>

            <section>
              <h3 className="text-xl font-semibold mb-3">Fin de manche</h3>
              <ul className="list-disc list-inside space-y-2">
                <li>Le vainqueur récupère ses jetons misés</li>
                <li>
                  Les perdants perdent des jetons égaux à leur différence de
                  valeurs
                </li>
                <li>Un joueur sans jetons est éliminé</li>
                <li>Le dernier joueur avec des jetons gagne la partie</li>
              </ul>
            </section>
          </div>
        </div>
      </div>
    </div>
  );

  // Logique de rendu principal
  if (!gameMode && !gameStarted) {
    return renderMainMenu();
  }

  if (gameMode === "rules") {
    return renderRules();
  }

  if (gameMode === "local" && !gameStarted) {
    return renderLocalSetup();
  }

  if (gameStarted) {
    return (
      <GameBoard
        key={gameKey}
        playerCount={playerCount}
        tokenCount={tokenCount}
        playerNames={playerNames}
        playerAvatars={playerAvatars}
        onGameEnd={handleGameEnd}
        withoutJokers={withoutJokers}
      />
    );
  }

  return null;
};

export default App;
