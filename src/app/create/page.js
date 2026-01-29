"use client"
import { useState, useContext } from "react";
import { useRouter } from "next/navigation";
import { GeneratedTimelineContext } from "@/components/GeneratedTimelineProvider/GeneratedTimelineProvider";
import styles from "./page.module.css"
import { useSearchParams } from "next/navigation";

function CreatePage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const initialTopic = searchParams ? searchParams.get("topic") : "";
    const { addTimeline } = useContext(GeneratedTimelineContext);
    const [topic, setTopic] = useState(initialTopic);
    const [file, setFile] = useState(null);
    const [fileContent, setFileContent] = useState(null);
    const [detailLevel, setDetailLevel] = useState("Medio");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleFileChange = async (e) => {
        const selectedFile = e.target.files[0];
        if (!selectedFile) {
            setFile(null);
            setFileContent(null);
            return;
        }

        setFile(selectedFile);
        setError(null);

        // Read file content based on file type
        try {
            const content = await readFileContent(selectedFile);
            setFileContent(content);
        } catch (err) {
            setError("Errore nella lettura del file. Assicurati che sia un file valido.");
            console.error("File reading error:", err);
        }
    };

    const readFileContent = async (file) => {
        const fileType = file.type;
        const fileName = file.name.toLowerCase();

        // Handle text files
        if (fileType === "text/plain" || fileName.endsWith(".txt")) {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = (e) => resolve(e.target.result);
                reader.onerror = reject;
                reader.readAsText(file);
            });
        }
        // Handle audio files - need transcription
        else if (
            fileType.startsWith("audio/") ||
            fileName.endsWith(".mp3") ||
            fileName.endsWith(".wav") ||
            fileName.endsWith(".m4a") ||
            fileName.endsWith(".ogg") ||
            fileName.endsWith(".webm")
        ) {
            try {
                const transcribedText = await transcribeAudio(file);
                return transcribedText;
            } catch (err) {
                setError("Errore nella trascrizione dell'audio. Assicurati che il file audio sia valido e chiaro.");
                throw err;
            }
        }
        // Handle PDF files
        else if (fileType === "application/pdf" || fileName.endsWith(".pdf")) {
            try {
                const extractedText = await extractTextFromPDF(file);
                return extractedText;
            } catch (err) {
                setError("Errore nell'estrazione del testo dal PDF. Assicurati che il PDF contenga testo selezionabile.");
                throw err;
            }
        }
        // Handle Word documents - also need special handling
        else if (
            fileType.includes("word") ||
            fileName.endsWith(".doc") ||
            fileName.endsWith(".docx")
        ) {
            setError("I file Word richiedono un'elaborazione speciale. Per ora, usa file di testo (.txt) o esporta il documento come testo.");
            throw new Error("Word documents not directly supported");
        }
        else {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = (e) => resolve(e.target.result);
                reader.onerror = reject;
                reader.readAsText(file);
            });
        }
    };

    const transcribeAudio = async (audioFile) => {
        const formData = new FormData();
        formData.append("audio", audioFile);

        try {
            const response = await fetch("/api/transcribe", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                throw new Error("Trascrizione fallita");
            }

            const data = await response.json();
            return data.text;
        } catch (error) {
            throw new Error("La trascrizione audio richiede un servizio di trascrizione. Per ora, usa file di testo o converti l'audio in testo.");
        }
    };

    const extractTextFromPDF = async (pdfFile) => {
        const pdfjsLib = await import("pdfjs-dist");
        pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

        const arrayBuffer = await pdfFile.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

        let fullText = "";

        for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();
            const pageText = textContent.items
                .map((item) => item.str)
                .join(" ");
            fullText += pageText + "\n\n";
        }

        if (!fullText.trim()) {
            throw new Error("Il PDF non contiene testo estraibile. Potrebbe essere un PDF scansionato.");
        }

        return fullText.trim();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch("/api/generate-timeline", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    topic,
                    fileContent,
                    detailLevel,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || data.message || "Errore nella generazione della timeline");
            }

            // Save timeline to context and redirect
            if (data && data.title && addTimeline) {
                // Add timeline to the array (will be first/latest)
                addTimeline(data);

                // Use window.location for a hard redirect to ensure page reloads and reads from localStorage
                window.location.href = "/user/0";
            } else if (!addTimeline) {
                throw new Error("Context non disponibile. Impossibile salvare la timeline.");
            } else {
                throw new Error("Timeline non generata correttamente. Struttura dati non valida.");
            }
        } catch (err) {
            setError(err.message || "Errore nella generazione della timeline. Riprova.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={styles.page}>
            <h2>Crea una nuova timeline</h2>
            <form className={styles.form} onSubmit={handleSubmit}>
                <div className={styles.formGroup}>
                    <label htmlFor="topic">Argomento della timeline</label>
                    <input
                        id="topic"
                        type="text"
                        placeholder="Il dopoguerra in Europa"
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                        required
                    />
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="file">Aggiungi un file</label>
                    <div className={styles.fileInputWrapper}>
                        <input
                            id="file"
                            type="file"
                            accept=".pdf,.txt,.doc,.docx,.mp3,.wav,.m4a,.ogg,.webm"
                            onChange={handleFileChange}
                        />
                        {file && (
                            <span className={styles.fileName}>{file.name}</span>
                        )}
                    </div>
                    <p className={styles.tip}>PDF, testo, audio o appunti: l&apos;AI li user&agrave; per costruire la timeline</p>
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="detailLevel">Livello di dettaglio</label>
                    <select
                        id="detailLevel"
                        value={detailLevel}
                        onChange={(e) => setDetailLevel(e.target.value)}
                    >
                        <option value="Essenziale">Essenziale</option>
                        <option value="Medio">Medio</option>
                        <option value="Approfondito">Approfondito</option>
                    </select>
                </div>

                {error && (
                    <div className={styles.error}>
                        {error}
                    </div>
                )}

                <button
                    type="submit"
                    className={styles.submitButton}
                    disabled={isLoading || !topic.trim()}
                >
                    {isLoading ? "Generazione in corso..." : "Genera timeline"}
                </button>
            </form>
        </div>
    )
}

export default CreatePage;