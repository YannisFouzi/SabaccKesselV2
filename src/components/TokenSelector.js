import React, { useState } from "react";
import jeton from "../assets/img/jeton.png";

const TokenSelector = ({ value, onChange }) => {
  const MIN_TOKENS = 4;
  const [inputValue, setInputValue] = useState(value || "");

  const handleInputChange = (e) => {
    const newValue = e.target.value;
    if (newValue === "" || /^\d+$/.test(newValue)) {
      setInputValue(newValue);

      const numValue = parseInt(newValue, 10);
      if (numValue >= MIN_TOKENS) {
        onChange(numValue);
      } else {
        onChange(null);
      }
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="block text-lg font-medium text-blue-100">
          Jetons par joueur
        </label>
        <span className="text-blue-200">
          {value && value < MIN_TOKENS ? `Minimum ${MIN_TOKENS} jetons` : ""}
        </span>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-shrink-0">
          <div className="relative w-16 h-16">
            {[...Array(3)].map((_, index) => (
              <img
                key={index}
                src={jeton}
                alt=""
                className="absolute w-14 h-14 object-contain transition-all duration-200"
                style={{
                  top: `${index * -4}px`,
                  left: `${index * 2}px`,
                  zIndex: index,
                  opacity: value && value >= MIN_TOKENS ? 1 : 0.5,
                }}
              />
            ))}
          </div>
        </div>

        <div className="flex-1 max-w-[200px]">
          <div className="relative">
            <input
              type="number"
              min={MIN_TOKENS}
              value={inputValue}
              onChange={handleInputChange}
              placeholder={`Min. ${MIN_TOKENS}`}
              className="w-full bg-white/10 border-2 border-white/20 rounded-xl 
                px-4 py-2 text-white placeholder-white/50
                focus:outline-none focus:border-white/40
                transition-all duration-200
                [appearance:textfield]
                [&::-webkit-outer-spin-button]:appearance-none
                [&::-webkit-inner-spin-button]:appearance-none"
            />
          </div>

          {value && value < MIN_TOKENS && (
            <p className="text-red-400 text-sm mt-2">
              Minimum {MIN_TOKENS} jetons requis
            </p>
          )}

          {/* Suggestions rapides */}
          <div className="flex gap-2 mt-3">
            {[4, 10, 20, 50, 100].map((amount) => (
              <button
                key={amount}
                onClick={() => {
                  setInputValue(amount.toString());
                  onChange(amount);
                }}
                className={`px-3 py-1 rounded-lg text-sm transition-all duration-200
                  ${
                    value === amount
                      ? "bg-blue-500 text-white"
                      : "bg-white/10 text-white/70 hover:bg-white/20"
                  }`}
              >
                {amount}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TokenSelector;
