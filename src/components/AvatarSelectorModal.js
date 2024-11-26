import React from "react";
import { AVATAR_LIST } from "../constants/avatarConfig";

const AvatarSelectorModal = ({ isOpen, onClose, onSelect, currentAvatar }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-gray-800/95 rounded-2xl p-6 w-[90%] max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold text-white">Choisir un avatar</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-xl p-2"
          >
            ✕
          </button>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-4 gap-4 p-2">
          {AVATAR_LIST.map((avatar) => (
            <button
              key={avatar.id}
              onClick={() => {
                onSelect(avatar.id);
                onClose();
              }}
              className={`p-3 rounded-xl transition-all duration-200 
                ${
                  currentAvatar === avatar.id
                    ? "bg-blue-500/30 ring-2 ring-blue-500"
                    : "hover:bg-white/10"
                }
                flex flex-col items-center gap-2
                hover:transform hover:scale-105`}
            >
              <div className="w-full aspect-square bg-gray-700/50 rounded-lg p-2">
                <img
                  src={avatar.image}
                  alt={avatar.name}
                  className="w-full h-full object-contain"
                />
              </div>
              <p className="text-sm font-medium text-white">{avatar.name}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AvatarSelectorModal;
