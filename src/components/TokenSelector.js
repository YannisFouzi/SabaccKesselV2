import React, { useCallback, useEffect, useMemo, useState } from "react";
import { GAME_CONFIG } from "../constants/gameConstants";
import LazyImage from "./LazyImage";

const TokenSelector = ({ value, onChange }) => {
  const [inputValue, setInputValue] = useState(value || "");

  // Fonctions de chargement d'images optimisées
  const loadJetonImage = useCallback(
    () => import("../assets/img/jeton.png").then((module) => module.default),
    []
  );

  const loadJetonKoImage = useCallback(
    () => import("../assets/img/jeton_ko.png").then((module) => module.default),
    []
  );

  // Mémoriser les validations
  const isValidToken = useMemo(() => {
    const num = parseInt(inputValue);
    return (
      !isNaN(num) &&
      num >= GAME_CONFIG.MIN_TOKENS &&
      num <= GAME_CONFIG.MAX_TOKENS
    );
  }, [inputValue]);

  // Optimiser les callbacks
  const handleInputChange = useCallback(
    (e) => {
      const newValue = e.target.value;
      setInputValue(newValue);

      const numValue = parseInt(newValue);
      if (
        !isNaN(numValue) &&
        numValue >= GAME_CONFIG.MIN_TOKENS &&
        numValue <= GAME_CONFIG.MAX_TOKENS
      ) {
        onChange(numValue);
      }
    },
    [onChange]
  );

  const handlePresetClick = useCallback(
    (presetValue) => {
      setInputValue(presetValue.toString());
      onChange(presetValue);
    },
    [onChange]
  );

  useEffect(() => {
    if (value) {
      setInputValue(value.toString());
    }
  }, [value]);

  // Mémoriser les jetons à afficher
  const tokensToShow = useMemo(() => {
    if (!value || value <= 0) return [];
    const maxTokens = Math.min(value, 20);
    return Array(maxTokens).fill(null);
  }, [value]);

  const [previousTokens, setPreviousTokens] = useState(tokensToShow);

  // Utilisez useEffect pour mettre à jour previousTokens après chaque changement
  useEffect(() => {
    const timer = setTimeout(() => {
      setPreviousTokens(tokensToShow);
    }, 300);
    return () => clearTimeout(timer);
  }, [tokensToShow]);

  const renderTokens = useMemo(() => {
    const maxDisplay = Math.max(tokensToShow.length, previousTokens.length);

    return Array(maxDisplay)
      .fill(null)
      .map((_, index) => {
        const isActive = index < tokensToShow.length;
        const wasActive = index < previousTokens.length;
        const isChanging = isActive !== wasActive;

        return (
          <div
            key={index}
            className={`
              w-4 h-4 transition-all duration-300 ease-in-out transform
              ${isActive ? "scale-100 opacity-100" : "scale-75 opacity-30"}
              ${isChanging ? "animate-pulse" : ""}
            `}
          >
            <LazyImage
              loadImageFn={isActive ? loadJetonImage : loadJetonKoImage}
              alt="Jeton"
              className="w-full h-full object-contain"
              fallbackClassName="rounded-full bg-amber-300"
            />
          </div>
        );
      });
  }, [tokensToShow, previousTokens, loadJetonImage, loadJetonKoImage]);

  const presetButtons = useMemo(() => [4, 8, 12, 16, 20], []);

  return (
    <div className="space-y-4">
      <div className="text-center">
        <label className="block text-white text-lg font-bold mb-2">
          Nombre de jetons par joueur
        </label>
        <div className="flex items-center justify-center space-x-4">
          <input
            type="number"
            min={GAME_CONFIG.MIN_TOKENS}
            max={GAME_CONFIG.MAX_TOKENS}
            value={inputValue}
            onChange={handleInputChange}
            className={`
              w-20 p-2 text-center text-lg font-bold rounded-lg
              border-2 transition-colors duration-200
              ${
                isValidToken
                  ? "border-green-500 bg-white text-gray-800 focus:border-green-600"
                  : "border-red-500 bg-red-100 text-red-800 focus:border-red-600"
              }
              focus:outline-none focus:ring-2 focus:ring-opacity-50
              ${isValidToken ? "focus:ring-green-300" : "focus:ring-red-300"}
            `}
          />
          <span className="text-white text-sm">
            ({GAME_CONFIG.MIN_TOKENS}-{GAME_CONFIG.MAX_TOKENS})
          </span>
        </div>

        {!isValidToken && inputValue && (
          <p className="text-red-400 text-sm mt-1">
            Choisissez entre {GAME_CONFIG.MIN_TOKENS} et{" "}
            {GAME_CONFIG.MAX_TOKENS} jetons
          </p>
        )}
      </div>

      <div className="flex justify-center space-x-2">
        {presetButtons.map((preset) => (
          <button
            key={preset}
            onClick={() => handlePresetClick(preset)}
            className={`
              px-3 py-1 rounded text-sm font-medium transition-all duration-200
              ${
                value === preset
                  ? "bg-purple-600 text-white shadow-lg transform scale-105"
                  : "bg-white/20 text-white hover:bg-white/30 hover:scale-105"
              }
            `}
          >
            {preset}
          </button>
        ))}
      </div>

      {value > 0 && (
        <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg">
          <div className="text-center text-white text-sm mb-2">
            Aperçu: {value} jetons
          </div>
          <div className="flex flex-wrap justify-center gap-1 max-h-24 overflow-hidden">
            {renderTokens}
            {value > 20 && (
              <div className="text-white text-xs mt-1">
                ... et {value - 20} de plus
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default React.memo(TokenSelector, (prevProps, nextProps) => {
  return prevProps.value === nextProps.value;
});
