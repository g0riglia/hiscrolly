"use client";
import { forwardRef } from "react";
import { AnimatePresence } from "framer-motion";
import styles from "./MacroTopic.module.css";
import { ChevronDown, ChevronUp, Trash2 } from "react-feather";
import MicroTimeline from "../MicroTimeline";
import EditableField from "@/components/EditableField";

const MacroTopic = forwardRef(function MacroTopic({ 
    topic, 
    macroIndex,
    totalMacros,
    isOpen, 
    setOpenedMacro,
    editMode,
    updateField,
    deleteMacro,
    moveMacro,
    addMicro,
    deleteMicro,
    moveMicro,
    changeMicroType
}, ref) {
    // Base path for this macro's fields
    const basePath = `macros.${macroIndex}`;

    // In edit mode, use a div instead of button to allow input interaction
    const CardWrapper = editMode ? "div" : "button";

    const canMoveUp = macroIndex > 0;
    const canMoveDown = macroIndex < totalMacros - 1;

    return (
        <div className={styles.container} ref={ref}>
            <CardWrapper 
                className={`${styles.card} ${editMode ? styles.editCard : ""}`} 
                onClick={editMode ? undefined : () => setOpenedMacro(isOpen ? null : topic.id)}
            >
                {editMode && (
                    <div className={styles.editControls}>
                        <button 
                            onClick={() => moveMacro?.(macroIndex, -1)} 
                            disabled={!canMoveUp}
                            title="Sposta su"
                            className={styles.controlBtn}
                        >
                            <ChevronUp />
                        </button>
                        <button 
                            onClick={() => moveMacro?.(macroIndex, 1)} 
                            disabled={!canMoveDown}
                            title="Sposta giù"
                            className={styles.controlBtn}
                        >
                            <ChevronDown />
                        </button>
                        <button 
                            onClick={() => deleteMacro?.(macroIndex)} 
                            title="Elimina capitolo"
                            className={`${styles.controlBtn} ${styles.deleteBtn}`}
                        >
                            <Trash2 />
                        </button>
                    </div>
                )}
                <EditableField
                    value={topic.title}
                    onChange={(val) => updateField?.(`${basePath}.title`, val)}
                    editMode={editMode}
                    as="h5"
                    placeholder="Titolo capitolo..."
                />
                <EditableField
                    value={topic.date || ""}
                    onChange={(val) => updateField?.(`${basePath}.date`, val)}
                    editMode={editMode}
                    className={styles.date}
                    placeholder="Periodo (es. 1914-1918)..."
                />
                <EditableField
                    value={topic.summary || ""}
                    onChange={(val) => updateField?.(`${basePath}.summary`, val)}
                    editMode={editMode}
                    multiline
                    rows={2}
                    className={styles.summary}
                    placeholder="Breve descrizione..."
                />
                {!editMode && (
                    <div className={styles.cta}>
                        <span>Approfondisci</span>
                        <ChevronDown />
                    </div>
                )}
            </CardWrapper>
            <AnimatePresence>
                {(isOpen || editMode) && (
                    <MicroTimeline 
                        contents={topic.micros} 
                        macroIndex={macroIndex}
                        editMode={editMode}
                        updateField={updateField}
                        addMicro={addMicro}
                        deleteMicro={deleteMicro}
                        moveMicro={moveMicro}
                        changeMicroType={changeMicroType}
                    />
                )}
            </AnimatePresence>
        </div>
    )
});

export default MacroTopic;