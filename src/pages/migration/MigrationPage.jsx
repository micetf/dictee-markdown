import { useState, useEffect, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDictee } from "../../hooks/useDictee";
import Button from "../../components/ui/Button";
import TextField from "../../components/ui/TextField";
import MarkdownService from "../../services/MarkdownService";

/**
 * Page de migration depuis l'ancien format
 * @returns {JSX.Element} La page de migration
 */
const MigrationPage = () => {
    const { importFromMarkdown, importFromOldUrl, loading, error } =
        useDictee();
    const [url, setUrl] = useState("");
    const [markdownContent, setMarkdownContent] = useState("");
    const [previewData, setPreviewData] = useState(null);
    const [sourceType, setSourceType] = useState("url"); // 'url' ou 'markdown'
    const [operationResult, setOperationResult] = useState({
        type: null,
        message: null,
    });
    const location = useLocation();
    const navigate = useNavigate();

    /**
     * Génère une prévisualisation du contenu Markdown
     */
    const handleMarkdownPreview = useCallback(
        (content = markdownContent) => {
            if (!content.trim()) {
                setOperationResult({
                    type: "error",
                    message: "Veuillez saisir ou importer un contenu Markdown",
                });
                return;
            }

            try {
                const dicteeData = MarkdownService.parseMarkdown(content);
                setPreviewData(dicteeData);
                setOperationResult({
                    type: "success",
                    message: "Markdown analysé avec succès !",
                });
            } catch (err) {
                setOperationResult({
                    type: "error",
                    message: `Erreur lors de l'analyse du Markdown : ${
                        err.message || "Une erreur est survenue"
                    }`,
                });
            }
        },
        [markdownContent]
    );

    // Vérifier si un contenu Markdown a été passé via l'état de navigation
    useEffect(() => {
        if (location.state?.content) {
            setMarkdownContent(location.state.content);
            setSourceType("markdown");
            handleMarkdownPreview(location.state.content);
        }
    }, [location.state, handleMarkdownPreview]);

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
     * Importe depuis le Markdown
     */
    const handleImportFromMarkdown = async () => {
        try {
            const id = await importFromMarkdown(markdownContent);
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
     * Gère l'importation d'un fichier Markdown
     */
    const handleFileImport = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            const content = e.target.result;
            setMarkdownContent(content);
            handleMarkdownPreview(content);
        };
        reader.readAsText(file);
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
                Migration vers le nouveau format
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
                <div className="px-6 py-4 border-b border-gray-200">
                    <div className="flex space-x-4">
                        <button
                            onClick={() => setSourceType("url")}
                            className={`px-4 py-2 font-medium rounded-md ${
                                sourceType === "url"
                                    ? "bg-primary-100 text-primary-800"
                                    : "text-gray-600 hover:bg-gray-100"
                            }`}
                        >
                            Depuis une ancienne URL
                        </button>
                        <button
                            onClick={() => setSourceType("markdown")}
                            className={`px-4 py-2 font-medium rounded-md ${
                                sourceType === "markdown"
                                    ? "bg-primary-100 text-primary-800"
                                    : "text-gray-600 hover:bg-gray-100"
                            }`}
                        >
                            Depuis un fichier Markdown
                        </button>
                    </div>
                </div>

                <div className="p-6">
                    {sourceType === "url" ? (
                        <div>
                            <p className="mb-4 text-gray-600">
                                Collez une ancienne URL de dictée pour la
                                convertir au nouveau format Markdown.
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
                    ) : (
                        <div>
                            <p className="mb-4 text-gray-600">
                                Importez un fichier Markdown ou collez son
                                contenu ci-dessous.
                            </p>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Importer un fichier Markdown
                                </label>
                                <input
                                    type="file"
                                    accept=".md"
                                    onChange={handleFileImport}
                                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Ou collez le contenu Markdown
                                </label>
                                <textarea
                                    value={markdownContent}
                                    onChange={(e) =>
                                        setMarkdownContent(e.target.value)
                                    }
                                    rows={8}
                                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                                    placeholder="# Titre de la dictée
                  
1. Première phrase de la dictée.
2. Deuxième phrase de la dictée.
3. Troisième phrase de la dictée."
                                    disabled={loading}
                                />
                                <div className="mt-3">
                                    <Button
                                        variant="primary"
                                        onClick={() => handleMarkdownPreview()}
                                        disabled={
                                            !markdownContent.trim() || loading
                                        }
                                    >
                                        Analyser
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}
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
                                onClick={
                                    sourceType === "url"
                                        ? handleImportFromUrl
                                        : handleImportFromMarkdown
                                }
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
                    dictées vers le nouveau format Markdown. Une fois
                    converties, vous pourrez les sauvegarder localement et les
                    réutiliser facilement.
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
