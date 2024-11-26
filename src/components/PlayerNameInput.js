import React, { useState } from "react";
import { AVATAR_LIST } from "../constants/avatarConfig";
import { GAME_CONFIG } from "../constants/gameConstants";
import AvatarSelectorModal from "./AvatarSelectorModal";

const PlayerNameInput = ({
  index,
  name,
  avatar,
  onChange,
  onAvatarChange,
  placeholder,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const selectedAvatar = AVATAR_LIST.find((a) => a.id === avatar);

  return (
    <div className="space-y-3">
      <div className="flex gap-3">
        <div className="flex flex-col items-center gap-2">
          <button
            onClick={() => setIsModalOpen(true)}
            className={`w-16 h-16 rounded-xl flex items-center justify-center
              ${!avatar ? "bg-white/10 hover:bg-white/20" : ""} 
              transition-all duration-200 border-2 border-white/20
              hover:border-white/40 hover:scale-105`}
            title="Choisir un avatar"
          >
            {avatar ? (
              <img
                src={selectedAvatar?.image}
                alt={selectedAvatar?.name}
                className="w-full h-full object-contain rounded-lg p-1"
              />
            ) : (
              <span className="text-xs text-white/70 text-center w-full">
                Choisir un avatar
              </span>
            )}
          </button>
        </div>

        <input
          type="text"
          value={name}
          onChange={(e) => onChange(index, e.target.value)}
          placeholder={placeholder}
          maxLength={GAME_CONFIG.MAX_NAME_LENGTH}
          className="flex-1 bg-white/10 border-2 border-white/20 rounded-xl px-4 py-2
            text-white placeholder-white/50
            focus:outline-none focus:border-white/40
            transition-all duration-200"
        />
      </div>

      <AvatarSelectorModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSelect={(avatarId) => onAvatarChange(index, avatarId)}
        currentAvatar={avatar}
      />
    </div>
  );
};

export default PlayerNameInput;
