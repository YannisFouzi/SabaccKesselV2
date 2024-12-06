import React from "react";
import { AVATAR_LIST } from "../../constants/avatarConfig";
import { getCardBack, getCardImage } from "../../constants/cardImages";
import { JOKERS } from "../../constants/gameConstants";

const ActionHistory = ({ actions, usedJokers, players }) => {
  const getPlayerAvatar = (playerName) => {
    if (!players) return null;
    const player = players.find((p) => p.name === playerName);
    if (!player) return null;
    const avatarConfig = AVATAR_LIST.find((a) => a.id === player.avatar);
    return avatarConfig?.image;
  };

  const renderCardImage = (card) => {
    return (
      <img
        src={
          card.isHidden
            ? getCardBack(card.family)
            : getCardImage(
                card.family,
                card.type,
                card.type === "NORMAL" ? card.value : null
              )
        }
        alt={`Carte ${card.family === "SAND" ? "Sable" : "Sang"}`}
        className="inline-block w-8 h-12 mx-1 align-middle"
      />
    );
  };

  const getJokerDescription = (jokerId) => {
    switch (jokerId) {
      case "A":
        return "Pioche une carte sans dépenser de jeton";
      case "B":
        return "Récupération de 2 jetons de mise maximum";
      case "C":
        return "Récupération de 3 jetons de mise maximum";
      case "D":
        return "A pris 1 jeton de mise dans chaque pot adverse et les a ajoutez à son pot";
      case "E":
        return "La valeur de l'imposteur est de 6 points jusqu'au prochain dévoilement de carte";
      case "F":
        return "A copié le pouvoir d'un autre joker";
      default:
        return `Joker ${jokerId}`;
    }
  };

  const renderPlayerActions = (playerName, playerActions) => {
    const hasUsedJoker = playerActions.some(
      (action) => action.type === "USE_JOKER"
    );
    const jokerAction = playerActions.find(
      (action) => action.type === "USE_JOKER"
    );
    const drawAction = playerActions.find((action) =>
      action.type.includes("DRAW")
    );
    const discardAction = playerActions.find(
      (action) => action.type === "DISCARD"
    );

    if (hasUsedJoker) {
      return (
        <div className="space-y-4">
          {/* Première ligne: image + nom */}
          <div className="flex items-center gap-2">
            <img
              src={getPlayerAvatar(playerName)}
              alt={`Avatar de ${playerName}`}
              className="w-8 h-8 rounded-full object-cover"
            />
            <span className="font-bold">{playerName}</span>
          </div>

          {/* Deuxième ligne: joker + description */}
          {jokerAction && (
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <img
                  src={require(`../../assets/img/jokers/joker-${jokerAction.jokerId}.png`)}
                  alt={`Joker ${jokerAction.jokerId}`}
                  className="w-6 h-6 object-contain"
                />
                <span className="text-purple-400">
                  {JOKERS[jokerAction.jokerId].title}
                </span>
              </div>
              <div className="text-sm text-gray-400 ml-8">
                {getJokerDescription(jokerAction.jokerId)}
              </div>
            </div>
          )}

          {/* Troisième ligne: pioche + défausse */}
          <div className="flex items-center gap-2">
            {drawAction && (
              <span>Pioche: {renderCardImage(drawAction.card)}</span>
            )}
            {discardAction && (
              <span>Défausse: {renderCardImage(discardAction.card)}</span>
            )}
          </div>
        </div>
      );
    } else {
      return (
        <div className="flex items-center gap-4">
          <img
            src={getPlayerAvatar(playerName)}
            alt={`Avatar de ${playerName}`}
            className="w-8 h-8 rounded-full object-cover"
          />
          <span className="font-bold">{playerName}</span>
          {drawAction && (
            <span>Pioche: {renderCardImage(drawAction.card)}</span>
          )}
          {discardAction && (
            <span>Défausse: {renderCardImage(discardAction.card)}</span>
          )}
        </div>
      );
    }
  };

  // Regrouper les actions par joueur
  const groupedActions = actions.reduce((acc, action) => {
    if (!acc[action.playerName]) {
      acc[action.playerName] = [];
    }
    acc[action.playerName].push(action);
    return acc;
  }, {});

  return (
    <div className="space-y-4">
      {Object.entries(groupedActions).map(([playerName, actions]) => (
        <div key={playerName} className="rounded-lg p-4">
          {renderPlayerActions(playerName, actions)}
        </div>
      ))}
    </div>
  );
};

const PlayerTransitionScreen = ({
  nextPlayer,
  onReady,
  actionHistory,
  usedJokers,
  players,
}) => {
  console.log("PlayerTransitionScreen props:", {
    nextPlayer,
    actionHistory,
    usedJokers,
    players,
  });
  const avatar = AVATAR_LIST.find((a) => a.id === nextPlayer.avatar);

  return (
    <div className="fixed inset-0 bg-gray-900 z-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-xl max-w-2xl w-full">
        <div className="flex flex-col items-center gap-4 mb-6">
          <img
            src={avatar?.image}
            alt={`Avatar de ${nextPlayer.name}`}
            className="w-20 h-20 rounded-full object-cover border-4 border-blue-500 shadow-lg"
          />
          <h2 className="text-2xl font-bold text-center">
            Au tour de {nextPlayer.name}
          </h2>
        </div>

        <ActionHistory
          actions={actionHistory}
          usedJokers={usedJokers}
          players={players}
        />

        <button
          onClick={onReady}
          className="w-full bg-blue-500 text-white py-4 rounded-lg text-lg font-semibold hover:bg-blue-600 transition-colors mt-6"
        >
          Commencer mon tour
        </button>
      </div>
    </div>
  );
};

export default PlayerTransitionScreen;
