import React from "react";

const Rules = ({ setGameMode }) => {
  return (
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
};

export default Rules;
