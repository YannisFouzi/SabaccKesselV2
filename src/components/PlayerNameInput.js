import React, { useEffect, useRef, useState } from "react";
import { AVATAR_LIST } from "../constants/avatarConfig";

const PlayerNameInput = ({
  index,
  name,
  avatar,
  onChange,
  onAvatarChange,
  placeholder,
  playerAvatars,
}) => {
  const [showAvatarSelect, setShowAvatarSelect] = useState(false);
  const avatarSelectRef = useRef(null);

  // Gestionnaire de clic à l'extérieur
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        avatarSelectRef.current &&
        !avatarSelectRef.current.contains(event.target)
      ) {
        setShowAvatarSelect(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Filtrer les avatars déjà utilisés par d'autres joueurs
  const availableAvatars = AVATAR_LIST.filter(
    (avatarOption) =>
      !playerAvatars.some(
        (usedAvatar, playerIndex) =>
          usedAvatar === avatarOption.id && playerIndex !== index
      )
  );

  return (
    <div className="relative">
      <div className="flex gap-2 items-center">
        <div className="flex-shrink-0">
          <button
            onClick={() => setShowAvatarSelect(!showAvatarSelect)}
            className={`w-12 h-12 rounded-full overflow-hidden border-2 border-white/20 
              hover:border-white/40 transition-all duration-200 flex items-center justify-center
              bg-white/10 ${
                !avatar ? "animate-glowPulse" : "hover:animate-wiggle"
              }`}
            title="Choisir un avatar"
          >
            {avatar ? (
              <img
                src={AVATAR_LIST.find((a) => a.id === avatar)?.image}
                alt={AVATAR_LIST.find((a) => a.id === avatar)?.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-white/60 text-xl">👤</span>
            )}
          </button>
        </div>

        <input
          type="text"
          value={name}
          onChange={(e) => onChange(index, e.target.value)}
          placeholder={placeholder}
          className="player-name-input w-full bg-white/10 border border-white/20 
            rounded-xl px-4 py-2 text-white placeholder-white/40 outline-none
            focus:border-white/40 transition-all duration-200"
        />
      </div>

      {showAvatarSelect && (
        <div
          ref={avatarSelectRef}
          className="absolute top-full left-0 mt-2 p-2 bg-gray-800/95 
          backdrop-blur-sm rounded-xl border border-white/20 grid grid-cols-4 gap-2 z-10
          animate-fadeIn shadow-lg shadow-black/20"
        >
          {availableAvatars.map((avatarOption) => (
            <button
              key={avatarOption.id}
              onClick={() => {
                onAvatarChange(index, avatarOption.id);
                setShowAvatarSelect(false);
              }}
              className={`flex flex-col items-center gap-1 p-2 rounded-lg
                ${
                  avatar === avatarOption.id
                    ? "border-blue-500 bg-blue-500/20"
                    : "border-transparent hover:border-white/40 hover:bg-white/5"
                } transition-all duration-200 hover:scale-105`}
            >
              <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white/20">
                <img
                  src={avatarOption.image}
                  alt={avatarOption.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-xs text-white/80">{avatarOption.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default PlayerNameInput;
