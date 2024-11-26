import React from "react";
import { AVATAR_LIST } from "../constants/avatarConfig";

const PlayerIdentity = ({ player, className = "" }) => {
  const avatar = AVATAR_LIST.find((a) => a.id === player.avatar);

  return (
    <div
      className={`inline-flex items-center gap-2 
        bg-gradient-to-r from-white/10 to-white/5 
        backdrop-blur-sm border border-white/10
        px-3 py-1.5 rounded-lg
        ${className}`}
    >
      {avatar && (
        <div className="w-8 h-8 rounded-lg overflow-hidden">
          <img
            src={avatar.image}
            alt={avatar.name}
            className="w-full h-full object-contain"
          />
        </div>
      )}
      <span className="font-bold text-base">{player.name}</span>
    </div>
  );
};

export default PlayerIdentity;
