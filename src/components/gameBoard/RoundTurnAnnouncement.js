import React, { useEffect, useState } from "react";

const RoundTurnAnnouncement = ({ round, turn }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    // Déclencher l'animation de sortie après 2 secondes
    const exitTimer = setTimeout(() => {
      setIsExiting(true);
    }, 2000);

    // Masquer complètement après 2.5 secondes (durée de l'animation de sortie)
    const hideTimer = setTimeout(() => {
      setIsVisible(false);
    }, 2500);

    return () => {
      clearTimeout(exitTimer);
      clearTimeout(hideTimer);
    };
  }, [round, turn]);

  if (!isVisible) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center pointer-events-none ${
        isExiting ? "fade-out" : ""
      }`}
    >
      {/* Overlay sombre avec flou */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

      <div className="relative">
        {/* Effet de particules et lueur */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#4f46e5_0%,transparent_70%)] opacity-40 animate-pulse" />
          <div className="absolute inset-0 bg-[conic-gradient(from_0deg,transparent,#4f46e5,transparent)] opacity-20 animate-spin-slow" />
        </div>

        {/* Cercles animés en arrière-plan */}
        <div className="absolute -inset-10 -z-20">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 border-2 border-indigo-500/30 rounded-full animate-ping" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 border-2 border-purple-500/20 rounded-full animate-ping animation-delay-300" />
        </div>

        <div className="text-center scale-in-center relative">
          <div className="text-7xl sm:text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 tracking-tight mb-4 animate-title drop-shadow-[0_0_15px_rgba(99,102,241,0.5)]">
            Manche {round}
          </div>
          <div className="text-5xl sm:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-yellow-300 tracking-tight animate-subtitle drop-shadow-[0_0_15px_rgba(245,158,11,0.5)]">
            Tour {turn}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoundTurnAnnouncement;

// Ajout des styles d'animation
const style = document.createElement("style");
style.textContent = `
@keyframes scale-in-center {
  0% {
    transform: scale(0);
    opacity: 0;
  }
  60% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

@keyframes slide-up {
  0% {
    transform: translateY(20px);
    opacity: 0;
  }
  100% {
    transform: translateY(0);
    opacity: 1;
  }
}

@keyframes fade-out {
  0% {
    opacity: 1;
    transform: scale(1);
  }
  100% {
    opacity: 0;
    transform: scale(1.2);
  }
}

.scale-in-center {
  animation: scale-in-center 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) both;
}

.animate-title {
  animation: scale-in-center 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) both;
}

.animate-subtitle {
  animation: slide-up 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.3s both;
}

.fade-out {
  animation: fade-out 0.5s ease-out forwards;
}

.animate-spin-slow {
  animation: spin 8s linear infinite;
}

.animation-delay-300 {
  animation-delay: 300ms;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
`;
document.head.appendChild(style);
