/**
 * Service pour la gestion de la synthèse vocale
 */
class SpeechService {
    constructor() {
        this.synth = window.speechSynthesis;
        this.utterance = null;
        this.voices = [];
        this.currentSentenceIndex = 0;
        this.speaking = false;
        this.callbacks = {};
    }

    /**
     * Initialise le service de synthèse vocale
     * @returns {Promise<Array>} Les voix disponibles
     */
    init() {
        return new Promise((resolve) => {
            const voices = this.synth.getVoices();
            if (voices.length) {
                this.voices = voices;
                resolve(voices);
            } else {
                this.synth.onvoiceschanged = () => {
                    this.voices = this.synth.getVoices();
                    resolve(this.voices);
                };
            }
        });
    }

    /**
     * Obtient la meilleure voix pour une langue donnée
     * @param {string} lang - Le code de langue (ex: 'fr-FR')
     * @returns {SpeechSynthesisVoice} La voix sélectionnée
     */
    getBestVoice(lang) {
        // Si aucune voix disponible, retourner null
        if (!this.voices || this.voices.length === 0) {
            console.warn("Aucune voix disponible");
            return null;
        }

        // Priorité à une voix correspondant exactement à la langue
        let voice = this.voices.find((v) => v.lang === lang);

        // Sinon, chercher une voix qui commence par le code de langue
        if (!voice) {
            voice = this.voices.find((v) =>
                v.lang.startsWith(lang.slice(0, 2))
            );
        }

        // Si toujours pas trouvé, prendre la première voix disponible
        if (!voice && this.voices.length > 0) {
            voice = this.voices[0];
        }

        return voice;
    }

    /**
     * Prononce un texte
     * @param {string} text - Le texte à prononcer
     * @param {string} lang - Le code de langue
     * @param {number} rate - La vitesse de lecture (0.1 à 2)
     * @returns {Promise<void>}
     */
    speak(text, lang = "fr-FR", rate = 0.65) {
        return new Promise((resolve, reject) => {
            if (!text) {
                reject(new Error("Texte non fourni"));
                return;
            }

            this.stop();

            this.utterance = new SpeechSynthesisUtterance(text);
            this.utterance.voice = this.getBestVoice(lang);
            this.utterance.rate = parseFloat(rate);
            this.utterance.pitch = 1;

            this.utterance.onend = () => {
                this.speaking = false;
                if (this.callbacks.onEnd) this.callbacks.onEnd();
                resolve();
            };

            this.utterance.onerror = (error) => {
                this.speaking = false;
                if (this.callbacks.onError) this.callbacks.onError(error);
                reject(error);
            };

            this.synth.speak(this.utterance);
            this.speaking = true;
            if (this.callbacks.onStart) this.callbacks.onStart();
        });
    }

    /**
     * Arrête la lecture
     */
    stop() {
        if (this.speaking) {
            this.synth.cancel();
            this.speaking = false;
            if (this.callbacks.onStop) this.callbacks.onStop();
        }
    }

    /**
     * Met en pause la lecture
     */
    pause() {
        if (this.speaking) {
            this.synth.pause();
            if (this.callbacks.onPause) this.callbacks.onPause();
        }
    }

    /**
     * Reprend la lecture
     */
    resume() {
        if (!this.speaking && this.utterance) {
            this.synth.resume();
            this.speaking = true;
            if (this.callbacks.onResume) this.callbacks.onResume();
        }
    }

    /**
     * Définit les callbacks pour les événements de lecture
     * @param {Object} callbacks - Les callbacks à définir
     */
    setCallbacks(callbacks) {
        this.callbacks = { ...this.callbacks, ...callbacks };
    }

    /**
     * Vérifie si la synthèse vocale est disponible
     * @returns {boolean}
     */
    isSupported() {
        return "speechSynthesis" in window;
    }

    /**
     * Liste les voix disponibles par langue
     * @returns {Object} Les voix regroupées par langue
     */
    getVoicesByLanguage() {
        if (!this.voices || this.voices.length === 0) {
            return {};
        }

        const voicesByLang = {};

        this.voices.forEach((voice) => {
            const langCode = voice.lang.slice(0, 2);
            if (!voicesByLang[langCode]) {
                voicesByLang[langCode] = [];
            }
            voicesByLang[langCode].push(voice);
        });

        return voicesByLang;
    }

    /**
     * Obtient les langues disponibles pour la synthèse vocale
     * @returns {Array<string>} Les codes de langue disponibles
     */
    getAvailableLanguages() {
        if (!this.voices || this.voices.length === 0) {
            return [];
        }

        const languages = new Set();
        this.voices.forEach((voice) => {
            languages.add(voice.lang.slice(0, 2));
        });

        return Array.from(languages);
    }

    /**
     * Vérifie si une langue spécifique est disponible
     * @param {string} langCode - Le code de langue à vérifier (ex: 'fr', 'en')
     * @returns {boolean} True si la langue est disponible
     */
    isLanguageAvailable(langCode) {
        if (!this.voices || this.voices.length === 0) {
            return false;
        }

        return this.voices.some((voice) => voice.lang.startsWith(langCode));
    }

    /**
     * Obtient l'état actuel de la synthèse vocale
     * @returns {Object} L'état actuel (speaking, voice, etc.)
     */
    getState() {
        return {
            speaking: this.speaking,
            currentVoice: this.utterance?.voice,
            currentRate: this.utterance?.rate,
            supported: this.isSupported(),
            availableVoices: this.voices.length,
        };
    }
}

export default new SpeechService();
