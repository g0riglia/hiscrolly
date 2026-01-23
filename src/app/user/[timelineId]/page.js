"use client"
import { useContext, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import styles from "./page.module.css";
import { GeneratedTimelineContext } from "@/components/GeneratedTimelineProvider";
import Timeline from "@/components/Timeline";
import Quiz from "@/components/Quiz";
import Link from "next/link";
import { Download, Trash2 } from "react-feather";

function UserTimelinePage() {
    const params = useParams();
    const router = useRouter();
    const { timelines, deleteTimeline } = useContext(GeneratedTimelineContext);
    const timelineId = params.timelineId;

    // Get timeline by index
    const timeline = useMemo(() => {
        if (!timelines || !timelineId) return null;
        const index = parseInt(timelineId, 10);
        if (isNaN(index) || index < 0 || index >= timelines.length) return null;
        return timelines[index];
    }, [timelines, timelineId]);

    // Handle case where timeline is not found
    if (!timeline) {
        return (
            <div className={styles.page}>
                <div className={styles.emptyState}>
                    <h2>Timeline non trovata</h2>
                    <p>La timeline che stai cercando non esiste o è stata eliminata.</p>
                    <Link href="/user" className={styles.createButton}>
                        Torna alle tue timeline
                    </Link>
                </div>
            </div>
        );
    }

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": timeline.title,
        "description": timeline.description,
        "datePublished": new Date().toISOString(),
        "author": {
            "@type": "Organization",
            "name": "Hiscrolly"
        },
        "publisher": {
            "@type": "Organization",
            "name": "Hiscrolly"
        }
    };

    // Calculate marker positions based on number of macros
    const markerPositions = timeline.macros?.map((_, index, array) => {
        if (array.length === 1) return 50;
        return (index / (array.length - 1)) * 100;
    }) || [];

    const handleDownload = () => {
        const dataStr = JSON.stringify(timeline, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${timeline.id || 'timeline'}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    const handleDelete = () => {
        if (confirm('Sei sicuro di voler eliminare questa timeline?')) {
            const index = parseInt(timelineId, 10);
            deleteTimeline(index);
            router.push('/user');
        }
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <div className={styles.page}>
                <div className={styles.header}>
                    <h1 className={styles.titleWithButtons}>
                        {timeline.title}
                        <div className={styles.buttons}>
                            <button 
                                onClick={handleDownload} 
                                className={styles.button}
                                aria-label="Scarica timeline"
                                title="Scarica timeline"
                            >
                                <Download size={20} />
                            </button>
                            <button 
                                onClick={handleDelete} 
                                className={styles.button}
                                aria-label="Elimina timeline"
                                title="Elimina timeline"
                            >
                                <Trash2 size={20} />
                            </button>
                        </div>
                    </h1>
                    {timeline.subtitle && (
                        <p className={styles.subtitle}>{timeline.subtitle}</p>
                    )}
                    {timeline.date && (
                        <p className={styles.date}>{timeline.date}</p>
                    )}
                    {timeline.description && (
                        <p>{timeline.description}</p>
                    )}
                </div>
                <h2>Timeline:</h2>
                <Timeline topic={timeline} markers={markerPositions.map(pos => ({ position: pos }))} />
                {timeline.quiz && timeline.quiz.length > 0 && (
                    <>
                        <h2>Quiz:</h2>
                        <Quiz quiz={timeline.quiz} />
                    </>
                )}
            </div>
        </>
    );
}

export default UserTimelinePage;
