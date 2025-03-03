import React, { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import HomePage from "./pages/home/HomePage";
import { useDictee } from "./hooks/useDictee";

// Importation paresseuse des pages pour améliorer les performances
const EditorPage = React.lazy(() => import("./pages/editor/EditorPage"));
const ImportPage = React.lazy(() => import("./pages/import/ImportPage"));
const PlayerPage = React.lazy(() => import("./pages/player/PlayerPage"));
const MigrationPage = React.lazy(() =>
    import("./pages/migration/MigrationPage")
);

/**
 * Composant principal de l'application
 * @returns {JSX.Element} Le composant App
 */
function App() {
    const { initializeApp } = useDictee();

    useEffect(() => {
        // Initialiser l'application au chargement
        initializeApp();

        // Détecter si l'utilisateur est en ligne ou hors ligne
        const handleConnectionChange = () => {
            const { onLine } = navigator;
            console.log(
                `L'utilisateur est ${onLine ? "en ligne" : "hors ligne"}`
            );
            // Vous pouvez ajouter ici un toast ou une notification
        };

        window.addEventListener("online", handleConnectionChange);
        window.addEventListener("offline", handleConnectionChange);

        return () => {
            window.removeEventListener("online", handleConnectionChange);
            window.removeEventListener("offline", handleConnectionChange);
        };
    }, [initializeApp]);

    return (
        <div className="flex flex-col min-h-screen bg-gray-100">
            <Navbar />
            <main className="flex-grow container mx-auto px-4 py-8">
                <React.Suspense
                    fallback={
                        <div className="text-center py-10">Chargement...</div>
                    }
                >
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/editor" element={<EditorPage />} />
                        <Route path="/editor/:id" element={<EditorPage />} />
                        <Route path="/editor/import" element={<ImportPage />} />
                        <Route path="/player/:id" element={<PlayerPage />} />
                        <Route path="/migration" element={<MigrationPage />} />
                        <Route path="*" element={<div>Page non trouvée</div>} />
                    </Routes>
                </React.Suspense>
            </main>
            <Footer />
        </div>
    );
}

export default App;
