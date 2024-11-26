import React from "react";
import { AVATAR_LIST } from "../constants/avatarConfig";

const PlayerIdentity = ({ player, className = "" }) => {
  const avatar = AVATAR_LIST.find((a) => a.id === player.avatar);

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {avatar && (
        <div className="w-8 h-8 rounded-lg overflow-hidden bg-white/10">
          <img
            src={avatar.image}
            alt={avatar.name}
            className="w-full h-full object-contain"
          />
        </div>
      )}
      <span className="font-medium">{player.name}</span>
    </div>
  );
};

export default PlayerIdentity;
