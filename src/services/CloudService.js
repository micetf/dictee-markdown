/**
 * Service pour gérer les connexions aux services cloud
 */
class CloudService {
    /**
     * Importe un fichier depuis Google Drive
     * @param {string} fileId - L'ID du fichier Google Drive
     * @returns {Promise<string>} Le contenu du fichier
     */
    async importFromGoogleDrive(fileId) {
        try {
            // Pour un accès simple à un fichier partagé publiquement
            const response = await fetch(
                `https://drive.google.com/uc?export=download&id=${fileId}`
            );

            if (!response.ok) {
                throw new Error(
                    `Erreur lors de la récupération depuis Google Drive: ${response.statusText}`
                );
            }

            return await response.text();
        } catch (error) {
            console.error("Erreur Google Drive:", error);
            throw error;
        }
    }

    /**
     * Importe un fichier depuis Dropbox
     * @param {string} sharedLink - Le lien de partage Dropbox
     * @returns {Promise<string>} Le contenu du fichier
     */
    async importFromDropbox(sharedLink) {
        try {
            // Convertir le lien de partage Dropbox en lien de téléchargement direct
            const downloadLink = sharedLink.replace(
                "www.dropbox.com",
                "dl.dropboxusercontent.com"
            );

            const response = await fetch(downloadLink);
            if (!response.ok) {
                throw new Error(
                    `Erreur lors de la récupération depuis Dropbox: ${response.statusText}`
                );
            }

            return await response.text();
        } catch (error) {
            console.error("Erreur Dropbox:", error);
            throw error;
        }
    }

    /**
     * Importe un fichier depuis GitHub
     * @param {string} url - L'URL GitHub
     * @returns {Promise<string>} Le contenu du fichier
     */
    async importFromGitHub(url) {
        try {
            // Si c'est un Gist, convertir en lien raw
            if (
                url.includes("github.com/gist/") ||
                url.includes("gist.github.com/")
            ) {
                url = url
                    .replace("github.com/gist/", "gist.githubusercontent.com/")
                    .replace("gist.github.com/", "gist.githubusercontent.com/")
                    .replace("/blob/", "/");

                if (!url.includes("/raw")) {
                    url += "/raw";
                }
            } else if (url.includes("github.com/")) {
                // Convertir un lien GitHub normal en lien raw
                url = url
                    .replace("github.com/", "raw.githubusercontent.com/")
                    .replace("/blob/", "/");
            }

            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(
                    `Erreur lors de la récupération depuis GitHub: ${response.statusText}`
                );
            }

            return await response.text();
        } catch (error) {
            console.error("Erreur GitHub:", error);
            throw error;
        }
    }

    /**
     * Importe un fichier depuis CodiMD/HedgeDoc
     * @param {string} url - L'URL CodiMD ou HedgeDoc
     * @returns {Promise<string>} Le contenu du fichier
     */
    async importFromCodiMD(url) {
        try {
            // Transformation des URLs pour accéder au contenu brut
            // Format typique: https://codimd.apps.education.fr/XXXXX

            // Convertir l'URL en version "raw" ou "download"
            let downloadUrl = url;

            // Si l'URL se termine par "/", supprimer le slash final
            if (downloadUrl.endsWith("/")) {
                downloadUrl = downloadUrl.slice(0, -1);
            }

            // Si l'URL ne contient pas déjà "/download" ou "/raw", ajouter "/download"
            if (
                !downloadUrl.includes("/download") &&
                !downloadUrl.includes("/raw")
            ) {
                downloadUrl += "/download";
            }

            const response = await fetch(downloadUrl);
            if (!response.ok) {
                throw new Error(
                    `Erreur lors de la récupération depuis CodiMD/HedgeDoc: ${response.statusText}`
                );
            }

            return await response.text();
        } catch (error) {
            console.error("Erreur CodiMD/HedgeDoc:", error);
            throw error;
        }
    }

    /**
     * Importe un fichier depuis Nextcloud (Nuage03)
     * @param {string} url - L'URL Nextcloud
     * @returns {Promise<string>} Le contenu du fichier
     */
    async importFromNextcloud(url) {
        try {
            // Pour les instances Nextcloud, on peut souvent accéder au contenu brut
            // en ajoutant "/download" à l'URL

            // Vérifier si l'URL contient déjà "/download"
            let downloadUrl = url;
            if (!url.includes("/download")) {
                // Enlever les paramètres d'URL si présents
                const urlWithoutParams = url.split("?")[0];
                downloadUrl = `${urlWithoutParams}/download`;
            }

            const response = await fetch(downloadUrl);
            if (!response.ok) {
                throw new Error(
                    `Erreur lors de la récupération depuis Nextcloud: ${response.statusText}`
                );
            }

            return await response.text();
        } catch (error) {
            console.error("Erreur Nextcloud:", error);
            throw error;
        }
    }

    /**
     * Méthode générique pour importer depuis une URL selon le service détecté
     * @param {string} url - L'URL à analyser
     * @returns {Promise<string>} Le contenu du fichier
     */
    async importFromUrl(url) {
        try {
            if (url.includes("drive.google.com")) {
                // Extraire l'ID du fichier Google Drive
                const fileIdMatch = url.match(/[-\w]{25,}|id=([-\w]{25,})/);
                if (!fileIdMatch)
                    throw new Error("ID de fichier Google Drive non valide");
                const fileId = fileIdMatch[1] || fileIdMatch[0];
                return await this.importFromGoogleDrive(fileId);
            } else if (url.includes("dropbox.com")) {
                return await this.importFromDropbox(url);
            } else if (url.includes("github.com")) {
                return await this.importFromGitHub(url);
            } else if (
                url.includes("codimd.apps.education.fr") ||
                url.includes("hedgedoc")
            ) {
                return await this.importFromCodiMD(url);
            } else if (
                url.includes("nuage03.apps.education.fr") ||
                url.includes("apps.education.fr")
            ) {
                return await this.importFromNextcloud(url);
            } else {
                // URL générique
                const response = await fetch(url, {
                    method: "GET",
                    headers: {
                        Accept: "text/plain, text/markdown",
                    },
                });
                if (!response.ok) {
                    throw new Error(
                        `Erreur lors de la récupération depuis l'URL: ${response.statusText}`
                    );
                }
                return await response.text();
            }
        } catch (error) {
            console.error("Erreur d'importation depuis URL:", error);
            throw error;
        }
    }
}

export default new CloudService();
