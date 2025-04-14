# Carte des Humeurs Mondiale

Une application web interactive permettant aux utilisateurs de partager leur humeur sur une carte du monde.

## Prérequis

- Node.js (version 14 ou supérieure)
- Un compte Mapbox et un token d'accès

## Installation

1. Clonez le repository
2. Installez les dépendances :
```bash
npm install
```

3. Créez un fichier `.env.local` à la racine du projet et ajoutez votre token Mapbox :
```
NEXT_PUBLIC_MAPBOX_TOKEN=votre_token_mapbox_ici
```

## Lancement de l'application

Pour lancer l'application en mode développement :

```bash
npm run dev
```

L'application sera accessible à l'adresse : http://localhost:3000

## Fonctionnalités

- Carte interactive du monde
- Possibilité de cliquer sur la carte pour ajouter son humeur
- 5 niveaux d'humeur différents avec des icônes et couleurs distinctes
- Affichage des humeurs sous forme de marqueurs sur la carte 