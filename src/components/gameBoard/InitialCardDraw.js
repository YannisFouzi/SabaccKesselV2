import React, { useEffect, useState } from "react";
import { getCardBack, getCardImage } from "../../constants/cardImages";
import { CARD_FAMILIES, CARD_TYPES } from "../../constants/gameConstants";

const InitialCardDraw = ({
  players,
  setGameState,
  GAME_STATES,
  setPlayerOrder,
}) => {
  const [availableCards, setAvailableCards] = useState([]);
  const [drawnCards, setDrawnCards] = useState({});
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(null);
  const [revealCards, setRevealCards] = useState(false);
  const [winner, setWinner] = useState(null);
  const [gameOrder, setGameOrder] = useState([]);
  const [showStartButton, setShowStartButton] = useState(false);

  // Initialisation des cartes et du premier joueur
  useEffect(() => {
    // Création du deck initial avec 1 Sylop et (playerCount-1) cartes normales
    const initialDeck = [
      {
        id: "sylop",
        type: CARD_TYPES.SYLOP,
        family: CARD_FAMILIES.SAND,
        value: null,
      },
      ...Array(players.length - 1)
        .fill()
        .map((_, index) => ({
          id: `normal-${index}`,
          type: CARD_TYPES.NORMAL,
          family: CARD_FAMILIES.SAND,
          value: index + 1,
        })),
    ].sort(() => Math.random() - 0.5);

    setAvailableCards(initialDeck);

    // Sélection aléatoire du premier joueur
    const randomStartIndex = Math.floor(Math.random() * players.length);
    setCurrentPlayerIndex(randomStartIndex);
  }, [players]);

  const handleCardSelect = (cardIndex) => {
    const selectedCard = availableCards[cardIndex];
    const currentPlayer = players[currentPlayerIndex];

    // Ajout de la carte tirée aux cartes du joueur
    setDrawnCards((prev) => ({
      ...prev,
      [currentPlayer.id]: selectedCard,
    }));

    // Retrait de la carte des cartes disponibles
    setAvailableCards((prev) => prev.filter((_, index) => index !== cardIndex));

    // Passage au joueur suivant
    const nextPlayerIndex = (currentPlayerIndex + 1) % players.length;

    // Si tous les joueurs ont tiré
    if (Object.keys(drawnCards).length + 1 === players.length) {
      determineWinnerAndOrder();
    } else {
      setCurrentPlayerIndex(nextPlayerIndex);
    }
  };

  const determineWinnerAndOrder = () => {
    setRevealCards(true);

    // Trouver le joueur qui a le Sylop
    const winningPlayer = players.find(
      (player) => drawnCards[player.id]?.type === CARD_TYPES.SYLOP
    );

    // Vérification de sécurité - si aucun gagnant n'est trouvé, prendre le premier joueur
    const winner = winningPlayer || players[0];
    setWinner(winner);

    // Déterminer l'ordre de jeu à partir du gagnant
    const winnerIndex = players.findIndex((p) => p.id === winner.id);
    const order = [];

    // Créer l'ordre de jeu en commençant par le gagnant
    for (let i = 0; i < players.length; i++) {
      const index = (winnerIndex + i) % players.length;
      order.push(players[index].id);
    }

    setGameOrder(order);
    setPlayerOrder(order);

    // Afficher le bouton après un délai
    setTimeout(() => {
      setShowStartButton(true);
    }, 2000);
  };

  const handleStartGame = () => {
    setGameState(GAME_STATES.SETUP);
  };

  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center overflow-y-auto">
      <div className="min-h-full w-full flex items-center justify-center py-8">
        <div className="w-full max-w-4xl p-4 sm:p-6">
          <h2 className="text-2xl sm:text-4xl font-bold text-center mb-4 sm:mb-8 text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-amber-600">
            Tirage des cartes initial
          </h2>

          {!revealCards && currentPlayerIndex !== null && (
            <div className="text-center mb-4 sm:mb-6 py-3 px-4 rounded-xl bg-amber-500/20 border border-amber-500/30 backdrop-blur-sm">
              <span className="text-amber-400 font-medium text-sm sm:text-base">
                {players[currentPlayerIndex].name}, choisissez une carte
              </span>
            </div>
          )}

          <div className="flex flex-col items-center gap-6 sm:gap-12">
            {/* Cartes disponibles */}
            {!revealCards && (
              <div className="w-full overflow-x-auto pb-4">
                <div className="flex justify-center min-w-fit">
                  <div
                    className="relative mx-auto"
                    style={{
                      width: `${Math.min(
                        availableCards.length * 60 + 80,
                        window.innerWidth - 32
                      )}px`,
                      height: "160px",
                    }}
                  >
                    {availableCards.map((card, index) => {
                      const offset =
                        index *
                        Math.min(
                          60,
                          (window.innerWidth - 160) / availableCards.length
                        );
                      const rotation =
                        (index - (availableCards.length - 1) / 2) * 3;

                      return (
                        <button
                          key={card.id}
                          onClick={() => handleCardSelect(index)}
                          className="absolute transition-all duration-200 hover:z-50"
                          style={{
                            left: `${offset}px`,
                            transform: `rotate(${rotation}deg)`,
                            transformOrigin: "bottom center",
                            zIndex: index,
                          }}
                          disabled={revealCards}
                        >
                          <div className="transform transition-all duration-200 hover:scale-110 hover:-translate-y-8 hover:brightness-110">
                            <img
                              src={getCardBack(CARD_FAMILIES.SAND)}
                              alt="Carte face cachée"
                              className="w-20 sm:w-28 rounded-lg shadow-lg hover:shadow-xl"
                            />
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Cartes tirées */}
            <div className="w-full overflow-x-auto">
              <div className="flex justify-center min-w-fit">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6 p-2">
                  {players.map((player) => (
                    <div
                      key={player.id}
                      className="flex flex-col items-center gap-2"
                    >
                      <span className="text-gray-300 font-medium text-sm sm:text-base">
                        {player.name}
                      </span>
                      {drawnCards[player.id] && (
                        <div className="w-20 sm:w-28">
                          <img
                            src={
                              revealCards
                                ? getCardImage(
                                    drawnCards[player.id].family,
                                    drawnCards[player.id].type,
                                    drawnCards[player.id].type ===
                                      CARD_TYPES.NORMAL
                                      ? drawnCards[player.id].value
                                      : null
                                  )
                                : getCardBack(CARD_FAMILIES.SAND)
                            }
                            alt="Carte tirée"
                            className="w-full rounded-lg shadow-lg"
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {revealCards && winner && (
              <div className="mt-4 sm:mt-8 text-center px-4">
                <h3 className="text-xl sm:text-2xl font-bold text-amber-400 mb-4">
                  {winner.name} commence la partie !
                </h3>
                <div className="text-gray-300 mb-6 sm:mb-8 text-sm sm:text-base">
                  <p className="mb-2">Ordre de jeu :</p>
                  <div className="flex flex-wrap justify-center gap-2">
                    {gameOrder.map((playerId, index) => {
                      const player = players.find((p) => p.id === playerId);
                      return (
                        <span key={playerId} className="flex items-center">
                          <span>
                            {index + 1}. {player.name}
                          </span>
                          {index < gameOrder.length - 1 && (
                            <span className="mx-2 text-amber-500">→</span>
                          )}
                        </span>
                      );
                    })}
                  </div>
                </div>
                {showStartButton && (
                  <button
                    onClick={handleStartGame}
                    className="px-6 py-3 bg-gradient-to-r from-amber-500 to-yellow-500 
                             text-white font-bold rounded-lg shadow-lg 
                             hover:from-amber-600 hover:to-yellow-600 
                             transform hover:scale-105 transition-all duration-200"
                  >
                    Commencer la partie
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InitialCardDraw;