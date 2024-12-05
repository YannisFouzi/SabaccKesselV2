/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(-10px) scale(0.95)" },
          "100%": { opacity: "1", transform: "translateY(0) scale(1)" },
        },
        glowPulse: {
          "0%": {
            boxShadow: "0 0 0 0 rgba(255, 255, 255, 0.4)",
            transform: "scale(1)",
          },
          "70%": {
            boxShadow: "0 0 0 10px rgba(255, 255, 255, 0)",
            transform: "scale(1.05)",
          },
          "100%": {
            boxShadow: "0 0 0 0 rgba(255, 255, 255, 0)",
            transform: "scale(1)",
          },
        },
        floatBounce: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-5px)" },
        },
        wiggle: {
          "0%, 100%": { transform: "rotate(-3deg)" },
          "50%": { transform: "rotate(3deg)" },
        },
      },
      animation: {
        fadeIn: "fadeIn 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
        glowPulse: "glowPulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        floatBounce: "floatBounce 2s ease-in-out infinite",
        wiggle: "wiggle 1s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
