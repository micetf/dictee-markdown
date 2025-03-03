# Guide de contribution

Merci de votre intérêt pour contribuer à Dictée Markdown ! Ce document vous guidera à travers les étapes nécessaires pour apporter votre contribution au projet.

## Code de conduite

Ce projet et tous ses participants sont régis par notre [Code de conduite](CODE_OF_CONDUCT.md). En participant, vous êtes tenu de respecter ce code.

## Comment puis-je contribuer ?

### Signaler des bugs

Les bugs sont suivis via les issues GitHub. Avant de créer une issue pour un bug :

1. Vérifiez que le bug n'a pas déjà été signalé
2. Assurez-vous d'utiliser la dernière version de l'application
3. Incluez autant de détails que possible :
    - Version du navigateur
    - OS/appareil utilisé
    - Étapes pour reproduire le bug
    - Comportement attendu vs comportement observé
    - Captures d'écran si pertinent

### Suggérer des améliorations

Les suggestions d'amélioration sont également bienvenues via les issues GitHub. Incluez :

1. Une description claire de l'amélioration
2. La motivation derrière cette suggestion
3. Comment cette amélioration bénéficierait aux utilisateurs
4. Des maquettes ou exemples si possible

### Pull Requests

Les pull requests sont le meilleur moyen de proposer des changements. Nous suivons le workflow GitHub standard :

1. Forkez le dépôt
2. Créez une branche pour votre fonctionnalité (`git checkout -b feature/amazing-feature`)
3. Effectuez vos changements
4. Commitez avec des messages clairs (`git commit -m 'Add some amazing feature'`)
5. Poussez vers la branche (`git push origin feature/amazing-feature`)
6. Ouvrez une Pull Request

#### Bonnes pratiques pour les Pull Requests

-   Suivez le style de code du projet
-   Mettez à jour la documentation si nécessaire
-   Assurez-vous que les tests passent
-   Incluez des tests pour les nouvelles fonctionnalités
-   Référencez les issues pertinentes dans la description

## Style de code

### JavaScript / React

-   Utilisez la syntaxe ES6+
-   Préférez les fonctions fléchées
-   Utilisez les hooks React au lieu des classes
-   Suivez les principes de composants fonctionnels purs quand possible
-   Utilisez la destructuration pour les props

### CSS / Tailwind

-   Suivez l'approche "utility-first" de Tailwind
-   Évitez le CSS personnalisé sauf quand nécessaire
-   Utilisez les variables CSS pour les thèmes
-   Suivez une convention de nommage cohérente pour les classes personnalisées

### Tests

-   Écrivez des tests unitaires pour les fonctions utilitaires
-   Écrivez des tests de composants pour les éléments d'interface critique
-   Visez une couverture de test d'au moins 70%

## Configuration de l'environnement de développement

### Prérequis

-   Node.js 18+
-   npm ou yarn
-   Un éditeur de texte moderne (VS Code recommandé)

### Installation

```bash
# Cloner le dépôt
git clone https://github.com/micetf/dictee-markdown.git
cd dictee-markdown

# Installer les dépendances
npm install

# Lancer en développement
npm run dev
```

### Structure du projet

Voir [GUIDE_TECHNIQUE.md](docs/GUIDE_TECHNIQUE.md) pour des détails sur la structure du projet.

### Scripts disponibles

-   `npm run dev` : lance le serveur de développement
-   `npm run build` : construit l'application pour la production
-   `npm run test` : exécute les tests
-   `npm run lint` : vérifie et corrige les problèmes de style
-   `npm run preview` : prévisualise la build de production localement

## Processus de release

Notre cycle de release fonctionne comme suit :

1. Les fonctionnalités sont développées dans des branches de fonctionnalités
2. Les pull requests sont fusionnées dans `develop`
3. Lorsqu'une version est prête, `develop` est fusionné dans `main`
4. Un tag de version est créé suivant [SemVer](https://semver.org/)
5. La documentation est mise à jour pour refléter les changements

## Documentation

La documentation est aussi importante que le code. Si vous ajoutez ou modifiez des fonctionnalités, mettez à jour la documentation correspondante.

Principaux documents à considérer :

-   `README.md` - Vue d'ensemble du projet
-   `docs/GUIDE_UTILISATION.md` - Guide utilisateur
-   `docs/GUIDE_TECHNIQUE.md` - Guide pour les développeurs
-   `docs/FORMAT_MARKDOWN.md` - Spécifications du format

## Communication

-   Pour les discussions techniques, utilisez les issues GitHub
-   Pour les questions générales, utilisez les discussions GitHub
-   Pour les idées ou feedback, vous pouvez contacter les mainteneurs à [webmaster@micetf.fr]

## Remerciements

Merci encore pour votre intérêt à contribuer ! Votre aide est précieuse pour améliorer cette application et la rendre plus utile pour tous les utilisateurs.

---

Si vous avez des questions sur ce guide, n'hésitez pas à ouvrir une issue ou à contacter un des mainteneurs du projet.
