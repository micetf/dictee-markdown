import { useState, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import { DicteeContext } from "./DicteeContext";
import StorageService from "../services/StorageService";
import MarkdownService from "../services/MarkdownService";
import SpeechService from "../services/SpeechService";

/**
 * Provider pour le contexte de dictée
 * @param {Object} props - Les propriétés du composant
 * @returns {JSX.Element} Le provider
 */
export const DicteeProvider = ({ children }) => {
    const [dictees, setDictees] = useState([]);
    const [currentDictee, setCurrentDictee] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [speechSupported, setSpeechSupported] = useState(false);
    const [initialized, setInitialized] = useState(false);

    /**
     * Initialise l'application
     */
    const initializeApp = useCallback(async () => {
        try {
            // Initialiser le service de synthèse vocale
            if (SpeechService.isSupported()) {
                await SpeechService.init();
                setSpeechSupported(true);
            }

            // Charger toutes les dictées
            const allDictees = await StorageService.getAllDictees();
            setDictees(allDictees);

            // Charger la dernière dictée utilisée si elle existe
            if (allDictees.length > 0) {
                const latestDictee = await StorageService.getLatestDictee();
                setCurrentDictee(latestDictee);
            }

            setInitialized(true);
        } catch (err) {
            console.error("Erreur lors de l'initialisation :", err);
            setError("Impossible d'initialiser l'application");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (!initialized) {
            initializeApp();
        }
    }, [initialized, initializeApp]);

    /**
     * Charge une dictée par son id
     * @param {number} id - L'id de la dictée
     */
    const loadDictee = useCallback(async (id) => {
        if (!id) return;

        try {
            setLoading(true);
            const dictee = await StorageService.getDictee(id);
            if (dictee) {
                setCurrentDictee(dictee);
            } else {
                setError(`Dictée introuvable (ID: ${id})`);
            }
        } catch (err) {
            console.error(`Erreur lors du chargement de la dictée ${id}:`, err);
            setError(`Impossible de charger la dictée (ID: ${id})`);
        } finally {
            setLoading(false);
        }
    }, []);

    /**
     * Crée une nouvelle dictée
     * @param {Object} dictee - La nouvelle dictée
     * @returns {Promise<number>} L'id de la dictée créée
     */
    const createDictee = useCallback(async (dictee) => {
        try {
            setLoading(true);
            const id = await StorageService.saveDictee(dictee);
            const newDictee = await StorageService.getDictee(id);
            setCurrentDictee(newDictee);

            // Mettre à jour la liste des dictées
            const allDictees = await StorageService.getAllDictees();
            setDictees(allDictees);

            return id;
        } catch (err) {
            console.error("Erreur lors de la création de la dictée:", err);
            setError("Impossible de créer la dictée");
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    /**
     * Met à jour une dictée existante
     * @param {Object} dictee - La dictée à mettre à jour
     */
    const updateDictee = useCallback(async (dictee) => {
        if (!dictee || !dictee.id) {
            setError("ID de dictée manquant pour la mise à jour");
            return;
        }

        try {
            setLoading(true);
            await StorageService.saveDictee(dictee);
            setCurrentDictee(dictee);

            // Mettre à jour la liste des dictées
            const allDictees = await StorageService.getAllDictees();
            setDictees(allDictees);
        } catch (err) {
            console.error(
                `Erreur lors de la mise à jour de la dictée ${dictee.id}:`,
                err
            );
            setError("Impossible de mettre à jour la dictée");
        } finally {
            setLoading(false);
        }
    }, []);

    /**
     * Supprime une dictée
     * @param {number} id - L'id de la dictée à supprimer
     */
    const deleteDictee = useCallback(
        async (id) => {
            if (!id) {
                setError("ID de dictée manquant pour la suppression");
                return;
            }

            try {
                setLoading(true);
                await StorageService.deleteDictee(id);

                // Si la dictée courante est celle supprimée, la réinitialiser
                if (currentDictee && currentDictee.id === id) {
                    setCurrentDictee(null);
                }

                // Mettre à jour la liste des dictées
                const allDictees = await StorageService.getAllDictees();
                setDictees(allDictees);
            } catch (err) {
                console.error(
                    `Erreur lors de la suppression de la dictée ${id}:`,
                    err
                );
                setError("Impossible de supprimer la dictée");
            } finally {
                setLoading(false);
            }
        },
        [currentDictee]
    );

    /**
     * Importe une dictée depuis un fichier Markdown
     * @param {string} markdownContent - Le contenu Markdown
     * @returns {Promise<number>} L'id de la dictée importée
     */
    const importFromMarkdown = useCallback(
        async (markdownContent) => {
            try {
                setLoading(true);
                const dictee = MarkdownService.parseMarkdown(markdownContent);
                const id = await createDictee(dictee);
                return id;
            } catch (err) {
                console.error(
                    "Erreur lors de l'importation de la dictée:",
                    err
                );
                setError(
                    "Impossible d'importer la dictée depuis le fichier Markdown"
                );
                throw err;
            } finally {
                setLoading(false);
            }
        },
        [createDictee]
    );

    /**
     * Exporte une dictée au format Markdown
     * @param {number} id - L'id de la dictée à exporter
     * @returns {Promise<string>} Le contenu Markdown
     */
    const exportToMarkdown = useCallback(
        async (id) => {
            try {
                if (!id && currentDictee) {
                    id = currentDictee.id;
                }

                if (!id) {
                    throw new Error(
                        "Aucune dictée sélectionnée pour l'exportation"
                    );
                }

                return await StorageService.exportToMarkdown(
                    id,
                    MarkdownService
                );
            } catch (err) {
                console.error(
                    "Erreur lors de l'exportation de la dictée:",
                    err
                );
                setError("Impossible d'exporter la dictée au format Markdown");
                throw err;
            }
        },
        [currentDictee]
    );

    /**
     * Importe depuis une ancienne URL
     * @param {string} url - L'ancienne URL
     * @returns {Promise<number>} L'id de la dictée importée
     */
    const importFromOldUrl = useCallback(
        async (url) => {
            try {
                setLoading(true);

                if (!MarkdownService.isOldUrl(url)) {
                    throw new Error(
                        "URL non reconnue comme ancienne URL de dictée"
                    );
                }

                const dictee = MarkdownService.parseOldUrl(url);
                const id = await createDictee(dictee);
                return id;
            } catch (err) {
                console.error(
                    "Erreur lors de l'importation depuis l'ancienne URL:",
                    err
                );
                setError("Impossible d'importer depuis l'ancienne URL");
                throw err;
            } finally {
                setLoading(false);
            }
        },
        [createDictee]
    );

    // Valeur du contexte
    const value = {
        dictees,
        currentDictee,
        loading,
        error,
        speechSupported,
        initialized,
        initializeApp,
        loadDictee,
        createDictee,
        updateDictee,
        deleteDictee,
        importFromMarkdown,
        exportToMarkdown,
        importFromOldUrl,
        setError: (msg) => setError(msg),
        clearError: () => setError(null),
    };

    return (
        <DicteeContext.Provider value={value}>
            {children}
        </DicteeContext.Provider>
    );
};

DicteeProvider.propTypes = {
    children: PropTypes.node.isRequired,
};
