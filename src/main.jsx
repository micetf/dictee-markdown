import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";
import { DicteeProvider } from "./context/DicteeProvider";

// Enregistrement du service worker pour la PWA
if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
        navigator.serviceWorker
            .register("/sw.js")
            .then((registration) => {
                console.log(
                    "Service Worker enregistré avec succès:",
                    registration.scope
                );
            })
            .catch((error) => {
                console.log("Échec d'enregistrement du Service Worker:", error);
            });
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
