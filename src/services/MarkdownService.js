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
            lang: "fr", // Par défaut
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

        const { title, sentences } = dictee;

        let markdown = `# ${title}\n\n`;

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
}

export default new MarkdownService();
