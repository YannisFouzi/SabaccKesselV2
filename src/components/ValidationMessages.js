import React from "react";
import { GAME_CONFIG } from "../constants/gameConstants";

const ValidationMessages = ({ playerNames, playerCount, playerAvatars }) => {
  if (!playerCount) return null;

  const errors = [];

  // Validation des noms
  playerNames.forEach((name, index) => {
    if (!name.trim()) {
      errors.push(`Le nom du joueur ${index + 1} est requis`);
    } else if (name.length > GAME_CONFIG.MAX_NAME_LENGTH) {
      errors.push(`Le nom du joueur ${index + 1} est trop long`);
    } else if (!/^[a-zA-Z0-9\s-_]+$/.test(name)) {
      errors.push(
        `Le nom du joueur ${index + 1} contient des caractères invalides`
      );
    }
  });

  // Validation des avatars
  playerAvatars.forEach((avatar, index) => {
    if (avatar === undefined) {
      errors.push(`L'avatar du joueur ${index + 1} doit être sélectionné`);
    }
  });

  if (errors.length === 0) return null;

  return (
    <div className="mt-4 text-red-400 text-center">
      {errors.map((error, index) => (
        <p key={index} className="error-message">
          {error}
        </p>
      ))}
    </div>
  );
};

export default ValidationMessages;
