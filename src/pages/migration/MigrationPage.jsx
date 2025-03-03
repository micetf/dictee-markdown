import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDictee } from "../../hooks/useDictee";
import Button from "../../components/ui/Button";
import TextField from "../../components/ui/TextField";
import MarkdownService from "../../services/MarkdownService";

/**
 * Page de migration depuis l'ancien format
 * @returns {JSX.Element} La page de migration
 */
const MigrationPage = () => {
    const { importFromOldUrl, loading, error } = useDictee();
    const [url, setUrl] = useState("");
    const [previewData, setPreviewData] = useState(null);
    const [operationResult, setOperationResult] = useState({
        type: null,
        message: null,
    });
    const navigate = useNavigate();

    /**
     * Génère une prévisualisation de l'URL
     */
    const handleUrlPreview = () => {
        if (!url.trim()) {
            setOperationResult({
                type: "error",
                message: "Veuillez saisir une URL valide",
            });
            return;
        }

        try {
            if (!MarkdownService.isOldUrl(url)) {
                setOperationResult({
                    type: "error",
                    message:
                        "Format d'URL non reconnu. Vérifiez que c'est bien une ancienne URL de dictée.",
                });
                return;
            }

            const dicteeData = MarkdownService.parseOldUrl(url);
            setPreviewData(dicteeData);
            setOperationResult({
                type: "success",
                message: "URL analysée avec succès !",
            });
        } catch (err) {
            setOperationResult({
                type: "error",
                message: `Erreur lors de l'analyse de l'URL : ${
                    err.message || "Une erreur est survenue"
                }`,
            });
        }
    };

    /**
     * Importe depuis l'URL
     */
    const handleImportFromUrl = async () => {
        try {
            const id = await importFromOldUrl(url);
            setOperationResult({
                type: "success",
                message: "Dictée importée avec succès !",
            });

            // Rediriger vers la page du lecteur après quelques secondes
            setTimeout(() => {
                navigate(`/player/${id}`);
            }, 1500);
        } catch (err) {
            setOperationResult({
                type: "error",
                message: `Erreur lors de l'importation : ${
                    err.message || "Une erreur est survenue"
                }`,
            });
        }
    };

    /**
     * Télécharge la dictée au format Markdown
     */
    const handleDownloadMarkdown = () => {
        if (!previewData) return;

        const markdown = MarkdownService.generateMarkdown(previewData);

        // Créer un blob et un lien de téléchargement
        const blob = new Blob([markdown], { type: "text/markdown" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${previewData.title || "dictee"}.md`;
        document.body.appendChild(a);
        a.click();

        // Nettoyer
        setTimeout(() => {
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }, 100);
    };

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">
                Migration depuis l&lsquo;ancien format
            </h1>

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

            <div className="bg-white shadow-md rounded-lg overflow-hidden mb-8">
                <div className="p-6">
                    <p className="mb-4 text-gray-600">
                        Collez une ancienne URL de dictée pour la convertir au
                        nouveau format Markdown.
                    </p>
                    <div className="flex flex-col md:flex-row gap-4">
                        <TextField
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            placeholder="https://micetf.fr/dictee/?tl=fr&titre=..."
                            fullWidth
                            disabled={loading}
                        />
                        <Button
                            variant="primary"
                            onClick={handleUrlPreview}
                            disabled={!url.trim() || loading}
                        >
                            Analyser
                        </Button>
                    </div>
                </div>
            </div>

            {/* Prévisualisation de la dictée */}
            {previewData && (
                <div className="bg-white shadow-md rounded-lg overflow-hidden mb-8">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h2 className="text-xl font-semibold text-gray-800">
                            Prévisualisation
                        </h2>
                    </div>

                    <div className="p-6">
                        <div className="mb-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-2">
                                {previewData.title}
                            </h3>
                            <p className="text-sm text-gray-500">
                                Langue: {previewData.lang} ·{" "}
                                {previewData.sentences.length} phrase(s)
                            </p>
                        </div>

                        <div className="bg-gray-50 p-4 rounded-md mb-6">
                            <h4 className="text-sm font-medium text-gray-700 mb-2">
                                Phrases:
                            </h4>
                            <ol className="list-decimal list-inside space-y-1 text-gray-700">
                                {previewData.sentences.map(
                                    (sentence, index) => (
                                        <li key={index}>{sentence}</li>
                                    )
                                )}
                            </ol>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3">
                            <Button
                                variant="primary"
                                onClick={handleImportFromUrl}
                                disabled={loading}
                            >
                                {loading
                                    ? "Importation..."
                                    : "Importer dans l'application"}
                            </Button>
                            <Button
                                variant="outline"
                                onClick={handleDownloadMarkdown}
                                disabled={loading}
                            >
                                Télécharger au format Markdown
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Informations sur la migration */}
            <div className="bg-blue-50 border border-blue-200 rounded-md p-6">
                <h2 className="text-lg font-medium text-blue-800 mb-2">
                    À propos de la migration
                </h2>
                <p className="text-blue-700 mb-4">
                    Cette fonctionnalité vous permet de convertir vos anciennes
                    dictées depuis l&lsquo;ancien format vers le nouveau format
                    Markdown. Une fois converties, vous pourrez les sauvegarder
                    localement et les réutiliser facilement.
                </p>
                <h3 className="text-md font-medium text-blue-800 mb-1">
                    Avantages du nouveau format:
                </h3>
                <ul className="list-disc list-inside text-blue-700 mb-4">
                    <li>URLs plus courtes et plus propres</li>
                    <li>
                        Possibilité de stocker et partager les dictées en local
                    </li>
                    <li>Compatibilité avec les éditeurs Markdown standards</li>
                    <li>Fonctionnement hors ligne grâce à la PWA</li>
                </ul>
            </div>
        </div>
    );
};

export default MigrationPage;
