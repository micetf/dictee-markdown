import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

/**
 * Composant de la barre de navigation
 * @returns {JSX.Element} La barre de navigation
 */
const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const location = useLocation();

    // Vérification si un lien est actif
    const isActive = (path) => {
        return location.pathname === path;
    };

    // Toggle du menu mobile
    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <nav className="bg-primary-800 shadow-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex">
                        <div className="flex-shrink-0 flex items-center">
                            <Link
                                to="/"
                                className="text-white font-bold text-xl"
                            >
                                Dictée
                            </Link>
                        </div>
                        <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                            <Link
                                to="/"
                                className={`${
                                    isActive("/")
                                        ? "border-white text-white"
                                        : "border-transparent text-gray-300 hover:border-gray-300 hover:text-white"
                                } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                            >
                                Accueil
                            </Link>
                            <Link
                                to="/editor"
                                className={`${
                                    isActive("/editor")
                                        ? "border-white text-white"
                                        : "border-transparent text-gray-300 hover:border-gray-300 hover:text-white"
                                } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                            >
                                Créer
                            </Link>
                            <Link
                                to="/migration"
                                className={`${
                                    isActive("/migration")
                                        ? "border-white text-white"
                                        : "border-transparent text-gray-300 hover:border-gray-300 hover:text-white"
                                } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                            >
                                Migration
                            </Link>
                        </div>
                    </div>

                    {/* Indicateur de connexion */}
                    <div className="hidden sm:ml-6 sm:flex sm:items-center">
                        <div className="flex items-center">
                            <div
                                className={`h-2 w-2 rounded-full mr-2 ${
                                    navigator.onLine
                                        ? "bg-green-500"
                                        : "bg-red-500"
                                }`}
                            ></div>
                            <span className="text-sm text-gray-300">
                                {navigator.onLine ? "En ligne" : "Hors ligne"}
                            </span>
                        </div>
                    </div>

                    {/* Bouton menu mobile */}
                    <div className="flex items-center sm:hidden">
                        <button
                            onClick={toggleMenu}
                            className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                            aria-expanded="false"
                        >
                            <span className="sr-only">Ouvrir le menu</span>
                            {/* Icône menu */}
                            <svg
                                className={`${
                                    isMenuOpen ? "hidden" : "block"
                                } h-6 w-6`}
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                aria-hidden="true"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M4 6h16M4 12h16M4 18h16"
                                />
                            </svg>
                            {/* Icône fermer */}
                            <svg
                                className={`${
                                    isMenuOpen ? "block" : "hidden"
                                } h-6 w-6`}
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                aria-hidden="true"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Menu mobile */}
            <div className={`${isMenuOpen ? "block" : "hidden"} sm:hidden`}>
                <div className="pt-2 pb-3 space-y-1">
                    <Link
                        to="/"
                        className={`${
                            isActive("/")
                                ? "bg-primary-900 border-white text-white"
                                : "border-transparent text-gray-300 hover:bg-primary-700 hover:border-gray-300 hover:text-white"
                        } block pl-3 pr-4 py-2 border-l-4 text-base font-medium`}
                        onClick={() => setIsMenuOpen(false)}
                    >
                        Accueil
                    </Link>
                    <Link
                        to="/editor"
                        className={`${
                            isActive("/editor")
                                ? "bg-primary-900 border-white text-white"
                                : "border-transparent text-gray-300 hover:bg-primary-700 hover:border-gray-300 hover:text-white"
                        } block pl-3 pr-4 py-2 border-l-4 text-base font-medium`}
                        onClick={() => setIsMenuOpen(false)}
                    >
                        Créer
                    </Link>
                    <Link
                        to="/migration"
                        className={`${
                            isActive("/migration")
                                ? "bg-primary-900 border-white text-white"
                                : "border-transparent text-gray-300 hover:bg-primary-700 hover:border-gray-300 hover:text-white"
                        } block pl-3 pr-4 py-2 border-l-4 text-base font-medium`}
                        onClick={() => setIsMenuOpen(false)}
                    >
                        Migration
                    </Link>
                    <div className="pl-3 pr-4 py-2 flex items-center text-gray-300">
                        <div
                            className={`h-2 w-2 rounded-full mr-2 ${
                                navigator.onLine ? "bg-green-500" : "bg-red-500"
                            }`}
                        ></div>
                        <span className="text-sm">
                            {navigator.onLine ? "En ligne" : "Hors ligne"}
                        </span>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
