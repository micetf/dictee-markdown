import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDictee } from "../../hooks/useDictee";
import DicteePlayer from "../../components/dictee/DicteePlayer";
import Button from "../../components/ui/Button";

/**
 * Page du lecteur de dictée
 * @returns {JSX.Element} La page du lecteur
 */
const PlayerPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const {
        currentDictee,
        loadDictee,
        exportToMarkdown,
        loading,
        error,
        speechSupported,
    } = useDictee();

    // Charger la dictée
    useEffect(() => {
        if (id) {
            loadDictee(id);
        }
    }, [id, loadDictee]);

    /**
     * Télécharge la dictée au format Markdown
     */
    const handleExportMarkdown = async () => {
        try {
            const markdown = await exportToMarkdown(id);

            // Créer un blob et un lien de téléchargement
            const blob = new Blob([markdown], { type: "text/markdown" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `${currentDictee.title || "dictee"}.md`;
            document.body.appendChild(a);
            a.click();

            // Nettoyer
            setTimeout(() => {
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
            }, 100);
        } catch (err) {
            console.error("Erreur lors de l'exportation:", err);
            // Gérer l'erreur si nécessaire
        }
    };

    /**
     * Gère la fin de la dictée
     * @param {Array} results - Les résultats de la dictée
     * @param {Object} score - Le score obtenu
     */
    const handleFinish = (results, score) => {
        console.log("Dictée terminée", { results, score });
        // Vous pouvez implémenter une logique supplémentaire ici
    };

    // Si les données sont en cours de chargement
    if (loading && !currentDictee) {
        return (
            <div className="flex justify-center items-center p-8">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    // Si la dictée n'a pas été trouvée
    if (!loading && !currentDictee) {
        return (
            <div className="max-w-4xl mx-auto text-center">
                <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-md p-6">
                    <h2 className="text-xl font-bold mb-2">
                        Dictée introuvable
                    </h2>
                    <p className="mb-4">
                        La dictée demandée n&lsquo;a pas été trouvée. Elle a
                        peut-être été supprimée ou l&lsquo;identifiant est
                        incorrect.
                    </p>
                    <Button variant="primary" onClick={() => navigate("/")}>
                        Retour à l&lsquo;accueil
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-6 flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900">
                    Dictée : {currentDictee?.title || "Sans titre"}
                </h1>

                <div className="flex space-x-3">
                    <Button
                        variant="outline"
                        onClick={() => navigate(`/editor/${id}`)}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 mr-2"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                        >
                            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                        </svg>
                        Modifier
                    </Button>
                    <Button
                        variant="outline"
                        onClick={handleExportMarkdown}
                        disabled={loading}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 mr-2"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                        >
                            <path
                                fillRule="evenodd"
                                d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                                clipRule="evenodd"
                            />
                        </svg>
                        Exporter
                    </Button>
                </div>
            </div>

            {error && (
                <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-md border border-red-200">
                    {error}
                </div>
            )}

            {!speechSupported && (
                <div className="mb-6 p-4 bg-yellow-50 text-yellow-700 rounded-md border border-yellow-200">
                    <p className="font-medium">
                        La synthèse vocale n&lsquo;est pas supportée par votre
                        navigateur.
                    </p>
                    <p className="mt-1">
                        Certaines fonctionnalités de l&lsquo;application
                        pourraient ne pas fonctionner correctement.
                    </p>
                </div>
            )}

            {currentDictee && (
                <DicteePlayer dictee={currentDictee} onFinish={handleFinish} />
            )}
        </div>
    );
};

export default PlayerPage;
