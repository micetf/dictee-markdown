import PropTypes from "prop-types";
import Button from "../ui/Button";

/**
 * Composant de prévisualisation pour les dictées en format Markdown
 * @param {Object} props - Les propriétés du composant
 * @returns {JSX.Element} Le composant de prévisualisation
 */
const MarkdownPreview = ({
    previewData,
    onImport,
    onDownload,
    isLoading = false,
    importLabel = "Importer dans l'application",
    downloadLabel = "Télécharger au format Markdown",
}) => {
    if (!previewData) return null;

    return (
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
                        {previewData.sentences.map((sentence, index) => (
                            <li key={index}>{sentence}</li>
                        ))}
                    </ol>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                    {onImport && (
                        <Button
                            variant="primary"
                            onClick={onImport}
                            disabled={isLoading}
                        >
                            {isLoading ? "Importation..." : importLabel}
                        </Button>
                    )}
                    {onDownload && (
                        <Button
                            variant="outline"
                            onClick={onDownload}
                            disabled={isLoading}
                        >
                            {downloadLabel}
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
};

MarkdownPreview.propTypes = {
    previewData: PropTypes.shape({
        title: PropTypes.string.isRequired,
        lang: PropTypes.string,
        sentences: PropTypes.arrayOf(PropTypes.string).isRequired,
    }),
    onImport: PropTypes.func,
    onDownload: PropTypes.func,
    isLoading: PropTypes.bool,
    importLabel: PropTypes.string,
    downloadLabel: PropTypes.string,
};

export default MarkdownPreview;
