import { CARD_FAMILIES, CARD_TYPES } from "./cardDefinitions";

// Importons directement toutes les images
import cardBackSand from "../assets/img/dos_sable.png";
import cardBackBlood from "../assets/img/dos_sang.png";

// Import des cartes de sable
import sable1 from "../assets/img/sable_1.png";
import sable2 from "../assets/img/sable_2.png";
import sable3 from "../assets/img/sable_3.png";
import sable4 from "../assets/img/sable_4.png";
import sable5 from "../assets/img/sable_5.png";
import sable6 from "../assets/img/sable_6.png";
import sableImposteur from "../assets/img/sable_imposteur.png";
import sableSylop from "../assets/img/sable_sylop.png";

// Import des cartes de sang
import sang1 from "../assets/img/sang_1.png";
import sang2 from "../assets/img/sang_2.png";
import sang3 from "../assets/img/sang_3.png";
import sang4 from "../assets/img/sang_4.png";
import sang5 from "../assets/img/sang_5.png";
import sang6 from "../assets/img/sang_6.png";
import sangImposteur from "../assets/img/sang_imposteur.png";
import sangSylop from "../assets/img/sang_sylop.png";

export const CARD_IMAGES = {
  [CARD_FAMILIES.SAND]: {
    [CARD_TYPES.SYLOP]: sableSylop,
    [CARD_TYPES.IMPOSTOR]: sableImposteur,
    NORMAL: {
      1: sable1,
      2: sable2,
      3: sable3,
      4: sable4,
      5: sable5,
      6: sable6,
    },
    BACK: cardBackSand,
  },
  [CARD_FAMILIES.BLOOD]: {
    [CARD_TYPES.SYLOP]: sangSylop,
    [CARD_TYPES.IMPOSTOR]: sangImposteur,
    NORMAL: {
      1: sang1,
      2: sang2,
      3: sang3,
      4: sang4,
      5: sang5,
      6: sang6,
    },
    BACK: cardBackBlood,
  },
};

// Ajout des fonctions exportées
export const getCardImage = (family, type, value = null) => {
  if (type === CARD_TYPES.NORMAL) {
    return CARD_IMAGES[family].NORMAL[value];
  }
  return CARD_IMAGES[family][type];
};

export const getCardBack = (family) => {
  return CARD_IMAGES[family].BACK;
};
