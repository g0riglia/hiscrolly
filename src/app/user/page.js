"use client"
import { useContext, useRef } from "react";
import styles from "./page.module.css";
import { GeneratedTimelineContext } from "@/components/GeneratedTimelineProvider";
import TopicCard from "@/components/TopicCard";
import TopicsList from "@/components/TopicsList";
import Link from "next/link";
import { Upload, PlusCircle } from "react-feather";

function UserPage() {
    const { timelines, uploadTimeline } = useContext(GeneratedTimelineContext);
    const fileInputRef = useRef(null);

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (!file.name.endsWith('.json')) {
            alert('Per favore, carica un file JSON valido.');
            return;
        }

        try {
            const text = await file.text();
            const timeline = JSON.parse(text);

            // Validate timeline structure
            if (!timeline.id || !timeline.title || !timeline.macros || !Array.isArray(timeline.macros)) {
                alert('Il file JSON non contiene una timeline valida. Assicurati che abbia id, title e macros.');
                return;
            }

            uploadTimeline(timeline);
            alert('Timeline caricata con successo!');

            // Reset file input
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        } catch (error) {
            console.error('Error uploading timeline:', error);
            alert('Errore nel caricamento della timeline. Assicurati che il file JSON sia valido.');
        }
    };

    return (
        <div className={styles.page}>
            <div className={styles.header}>
                <h2>Le tue timelines</h2>
                <div className={styles.headerButtons}>
                    <Link href="/create" className={styles.createButton}>
                        <PlusCircle size={18} />
                        <span>Crea nuova</span>
                    </Link>
                    <label className={styles.uploadButton}>
                        <Upload size={18} />
                        <span>Carica</span>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept=".json"
                            onChange={handleFileUpload}
                            style={{ display: 'none' }}
                        />
                    </label>
                </div>
            </div>
            {!timelines || timelines.length === 0 ? (
                <div className={styles.emptyState}>
                    <p>Non hai ancora generato nessuna timeline.</p>
                    <Link href="/create" className={styles.createButton}>
                        Crea la tua prima timeline
                    </Link>
                </div>
            ) : (
                <TopicsList
                    topics={timelines}
                    getHref={(topic, index) => `/user/${index}`}
                />
            )}
        </div>
    )
}

export default UserPage;