# Guide de migration - De l'ancienne dictée au format Markdown

Ce document explique comment migrer des dictées depuis l'ancienne version de l'application (basée sur les paramètres URL) vers le nouveau format Markdown.

## Comprendre l'ancien format

Dans l'ancienne version de l'application, les dictées étaient stockées dans l'URL sous forme de paramètres :

```
https://micetf.fr/dictee/?tl=fr&titre=Les+mois+de+l%27ann%C3%A9e&d[1]=106|97|110|118|105|101|114|&d[2]=102|233|118|114|105|101|114|&d[3]=109|97|114|115|
```

Où :

-   `tl` est le code de langue (fr, en, es, de, it)
-   `titre` est le titre de la dictée (encodé en URL)
-   `d[1]`, `d[2]`, etc. sont les phrases encodées en valeurs ASCII séparées par des barres verticales

## Méthodes de migration

### 1. Migration automatique via l'outil intégré

L'application Dictée Markdown intègre un outil de migration automatique :

1. Dans l'application, cliquez sur "Migrer une ancienne dictée"
2. Collez l'URL complète de l'ancienne dictée
3. Cliquez sur "Convertir"
4. L'application analysera l'URL, décodera les phrases et générera la version Markdown
5. Vérifiez le résultat et cliquez sur "Enregistrer" pour sauvegarder la dictée

### 2. Migration manuelle

Si vous préférez migrer manuellement :

1. Ouvrez l'ancienne dictée dans votre navigateur
2. Notez le titre
3. Listez toutes les phrases en utilisant le bouton "Écouter" pour chacune
4. Créez un nouveau fichier Markdown avec la structure correcte :

    ```markdown
    # Titre de la dictée

    1. Première phrase
    2. Deuxième phrase
       ...
    ```

5. Importez ce fichier dans la nouvelle application

## Décodage de l'ancien format

Pour les utilisateurs techniques qui souhaitent comprendre ou implémenter leur propre décodeur :

### Processus de décodage

```javascript
// Décode une phrase depuis l'ancien format
function decodeOldPhrase(encodedPhrase) {
    // Divise la chaîne en codes ASCII séparés par |
    const codes = encodedPhrase.split("|");

    // Convertit chaque code en caractère et les joint
    return codes
        .filter((code) => code !== "")
        .map((code) => String.fromCharCode(parseInt(code, 10)))
        .join("");
}

// Exemple d'utilisation
const oldEncodedPhrase = "106|97|110|118|105|101|114|";
const decodedPhrase = decodeOldPhrase(oldEncodedPhrase);
console.log(decodedPhrase); // "janvier"
```

### Exemple de conversion complète

```javascript
// Convertit une URL complète en objet dictée
function convertOldUrlToDictee(url) {
    // Extrait les paramètres de l'URL
    const params = new URLSearchParams(url.split("?")[1]);

    // Récupère le titre (décode l'URL encoding)
    const title = decodeURIComponent(params.get("titre") || "Sans titre");

    // Récupère la langue
    const language = params.get("tl") || "fr";

    // Tableau pour stocker les phrases décodées
    const sentences = [];

    // Parcourt les paramètres d[1] à d[20]
    for (let i = 1; i <= 20; i++) {
        const encodedPhrase = params.get(`d[${i}]`);
        if (encodedPhrase) {
            const decodedPhrase = decodeOldPhrase(encodedPhrase);
            if (decodedPhrase) {
                sentences.push(decodedPhrase);
            }
        }
    }

    // Conversion au format Markdown
    let markdown = `# ${title}\n\n`;
    sentences.forEach((sentence, index) => {
        markdown += `${index + 1}. ${sentence}\n`;
    });

    return markdown;
}
```

## Mapping des codes de langue

Le tableau suivant montre la correspondance entre les anciens codes de langue et les nouveaux :

| Ancien code | Nouveau code |
| ----------- | ------------ |
| fr          | fr-FR        |
| en          | en-US        |
| es          | es-ES        |
| de          | de-DE        |
| it          | it-IT        |

## Limites et considérations

### Limites de la migration automatique

-   Les formatages spéciaux (gras, italique) ne sont pas présents dans l'ancien format et ne seront donc pas récupérés
-   Les métadonnées avancées (auteur, niveau, etc.) devront être ajoutées manuellement
-   Le paramètre d'ordre aléatoire (`a=1`) est converti, mais d'autres paramètres peuvent être perdus

### Avantages du nouveau format

-   Meilleure lisibilité
-   URLs plus courtes
-   Possibilité d'ajouter des métadonnées et du formatage
-   Compatibilité avec des éditeurs Markdown externes
-   Stockage local ou cloud du fichier .md

## FAQ sur la migration

**Q : Puis-je migrer plusieurs dictées à la fois ?**  
R : Non, l'outil de migration traite une dictée à la fois. Pour les utilisateurs avec de nombreuses dictées, contactez-nous pour une solution personnalisée.

**Q : Les anciennes URLs continueront-elles à fonctionner ?**  
R : Oui, pour assurer la compatibilité, les anciennes URLs resteront fonctionnelles, mais un message vous invitera à migrer vers le nouveau format.

**Q : Que se passe-t-il si la conversion échoue ?**  
R : L'application affichera un message d'erreur précis. Vous pourrez alors essayer la méthode de migration manuelle ou nous contacter pour obtenir de l'aide.

**Q : Comment partager mes dictées migrées ?**  
R : Après la migration, vous pouvez télécharger le fichier Markdown et le partager par e-mail, services cloud ou via l'URL directe générée par l'application.

## Ressources supplémentaires

-   [Guide d'utilisation](GUIDE_UTILISATION.md) - Pour en savoir plus sur l'utilisation de la nouvelle application
-   [Format Markdown](FORMAT_MARKDOWN.md) - Documentation détaillée du format Markdown utilisé
-   [Exemples de dictées](https://github.com/micetf/dictee-markdown/tree/main/examples) - Collection d'exemples au format Markdown
