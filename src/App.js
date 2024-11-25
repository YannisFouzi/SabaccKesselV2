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

  // Vérification si la configuration est valide
  const isConfigValid = playerCount && tokenCount;

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
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-yellow-200 to-yellow-400 mb-4 animate-pulse">
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
              {/* Mode Local */}
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-white/20">
                <h2 className="text-3xl font-bold text-white mb-6 flex items-center">
                  <span className="mr-3">🎮</span>
                  Modes de jeu
                </h2>

                {/* Configuration mode local */}
                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-blue-100 mb-2">
                      Nombre de joueurs
                    </label>
                    <select
                      className="w-full p-2 bg-white/20 border border-white/30 rounded-lg text-white"
                      value={playerCount || ""}
                      onChange={(e) => setPlayerCount(Number(e.target.value))}
                    >
                      <option value="">Sélectionnez</option>
                      {[
                        ...Array(
                          GAME_CONFIG.MAX_PLAYERS - GAME_CONFIG.MIN_PLAYERS + 1
                        ),
                      ].map((_, i) => (
                        <option
                          key={i + GAME_CONFIG.MIN_PLAYERS}
                          value={i + GAME_CONFIG.MIN_PLAYERS}
                        >
                          {i + GAME_CONFIG.MIN_PLAYERS} Joueurs
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-blue-100 mb-2">
                      Jetons par joueur
                    </label>
                    <select
                      className="w-full p-2 bg-white/20 border border-white/30 rounded-lg text-white"
                      value={tokenCount || ""}
                      onChange={(e) => setTokenCount(Number(e.target.value))}
                    >
                      <option value="">Sélectionnez</option>
                      {[
                        ...Array(
                          GAME_CONFIG.MAX_TOKENS - GAME_CONFIG.MIN_TOKENS + 1
                        ),
                      ].map((_, i) => (
                        <option
                          key={i + GAME_CONFIG.MIN_TOKENS}
                          value={i + GAME_CONFIG.MIN_TOKENS}
                        >
                          {i + GAME_CONFIG.MIN_TOKENS} Jetons
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <button
                  onClick={handleStartGame}
                  className={`
                    w-full py-4 px-6 rounded-xl text-lg font-bold mb-4
                    transition-all duration-200 transform
                    ${
                      isConfigValid
                        ? "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0"
                        : "bg-gray-500/50 text-gray-300 cursor-not-allowed"
                    }
                    flex items-center justify-center space-x-2
                  `}
                  disabled={!isConfigValid}
                >
                  <span>🎮</span>
                  <span>Partie locale</span>
                  <span>🎲</span>
                </button>

                {/* Mode Multi */}
                <div className="relative">
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
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Mode Local</h1>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nombre de joueurs
            </label>
            <select
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              value={playerCount || ""}
              onChange={(e) => setPlayerCount(Number(e.target.value))}
            >
              <option value="">Sélectionnez</option>
              {[
                ...Array(GAME_CONFIG.MAX_PLAYERS - GAME_CONFIG.MIN_PLAYERS + 1),
              ].map((_, i) => (
                <option
                  key={i + GAME_CONFIG.MIN_PLAYERS}
                  value={i + GAME_CONFIG.MIN_PLAYERS}
                >
                  {i + GAME_CONFIG.MIN_PLAYERS} Joueurs
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Jetons par joueur
            </label>
            <select
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              value={tokenCount || ""}
              onChange={(e) => setTokenCount(Number(e.target.value))}
            >
              <option value="">Sélectionnez</option>
              {[
                ...Array(GAME_CONFIG.MAX_TOKENS - GAME_CONFIG.MIN_TOKENS + 1),
              ].map((_, i) => (
                <option
                  key={i + GAME_CONFIG.MIN_TOKENS}
                  value={i + GAME_CONFIG.MIN_TOKENS}
                >
                  {i + GAME_CONFIG.MIN_TOKENS} Jetons
                </option>
              ))}
            </select>
          </div>

          <div className="flex space-x-4">
            <button
              className="flex-1 bg-gray-600 text-white py-3 rounded-lg hover:bg-gray-700"
              onClick={() => setGameMode(null)}
            >
              Retour
            </button>
            <button
              className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
              disabled={!playerCount || !tokenCount}
              onClick={() => setGameStarted(true)}
            >
              Commencer
            </button>
          </div>
        </div>

        {gameHistory.length > 0 && (
          <div className="mt-8 pt-6 border-t">
            <h2 className="text-xl font-semibold mb-4">
              Historique des parties
            </h2>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {gameHistory.map((game, index) => (
                <div key={index} className="p-3 bg-gray-50 rounded text-sm">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">
                      {game.playerCount} joueurs - {game.tokenCount} jetons
                    </span>
                    <span className="text-gray-600">
                      {new Date(game.date).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="text-gray-600 mt-1">
                    Gagnant{game.winners.length > 1 ? "s" : ""} :{" "}
                    {game.winners.join(", ")}
                  </div>
                </div>
              ))}
            </div>
          </div>
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
        onGameEnd={handleGameEnd}
      />
    );
  }

  return null;
};

export default App;
