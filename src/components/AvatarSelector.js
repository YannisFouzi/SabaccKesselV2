import React from "react";
import { AVATAR_LIST } from "../constants/avatarConfig";

const AvatarSelector = ({ selectedAvatar, onSelect }) => {
  return (
    <div className="space-y-2">
      <h4 className="text-sm font-medium text-blue-100 mb-1">
        Choisissez un avatar
      </h4>
      <div className="grid grid-cols-4 gap-3 p-2 bg-white/5 rounded-xl">
        {AVATAR_LIST.map((avatar) => (
          <button
            key={avatar.id}
            onClick={() => onSelect(avatar.id)}
            className={`relative flex flex-col items-center gap-1 p-1 rounded-lg transition-all duration-200 
              ${
                selectedAvatar === avatar.id
                  ? "bg-yellow-400/30 ring-2 ring-yellow-400"
                  : "hover:bg-white/10"
              }`}
            title={avatar.name}
          >
            <img
              src={avatar.src}
              alt={avatar.name}
              className="w-12 h-12 rounded-lg"
            />
            <span className="text-xs text-white/70 line-clamp-1 w-full text-center">
              {avatar.name}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default AvatarSelector;
