import { CARD_FAMILIES, CARD_TYPES } from "./cardDefinitions";

// Cache pour les images chargées
const imageCache = new Map();

// Fonction de lazy loading pour les images
const loadImage = async (imagePath) => {
  if (imageCache.has(imagePath)) {
    return imageCache.get(imagePath);
  }

  try {
    const module = await import(`../assets/img/${imagePath}`);
    const image = module.default;
    imageCache.set(imagePath, image);
    return image;
  } catch (error) {
    console.error(`Erreur lors du chargement de l'image: ${imagePath}`, error);
    return null;
  }
};

// Fonction pour obtenir le chemin d'une carte
const getCardPath = (family, type, value = null) => {
  const familyPrefix = family === CARD_FAMILIES.SAND ? "sable" : "sang";

  switch (type) {
    case CARD_TYPES.SYLOP:
      return `${familyPrefix}_sylop.png`;
    case CARD_TYPES.IMPOSTOR:
      return `${familyPrefix}_imposteur.png`;
    case CARD_TYPES.NORMAL:
      return `${familyPrefix}_${value}.png`;
    default:
      return null;
  }
};

// Fonction pour obtenir le chemin du dos d'une carte
const getCardBackPath = (family) => {
  return family === CARD_FAMILIES.SAND ? "dos_sable.png" : "dos_sang.png";
};

// Fonction asynchrone pour obtenir l'image d'une carte
export const getCardImage = async (family, type, value = null) => {
  const path = getCardPath(family, type, value);
  if (!path) return null;
  return await loadImage(path);
};

// Fonction asynchrone pour obtenir le dos d'une carte
export const getCardBack = async (family) => {
  const path = getCardBackPath(family);
  return await loadImage(path);
};

// Fonction pour précharger les images critiques (cartes actuellement visibles)
export const preloadCriticalImages = async (criticalCards = []) => {
  const preloadPromises = criticalCards.map(({ family, type, value }) =>
    getCardImage(family, type, value)
  );

  // Précharger aussi les dos de cartes
  preloadPromises.push(getCardBack(CARD_FAMILIES.SAND));
  preloadPromises.push(getCardBack(CARD_FAMILIES.BLOOD));

  try {
    await Promise.all(preloadPromises);
  } catch (error) {
    console.error("Erreur lors du préchargement des images critiques:", error);
  }
};

// Fonction pour vider le cache (utile pour les tests ou la gestion mémoire)
export const clearImageCache = () => {
  imageCache.clear();
};

// Export de compatibilité synchrone (fallback vers un placeholder)
export const getCardImageSync = (family, type, value = null) => {
  const path = getCardPath(family, type, value);
  if (imageCache.has(path)) {
    return imageCache.get(path);
  }

  // Retourner un placeholder ou déclencher le chargement en arrière-plan
  getCardImage(family, type, value);
  return null; // Le composant devra gérer ce cas avec un skeleton/placeholder
};

export const getCardBackSync = (family) => {
  const path = getCardBackPath(family);
  if (imageCache.has(path)) {
    return imageCache.get(path);
  }

  // Retourner un placeholder ou déclencher le chargement en arrière-plan
  getCardBack(family);
  return null;
};
