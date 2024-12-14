import React, { useState } from "react";
import JokerSelection from "../components/JokerSelection";
import PlayerNameInput from "../components/PlayerNameInput";
import { AVATAR_LIST } from "../constants/avatarConfig";
import { GAME_CONFIG, JOKERS } from "../constants/gameConstants";

// Créer une version des jokers avec tous les jetons activés
const AVAILABLE_JOKERS = Object.entries(JOKERS).reduce((acc, [key, joker]) => {
  acc[key] = {
    ...joker,
    enabled: true, // Forcer tous les jokers à être activés
  };
  return acc;
}, {});

const PlayerSetup = ({ onComplete }) => {
  const [playerName, setPlayerName] = useState("");
  const [playerAvatar, setPlayerAvatar] = useState(null);
  const [hasAttemptedStart, setHasAttemptedStart] = useState(false);

  const isValid =
    playerName.trim() !== "" &&
    playerName.length <= GAME_CONFIG.MAX_NAME_LENGTH &&
    /^[a-zA-ZÀ-ÿ0-9\s-_]+$/.test(playerName) &&
    playerAvatar !== null;

  const handleSubmit = () => {
    setHasAttemptedStart(true);
    if (isValid) {
      onComplete({
        id: "demo",
        name: playerName,
        avatar: playerAvatar,
      });
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-white/10 backdrop-blur-md p-6 rounded-2xl shadow-xl border border-white/20">
      <h2 className="text-2xl font-bold text-white mb-6 text-center">
        qui êtes-vous ?
      </h2>

      <div className="space-y-6">
        <PlayerNameInput
          index={0}
          name={playerName}
          avatar={playerAvatar}
          onChange={(_, value) => setPlayerName(value)}
          onAvatarChange={(_, value) => setPlayerAvatar(value)}
          placeholder="Votre nom"
          playerAvatars={[playerAvatar]}
        />

        {hasAttemptedStart && !isValid && (
          <div className="text-red-400 text-sm">
            {!playerName.trim() && "Veuillez entrer votre nom"}
            {playerName.trim() && !playerAvatar && "Veuillez choisir un avatar"}
          </div>
        )}

        <button
          onClick={handleSubmit}
          className="w-full py-3 px-6 rounded-xl text-lg font-bold
            bg-gradient-to-r from-purple-600 to-blue-600 
            hover:from-purple-700 hover:to-blue-700
            text-white shadow-lg
            transform transition-all duration-200 
            hover:-translate-y-0.5 active:translate-y-0"
        >
          Continuer
        </button>
      </div>
    </div>
  );
};

const PlayerActiveJokers = ({ jokers, onUseJoker, player }) => {
  const [jokerToConfirm, setJokerToConfirm] = useState(null);
  const [displayedJoker, setDisplayedJoker] = useState(null);

  const handleConfirmUse = () => {
    if (jokerToConfirm !== null) {
      const joker = AVAILABLE_JOKERS[jokers[jokerToConfirm]]; // Utiliser AVAILABLE_JOKERS au lieu de JOKERS
      setDisplayedJoker({
        id: jokers[jokerToConfirm],
        title: joker.title,
        description: joker.description,
        playerName: player.name,
        playerAvatar: player.avatar,
      });
    }
  };

  const handleCloseJokerDisplay = () => {
    setDisplayedJoker(null);
    onUseJoker(jokerToConfirm);
    setJokerToConfirm(null);
  };

  return (
    <>
      {/* Overlay pour afficher le joker en grand */}
      {displayedJoker && (
        <div className="fixed inset-0 z-50">
          {/* Background flou */}
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900/95 via-purple-900/95 to-blue-900/95 backdrop-blur-md" />

          {/* Contenu */}
          <div className="relative h-full flex flex-col items-center justify-center p-4">
            <div className="transform animate-scale-up max-w-lg w-full mx-auto text-center space-y-6">
              {/* Info joueur */}
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white/20">
                  <img
                    src={
                      AVATAR_LIST.find(
                        (avatar) => avatar.id === displayedJoker.playerAvatar
                      )?.image
                    }
                    alt={`Avatar de ${displayedJoker.playerName}`}
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="text-xl text-white font-medium">
                  {displayedJoker.playerName}
                </span>
              </div>

              {/* Image du joker */}
              <div className="w-64 h-64 mx-auto">
                <img
                  src={require(`../assets/img/jokers/joker-${displayedJoker.id}.png`)}
                  alt={displayedJoker.title}
                  className="w-full h-full object-contain"
                />
              </div>

              {/* Titre */}
              <h2 className="text-4xl font-bold text-white">
                {displayedJoker.title}
              </h2>

              {/* Description */}
              <p className="text-xl text-gray-300 max-w-md mx-auto">
                {displayedJoker.description}
              </p>

              {/* Bouton pour fermer */}
              <button
                onClick={handleCloseJokerDisplay}
                className="mt-8 px-8 py-3 bg-white/20 hover:bg-white/30 text-white rounded-xl 
                         transition-all duration-300 transform hover:scale-105
                         border border-white/30 backdrop-blur-sm"
              >
                Terminer l'action
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Contenu normal */}
      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-white/20">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">vos jetons d'action</h2>
          <div className="flex items-center gap-3">
            <span className="text-white font-medium">{player.name}</span>
            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white/20">
              <img
                src={
                  AVATAR_LIST.find((avatar) => avatar.id === player.avatar)
                    ?.image
                }
                alt={`Avatar de ${player.name}`}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {jokers.map((jokerId, index) => {
            const joker = AVAILABLE_JOKERS[jokerId]; // Utiliser AVAILABLE_JOKERS au lieu de JOKERS
            const isConfirming = jokerToConfirm === index;

            return (
              <div
                key={index}
                className="bg-white/5 p-4 rounded-xl border border-white/10"
              >
                <div className="w-20 h-20 mx-auto mb-2">
                  <img
                    src={require(`../assets/img/jokers/joker-${jokerId}.png`)}
                    alt={joker.title}
                    className={`w-full h-full object-contain ${
                      isConfirming ? "opacity-50" : ""
                    }`}
                  />
                </div>
                <div className="text-white text-center">
                  <h3 className="font-bold mb-2">{joker.title}</h3>
                  <p className="text-sm text-gray-300 mb-4">
                    {joker.description}
                  </p>
                  {isConfirming ? (
                    <div className="space-y-2">
                      <p className="text-amber-400 text-sm mb-2">
                        Confirmer l'utilisation ?
                      </p>
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={handleConfirmUse}
                          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
                        >
                          Confirmer
                        </button>
                        <button
                          onClick={() => setJokerToConfirm(null)}
                          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
                        >
                          Annuler
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => setJokerToConfirm(index)}
                      className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                      Utiliser
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Styles pour l'animation */}
      <style jsx>{`
        @keyframes scale-up {
          0% {
            transform: scale(0.5);
            opacity: 0;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
        .animate-scale-up {
          animation: scale-up 0.3s ease-out forwards;
        }
      `}</style>
    </>
  );
};

const JokersPage = ({ setGameMode }) => {
  const [player, setPlayer] = useState(null);
  const [selectedJokers, setSelectedJokers] = useState(null);
  const [arrivalTime] = useState(new Date().toLocaleTimeString());

  const handlePlayerSetup = (playerData) => {
    setPlayer(playerData);
  };

  const handleJokerSelection = (selection) => {
    if (Array.isArray(selection)) {
      setSelectedJokers(selection);
    } else {
      setSelectedJokers(selection[player.id]);
    }
  };

  const handleUseJoker = (index) => {
    const newJokers = [...selectedJokers];
    newJokers.splice(index, 1);
    setSelectedJokers(newJokers);
  };

  const handleBack = () => {
    setGameMode(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900">
      <div className="container mx-auto px-4 py-8 min-h-screen flex flex-col">
        <div className="text-white text-right mb-4">
          Heure d'arrivée: {arrivalTime}
        </div>

        {!player ? (
          <PlayerSetup onComplete={handlePlayerSetup} />
        ) : !selectedJokers ? (
          <JokerSelection
            players={[player]}
            currentJokerSelectionPlayer={0}
            setSelectedJokers={handleJokerSelection}
            setCurrentJokerSelectionPlayer={() => {}}
            setGameState={() => {}}
            standalone={true}
            jokers={AVAILABLE_JOKERS} // Passer les jokers activés au composant JokerSelection
          />
        ) : (
          <div className="flex-1 flex flex-col space-y-6 overflow-y-auto">
            <PlayerActiveJokers
              jokers={selectedJokers}
              onUseJoker={handleUseJoker}
              player={player}
            />

            <div className="flex justify-center pb-6">
              <button
                onClick={handleBack}
                className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                Retour au menu principal
              </button>
            </div>
          </div>
        )}
      </div>

      <style jsx global>{`
        body {
          overflow-y: auto !important;
        }
        #root {
          min-height: 100vh;
          overflow-y: auto !important;
        }
      `}</style>
    </div>
  );
};

export default JokersPage;
