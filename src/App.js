import React, { useState } from "react";
import ComingSoonRibbon from "./components/ComingSoonRibbon";
import GameBoard from "./components/GameBoard";
import { GAME_CONFIG } from "./constants/gameConstants";

const App = () => {
  const [gameMode, setGameMode] = useState(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [playerCount, setPlayerCount] = useState(null);
  const [tokenCount, setTokenCount] = useState(null);
  const [gameHistory, setGameHistory] = useState([]);
  const [gameKey, setGameKey] = useState(0);
  const [playerNames, setPlayerNames] = useState([]);

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

  // Mise à jour de la validation de configuration
  const isConfigValid =
    playerCount &&
    tokenCount &&
    playerNames.length === playerCount &&
    playerNames.every((name) => validatePlayerName(name));

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
              © 2024 Sabacc de Kessel - Un jeu inspiré de l'univers Star Wars
            </p>
          </footer>
        </div>
      </div>
    </div>
  );

  // Configuration du mode local
  const renderLocalSetup = () => (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white/10 backdrop-blur-md p-8 rounded-2xl shadow-xl border border-white/20">
        <h2 className="text-3xl font-bold text-white mb-8 text-center">
          Configuration de la partie
        </h2>

        {/* Sélection du nombre de joueurs */}
        <div className="mb-8">
          <label className="block text-lg font-medium text-blue-100 mb-4">
            Nombre de joueurs
          </label>
          <select
            className="w-full p-3 bg-white/10 border-2 border-white/30 rounded-xl text-white 
              backdrop-blur-sm transition-all duration-200
              hover:bg-white/20 hover:border-white/40
              focus:outline-none focus:ring-2 focus:ring-yellow-400/50
              appearance-none cursor-pointer
              bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZmlsbD0id2hpdGUiIGQ9Ik03LjQxIDguNTlMMTIgMTMuMTdsNC41OS00LjU4TDE4IDEwbC02IDYtNi02IDEuNDEtMS40MXoiLz48L3N2Zz4=')] 
              bg-no-repeat bg-[length:1.5em] bg-[center_right_0.5em]"
            value={playerCount || ""}
            onChange={(e) => {
              const count = Number(e.target.value);
              setPlayerCount(count);
              // Initialiser un tableau de noms vides pour chaque joueur
              setPlayerNames(Array(count).fill(""));
            }}
          >
            <option value="" className="bg-gray-900">
              Sélectionnez
            </option>
            {[
              ...Array(GAME_CONFIG.MAX_PLAYERS - GAME_CONFIG.MIN_PLAYERS + 1),
            ].map((_, i) => (
              <option
                key={i + GAME_CONFIG.MIN_PLAYERS}
                value={i + GAME_CONFIG.MIN_PLAYERS}
                className="bg-gray-900"
              >
                {i + GAME_CONFIG.MIN_PLAYERS} Joueurs
              </option>
            ))}
          </select>
        </div>

        {/* Saisie des noms des joueurs */}
        {playerCount > 0 && (
          <div className="space-y-4 mb-8">
            <h3 className="text-lg font-medium text-blue-100">
              Noms des joueurs
            </h3>
            <div className="grid gap-4 md:grid-cols-2">
              {playerNames.map((name, index) => (
                <div key={index} className="relative group">
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => {
                      const newNames = [...playerNames];
                      newNames[index] = e.target.value;
                      setPlayerNames(newNames);
                    }}
                    placeholder={`Joueur ${index + 1}`}
                    className="w-full p-3 bg-white/10 border-2 border-white/30 rounded-xl text-white 
                      backdrop-blur-sm transition-all duration-200
                      hover:bg-white/20 hover:border-white/40
                      focus:outline-none focus:ring-2 focus:ring-yellow-400/50
                      placeholder-white/50"
                  />
                  <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                    <span className="text-white/50 group-hover:text-white/70">
                      👤
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Sélection du nombre de jetons */}
        {playerCount > 0 && (
          <div className="mb-8">
            <label className="block text-lg font-medium text-blue-100 mb-4">
              Jetons par joueur
            </label>
            <select
              className="w-full p-3 bg-white/10 border-2 border-white/30 rounded-xl text-white 
                backdrop-blur-sm transition-all duration-200
                hover:bg-white/20 hover:border-white/40
                focus:outline-none focus:ring-2 focus:ring-yellow-400/50
                appearance-none cursor-pointer
                bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZmlsbD0id2hpdGUiIGQ9Ik03LjQxIDguNTlMMTIgMTMuMTdsNC41OS00LjU4TDE4IDEwbC02IDYtNi02IDEuNDEtMS40MXoiLz48L3N2Zz4=')] 
                bg-no-repeat bg-[length:1.5em] bg-[center_right_0.5em]"
              value={tokenCount || ""}
              onChange={(e) => setTokenCount(Number(e.target.value))}
            >
              <option value="" className="bg-gray-900">
                Sélectionnez
              </option>
              {[
                ...Array(GAME_CONFIG.MAX_TOKENS - GAME_CONFIG.MIN_TOKENS + 1),
              ].map((_, i) => (
                <option
                  key={i + GAME_CONFIG.MIN_TOKENS}
                  value={i + GAME_CONFIG.MIN_TOKENS}
                  className="bg-gray-900"
                >
                  {i + GAME_CONFIG.MIN_TOKENS} Jetons
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Boutons de navigation */}
        <div className="flex space-x-4">
          <button
            onClick={() => {
              setGameMode(null);
              setPlayerCount(null);
              setTokenCount(null);
              setPlayerNames([]);
            }}
            className="flex-1 py-3 px-6 rounded-xl text-lg font-bold
              bg-white/10 text-white
              hover:bg-white/20 transition-all duration-200"
          >
            Retour
          </button>
          <button
            onClick={() => {
              if (playerNames.every((name) => name.trim() !== "")) {
                setGameStarted(true);
              }
            }}
            disabled={
              !isConfigValid || !playerNames.every((name) => name.trim() !== "")
            }
            className="flex-1 py-3 px-6 rounded-xl text-lg font-bold
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

        {/* Message d'erreur si des noms sont manquants */}
        {playerCount > 0 &&
          !playerNames.every((name) => name.trim() !== "") && (
            <p className="mt-4 text-red-400 text-center">
              Veuillez saisir un nom pour chaque joueur
            </p>
          )}
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
        onGameEnd={handleGameEnd}
      />
    );
  }

  return null;
};

export default App;
