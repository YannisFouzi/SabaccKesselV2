const FIRST_NAMES = [
  "Luna",
  "Nova",
  "Atlas",
  "Orion",
  "Stella",
  "Cosmos",
  "Phoenix",
  "Storm",
  "Echo",
  "Blaze",
  "Shadow",
  "Frost",
  "Ember",
  "River",
  "Sky",
  "Dawn",
  "Ash",
  "Rain",
  "Wolf",
  "Star",
  "Raven",
  "Cloud",
  "Sage",
  "Vale",
];

const LAST_NAMES = [
  "Walker",
  "Hunter",
  "Rider",
  "Seeker",
  "Weaver",
  "Dreamer",
  "Runner",
  "Keeper",
  "Master",
  "Knight",
  "Spirit",
  "Heart",
  "Soul",
  "Mind",
  "Light",
  "Shade",
  "Fire",
  "Wind",
  "Storm",
  "Moon",
  "Sun",
  "Star",
  "Dawn",
  "Dusk",
];

export const generateRandomName = () => {
  const firstName = FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)];
  const lastName = LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)];
  return `${firstName} ${lastName}`;
};
