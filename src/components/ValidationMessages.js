import React from "react";

const ValidationMessages = ({ playerNames, playerCount }) => {
  if (!playerCount) return null;

  const errors = playerNames
    .map((name, index) => {
      if (!name.trim()) {
        return `Le nom du joueur ${index + 1} est requis`;
      }
      if (name.length > GAME_CONFIG.MAX_NAME_LENGTH) {
        return `Le nom du joueur ${index + 1} est trop long`;
      }
      if (!/^[a-zA-Z0-9\s-_]+$/.test(name)) {
        return `Le nom du joueur ${
          index + 1
        } contient des caractères invalides`;
      }
      return null;
    })
    .filter((error) => error !== null);

  if (errors.length === 0) return null;

  return (
    <div className="mt-4 text-red-400 text-center">
      {errors.map((error, index) => (
        <p key={index}>{error}</p>
      ))}
    </div>
  );
};

export default ValidationMessages;
