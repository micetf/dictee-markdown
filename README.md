# Dictée Markdown

Application web progressive (PWA) pour créer, gérer et pratiquer des dictées en utilisant le format Markdown.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

## Description

Dictée Markdown est une refonte moderne de l'application [micetf.fr/dictee](https://micetf.fr/dictee) qui utilise le format Markdown pour stocker et partager des dictées. Cette PWA peut être installée sur tous types d'appareils et fonctionne même hors ligne.

### Fonctionnalités principales

-   Création et édition de dictées au format Markdown
-   Importation/exportation de fichiers .md
-   Lecture vocale des dictées avec la synthèse vocale
-   Mode hors ligne complet
-   Migration automatique des dictées depuis l'ancien format

## Démo

[Essayer l'application](https://micetf.fr/dictee-markdown)

## Documentation

-   [Guide d'utilisation](docs/GUIDE_UTILISATION.md) - Pour les utilisateurs de l'application
-   [Guide technique](docs/GUIDE_TECHNIQUE.md) - Pour les développeurs
-   [Format Markdown](docs/FORMAT_MARKDOWN.md) - Spécifications du format de dictée
-   [Migration](docs/MIGRATION.md) - Comment migrer depuis l'ancienne version

## Installation

### Prérequis

-   Node.js 18+
-   npm ou yarn

### Installation en local

```bash
# Cloner le dépôt
git clone https://github.com/micetf/dictee-markdown.git
cd dictee-markdown

# Installer les dépendances
npm install

# Lancer en développement
npm run dev

# Construire pour la production
npm run build
```

## Déploiement

Une fois construite, l'application peut être déployée sur n'importe quel service d'hébergement statique (Netlify, Vercel, GitHub Pages, etc.).

## Architecture

Cette application est construite avec :

-   [React](https://reactjs.org/) - Bibliothèque UI
-   [Vite](https://vitejs.dev/) - Outil de build
-   [Tailwind CSS](https://tailwindcss.com/) - Framework CSS
-   [IndexedDB](https://developer.mozilla.org/fr/docs/Web/API/IndexedDB_API) - Stockage local
-   [Web Speech API](https://developer.mozilla.org/fr/docs/Web/API/Web_Speech_API) - Synthèse vocale

## Contribution

Les contributions sont les bienvenues ! Consultez [CONTRIBUTING.md](CONTRIBUTING.md) pour les détails.

## Licence

Ce projet est sous licence MIT - voir le fichier [LICENSE](LICENSE) pour plus de détails.

## Contact

Votre Nom - [@micetf](https://twitter.com/votre_twitter) - webmaster@micetf.fr

Lien du projet : [https://github.com/micetf/dictee-markdown](https://github.com/micetf/dictee-markdown)
