import PropTypes from "prop-types";
import Button from "../../components/ui/Button";
import TextField from "../../components/ui/TextField";

/**
 * Composant pour l'importation depuis les services cloud
 * @param {Object} props - Les propriétés du composant
 * @returns {JSX.Element} Le formulaire d'importation cloud
 */
const CloudImportForm = ({
    cloudUrl = "",
    onUrlChange,
    onImport,
    isLoading = false,
    disabled = false,
}) => {
    return (
        <div>
            <p className="mb-4 text-gray-600">
                Collez un lien vers un fichier Markdown stocké sur un service
                cloud compatible.
            </p>
            <div className="flex flex-col md:flex-row gap-4">
                <TextField
                    value={cloudUrl}
                    onChange={(e) => onUrlChange(e.target.value)}
                    placeholder="https://drive.google.com/file/d/... ou https://codimd.apps.education.fr/..."
                    fullWidth
                    disabled={disabled || isLoading}
                />
                <Button
                    variant="primary"
                    onClick={onImport}
                    disabled={!cloudUrl.trim() || disabled || isLoading}
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
                    <li>Google Drive (lien de partage public)</li>
                    <li>Dropbox (lien de partage)</li>
                    <li>GitHub (fichier ou Gist)</li>
                    <li>CodiMD (https://codimd.apps.education.fr)</li>
                    <li>HedgeDoc</li>
                    <li>Nuage03 (https://nuage03.apps.education.fr)</li>
                    <li>Autres instances Nextcloud (apps.education.fr)</li>
                    <li>URL directe vers un fichier Markdown</li>
                </ul>
                <p className="mt-3 text-xs text-blue-600">
                    Note : Assurez-vous que les fichiers sont partagés
                    publiquement ou accessibles sans authentification.
                </p>
            </div>
        </div>
    );
};

CloudImportForm.propTypes = {
    cloudUrl: PropTypes.string,
    onUrlChange: PropTypes.func.isRequired,
    onImport: PropTypes.func.isRequired,
    isLoading: PropTypes.bool,
    disabled: PropTypes.bool,
};

export default CloudImportForm;
