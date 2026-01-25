import styles from "./MicroEvent.module.css";
import { Calendar, ChevronUp, ChevronDown, Trash2 } from "react-feather";
import EditableField from "@/components/EditableField";

function MicroEvent({ 
    micro, 
    macroIndex, 
    microIndex, 
    totalMicros,
    editMode, 
    updateField,
    deleteMicro,
    moveMicro,
    changeMicroType
}) {
    //type = event | list | focus | text (more below)
    const { type, title, date, content } = micro;
    
    // Base path for this micro's fields
    const basePath = `macros.${macroIndex}.micros.${microIndex}`;

    const canMoveUp = microIndex > 0;
    const canMoveDown = microIndex < totalMicros - 1;

    // Edit controls component with type selector
    const EditControls = () => (
        <div className={styles.editControls}>
            <select 
                value={type}
                onChange={(e) => changeMicroType?.(macroIndex, microIndex, e.target.value)}
                className={styles.typeSelect}
                title="Tipo di contenuto"
            >
                <option value="event">Evento</option>
                <option value="focus">In evidenza</option>
                <option value="list">Elenco</option>
                <option value="text">Approfondimento</option>
            </select>
            <div className={styles.controlButtons}>
                <button 
                    onClick={() => moveMicro?.(macroIndex, microIndex, -1)} 
                    disabled={!canMoveUp}
                    title="Sposta su"
                    className={styles.controlBtn}
                >
                    <ChevronUp />
                </button>
                <button 
                    onClick={() => moveMicro?.(macroIndex, microIndex, 1)} 
                    disabled={!canMoveDown}
                    title="Sposta giù"
                    className={styles.controlBtn}
                >
                    <ChevronDown />
                </button>
                <button 
                    onClick={() => deleteMicro?.(macroIndex, microIndex)} 
                    title="Elimina contenuto"
                    className={`${styles.controlBtn} ${styles.deleteBtn}`}
                >
                    <Trash2 />
                </button>
            </div>
        </div>
    );


    //the normal type: title, date and text
    if (type === "event") {
        return (
            <div className={`${styles.event} ${editMode ? styles.editing : ""}`}>
                {editMode && <EditControls />}
                <EditableField
                    value={title}
                    onChange={(val) => updateField?.(`${basePath}.title`, val)}
                    editMode={editMode}
                    as="h6"
                    className={styles.title}
                    placeholder="Titolo evento..."
                />
                {(date || editMode) && (
                    <p className={styles.date}>
                        <Calendar />
                        <EditableField
                            value={date || ""}
                            onChange={(val) => updateField?.(`${basePath}.date`, val)}
                            editMode={editMode}
                            as="span"
                            placeholder="Data..."
                        />
                    </p>
                )}
                <EditableField
                    value={content}
                    onChange={(val) => updateField?.(`${basePath}.content`, val)}
                    editMode={editMode}
                    multiline
                    rows={3}
                    placeholder="Contenuto..."
                />
            </div>
        );
    }

    //a list (with a title maybe)
    if (type === "list") {
        return (
            <div className={`${styles.list} ${editMode ? styles.editing : ""}`}>
                {editMode && <EditControls />}
                {(title || editMode) && (
                    <EditableField
                        value={title || ""}
                        onChange={(val) => updateField?.(`${basePath}.title`, val)}
                        editMode={editMode}
                        as="h6"
                        className={styles.title}
                        placeholder="Titolo lista..."
                    />
                )}
                {/* For lists, content is an array - show as text in edit mode */}
                {editMode ? (
                    <EditableField
                        value={Array.isArray(content) ? content.join("\n") : content}
                        onChange={(val) => updateField?.(`${basePath}.content`, val.split("\n"))}
                        editMode={editMode}
                        multiline
                        rows={4}
                        placeholder="Un elemento per riga..."
                    />
                ) : (
                    content.map((item, index) => (
                        <li key={index}>{item}</li>
                    ))
                )}
            </div>
        );
    }

    //important informations
    if (type === "focus") {
        return (
            <div className={`${styles.focus} ${editMode ? styles.editing : ""}`}>
                {editMode && <EditControls />}
                <EditableField
                    value={title}
                    onChange={(val) => updateField?.(`${basePath}.title`, val)}
                    editMode={editMode}
                    as="h6"
                    placeholder="Titolo focus..."
                />
                {(date || editMode) && (
                    <EditableField
                        value={date || ""}
                        onChange={(val) => updateField?.(`${basePath}.date`, val)}
                        editMode={editMode}
                        placeholder="Data..."
                    />
                )}
            </div>
        );
    }

    //long texts
    if (type === "text") {
        return (
            <div className={`${styles.text} ${editMode ? styles.editing : ""}`}>
                {editMode && <EditControls />}
                <EditableField
                    value={title}
                    onChange={(val) => updateField?.(`${basePath}.title`, val)}
                    editMode={editMode}
                    as="h6"
                    className={styles.title}
                    placeholder="Titolo..."
                />
                <EditableField
                    value={content}
                    onChange={(val) => updateField?.(`${basePath}.content`, val)}
                    editMode={editMode}
                    multiline
                    rows={5}
                    placeholder="Contenuto..."
                />
            </div>
        )
    }

    // Fallback for unknown types
    return null;
}

export default MicroEvent;