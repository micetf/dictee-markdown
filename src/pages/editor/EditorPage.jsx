import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDictee } from "../../hooks/useDictee";
import DicteeForm from "../../components/dictee/DicteeForm";
import Button from "../../components/ui/Button";

/**
 * Page d'édition de dictée
 * @returns {JSX.Element} La page d'édition
 */
const EditorPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const {
        currentDictee,
        loadDictee,
        createDictee,
        updateDictee,
        exportToMarkdown,
        loading,
        error,
    } = useDictee();
    const [operationResult, setOperationResult] = useState({
        type: null,
        message: null,
    });

    // Charger la dictée si un ID est fourni
    useEffect(() => {
        if (id) {
            loadDictee(id);
        }
    }, [id, loadDictee]);

    /**
     * Gère la soumission du formulaire
     * @param {Object} dicteeData - Les données de la dictée
     */
    const handleSubmit = async (dicteeData) => {
        try {
            let savedId;

            if (id) {
                // Mise à jour
                await updateDictee({ ...dicteeData, id: Number(id) });
                savedId = id;
                setOperationResult({
                    type: "success",
                    message: "Dictée mise à jour avec succès !",
                });
            } else {
                // Création
                savedId = await createDictee(dicteeData);
                setOperationResult({
                    type: "success",
                    message: "Dictée créée avec succès !",
                });
            }

            // Rediriger vers la page de lecteur après quelques secondes
            setTimeout(() => {
                navigate(`/player/${savedId}`);
            }, 1500);
        } catch (err) {
            setOperationResult({
                type: "error",
                message: `Erreur: ${err.message || "Une erreur est survenue"}`,
            });
        }
    };

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

            setOperationResult({
                type: "success",
                message: "Dictée exportée avec succès !",
            });
        } catch (err) {
            setOperationResult({
                type: "error",
                message: `Erreur lors de l'exportation: ${
                    err.message || "Une erreur est survenue"
                }`,
            });
        }
    };

    const handleCancel = () => {
        navigate(-1);
    };

    // Déterminer les données initiales
    const initialData = id
        ? currentDictee
        : { title: "", sentences: [""], lang: "fr" };

    // Si on est en mode édition et que les données ne sont pas encore chargées
    if (id && loading && !currentDictee) {
        return (
            <div className="flex justify-center items-center p-8">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-6 flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900">
                    {id
                        ? `Modifier "${currentDictee?.title || "Dictée"}"`
                        : "Créer une nouvelle dictée"}
                </h1>

                {id && (
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
                        Exporter en Markdown
                    </Button>
                )}
            </div>

            {(error || operationResult.message) && (
                <div
                    className={`mb-6 p-4 rounded-md ${
                        error || operationResult.type === "error"
                            ? "bg-red-50 text-red-700 border border-red-200"
                            : "bg-green-50 text-green-700 border border-green-200"
                    }`}
                >
                    {error || operationResult.message}
                </div>
            )}

            <DicteeForm
                initialData={initialData}
                onSubmit={handleSubmit}
                onCancel={handleCancel}
                loading={loading}
            />
        </div>
    );
};

export default EditorPage;
