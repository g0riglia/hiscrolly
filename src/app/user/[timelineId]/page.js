"use client"
import { useState, useContext, useMemo, useCallback, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useImmerReducer } from "use-immer";
import styles from "./page.module.css";
import { GeneratedTimelineContext } from "@/components/GeneratedTimelineProvider";
import { Download, Trash2, Edit, Check, X, ArrowLeft, ArrowRight } from "react-feather";
import Timeline from "@/components/Timeline";
import OverflowMenu from "@/components/OverflowMenu";
import Quiz from "@/components/Quiz";
import Link from "next/link";
import EditableField from "@/components/EditableField";

function generateId() {
    return `id-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

function editReducer(draft, action) {
    switch (action.type) {
        case "SET_TIMELINE": {
            const timeline = action.payload;
            if (timeline?.macros) {
                timeline.macros.forEach(macro => {
                    if (macro.micros) {
                        macro.micros.forEach(micro => {
                            if (!micro.id) {
                                micro.id = generateId();
                            }
                        });
                    }
                });
            }
            return timeline;
        }
        case "UPDATE_FIELD":
            const keys = action.path.split(".");
            let obj = draft;
            for (let i = 0; i < keys.length - 1; i++) {
                obj = obj[keys[i]];
            }
            obj[keys[keys.length - 1]] = action.value;
            break;
        case "ADD_MACRO":
            draft.macros.push(action.payload);
            break;
        case "DELETE_MACRO":
            draft.macros.splice(action.macroIndex, 1);
            break;
        case "MOVE_MACRO": {
            const { macroIndex, direction } = action;
            const newIndex = macroIndex + direction;
            if (newIndex >= 0 && newIndex < draft.macros.length) {
                const temp = draft.macros[macroIndex];
                draft.macros[macroIndex] = draft.macros[newIndex];
                draft.macros[newIndex] = temp;
            }
            break;
        }
        case "ADD_MICRO":
            draft.macros[action.macroIndex].micros.push(action.payload);
            break;
        case "DELETE_MICRO":
            draft.macros[action.macroIndex].micros.splice(action.microIndex, 1);
            break;
        case "MOVE_MICRO": {
            const { macroIndex, microIndex, direction } = action;
            const micros = draft.macros[macroIndex].micros;
            const newIndex = microIndex + direction;
            if (newIndex >= 0 && newIndex < micros.length) {
                const temp = micros[microIndex];
                micros[microIndex] = micros[newIndex];
                micros[newIndex] = temp;
            }
            break;
        }
        case "CHANGE_MICRO_TYPE": {
            const micro = draft.macros[action.macroIndex].micros[action.microIndex];
            const newType = action.newType;
            micro.type = newType;
            // Reset content based on new type
            if (newType === "list" && !Array.isArray(micro.content)) {
                micro.content = micro.content ? [micro.content] : [];
            } else if (newType !== "list" && Array.isArray(micro.content)) {
                micro.content = micro.content.join("\n");
            }
            break;
        }
        case "RESET":
            return null;
        default:
            break;
    }
}

function UserTimelinePage() {
    const [editMode, setEditMode] = useState(false);
    const [editedTimeline, dispatchEdit] = useImmerReducer(editReducer, null);
    const params = useParams();
    const router = useRouter();
    const { timelines, deleteTimeline, updateTimeline } = useContext(GeneratedTimelineContext);
    const timelineId = params.timelineId;

    useEffect(() => {
        if (!editMode) return;

        const handleBeforeUnload = (e) => {
            e.preventDefault();
            e.returnValue = "";
            return "";
        };

        window.addEventListener("beforeunload", handleBeforeUnload);
        return () => window.removeEventListener("beforeunload", handleBeforeUnload);
    }, [editMode]);

    const updateField = useCallback((path, value) => {
        dispatchEdit({ type: "UPDATE_FIELD", path, value });
    }, [dispatchEdit]);

    const timeline = useMemo(() => {
        if (!timelines || !timelineId) return null;
        const index = parseInt(timelineId, 10);
        if (isNaN(index) || index < 0 || index >= timelines.length) return null;
        return timelines[index];
    }, [timelines, timelineId]);

    const addMacro = useCallback(() => {
        dispatchEdit({
            type: "ADD_MACRO",
            payload: {
                id: `macro-${Date.now()}`,
                title: "Nuovo macro-evento",
                date: "",
                summary: "",
                micros: []
            }
        });
    }, [dispatchEdit]);

    const deleteMacro = useCallback((macroIndex) => {
        dispatchEdit({ type: "DELETE_MACRO", macroIndex });
    }, [dispatchEdit]);

    // direction: -1 = move up, 1 = move down
    const moveMacro = useCallback((macroIndex, direction) => {
        dispatchEdit({ type: "MOVE_MACRO", macroIndex, direction });
    }, [dispatchEdit]);

    const addMicro = useCallback((macroIndex, type = "event") => {
        dispatchEdit({
            type: "ADD_MICRO",
            macroIndex,
            payload: {
                id: `micro-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                type,
                title: "Nuovo evento",
                date: "",
                content: type === "list" ? [] : ""
            }
        });
    }, [dispatchEdit]);

    const deleteMicro = useCallback((macroIndex, microIndex) => {
        dispatchEdit({ type: "DELETE_MICRO", macroIndex, microIndex });
    }, [dispatchEdit]);

    // direction: -1 = move up, 1 = move down
    const moveMicro = useCallback((macroIndex, microIndex, direction) => {
        dispatchEdit({ type: "MOVE_MICRO", macroIndex, microIndex, direction });
    }, [dispatchEdit]);

    const changeMicroType = useCallback((macroIndex, microIndex, newType) => {
        dispatchEdit({ type: "CHANGE_MICRO_TYPE", macroIndex, microIndex, newType });
    }, [dispatchEdit]);

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

    const handleEdit = () => {
        dispatchEdit({ type: "SET_TIMELINE", payload: structuredClone(timeline) });
        setEditMode(true);
    }

    const handleSaveEdits = () => {
        if (editedTimeline && updateTimeline) {
            const index = parseInt(timelineId, 10);
            updateTimeline(index, editedTimeline);
        }
        dispatchEdit({ type: "RESET" });
        setEditMode(false);
    }

    const handleCancelEdits = () => {
        if (confirm('Hai modifiche non salvate. Vuoi davvero uscire senza salvare?')) {
            dispatchEdit({ type: "RESET" });
            setEditMode(false);
        }
    }

    const displayTimeline = editMode && editedTimeline ? editedTimeline : timeline;

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            {editMode && (
                <div className={styles.editBanner}>
                    <p>Modalità modifica attiva</p>
                    <div className={styles.editButtons}>
                        <button onClick={handleSaveEdits}><Check /></button>
                        <button onClick={handleCancelEdits}><X /></button>
                    </div>
                </div>
            )}
            <div className={`${styles.page} ${editMode ? styles.editPage : ""}`}>
                <div className={styles.header}>
                    <h1 className={styles.titleWithButtons}>
                        <EditableField
                            value={displayTimeline.title}
                            onChange={(val) => updateField("title", val)}
                            editMode={editMode}
                            as="span"
                            className={styles.titleInput}
                        />
                        {!editMode && (
                            <OverflowMenu buttons={[
                                {
                                    name: "Scarica",
                                    action: handleDownload,
                                    icon: <Download />,
                                },
                                {
                                    name: "Cancella",
                                    action: handleDelete,
                                    icon: <Trash2 />,
                                },
                                {
                                    name: "Modifica",
                                    action: handleEdit,
                                    icon: <Edit />,
                                },
                            ]} />
                        )}
                    </h1>
                    {(displayTimeline.subtitle || editMode) && (
                        <EditableField
                            value={displayTimeline.subtitle || ""}
                            onChange={(val) => updateField("subtitle", val)}
                            editMode={editMode}
                            className={styles.subtitle}
                            placeholder="Sottotitolo..."
                        />
                    )}
                    {(displayTimeline.date || editMode) && (
                        <EditableField
                            value={displayTimeline.date || ""}
                            onChange={(val) => updateField("date", val)}
                            editMode={editMode}
                            className={styles.date}
                            placeholder="Data..."
                        />
                    )}
                    {(displayTimeline.description || editMode) && (
                        <EditableField
                            value={displayTimeline.description || ""}
                            onChange={(val) => updateField("description", val)}
                            editMode={editMode}
                            multiline
                            rows={4}
                            placeholder="Descrizione..."
                        />
                    )}
                </div>
                <h2>Timeline:</h2>
                <Timeline
                    topic={displayTimeline}
                    editMode={editMode}
                    updateField={updateField}
                    markers={markerPositions.map(pos => ({ position: pos }))}
                    addMacro={addMacro}
                    deleteMacro={deleteMacro}
                    moveMacro={moveMacro}
                    addMicro={addMicro}
                    deleteMicro={deleteMicro}
                    moveMicro={moveMicro}
                    changeMicroType={changeMicroType}
                />
                {displayTimeline.quiz && displayTimeline.quiz.length > 0 && (
                    <>
                        <h2>Quiz:</h2>
                        <Quiz quiz={displayTimeline.quiz} />
                    </>
                )}
            </div>
            {timeline.before || timeline.after ?
                (
                    <>
                        <h3 className={styles.eventsBeforeAfter}>Scopri come gli eventi sono collegati nel tempo</h3>
                        <div className={styles.beforeAfter}>
                            {timeline.before ? (
                                <Link className={styles.before} href={`/create?topic=${timeline.before.title}`}><ArrowLeft /> {timeline.before.title}</Link>) : null}
                            {timeline.before ? (
                                <Link className={styles.after} href={`/create?topic=${timeline.after.title}`}>{timeline.after.title} <ArrowRight /></Link>) : null}

                        </div>
                    </>)
                : null}
        </>
    );
}

export default UserTimelinePage;
