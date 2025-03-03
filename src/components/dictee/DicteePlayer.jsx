import { useState, useEffect, useRef, useCallback } from "react";
import PropTypes from "prop-types";
import Button from "../ui/Button";
import TextField from "../ui/TextField";
import SpeechService from "../../services/SpeechService";

/**
 * Composant pour jouer une dictée
 * @param {Object} props - Les propriétés du composant
 * @returns {JSX.Element} Le lecteur de dictée
 */
const DicteePlayer = ({ dictee, onFinish }) => {
    // État local
    const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0);
    const [userInput, setUserInput] = useState("");
    const [results, setResults] = useState([]);
    const [score, setScore] = useState({ correct: 0, total: 0 });
    const [playbackRate, setPlaybackRate] = useState(0.65);
    const [isFinished, setIsFinished] = useState(false);
    const [disableInput, setDisableInput] = useState(false);
    const [error, setError] = useState(null);
    const [currentVoice, setCurrentVoice] = useState(null);
    const [speakingStatus, setSpeakingStatus] = useState("stopped"); // 'stopped', 'playing', 'paused'

    // Références
    const inputRef = useRef(null);

    /**
     * Initialise le service de synthèse vocale
     */
    const initSpeechService = useCallback(async () => {
        try {
            // Vérifier si la synthèse vocale est supportée
            if (!SpeechService.isSupported()) {
                setError(
                    "La synthèse vocale n'est pas supportée par votre navigateur."
                );
                return;
            }

            // Initialiser les voix
            await SpeechService.init();

            // Configurer les callbacks
            SpeechService.setCallbacks({
                onStart: () => setSpeakingStatus("playing"),
                onEnd: () => setSpeakingStatus("stopped"),
                onPause: () => setSpeakingStatus("paused"),
                onResume: () => setSpeakingStatus("playing"),
                onStop: () => setSpeakingStatus("stopped"),
                onError: (err) => {
                    setSpeakingStatus("stopped");
                    setError(
                        `Erreur de synthèse vocale : ${
                            err.message || "Erreur inconnue"
                        }`
                    );
                },
            });

            // Obtenir la meilleure voix pour la langue
            const voice = SpeechService.getBestVoice(dictee?.lang || "fr-FR");
            setCurrentVoice(voice);

            if (!voice) {
                setError(
                    `Aucune voix disponible pour la langue "${
                        dictee?.lang || "fr-FR"
                    }"`
                );
            }
        } catch (err) {
            setError(
                `Erreur d'initialisation de la synthèse vocale : ${
                    err.message || "Erreur inconnue"
                }`
            );
        }
    }, [dictee?.lang]);

    // Initialisation
    useEffect(() => {
        if (dictee && dictee.sentences && dictee.sentences.length > 0) {
            setResults(new Array(dictee.sentences.length).fill(null));
            setScore({ correct: 0, total: 0 });
            setCurrentSentenceIndex(0);
            setIsFinished(false);

            // Initialiser le service de synthèse vocale
            initSpeechService();
        }

        return () => {
            // Nettoyer le service de synthèse vocale
            SpeechService.stop();
        };
    }, [dictee, initSpeechService]);

    // Focus sur l'input
    useEffect(() => {
        if (inputRef.current && !isFinished) {
            inputRef.current.focus();
        }
    }, [currentSentenceIndex, isFinished]);

    /**
     * Lit la phrase courante
     */
    const speakCurrentSentence = async () => {
        if (!dictee || !dictee.sentences || dictee.sentences.length === 0)
            return;

        const sentence = dictee.sentences[currentSentenceIndex];
        if (!sentence) return;

        try {
            await SpeechService.speak(
                sentence,
                dictee.lang || "fr-FR",
                playbackRate
            );
        } catch (err) {
            setError(
                `Erreur de synthèse vocale : ${
                    err.message || "Erreur inconnue"
                }`
            );
        }
    };

    /**
     * Vérifie la réponse de l'utilisateur
     */
    const checkAnswer = () => {
        if (!dictee || !dictee.sentences || dictee.sentences.length === 0)
            return;

        // Désactiver l'input pendant la vérification
        setDisableInput(true);

        const currentSentence = dictee.sentences[currentSentenceIndex];
        const isCorrect =
            userInput.trim().toLowerCase() ===
            currentSentence.trim().toLowerCase();

        // Mettre à jour les résultats
        const newResults = [...results];
        newResults[currentSentenceIndex] = {
            sentence: currentSentence,
            userInput,
            isCorrect,
        };
        setResults(newResults);

        // Mettre à jour le score
        setScore((prev) => ({
            correct: prev.correct + (isCorrect ? 1 : 0),
            total: prev.total + 1,
        }));

        // Si c'est incorrect, afficher la réponse correcte
        if (!isCorrect) {
            setTimeout(() => {
                setUserInput(currentSentence);

                // Après un délai, passer à la phrase suivante
                setTimeout(() => {
                    goToNextSentence();
                }, 1500);
            }, 500);
        } else {
            // Si c'est correct, passer directement à la phrase suivante
            goToNextSentence();
        }
    };

    /**
     * Passe à la phrase suivante
     */
    const goToNextSentence = () => {
        // Arrêter la synthèse vocale
        SpeechService.stop();

        // Réinitialiser l'input
        setUserInput("");
        setDisableInput(false);

        // Vérifier si c'est la dernière phrase
        if (currentSentenceIndex >= dictee.sentences.length - 1) {
            setIsFinished(true);
        } else {
            // Passer à la phrase suivante
            setCurrentSentenceIndex((prev) => prev + 1);
        }
    };

    /**
     * Gère l'appui sur la touche Entrée
     */
    const handleKeyDown = (e) => {
        if (e.key === "Enter" && userInput.trim() && !disableInput) {
            checkAnswer();
        }
    };

    /**
     * Télécharge les résultats au format PDF (stub)
     */
    const downloadResults = () => {
        // Pour l'instant, simplement afficher un message
        alert("Fonctionnalité de téléchargement des résultats à implémenter");

        // Appeler le callback de fin
        if (onFinish) {
            onFinish(results, score);
        }
    };

    /**
     * Recommence la dictée
     */
    const restartDictee = () => {
        setResults(new Array(dictee.sentences.length).fill(null));
        setScore({ correct: 0, total: 0 });
        setCurrentSentenceIndex(0);
        setUserInput("");
        setIsFinished(false);
    };

    // Calcul du pourcentage de réussite
    const successRate =
        score.total > 0 ? Math.round((score.correct / score.total) * 100) : 0;

    // Couleur de fond basée sur le taux de réussite
    const getBackgroundColor = () => {
        if (score.total === 0) return "rgb(255, 255, 255)";

        // Plus le taux est élevé, plus on tend vers le vert
        const r = Math.round(255 - successRate * 2.55);
        const g = Math.round(successRate * 2.55);

        return `rgb(${r}, ${g}, 0)`;
    };

    // Si pas de dictée, afficher un message
    if (!dictee || !dictee.sentences || dictee.sentences.length === 0) {
        return (
            <div className="bg-white shadow-md rounded-lg p-6 text-center">
                <p className="text-gray-500">Aucune dictée à lire</p>
            </div>
        );
    }

    return (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-800">
                    Dictée : {dictee.title}
                </h2>
            </div>

            <div className="p-6">
                {error && (
                    <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md">
                        {error}
                    </div>
                )}

                {isFinished ? (
                    /* Écran de fin */
                    <div className="text-center">
                        <div className="mb-6">
                            <h3 className="text-xl font-semibold mb-2">
                                Dictée terminée !
                            </h3>
                            <div
                                className="inline-block px-6 py-3 rounded-lg"
                                style={{
                                    backgroundColor: getBackgroundColor(),
                                    color: "white",
                                }}
                            >
                                {successRate}% de réussite
                            </div>
                            <p className="mt-2 text-gray-600">
                                {score.correct} mot(s) correct(s) sur{" "}
                                {score.total}
                            </p>
                        </div>

                        <div className="mb-6">
                            <TextField
                                label="Votre prénom"
                                placeholder="Anonyme"
                                id="pseudo"
                                name="pseudo"
                                className="max-w-xs mx-auto"
                            />
                        </div>

                        <div className="flex justify-center space-x-4">
                            <Button variant="success" onClick={downloadResults}>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-5 w-5 mr-2"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                                Télécharger les résultats
                            </Button>
                            <Button variant="outline" onClick={restartDictee}>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-5 w-5 mr-2"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                                Recommencer
                            </Button>
                        </div>

                        {/* Récapitulatif des résultats */}
                        <div className="mt-8">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">
                                Récapitulatif
                            </h3>
                            <div className="divide-y divide-gray-200">
                                {results.map(
                                    (result, index) =>
                                        result && (
                                            <div
                                                key={index}
                                                className={`py-3 ${
                                                    result.isCorrect
                                                        ? "bg-green-50"
                                                        : "bg-red-50"
                                                }`}
                                            >
                                                <div className="flex items-center">
                                                    <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-white text-gray-800 rounded-full font-semibold mr-3 border">
                                                        {index + 1}
                                                    </span>
                                                    <div className="flex-1">
                                                        <p className="font-medium">
                                                            {result.sentence}
                                                        </p>
                                                        {!result.isCorrect && (
                                                            <p className="text-red-600 text-sm mt-1">
                                                                Vous avez écrit
                                                                :{" "}
                                                                {
                                                                    result.userInput
                                                                }
                                                            </p>
                                                        )}
                                                    </div>
                                                    <div className="flex-shrink-0">
                                                        {result.isCorrect ? (
                                                            <svg
                                                                className="h-6 w-6 text-green-500"
                                                                fill="none"
                                                                viewBox="0 0 24 24"
                                                                stroke="currentColor"
                                                            >
                                                                <path
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                    strokeWidth="2"
                                                                    d="M5 13l4 4L19 7"
                                                                />
                                                            </svg>
                                                        ) : (
                                                            <svg
                                                                className="h-6 w-6 text-red-500"
                                                                fill="none"
                                                                viewBox="0 0 24 24"
                                                                stroke="currentColor"
                                                            >
                                                                <path
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                    strokeWidth="2"
                                                                    d="M6 18L18 6M6 6l12 12"
                                                                />
                                                            </svg>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                )}
                            </div>
                        </div>
                    </div>
                ) : (
                    /* Interface de dictée */
                    <div>
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <p className="text-sm text-gray-500">
                                    Phrase {currentSentenceIndex + 1} sur{" "}
                                    {dictee.sentences.length}
                                </p>
                                {/* Affichage de la voix utilisée */}
                                {currentVoice && (
                                    <p className="text-xs text-gray-500 mt-1">
                                        Voix: {currentVoice.name} (
                                        {currentVoice.lang})
                                    </p>
                                )}
                            </div>
                            <div className="flex items-center space-x-2">
                                <label className="text-sm text-gray-700">
                                    Débit :
                                </label>
                                <div className="flex space-x-2">
                                    <label className="inline-flex items-center">
                                        <input
                                            type="radio"
                                            name="playbackRate"
                                            value="0.65"
                                            checked={playbackRate === 0.65}
                                            onChange={() =>
                                                setPlaybackRate(0.65)
                                            }
                                            className="form-radio h-4 w-4 text-primary-600"
                                        />
                                        <span className="ml-1 text-sm text-gray-700">
                                            Normal
                                        </span>
                                    </label>
                                    <label className="inline-flex items-center">
                                        <input
                                            type="radio"
                                            name="playbackRate"
                                            value="0.45"
                                            checked={playbackRate === 0.45}
                                            onChange={() =>
                                                setPlaybackRate(0.45)
                                            }
                                            className="form-radio h-4 w-4 text-primary-600"
                                        />
                                        <span className="ml-1 text-sm text-gray-700">
                                            Moyen
                                        </span>
                                    </label>
                                    <label className="inline-flex items-center">
                                        <input
                                            type="radio"
                                            name="playbackRate"
                                            value="0.25"
                                            checked={playbackRate === 0.25}
                                            onChange={() =>
                                                setPlaybackRate(0.25)
                                            }
                                            className="form-radio h-4 w-4 text-primary-600"
                                        />
                                        <span className="ml-1 text-sm text-gray-700">
                                            Lent
                                        </span>
                                    </label>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center mb-6">
                            <div className="md:col-span-2">
                                <Button
                                    variant="warning"
                                    fullWidth
                                    onClick={speakCurrentSentence}
                                    disabled={speakingStatus === "playing"}
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-5 w-5 mr-1"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                    Écouter
                                </Button>
                            </div>
                            <div className="md:col-span-8">
                                <TextField
                                    ref={inputRef}
                                    value={userInput}
                                    onChange={(e) =>
                                        setUserInput(e.target.value)
                                    }
                                    onKeyDown={handleKeyDown}
                                    disabled={disableInput}
                                    fullWidth
                                    className="text-center"
                                    placeholder="Tapez ce que vous entendez..."
                                />
                            </div>
                            <div className="md:col-span-2">
                                <Button
                                    variant="success"
                                    fullWidth
                                    onClick={checkAnswer}
                                    disabled={!userInput.trim() || disableInput}
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-5 w-5 mr-1"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                    Valider
                                </Button>
                            </div>
                        </div>

                        {/* Statut de la synthèse vocale */}
                        <div className="text-center mb-4">
                            {speakingStatus === "playing" && (
                                <div className="text-xs text-primary-600 flex items-center justify-center">
                                    <svg
                                        className="animate-pulse h-4 w-4 mr-1"
                                        viewBox="0 0 24 24"
                                        fill="currentColor"
                                    >
                                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                                    </svg>
                                    Lecture en cours...
                                </div>
                            )}
                        </div>

                        {/* Résultats partiels */}
                        <div className="mt-8">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {results.map((result, index) => (
                                    <div
                                        key={index}
                                        className={`p-3 rounded-md text-center ${
                                            result
                                                ? result.isCorrect
                                                    ? "bg-green-100 text-green-800"
                                                    : "bg-red-100 text-red-800"
                                                : "bg-gray-100 text-gray-400"
                                        }`}
                                    >
                                        {result
                                            ? result.sentence
                                            : `Phrase ${index + 1}`}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Indicateur de progression */}
                        <div className="mt-6 text-center">
                            <div
                                className="py-2 px-4 rounded-md inline-block"
                                style={{
                                    backgroundColor: getBackgroundColor(),
                                    color: "white",
                                }}
                            >
                                {successRate}% de réussite
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

DicteePlayer.propTypes = {
    dictee: PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
        title: PropTypes.string.isRequired,
        sentences: PropTypes.arrayOf(PropTypes.string).isRequired,
        lang: PropTypes.string,
    }).isRequired,
    onFinish: PropTypes.func,
};

export default DicteePlayer;
