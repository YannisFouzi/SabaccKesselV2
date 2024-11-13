# Sabacc de Kessel

Un jeu de cartes inspiré du Sabacc, implémenté avec React.

## Technologies utilisées

- React
- Tailwind CSS
- shadcn/ui

## Installation

1. Clonez le repository
```bash
git clone [URL de votre repository]
```

2. Installez les dépendances
```bash
npm install
```

3. Lancez l'application en mode développement
```bash
npm start
```

## Règles du jeu

### Base du jeu
- 3 à 4 joueurs
- Chaque joueur commence avec un nombre défini de jetons
- Deux familles de cartes : Sable et Sang
- Chaque joueur doit avoir une carte de chaque famille

### Types de cartes
- Cartes normales (valeurs de 1 à 6)
- Sylops (adoptent la valeur de l'autre carte)
- Imposteurs (valeur déterminée par un lancer de dés)

### Déroulement
1. Une manche se joue en 3 tours
2. À chaque tour, un joueur peut :
   - Piocher une carte (coûte 1 jeton)
   - Passer son tour
3. La manche se termine quand :
   - Les 3 tours sont terminés
   - Tous les joueurs passent consécutivement

### Score
- L'objectif est d'avoir la plus petite paire de cartes
- Une paire de Sylops est la meilleure main possible
- Les perdants perdent des jetons selon leur main :
  - 1 jeton pour une paire
  - X jetons pour une différence de X
