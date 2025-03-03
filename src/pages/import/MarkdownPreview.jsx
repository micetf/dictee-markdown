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
                    <div className="flex flex-wrap gap-2 text-sm text-gray-500">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4 mr-1"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"
                                />
                            </svg>
                            Langue: {previewData.lang}
                        </span>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-green-100 text-green-800">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4 mr-1"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                                />
                            </svg>
                            {previewData.sentences.length} phrase(s)
                        </span>
                    </div>
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
