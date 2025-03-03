/**
 * Service pour la gestion et la manipulation des fichiers Markdown
 */
class MarkdownService {
    /**
     * Convertit un contenu Markdown en objet dictée
     * @param {string} markdownContent - Le contenu Markdown à analyser
     * @returns {Object} La dictée extraite
     */
    parseMarkdown(markdownContent) {
        if (!markdownContent) {
            return { title: "Sans titre", sentences: [], lang: "fr" };
        }

        const lines = markdownContent.split("\n");

        // Extraire le titre (première ligne H1)
        const titleMatch = lines[0].match(/^# (.+)$/);
        const title = titleMatch ? titleMatch[1].trim() : "Sans titre";

        // Extraire la langue depuis les métadonnées (commentaire HTML)
        let lang = "fr"; // Valeur par défaut
        const langMatch = markdownContent.match(
            /<!--\s*lang:([a-z]{2}(?:-[A-Z]{2})?)\s*-->/
        );
        if (langMatch && langMatch[1]) {
            lang = langMatch[1].trim();
        }

        // Extraire les phrases (lignes numérotées)
        const sentences = [];
        const sentenceRegex = /^\d+\.\s+(.+)$/;

        for (let i = 1; i < lines.length; i++) {
            const match = lines[i].match(sentenceRegex);
            if (match) {
                sentences.push(match[1].trim());
            }
        }

        return {
            title,
            sentences,
            lang,
        };
    }

    /**
     * Convertit un objet dictée en Markdown
     * @param {Object} dictee - La dictée à convertir
     * @returns {string} Le contenu Markdown généré
     */
    generateMarkdown(dictee) {
        if (!dictee || !dictee.title || !dictee.sentences) {
            return "# Sans titre\n\n";
        }

        const { title, sentences, lang } = dictee;

        // Générer le Markdown avec métadonnées
        let markdown = `# ${title}\n`;

        // Ajouter la langue comme commentaire HTML si disponible
        if (lang) {
            markdown += `<!-- lang:${lang} -->\n`;
        }

        markdown += "\n";

        sentences.forEach((sentence, index) => {
            if (sentence && sentence.trim()) {
                markdown += `${index + 1}. ${sentence}\n`;
            }
        });

        return markdown;
    }

    /**
     * Convertit une ancienne URL en dictée
     * @param {string} url - L'URL à analyser
     * @returns {Object} La dictée extraite
     */
    parseOldUrl(url) {
        if (!url) {
            return { title: "Sans titre", sentences: [], lang: "fr" };
        }

        const params = new URLSearchParams(url.split("?")[1] || "");
        const title = params.get("titre") || "Sans titre";
        const lang = params.get("tl") || "fr";

        const sentences = [];
        for (let i = 1; i <= 20; i++) {
            const param = params.get(`d[${i}]`);
            if (param) {
                const codes = param.split("|");
                let sentence = "";

                codes.forEach((code) => {
                    if (code && code.trim()) {
                        sentence += String.fromCharCode(parseInt(code));
                    }
                });

                if (sentence.trim()) {
                    sentences.push(sentence);
                }
            }
        }

        return { title, sentences, lang };
    }

    /**
     * Détecte si une URL est une ancienne URL de dictée
     * @param {string} url - L'URL à vérifier
     * @returns {boolean} True si c'est une ancienne URL
     */
    isOldUrl(url) {
        if (!url) return false;

        const params = new URLSearchParams(url.split("?")[1] || "");
        // Cherche au moins un paramètre d[n]
        for (let i = 1; i <= 20; i++) {
            if (params.has(`d[${i}]`)) {
                return true;
            }
        }

        return false;
    }

    /**
     * Extrait les métadonnées d'un contenu Markdown
     * @param {string} markdownContent - Le contenu Markdown
     * @returns {Object} Les métadonnées extraites
     */
    extractMetadata(markdownContent) {
        if (!markdownContent) {
            return { lang: "fr" };
        }

        const metadata = { lang: "fr" };

        // Extraire la langue
        const langMatch = markdownContent.match(
            /<!--\s*lang:([a-z]{2}(?:-[A-Z]{2})?)\s*-->/
        );
        if (langMatch && langMatch[1]) {
            metadata.lang = langMatch[1].trim();
        }

        return metadata;
    }
}

export default new MarkdownService();
