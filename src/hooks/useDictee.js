import { useContext } from "react";
import { DicteeContext } from "../context/DicteeContext";

/**
 * Hook personnalisé pour accéder au contexte de dictée
 *
 * Fournit un accès aux données et fonctionnalités liées aux dictées :
 * - Liste des dictées (dictees)
 * - Dictée courante (currentDictee)
 * - État de chargement (loading)
 * - Gestion des erreurs (error)
 * - Méthodes pour créer, mettre à jour, supprimer, importer et exporter des dictées
 *
 * @returns {Object} Le contexte de dictée avec toutes ses fonctionnalités
 * @throws {Error} Si utilisé en dehors d'un DicteeProvider
 *
 * @example
 * // Dans un composant
 * const { dictees, loading, createDictee } = useDictee();
 *
 * // Utilisation
 * if (loading) return <Loader />;
 *
 * return (
 *   <button onClick={() => createDictee({ title: 'Nouvelle dictée', sentences: [] })}>
 *     Créer une dictée
 *   </button>
 * );
 */
export const useDictee = () => {
    const context = useContext(DicteeContext);

    if (!context) {
        throw new Error("useDictee doit être utilisé dans un DicteeProvider");
    }

    return context;
};
