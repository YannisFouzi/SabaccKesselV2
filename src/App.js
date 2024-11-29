import React, { useState } from "react";
import GameBoard from "./components/GameBoard";
import { GAME_CONFIG } from "./constants/gameConstants";
import LocalSetup from "./layouts/main/LocalSetup";
import MainMenu from "./layouts/main/MainMenu";
import Rules from "./layouts/main/Rules";

const App = () => {
  const [gameMode, setGameMode] = useState(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [playerCount, setPlayerCount] = useState(GAME_CONFIG.MIN_PLAYERS);
  const [tokenCount, setTokenCount] = useState(null);
  const [, setGameHistory] = useState([]);
  const [gameKey, setGameKey] = useState(0);
  const [playerNames, setPlayerNames] = useState(
    Array(GAME_CONFIG.MIN_PLAYERS).fill("")
  );
  const [playerAvatars, setPlayerAvatars] = useState(
    Array(GAME_CONFIG.MIN_PLAYERS).fill(null)
  );
  const [hasAttemptedStart, setHasAttemptedStart] = useState(false);
  const [withoutJokers, setWithoutJokers] = useState(false);

  // Fonction de validation des noms
  const validatePlayerName = (name) => {
    return (
      name.trim() !== "" &&
      name.length <= GAME_CONFIG.MAX_NAME_LENGTH &&
      /^[a-zA-Z0-9\s-_]+$/.test(name)
    );
  };

  // Mise à jour de la fonction de changement de nom
  const handleNameChange = (index, value) => {
    const newNames = [...playerNames];
    newNames[index] = value.slice(0, GAME_CONFIG.MAX_NAME_LENGTH);
    setPlayerNames(newNames);
  };

  // Nouvelle fonction pour gérer le changement d'avatar
  const handleAvatarChange = (index, avatarId) => {
    const newAvatars = [...playerAvatars];
    newAvatars[index] = avatarId;
    setPlayerAvatars(newAvatars);
  };

  // Mise à jour de la validation de configuration
  const isConfigValid =
    playerCount &&
    tokenCount &&
    playerNames.length === playerCount &&
    playerNames.every((name) => validatePlayerName(name)) &&
    playerAvatars.length === playerCount &&
    playerAvatars.every((avatar) => avatar !== null && avatar !== undefined);

  const handleGameEnd = (winners = []) => {
    if (winners.length > 0) {
      setGameHistory((prev) => [
        ...prev,
        {
          date: new Date(),
          winners: winners.map((w) => w.name),
          playerCount,
          tokenCount,
        },
      ]);
    }

    setGameStarted(false);
    setGameKey((prev) => prev + 1);
    setGameMode(null);
  };

  // Fonction pour ajouter un joueur
  const handleAddPlayer = () => {
    if (playerCount < GAME_CONFIG.MAX_PLAYERS) {
      const newCount = playerCount + 1;
      setPlayerCount(newCount);
      setPlayerNames((prev) => [...prev, ""]);
      setPlayerAvatars((prev) => [...prev, null]);
    }
  };

  // Fonction pour supprimer un joueur
  const handleRemovePlayer = (indexToRemove) => {
    if (playerCount > GAME_CONFIG.MIN_PLAYERS) {
      setPlayerCount(playerCount - 1);
      setPlayerNames((prev) =>
        prev.filter((_, index) => index !== indexToRemove)
      );
      setPlayerAvatars((prev) =>
        prev.filter((_, index) => index !== indexToRemove)
      );
    }
  };

  // Logique de rendu principal
  if (!gameMode && !gameStarted) {
    return <MainMenu setGameMode={setGameMode} />;
  }

  if (gameMode === "rules") {
    return <Rules setGameMode={setGameMode} />;
  }

  if (gameMode === "local" && !gameStarted) {
    return (
      <LocalSetup
        playerCount={playerCount}
        playerNames={playerNames}
        playerAvatars={playerAvatars}
        tokenCount={tokenCount}
        withoutJokers={withoutJokers}
        hasAttemptedStart={hasAttemptedStart}
        isConfigValid={isConfigValid}
        handleNameChange={handleNameChange}
        handleAvatarChange={handleAvatarChange}
        handleAddPlayer={handleAddPlayer}
        handleRemovePlayer={handleRemovePlayer}
        setTokenCount={setTokenCount}
        setWithoutJokers={setWithoutJokers}
        setGameMode={setGameMode}
        setGameStarted={setGameStarted}
        setPlayerCount={setPlayerCount}
        setPlayerNames={setPlayerNames}
        setPlayerAvatars={setPlayerAvatars}
        setHasAttemptedStart={setHasAttemptedStart}
      />
    );
  }

  if (gameStarted) {
    return (
      <GameBoard
        key={gameKey}
        playerCount={playerCount}
        tokenCount={tokenCount}
        playerNames={playerNames}
        playerAvatars={playerAvatars}
        onGameEnd={handleGameEnd}
        withoutJokers={withoutJokers}
      />
    );
  }

  return null;
};

export default App;
