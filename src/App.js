import { BookOpen, Shield, Users } from "lucide-react";
import React, { useState } from "react";
import GameBoard from "./components/GameBoard";
import { GAME_CONFIG } from "./constants/gameConstants";

const App = () => {
  const [gameMode, setGameMode] = useState(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [playerCount, setPlayerCount] = useState(null);
  const [tokenCount, setTokenCount] = useState(null);
  const [gameHistory, setGameHistory] = useState([]);
  const [gameKey, setGameKey] = useState(0);

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
    setGameMode(null); // Retour au menu principal
  };

  // Menu principal
  const renderMainMenu = () => (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="w-full max-w-md space-y-8 p-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">Sabacc de Kessel</h1>
          <p className="mt-2 text-gray-600">Choisissez votre mode de jeu</p>
        </div>

        <div className="space-y-4">
          <button
            onClick={() => setGameMode("local")}
            className="w-full flex items-center justify-between p-4 text-left border rounded-lg hover:bg-blue-50 hover:border-blue-500 transition-colors"
          >
            <div>
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5" />
                <span className="font-semibold">Mode Local</span>
              </div>
              <p className="ml-8 text-sm text-gray-600 mt-1">
                Jouez sur le même appareil
              </p>
            </div>
          </button>

          <button className="w-full flex items-center justify-between p-4 text-left border rounded-lg opacity-75 cursor-not-allowed">
            <div>
              <div className="flex items-center gap-3">
                <Users className="w-5 h-5" />
                <span className="font-semibold">Mode Multijoueur</span>
              </div>
              <p className="ml-8 text-sm text-gray-600 mt-1">Coming Soon</p>
            </div>
          </button>

          <button
            onClick={() => setGameMode("rules")}
            className="w-full flex items-center justify-between p-4 text-left border rounded-lg hover:bg-blue-50 hover:border-blue-500 transition-colors"
          >
            <div>
              <div className="flex items-center gap-3">
                <BookOpen className="w-5 h-5" />
                <span className="font-semibold">Règles du jeu</span>
              </div>
              <p className="ml-8 text-sm text-gray-600 mt-1">
                Consultez les règles complètes
              </p>
            </div>
          </button>
        </div>

        {gameHistory.length > 0 && (
          <div className="mt-8 pt-4 border-t">
            <p className="text-sm text-gray-600 text-center">
              {gameHistory.length} partie{gameHistory.length > 1 ? "s" : ""}{" "}
              jouée{gameHistory.length > 1 ? "s" : ""}
            </p>
          </div>
        )}
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
                  Une paire de sylops forme un "Sabacc pur", la meilleure main
                  possible
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
