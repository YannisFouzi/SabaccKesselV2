import React from "react";
import AvatarSelector from "./AvatarSelector";

const PlayerNameInput = ({
  index,
  name,
  avatar,
  onChange,
  onAvatarChange,
  placeholder,
}) => {
  return (
    <div className="space-y-2">
      <div className="relative group">
        <input
          type="text"
          value={name}
          onChange={(e) => onChange(index, e.target.value)}
          placeholder={placeholder}
          className="w-full p-3 bg-white/10 border-2 border-white/30 rounded-xl text-white 
            backdrop-blur-sm transition-all duration-200
            hover:bg-white/20 hover:border-white/40
            focus:outline-none focus:ring-2 focus:ring-yellow-400/50
            placeholder-white/50"
        />
        <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
          <span className="text-white/50 group-hover:text-white/70">👤</span>
        </div>
      </div>
      <AvatarSelector
        selectedAvatar={avatar}
        onSelect={(avatarId) => onAvatarChange(index, avatarId)}
      />
    </div>
  );
};

export default PlayerNameInput;
