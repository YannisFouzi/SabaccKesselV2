import React from "react";
import { AVATAR_LIST } from "../constants/avatarConfig";

const PlayerIdentity = ({ player, className, avatarClassName }) => {
  const avatar = AVATAR_LIST.find((a) => a.id === player.avatar);

  return (
    <div className="flex items-center gap-1">
      <img
        src={avatar?.image}
        alt={`Avatar de ${player.name}`}
        className={`rounded-full ${avatarClassName || "w-8 h-8"}`}
      />
      <span className={className}>{player.name}</span>
    </div>
  );
};

export default PlayerIdentity;
