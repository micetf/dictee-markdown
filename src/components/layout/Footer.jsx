/**
 * Composant du pied de page
 * @returns {JSX.Element} Le pied de page
 */
const Footer = () => {
    return (
        <footer className="bg-primary-800 text-white py-6">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row justify-between items-center">
                    <div className="mb-4 md:mb-0">
                        <p className="text-sm">
                            © {new Date().getFullYear()} Application de Dictée -
                            Version PWA avec Markdown
                        </p>
                    </div>
                    <div className="flex space-x-6">
                        <a
                            href="https://micetf.fr"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-300 hover:text-white transition duration-150"
                        >
                            MiCetF
                        </a>
                        <a
                            href="#"
                            className="text-gray-300 hover:text-white transition duration-150"
                            onClick={(e) => {
                                e.preventDefault();
                                // Ouvrir la modal de contact ici
                                alert(
                                    "Fonctionnalité de contact à implémenter"
                                );
                            }}
                        >
                            Contact
                        </a>
                        <button
                            className="text-gray-300 hover:text-white transition duration-150"
                            onClick={() => {
                                if ("caches" in window) {
                                    caches.keys().then(function (names) {
                                        for (let name of names) {
                                            caches.delete(name);
                                        }
                                        alert("Cache effacé avec succès !");
                                        window.location.reload();
                                    });
                                } else {
                                    alert(
                                        "La fonctionnalité de cache n'est pas disponible sur ce navigateur."
                                    );
                                }
                            }}
                        >
                            Effacer le cache
                        </button>
                    </div>
                </div>

                {/* Affichage de l'état de l'installation PWA */}
                <div className="mt-4 text-center text-xs text-gray-400">
                    <p>
                        {window.matchMedia("(display-mode: standalone)").matches
                            ? "Application installée en mode autonome"
                            : "Vous pouvez installer cette application sur votre appareil"}
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
