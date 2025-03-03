import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../components/ui/Button";
import { useDictee } from "../../hooks/useDictee";

/**
 * Page d'accueil de l'application
 * @returns {JSX.Element} La page d'accueil
 */
const HomePage = () => {
    const { dictees, loading, error, initialized } = useDictee();
    const [isInstallable, setIsInstallable] = useState(false);
    const [deferredPrompt, setDeferredPrompt] = useState(null);
    const navigate = useNavigate();

    // Détecter si l'application est installable
    useEffect(() => {
        window.addEventListener("beforeinstallprompt", (e) => {
            // Empêcher Chrome 67+ d'afficher automatiquement l'invite
            e.preventDefault();
            // Stocker l'événement pour pouvoir le déclencher plus tard
            setDeferredPrompt(e);
            // Mettre à jour l'état pour indiquer que l'application est installable
            setIsInstallable(true);
        });

        window.addEventListener("appinstalled", () => {
            // Cacher l'invite d'installation une fois l'application installée
            setIsInstallable(false);
            console.log("Application installée !");
        });
    }, []);

    // Fonction pour installer l'application
    const installApp = async () => {
        if (!deferredPrompt) return;

        // Afficher l'invite d'installation
        deferredPrompt.prompt();

        // Attendre que l'utilisateur réponde à l'invite
        const { outcome } = await deferredPrompt.userChoice;
        console.log(
            `L'utilisateur a ${
                outcome === "accepted" ? "accepté" : "refusé"
            } l'installation`
        );

        // On ne peut utiliser le prompt qu'une seule fois
        setDeferredPrompt(null);
        setIsInstallable(false);
    };

    // Fonction pour importer un fichier Markdown
    const importMarkdownFile = () => {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = ".md";
        input.onchange = (event) => {
            const file = event.target.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = (e) => {
                // Rediriger vers la page de migration avec le contenu du fichier
                navigate("/migration", { state: { content: e.target.result } });
            };
            reader.readAsText(file);
        };
        input.click();
    };

    if (loading && !initialized) {
        return (
            <div className="flex justify-center items-center p-8">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold text-primary-800 mb-4">
                    Application de Dictée
                </h1>
                <p className="text-lg text-gray-600 mb-8">
                    Créez, importez et partagez facilement des dictées avec le
                    format Markdown
                </p>

                {/* Boutons d'action principale */}
                <div className="flex flex-col sm:flex-row justify-center gap-4 mb-8">
                    <Button
                        variant="primary"
                        size="lg"
                        onClick={() => navigate("/editor")}
                    >
                        Créer une nouvelle dictée
                    </Button>

                    <Button
                        variant="outline"
                        size="lg"
                        onClick={importMarkdownFile}
                    >
                        Importer un fichier Markdown
                    </Button>

                    <Button
                        variant="secondary"
                        size="lg"
                        onClick={() => navigate("/migration")}
                    >
                        Migrer depuis ancienne URL
                    </Button>
                </div>

                {/* Invite d'installation PWA */}
                {isInstallable && (
                    <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-8">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <svg
                                    className="h-5 w-5 text-blue-400"
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            </div>
                            <div className="ml-3 flex-1 md:flex md:justify-between">
                                <p className="text-sm text-blue-700">
                                    Cette application peut être installée sur
                                    votre appareil pour une utilisation hors
                                    ligne.
                                </p>
                                <Button
                                    variant="ghost"
                                    onClick={installApp}
                                    className="ml-3 text-sm text-blue-600 hover:text-blue-800"
                                >
                                    Installer
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Liste des dictées récentes */}
            <div className="bg-white shadow-md rounded-lg overflow-hidden mb-8">
                <div className="px-6 py-4 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-800">
                        Mes dictées
                    </h2>
                </div>

                <div className="divide-y divide-gray-200">
                    {error && (
                        <div className="p-4 text-red-700 bg-red-50">
                            <p>Erreur: {error}</p>
                        </div>
                    )}

                    {dictees.length === 0 ? (
                        <div className="p-6 text-center text-gray-500">
                            <p>
                                Aucune dictée trouvée. Commencez par en créer
                                une nouvelle !
                            </p>
                        </div>
                    ) : (
                        dictees.map((dictee) => (
                            <div
                                key={dictee.id}
                                className="p-4 hover:bg-gray-50 transition duration-150"
                            >
                                <div className="flex justify-between items-center">
                                    <div>
                                        <h3 className="text-lg font-medium text-gray-900">
                                            {dictee.title}
                                        </h3>
                                        <p className="text-sm text-gray-500">
                                            {dictee.sentences.length} phrase(s)
                                            · Dernière modification:{" "}
                                            {new Date(
                                                dictee.updatedAt
                                            ).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <div className="flex space-x-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() =>
                                                navigate(`/player/${dictee.id}`)
                                            }
                                        >
                                            Utiliser
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() =>
                                                navigate(`/editor/${dictee.id}`)
                                            }
                                        >
                                            Modifier
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Informations sur le format Markdown */}
            <div className="bg-white shadow-md rounded-lg overflow-hidden mb-8">
                <div className="px-6 py-4 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-800">
                        Format Markdown
                    </h2>
                </div>
                <div className="p-6">
                    <p className="mb-4">
                        Cette application utilise le format Markdown pour
                        stocker les dictées, ce qui offre plusieurs avantages :
                    </p>
                    <ul className="list-disc list-inside mb-4 text-gray-700">
                        <li>Fichiers légers et faciles à partager</li>
                        <li>
                            Édition possible avec n&lsquo;importe quel éditeur
                            de texte
                        </li>
                        <li>
                            Stockage local ou sur un service cloud de votre
                            choix
                        </li>
                        <li>
                            Compatibilité avec d&lsquo;autres outils Markdown
                        </li>
                    </ul>

                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                        Exemple de format
                    </h3>
                    <div className="bg-gray-100 p-4 rounded-md font-mono text-sm mb-4">
                        <p># Titre de la dictée</p>
                        <p>&nbsp;</p>
                        <p>1. Première phrase de la dictée.</p>
                        <p>2. Deuxième phrase de la dictée.</p>
                        <p>3. Troisième phrase de la dictée.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomePage;
