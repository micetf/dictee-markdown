# Format Markdown pour les dictées

Ce document spécifie le format Markdown utilisé pour stocker et partager les dictées dans l'application.

## Format de base

Une dictée au format Markdown suit cette structure :

```markdown
# Titre de la dictée

<!-- lang:fr -->

1. Première phrase de la dictée.
2. Deuxième phrase de la dictée.
3. Troisième phrase de la dictée.
```

## Spécifications détaillées

### Titre

-   Le titre doit être précédé d'un `#` et un espace
-   Il doit apparaître sur la première ligne non vide du document
-   Un seul titre par document est autorisé
-   Exemple : `# Les mois de l'année`

### Métadonnées

Les métadonnées peuvent être ajoutées de deux façons :

#### 1. Commentaires HTML (Recommandé)

Pour une meilleure compatibilité avec tous les éditeurs Markdown, utilisez des commentaires HTML pour les métadonnées essentielles :

```markdown
# Titre de la dictée

<!-- lang:fr-FR -->

1. Première phrase.
```

#### 2. YAML Frontmatter (Avancé)

Pour des métadonnées plus complètes, vous pouvez utiliser le format YAML frontmatter :

```markdown
---
language: fr-FR
random: true
author: Prénom Nom
created: 2023-04-15
---

# Titre de la dictée

1. Première phrase.
```

**Note importante** : L'application privilégie les métadonnées au format commentaire HTML pour la langue. Si les deux formats sont présents, le commentaire HTML sera prioritaire.

#### Métadonnées supportées

| Clé      | Description          | Valeurs possibles              | Par défaut    |
| -------- | -------------------- | ------------------------------ | ------------- |
| language | Code de langue       | Codes ISO (ex: fr-FR, en-US)   | fr            |
| random   | Ordre aléatoire      | true/false                     | false         |
| author   | Auteur de la dictée  | Texte                          | Non défini    |
| created  | Date de création     | YYYY-MM-DD                     | Date actuelle |
| tags     | Mots-clés associés   | Liste séparée par des virgules | Non défini    |
| level    | Niveau de difficulté | easy, medium, hard             | medium        |
| category | Catégorie thématique | Texte                          | Non défini    |

### Langue de la dictée

La langue est indiquée juste après le titre, avant les phrases :

```markdown
# Titre de la dictée

<!-- lang:fr -->

1. Première phrase de la dictée.
2. Deuxième phrase de la dictée.
```

Les codes de langue valides incluent :

-   Codes courts : `fr`, `en`, `es`, `de`, `it`
-   Codes régionaux : `fr-FR`, `fr-CA`, `en-US`, `en-GB`, `es-ES`, etc.

La langue spécifiée sera utilisée pour configurer la synthèse vocale lors de la lecture de la dictée.

### Phrases

-   Chaque phrase doit commencer par un numéro suivi d'un point et d'un espace (`1. `)
-   Les phrases sont numérotées séquentiellement à partir de 1
-   Chaque phrase doit apparaître sur une ligne distincte
-   Une phrase peut contenir des formatages Markdown (gras, italique, etc.)
-   Exemple : `1. Voici **une** phrase avec du *formatage*. `

## Extensions et formatages

### Formatage du texte

Les dictées peuvent utiliser les éléments de formatage Markdown suivants :

-   **Gras** : `**texte en gras**` ou `__texte en gras__`
-   _Italique_ : `*texte en italique*` ou `_texte en italique_`
-   **_Gras et italique_** : `**_texte en gras et italique_**`
-   ~~Barré~~ : `~~texte barré~~`
-   `Code` : `` `code` ``

Ces formatages peuvent être utiles pour mettre en évidence certains éléments grammaticaux ou orthographiques.

### Annotations pédagogiques

Des annotations pédagogiques peuvent être ajoutées entre crochets après une phrase :

```markdown
1. Cette phrase contient un participe passé. [Attention à l'accord]
2. Voici une phrase avec des homophones. [Distinguer "est" et "et"]
```

### Groupes de mots

Pour les dictées de mots (par opposition aux phrases complètes), utilisez cette syntaxe :

```markdown
# Dictée de mots - Homophones

<!-- lang:fr -->

1. ver, verre, vers, vert
2. mer, mère, maire
3. pain, pin, peint
```

## Exemples complets

### Exemple 1 : Dictée simple

```markdown
# Les saisons

<!-- lang:fr -->

1. L'hiver est la saison la plus froide de l'année.
2. Au printemps, les fleurs commencent à éclore.
3. L'été est caractérisé par des journées chaudes et ensoleillées.
4. En automne, les feuilles des arbres changent de couleur et tombent.
```

### Exemple 2 : Dictée avec métadonnées et formatage

```markdown
---
random: false
author: Jean Dupont
created: 2023-05-12
tags: grammaire, accord, participe passé
level: medium
category: Règles grammaticales
---

# Les participes passés

<!-- lang:fr-FR -->

1. Les fleurs que j'ai **cueillies** sont magnifiques.
2. Ma sœur est **partie** en voyage hier soir.
3. Les efforts qu'ils ont **fournis** ont été récompensés.
4. Elles se sont **regardées** en souriant.
```

### Exemple 3 : Dictée de mots en anglais

```markdown
# Days of the week

<!-- lang:en-US -->

1. Monday
2. Tuesday
3. Wednesday
4. Thursday
5. Friday
6. Saturday
7. Sunday
```

## Validation et compatibilité

### Validation

Un document de dictée est considéré valide s'il contient au minimum :

-   Un titre précédé de `#`
-   Au moins une phrase numérotée

### Compatibilité

Les fichiers Markdown sans métadonnées de langue seront toujours reconnus, et la langue sera définie par défaut à "fr" (français).

### Compatibilité avec d'autres applications

Le format choisi est compatible avec la plupart des éditeurs et visualiseurs Markdown :

-   Visual Studio Code
-   Typora
-   Obsidian
-   GitLab/GitHub Markdown
-   Notion (avec quelques limitations pour les métadonnées)

La métadonnée de langue au format commentaire HTML est invisible dans la plupart des prévisualisations Markdown, ce qui préserve la lisibilité du document.

## Migration depuis l'ancien format

Pour convertir une dictée depuis l'ancien format URL, utilisez la fonction de migration de l'application. Les étapes sont détaillées dans le [guide de migration](MIGRATION.md).

## Bonnes pratiques

-   Limitez les dictées à 20 phrases maximum pour une expérience utilisateur optimale
-   Utilisez un titre concis et descriptif
-   Spécifiez toujours la langue pour une meilleure expérience avec la synthèse vocale
-   Pour les dictées pédagogiques, incluez le niveau scolaire dans les métadonnées
-   Évitez d'utiliser des caractères spéciaux qui pourraient causer des problèmes d'encodage
-   Vérifiez toujours la dictée avec la fonction de prévisualisation avant de la partager
