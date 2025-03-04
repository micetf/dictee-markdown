import { useState, useEffect, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDictee } from "../../hooks/useDictee";
import Button from "../../components/ui/Button";
import TextField from "../../components/ui/TextField";
import MarkdownService from "../../services/MarkdownService";
import CloudService from "../../services/CloudService";

/**
 * Page d'importation de dictées
 * @returns {JSX.Element} La page d'importation
 */
const ImportPage = () => {
    const { importFromMarkdown, loading, error } = useDictee();
    const [importType, setImportType] = useState("file"); // 'file' ou 'cloud'
    const [cloudUrl, setCloudUrl] = useState("");
    const [markdownContent, setMarkdownContent] = useState("");
    const [previewData, setPreviewData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
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
     * Gère l'importation depuis un service cloud
     */
    const handleCloudImport = async () => {
        if (!cloudUrl.trim()) {
            setOperationResult({
                type: "error",
                message: "Veuillez saisir une URL valide",
            });
            return;
        }

        try {
            setIsLoading(true);
            // Récupérer le contenu depuis le cloud
            const content = await CloudService.importFromUrl(cloudUrl);

            // Vérifier que c'est bien du Markdown et qu'il contient au moins un titre
            if (!content.includes("#")) {
                setOperationResult({
                    type: "error",
                    message:
                        "Le fichier récupéré ne semble pas être au format Markdown (pas de titre avec #)",
                });
                return;
            }

            // Afficher la prévisualisation
            setMarkdownContent(content);
            handleMarkdownPreview(content);

            setOperationResult({
                type: "success",
                message: "Fichier importé avec succès depuis le cloud !",
            });
        } catch (err) {
            setOperationResult({
                type: "error",
                message: `Erreur lors de l'importation : ${
                    err.message || "Une erreur est survenue"
                }`,
            });
        } finally {
            setIsLoading(false);
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

    // Définir le type d'importation en fonction de l'état de la navigation
    useEffect(() => {
        if (location.state?.type) {
            setImportType(location.state.type);
        }

        // Si un contenu est passé dans l'état, l'utiliser
        if (location.state?.content) {
            setMarkdownContent(location.state.content);
            handleMarkdownPreview(location.state.content);
        }
    }, [handleMarkdownPreview, location.state]);

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">
                Importer une dictée
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
                    <div className="flex flex-wrap space-x-2 space-y-2 sm:space-y-0">
                        <button
                            onClick={() => setImportType("file")}
                            className={`px-4 py-2 font-medium rounded-md ${
                                importType === "file"
                                    ? "bg-primary-100 text-primary-800"
                                    : "text-gray-600 hover:bg-gray-100"
                            }`}
                        >
                            Depuis un fichier
                        </button>
                        <button
                            onClick={() => setImportType("cloud")}
                            className={`px-4 py-2 font-medium rounded-md ${
                                importType === "cloud"
                                    ? "bg-primary-100 text-primary-800"
                                    : "text-gray-600 hover:bg-gray-100"
                            }`}
                        >
                            Depuis le Cloud
                        </button>
                    </div>
                </div>

                <div className="p-6">
                    {importType === "file" ? (
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
                                    disabled={loading || isLoading}
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
                                    disabled={loading || isLoading}
                                />
                                <div className="mt-3">
                                    <Button
                                        variant="primary"
                                        onClick={() => handleMarkdownPreview()}
                                        disabled={
                                            !markdownContent.trim() ||
                                            loading ||
                                            isLoading
                                        }
                                    >
                                        Analyser
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        /* Interface d'importation depuis le cloud */
                        /* Interface d'importation depuis le cloud */
                        <div>
                            <p className="mb-4 text-gray-600">
                                Collez un lien vers un fichier Markdown stocké
                                sur un service cloud compatible.
                            </p>
                            <div className="flex flex-col md:flex-row gap-4">
                                <TextField
                                    value={cloudUrl}
                                    onChange={(e) =>
                                        setCloudUrl(e.target.value)
                                    }
                                    placeholder="https://drive.google.com/file/d/... ou https://codimd.apps.education.fr/..."
                                    fullWidth
                                    disabled={loading || isLoading}
                                />
                                <Button
                                    variant="primary"
                                    onClick={handleCloudImport}
                                    disabled={
                                        !cloudUrl.trim() || loading || isLoading
                                    }
                                >
                                    {isLoading ? (
                                        <span className="flex items-center">
                                            <svg
                                                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                            >
                                                <circle
                                                    className="opacity-25"
                                                    cx="12"
                                                    cy="12"
                                                    r="10"
                                                    stroke="currentColor"
                                                    strokeWidth="4"
                                                ></circle>
                                                <path
                                                    className="opacity-75"
                                                    fill="currentColor"
                                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                                ></path>
                                            </svg>
                                            Importation...
                                        </span>
                                    ) : (
                                        "Importer"
                                    )}
                                </Button>
                            </div>

                            <div className="mt-6 bg-blue-50 p-4 rounded-md">
                                <h3 className="text-sm font-medium text-blue-800 mb-2">
                                    Services pris en charge :
                                </h3>
                                <ul className="list-disc pl-5 text-sm text-blue-700">
                                    <li>
                                        Google Drive (lien de partage public)
                                    </li>
                                    <li>Dropbox (lien de partage)</li>
                                    <li>GitHub (fichier ou Gist)</li>
                                    <li>
                                        CodiMD
                                        (https://codimd.apps.education.fr)
                                    </li>
                                    <li>HedgeDoc</li>
                                    <li>
                                        Nuage03
                                        (https://nuage03.apps.education.fr)
                                    </li>
                                    <li>
                                        Autres instances Nextcloud
                                        (apps.education.fr)
                                    </li>
                                    <li>
                                        URL directe vers un fichier Markdown
                                    </li>
                                </ul>
                                <p className="mt-3 text-xs text-blue-600">
                                    Note : Assurez-vous que les fichiers sont
                                    partagés publiquement ou accessibles sans
                                    authentification.
                                </p>
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
                                onClick={handleImportFromMarkdown}
                                disabled={loading || isLoading}
                            >
                                {loading || isLoading
                                    ? "Importation..."
                                    : "Importer dans l'application"}
                            </Button>
                            <Button
                                variant="outline"
                                onClick={handleDownloadMarkdown}
                                disabled={loading || isLoading}
                            >
                                Télécharger au format Markdown
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            <div className="bg-blue-50 border border-blue-200 rounded-md p-6">
                <h2 className="text-lg font-medium text-blue-800 mb-2">
                    À propos de l&lsquo;importation
                </h2>
                <p className="text-blue-700 mb-4">
                    Cette fonctionnalité vous permet d&lsquo;importer des
                    dictées au format Markdown depuis différentes sources. Vous
                    pouvez utiliser un fichier local ou importer directement
                    depuis des services cloud populaires.
                </p>
                <h3 className="text-md font-medium text-blue-800 mb-1">
                    Conseils d&lsquo;utilisation:
                </h3>
                <ul className="list-disc list-inside text-blue-700 mb-4">
                    <li>
                        Le fichier doit contenir un titre (ligne commençant par
                        #)
                    </li>
                    <li>Chaque phrase doit être numérotée (1. Phrase...)</li>
                    <li>
                        Pour des fichiers volumineux, préférez
                        l&lsquo;importation de fichier local
                    </li>
                    <li>
                        Vérifiez toujours la prévisualisation avant
                        d&lsquo;importer
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default ImportPage;
