import React from "react";
import jetonImage from "../../assets/img/jeton.png";
import jetonKoImage from "../../assets/img/jeton_ko.png";

export const TokenDisplay = ({ count, type = "available" }) => {
  return (
    <div className="flex items-center gap-1">
      <div className="flex items-center gap-1">
        {[...Array(count)].map((_, index) => (
          <img
            key={index}
            src={type === "available" ? jetonImage : jetonKoImage}
            alt="Jeton"
            className="w-4 h-4 sm:w-5 sm:h-5"
          />
        ))}
      </div>
    </div>
  );
};

export const TokensRow = ({ availableTokens, betTokens }) => {
  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-1">
        {[...Array(availableTokens)].map((_, index) => (
          <img
            key={index}
            src={jetonImage}
            alt="Jeton disponible"
            className="w-4 h-4 sm:w-5 sm:h-5"
          />
        ))}
      </div>
      {betTokens > 0 && (
        <div className="flex items-center gap-1">
          {[...Array(betTokens)].map((_, index) => (
            <img
              key={index}
              src={jetonKoImage}
              alt="Jeton misé"
              className="w-4 h-4 sm:w-5 sm:h-5"
            />
          ))}
        </div>
      )}
    </div>
  );
};
