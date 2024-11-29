import React from "react";
import ComingSoonRibbon from "../../components/ComingSoonRibbon";

const MainMenu = ({ setGameMode }) => {
  return (
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
};

export default MainMenu;
