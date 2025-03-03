import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { registerSW } from "virtual:pwa-register";
import App from "./App";
import "./index.css";
import { DicteeProvider } from "./context/DicteeProvider";

// Enregistrement du service worker pour la PWA
if ("serviceWorker" in navigator) {
    const updateSW = registerSW({
        onNeedRefresh() {
            // Une mise à jour est disponible
            console.log("Une mise à jour est disponible !");
            // Vous pourriez ajouter ici une UI pour demander à l'utilisateur de rafraîchir
            const shouldUpdate = confirm(
                "Une nouvelle version est disponible. Rafraîchir?"
            );
            if (shouldUpdate) {
                updateSW();
            }
        },
        onOfflineReady() {
            // L'application est prête à fonctionner hors ligne
            console.log("Application prête pour le mode hors ligne");
        },
    });
}

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <BrowserRouter>
            <DicteeProvider>
                <App />
            </DicteeProvider>
        </BrowserRouter>
    </React.StrictMode>
);
