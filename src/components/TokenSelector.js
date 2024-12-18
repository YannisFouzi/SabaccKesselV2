import React, { useEffect, useState } from "react";
import jeton from "../assets/img/jeton.png";
import jetonKo from "../assets/img/jeton_ko.png";

const TokenSelector = ({ value, onChange }) => {
  const MIN_TOKENS = 4;
  const MAX_TOKENS = 12;
  const [inputValue, setInputValue] = useState(value || "");

  const handleInputChange = (e) => {
    const newValue = e.target.value;
    if (newValue === "" || /^\d+$/.test(newValue)) {
      const numValue = parseInt(newValue, 10);

      if (!isNaN(numValue)) {
        if (numValue > MAX_TOKENS) {
          setInputValue(MAX_TOKENS.toString());
          onChange(MAX_TOKENS);
          return;
        }
      }

      setInputValue(newValue);
      if (numValue >= MIN_TOKENS && numValue <= MAX_TOKENS) {
        onChange(numValue);
      } else {
        onChange(null);
      }
    }
  };

  const isValid = value && value >= MIN_TOKENS && value <= MAX_TOKENS;

  // On utilise directement la valeur saisie pour le nombre de jetons
  const tokensToShow = value || 0;

  // Gardez en mémoire le nombre précédent de jetons pour l'animation
  const [previousTokens, setPreviousTokens] = useState(tokensToShow);

  // Utilisez useEffect pour mettre à jour previousTokens après chaque changement
  useEffect(() => {
    const timer = setTimeout(() => {
      setPreviousTokens(tokensToShow);
    }, 300); // Durée de l'animation
    return () => clearTimeout(timer);
  }, [tokensToShow]);

  // Calculez le nombre maximum de jetons à afficher
  const maxTokensToShow = Math.max(previousTokens, tokensToShow);

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="text-center">
        <span className="text-blue-200">
          {value && !isValid
            ? `Entre ${MIN_TOKENS} et ${MAX_TOKENS} jetons`
            : ""}
        </span>
      </div>

      <div className="flex flex-col items-center gap-4">
        <div className="relative flex-shrink-0">
          <div className="relative w-[400px] h-20 flex items-center justify-center">
            {[...Array(maxTokensToShow)].map((_, index) => {
              const shouldShow = index < tokensToShow;
              const isExiting = index >= tokensToShow && index < previousTokens;
              const exitDelay = isExiting
                ? (previousTokens - index - 1) * 0.02 // Pour que ça parte de droite à gauche
                : 0;

              return (
                <img
                  key={index}
                  src={isValid ? jeton : jetonKo}
                  alt=""
                  className={`absolute w-14 h-14 object-contain
                    transition-all duration-200 ease-in-out
                    hover:scale-110 ${isExiting ? "token-exit" : ""}`}
                  style={{
                    left: `${(index - maxTokensToShow / 2) * 30 + 200}px`,
                    zIndex: index,
                    opacity: shouldShow ? 0 : undefined,
                    animation: shouldShow
                      ? `fadeIn 0.3s ease-out ${index * 0.02}s forwards`
                      : isExiting
                      ? `fadeOut 0.3s ease-out ${exitDelay}s forwards`
                      : undefined,
                  }}
                />
              );
            })}
          </div>
        </div>

        <div className="flex flex-col items-center w-full max-w-[200px]">
          <div className="relative w-full">
            <input
              type="number"
              min={MIN_TOKENS}
              max={MAX_TOKENS}
              value={inputValue}
              onChange={handleInputChange}
              placeholder={"Jetons (min.4)"}
              className="w-full bg-white/10 border-2 border-white/20 rounded-xl 
                px-4 py-2 text-white placeholder-white/50 text-center
                focus:outline-none focus:border-white/40
                transition-all duration-200
                [appearance:textfield]
                [&::-webkit-outer-spin-button]:appearance-none
                [&::-webkit-inner-spin-button]:appearance-none"
            />
          </div>

          {value && !isValid && (
            <p className="text-red-400 text-sm mt-2 text-center">
              Entre {MIN_TOKENS} et {MAX_TOKENS} jetons
            </p>
          )}

          {/* Suggestions rapides */}
          <div className="flex justify-center flex-wrap gap-2 mt-3">
            {[4, 6, 8, 10, 12].map((amount) => (
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

// Définition des styles d'animation
const styles = `
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: scale(0.3) translateY(-20px);
    }
    to {
      opacity: 1;
      transform: scale(1) translateY(0);
    }
  }

  @keyframes fadeOut {
    from {
      opacity: 1;
      transform: scale(1) translateY(0);
    }
    to {
      opacity: 0;
      transform: scale(0.3) translateY(-20px);
    }
  }

  .token-exit {
    animation: fadeOut 0.3s ease-out forwards;
  }
`;

// Export du composant wrapper avec les styles
const TokenSelectorWithStyles = (props) => (
  <>
    <style>{styles}</style>
    <TokenSelector {...props} />
  </>
);

export default TokenSelectorWithStyles;
