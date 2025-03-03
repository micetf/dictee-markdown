import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Button from "../ui/Button";
import TextField from "../ui/TextField";

/**
 * Composant de formulaire pour créer ou éditer une dictée
 * @param {Object} props - Les propriétés du composant
 * @returns {JSX.Element} Le composant de formulaire
 */
const DicteeForm = ({
    initialData = { title: "", sentences: [], lang: "fr" },
    onSubmit,
    onCancel,
    loading = false,
}) => {
    const [title, setTitle] = useState(initialData.title || "Sans titre");
    const [sentences, setSentences] = useState(initialData.sentences || []);
    const [lang, setLang] = useState(initialData.lang || "fr");
    const [markdownPreview, setMarkdownPreview] = useState("");
    const [errors, setErrors] = useState({});

    // Ajouter une phrase vide si nécessaire
    useEffect(() => {
        if (sentences.length === 0) {
            setSentences([""]);
        }
    }, [sentences]);

    // Générer l'aperçu Markdown
    useEffect(() => {
        let md = `# ${title}\n`;

        // Inclure la langue dans l'aperçu
        if (lang) {
            md += `<!-- lang:${lang} -->\n`;
        }

        md += "\n";

        sentences.forEach((sentence, index) => {
            if (sentence.trim()) {
                md += `${index + 1}. ${sentence}\n`;
            }
        });
        setMarkdownPreview(md);
    }, [title, sentences, lang]);

    // Validation du formulaire
    const validateForm = () => {
        const newErrors = {};

        if (!title.trim()) {
            newErrors.title = "Le titre est requis";
        }

        if (sentences.filter((s) => s.trim()).length === 0) {
            newErrors.sentences = "Au moins une phrase est requise";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Soumission du formulaire
    const handleSubmit = (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        // Filtrer les phrases vides
        const filteredSentences = sentences.filter((s) => s.trim());

        onSubmit({
            ...initialData,
            title: title.trim(),
            sentences: filteredSentences,
            lang,
        });
    };

    // Gestion des phrases
    const handleSentenceChange = (index, value) => {
        const newSentences = [...sentences];
        newSentences[index] = value;
        setSentences(newSentences);
    };

    const addSentence = () => {
        setSentences([...sentences, ""]);
    };

    const removeSentence = (index) => {
        const newSentences = [...sentences];
        newSentences.splice(index, 1);
        setSentences(newSentences);
    };

    return (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-800">
                    {initialData.id ? "Modifier" : "Créer"} une dictée
                </h2>
            </div>

            <form onSubmit={handleSubmit} className="p-6">
                <div className="grid grid-cols-1 gap-6">
                    {/* Titre de la dictée */}
                    <TextField
                        label="Titre de la dictée"
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        fullWidth
                        error={errors.title}
                    />
                    {/* Langue de la dictée */}
                    <div>
                        <label
                            htmlFor="lang"
                            className="block text-sm font-medium text-gray-700 mb-1"
                        >
                            Langue de la dictée
                            <span className="ml-1 text-xs text-gray-500">
                                (pour la synthèse vocale)
                            </span>
                        </label>
                        <select
                            id="lang"
                            name="lang"
                            value={lang}
                            onChange={(e) => setLang(e.target.value)}
                            className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                        >
                            <option value="fr">Français (fr)</option>
                            <option value="fr-FR">
                                Français - France (fr-FR)
                            </option>
                            <option value="fr-CA">
                                Français - Canada (fr-CA)
                            </option>
                            <option value="en">Anglais (en)</option>
                            <option value="en-US">
                                Anglais - États-Unis (en-US)
                            </option>
                            <option value="en-GB">
                                Anglais - Royaume-Uni (en-GB)
                            </option>
                            <option value="es">Espagnol (es)</option>
                            <option value="es-ES">
                                Espagnol - Espagne (es-ES)
                            </option>
                            <option value="de">Allemand (de)</option>
                            <option value="de-DE">
                                Allemand - Allemagne (de-DE)
                            </option>
                            <option value="it">Italien (it)</option>
                            <option value="it-IT">
                                Italien - Italie (it-IT)
                            </option>
                        </select>
                        <p className="mt-1 text-xs text-gray-500">
                            La langue sera sauvegardée dans le fichier Markdown
                            et utilisée pour la synthèse vocale.
                        </p>
                    </div>
                    {/* Phrases de la dictée */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Phrases
                            {errors.sentences && (
                                <span className="text-red-600 ml-2">
                                    {errors.sentences}
                                </span>
                            )}
                        </label>

                        <div className="space-y-3">
                            {sentences.map((sentence, index) => (
                                <div
                                    key={index}
                                    className="flex items-center gap-2"
                                >
                                    <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-primary-100 text-primary-800 rounded-full font-semibold">
                                        {index + 1}
                                    </span>
                                    <TextField
                                        value={sentence}
                                        onChange={(e) =>
                                            handleSentenceChange(
                                                index,
                                                e.target.value
                                            )
                                        }
                                        placeholder={`Phrase ${index + 1}`}
                                        fullWidth
                                    />
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => removeSentence(index)}
                                        disabled={sentences.length <= 1}
                                        className="text-red-600 hover:text-red-800"
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-5 w-5"
                                            viewBox="0 0 20 20"
                                            fill="currentColor"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                    </Button>
                                </div>
                            ))}

                            <div className="pt-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={addSentence}
                                >
                                    + Ajouter une phrase
                                </Button>
                            </div>
                        </div>
                    </div>
                    {/* Aperçu Markdown */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Aperçu Markdown
                        </label>
                        <div className="bg-gray-100 p-4 rounded-md font-mono text-sm whitespace-pre-wrap">
                            {markdownPreview}
                        </div>
                    </div>
                    {/* Boutons d'action */}
                    <div className="flex justify-end space-x-3 pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onCancel}
                            disabled={loading}
                        >
                            Annuler
                        </Button>
                        <Button
                            type="submit"
                            variant="primary"
                            disabled={loading}
                        >
                            {loading ? (
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
                                    Enregistrement...
                                </span>
                            ) : initialData.id ? (
                                "Mettre à jour"
                            ) : (
                                "Créer"
                            )}
                        </Button>
                    </div>
                </div>
            </form>
        </div>
    );
};

DicteeForm.propTypes = {
    initialData: PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
        title: PropTypes.string,
        sentences: PropTypes.arrayOf(PropTypes.string),
        lang: PropTypes.string,
    }),
    onSubmit: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    loading: PropTypes.bool,
};

export default DicteeForm;
