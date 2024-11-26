import React from "react";
import { AVATAR_LIST } from "../constants/avatarConfig";

const PlayerIdentity = ({ player, className = "", size = "medium" }) => {
  const sizeClasses = {
    small: "w-6 h-6",
    medium: "w-8 h-8",
    large: "w-12 h-12",
  };

  const avatarData = AVATAR_LIST.find((avatar) => avatar.id === player.avatar);

  if (!avatarData) {
    console.warn(
      `Avatar non trouvé pour le joueur ${player.name} (ID avatar: ${player.avatar})`
    );
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <img
        src={avatarData?.src || AVATAR_LIST[0].src}
        alt={`Avatar de ${player.name}`}
        className={`${sizeClasses[size]} rounded-full object-cover`}
      />
      <span>{player.name}</span>
    </div>
  );
};

export default PlayerIdentity;
