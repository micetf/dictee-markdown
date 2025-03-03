import PropTypes from "prop-types";
import Button from "../ui/Button";

/**
 * Composant pour l'importation de fichiers Markdown
 * @param {Object} props - Les propriétés du composant
 * @returns {JSX.Element} Le formulaire d'importation
 */
const FileImportForm = ({
    markdownContent = "",
    onContentChange,
    onAnalyze,
    isLoading = false,
    disabled = false,
}) => {
    const handleFileImport = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            const content = e.target.result;
            onContentChange(content);
        };
        reader.readAsText(file);
    };

    return (
        <div>
            <p className="mb-4 text-gray-600">
                Importez un fichier Markdown ou collez son contenu ci-dessous.
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
                    disabled={disabled || isLoading}
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ou collez le contenu Markdown
                </label>
                <textarea
                    value={markdownContent}
                    onChange={(e) => onContentChange(e.target.value)}
                    rows={8}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                    placeholder="# Titre de la dictée
                  
1. Première phrase de la dictée.
2. Deuxième phrase de la dictée.
3. Troisième phrase de la dictée."
                    disabled={disabled || isLoading}
                />
                <div className="mt-3">
                    <Button
                        variant="primary"
                        onClick={onAnalyze}
                        disabled={
                            !markdownContent.trim() || disabled || isLoading
                        }
                    >
                        Analyser
                    </Button>
                </div>
            </div>
        </div>
    );
};

FileImportForm.propTypes = {
    markdownContent: PropTypes.string,
    onContentChange: PropTypes.func.isRequired,
    onAnalyze: PropTypes.func.isRequired,
    isLoading: PropTypes.bool,
    disabled: PropTypes.bool,
};

export default FileImportForm;
