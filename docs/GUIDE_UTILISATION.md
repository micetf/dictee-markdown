# Guide d'utilisation - Dictée Markdown

Ce guide explique comment utiliser l'application Dictée Markdown pour créer, modifier, partager et pratiquer des dictées.

## Table des matières

-   [Démarrage](#démarrage)
-   [Création d'une dictée](#création-dune-dictée)
-   [Importation d'une dictée](#importation-dune-dictée)
-   [Utilisation du mode dictée](#utilisation-du-mode-dictée)
-   [Synthèse vocale](#synthèse-vocale)
-   [Sauvegarde et partage](#sauvegarde-et-partage)
-   [Utilisation hors ligne](#utilisation-hors-ligne)
-   [Migration depuis l'ancienne version](#migration-depuis-lancienne-version)
-   [FAQ](#faq)

## Démarrage

1. Accédez à l'application via [micetf.fr/dictee-markdown](https://micetf.fr/dictee-markdown)
2. Pour une utilisation optimale, installez l'application sur votre appareil :
    - Sur ordinateur : Cliquez sur l'icône d'installation dans la barre d'adresse du navigateur
    - Sur mobile : Utilisez l'option "Ajouter à l'écran d'accueil" dans le menu du navigateur

## Création d'une dictée

### Méthode 1 : Éditeur intégré

1. Cliquez sur "Nouvelle dictée"
2. Saisissez un titre dans le champ prévu
3. Ajoutez chaque phrase de la dictée, une par ligne
4. L'application numérotera automatiquement les phrases
5. Cliquez sur "Enregistrer" pour sauvegarder votre dictée

### Méthode 2 : Édition directe en Markdown

1. Cliquez sur "Nouvelle dictée"
2. Cliquez sur "Mode Markdown"
3. Saisissez votre dictée au format Markdown :

    ```markdown
    # Titre de la dictée

    1. Première phrase.
    2. Deuxième phrase.
    3. Troisième phrase.
    ```

4. Cliquez sur "Enregistrer"

## Importation d'une dictée

### Depuis un fichier Markdown

1. Cliquez sur "Importer"
2. Sélectionnez un fichier .md depuis votre appareil
3. L'application analysera le fichier et chargera la dictée

### Depuis une URL

1. Cliquez sur "Importer depuis URL"
2. Collez l'URL d'un fichier Markdown (Google Drive, Dropbox, GitHub, etc.)
3. Cliquez sur "Charger"

## Utilisation du mode dictée

1. Ouvrez une dictée
2. Cliquez sur "Commencer la dictée"
3. Écoutez chaque phrase en cliquant sur "Écouter"
4. Saisissez le texte dans le champ prévu
5. Validez avec "Entrée" ou en cliquant sur "Valider"
6. L'application corrigera automatiquement votre saisie
7. Continuez jusqu'à la fin de la dictée
8. Consultez vos résultats dans le récapitulatif final

## Synthèse vocale

### Réglages de la voix

-   Réglez la vitesse de lecture avec le curseur prévu
-   Choisissez la voix dans le menu déroulant (si plusieurs voix sont disponibles)
-   Testez les paramètres avec le bouton "Tester la voix"

### Utilisation pendant la dictée

-   Cliquez sur "Écouter" pour entendre la phrase actuelle
-   Utilisez "Répéter" pour réécouter
-   La phrase en cours de lecture sera mise en surbrillance

## Sauvegarde et partage

### Téléchargement d'une dictée

1. Ouvrez la dictée souhaitée
2. Cliquez sur "Télécharger"
3. Un fichier .md sera généré et téléchargé sur votre appareil

### Partage d'une dictée

1. Ouvrez la dictée souhaitée
2. Cliquez sur "Partager"
3. Choisissez une méthode de partage :
    - Lien direct (URL avec paramètres)
    - QR Code
    - Services cloud (Google Drive, Dropbox, etc.)

## Utilisation hors ligne

L'application fonctionne entièrement hors ligne une fois chargée :

1. Toutes vos dictées sont sauvegardées localement
2. La synthèse vocale fonctionne sans connexion
3. L'importation et l'exportation de fichiers restent disponibles

Pour assurer la disponibilité hors ligne :

-   Visitez l'application au moins une fois avec une connexion internet
-   Installez l'application sur votre appareil pour un accès optimal

## Migration depuis l'ancienne version

Si vous utilisez l'ancienne version de Dictée :

1. Ouvrez votre dictée dans l'ancienne application
2. Copiez l'URL complète
3. Dans Dictée Markdown, cliquez sur "Migrer une ancienne dictée"
4. Collez l'URL complète
5. L'application convertira automatiquement la dictée au format Markdown

## FAQ

**Q: Puis-je utiliser des styles (gras, italique) dans mes dictées ?**  
R: Oui, le format Markdown supporte le formatage comme **gras** et _italique_.

**Q: Comment gérer plusieurs dictées ?**  
R: L'application offre un gestionnaire de dictées où vous pouvez organiser, modifier et supprimer vos dictées.

**Q: Mes dictées sont-elles sauvegardées en ligne ?**  
R: Par défaut, les dictées sont stockées uniquement sur votre appareil. Pour les sauvegarder en ligne, utilisez l'option d'exportation vers un service cloud.

**Q: La synthèse vocale ne fonctionne pas, que faire ?**  
R: Vérifiez que votre navigateur supporte la Web Speech API et que le son n'est pas coupé. Certains navigateurs nécessitent une interaction utilisateur avant de permettre la synthèse vocale.

**Q: Comment puis-je contribuer au projet ?**  
R: Le code source est disponible sur [GitHub](https://github.com/micetf/dictee-markdown). Consultez CONTRIBUTING.md pour plus d'informations.
