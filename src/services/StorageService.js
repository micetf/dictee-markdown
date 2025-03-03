import Dexie from "dexie";

/**
 * Base de données IndexedDB pour les dictées
 */
class DicteeDatabase extends Dexie {
    constructor() {
        super("DicteeDatabase");
        this.version(1).stores({
            dictees: "++id, title, lang, createdAt, updatedAt",
        });
    }
}

const db = new DicteeDatabase();

/**
 * Service pour le stockage et la gestion des dictées
 */
class StorageService {
    /**
     * Sauvegarde une dictée dans la base de données
     * @param {Object} dictee - La dictée à sauvegarder
     * @returns {Promise<number>} L'id de la dictée sauvegardée
     */
    async saveDictee(dictee) {
        if (!dictee || !dictee.title) {
            throw new Error("Dictée invalide");
        }

        // Ajouter des timestamps
        const now = new Date();
        const dicteeWithMeta = {
            ...dictee,
            updatedAt: now,
            createdAt: dictee.createdAt || now,
        };

        return await db.dictees.put(dicteeWithMeta);
    }

    /**
     * Récupère une dictée par son id
     * @param {number} id - L'id de la dictée
     * @returns {Promise<Object>} La dictée récupérée
     */
    async getDictee(id) {
        if (!id) return null;
        return await db.dictees.get(Number(id));
    }

    /**
     * Récupère toutes les dictées
     * @returns {Promise<Array>} La liste des dictées
     */
    async getAllDictees() {
        return await db.dictees.toArray();
    }

    /**
     * Supprime une dictée
     * @param {number} id - L'id de la dictée à supprimer
     * @returns {Promise<void>}
     */
    async deleteDictee(id) {
        if (!id) throw new Error("ID non valide");
        return await db.dictees.delete(Number(id));
    }

    /**
     * Exporte une dictée au format Markdown
     * @param {number} id - L'id de la dictée
     * @param {Object} markdownService - Le service Markdown
     * @returns {Promise<string>} Le contenu Markdown
     */
    async exportToMarkdown(id, markdownService) {
        const dictee = await this.getDictee(id);
        if (!dictee) return null;

        return markdownService.generateMarkdown(dictee);
    }

    /**
     * Vérifie si la base de données contient des dictées
     * @returns {Promise<boolean>} True si des dictées existent
     */
    async hasDictees() {
        const count = await db.dictees.count();
        return count > 0;
    }

    /**
     * Récupère la dernière dictée modifiée
     * @returns {Promise<Object>} La dernière dictée
     */
    async getLatestDictee() {
        return await db.dictees.orderBy("updatedAt").reverse().first();
    }
}

export default new StorageService();
