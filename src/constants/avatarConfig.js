// Import de tous les avatars disponibles
import admiralAckbar from "../assets/img/avatar/admiral-ackbar.png";
import bobaFett from "../assets/img/avatar/boba-fett.png";
import c3po from "../assets/img/avatar/c3p0.png";
import darthVader from "../assets/img/avatar/darth-vader.png";
import palpatine from "../assets/img/avatar/emperor-palpatine.png";
import hanSolo from "../assets/img/avatar/han-solo.png";
import lando from "../assets/img/avatar/lando-calrissian.png";
import lukeSkywalker from "../assets/img/avatar/luke-skywalker.png";
import obiWanKenobi from "../assets/img/avatar/obiwan-kenobi.png";
import leiaOrgana from "../assets/img/avatar/princess-leia.png";
import r2d2 from "../assets/img/avatar/r2d2.png";
import yoda from "../assets/img/avatar/yoda.png";

// Configuration des avatars pour le sélecteur
export const AVATAR_LIST = [
  { id: 1, src: admiralAckbar, name: "Admiral Ackbar" },
  { id: 2, src: bobaFett, name: "Boba Fett" },
  { id: 3, src: c3po, name: "C-3PO" },
  { id: 4, src: darthVader, name: "Darth Vader" },
  { id: 5, src: hanSolo, name: "Han Solo" },
  { id: 6, src: lando, name: "Lando Calrissian" },
  { id: 7, src: leiaOrgana, name: "Leia Organa" },
  { id: 8, src: lukeSkywalker, name: "Luke Skywalker" },
  { id: 9, src: obiWanKenobi, name: "Obi-Wan Kenobi" },
  { id: 10, src: palpatine, name: "Emperor Palpatine" },
  { id: 11, src: r2d2, name: "R2-D2" },
  { id: 12, src: yoda, name: "Yoda" },
];

// Mapping des avatars pour l'affichage
export const AVATAR_MAP = AVATAR_LIST.reduce((acc, avatar) => {
  acc[avatar.id] = avatar.src;
  return acc;
}, {});
