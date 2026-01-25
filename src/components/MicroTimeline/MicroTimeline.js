"use client";
import { motion, LayoutGroup } from "framer-motion";
import styles from "./MicroTimeline.module.css";
import MicroEvent from "@/components/MicroEvent";
import { PlusCircle } from "react-feather";

function MicroTimeline({ 
    contents = [], 
    macroIndex, 
    editMode, 
    updateField,
    addMicro,
    deleteMicro,
    moveMicro,
    changeMicroType
}) {
    const totalMicros = contents.length;

    return (
        <motion.div
            className={styles.container}
            initial={editMode ? false : { opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4, ease: [0.34, 1.56, 0.64, 1] }}
        >
            <motion.div
                className={styles.line}
                initial={editMode ? false : { scaleY: 0 }}
                animate={{ scaleY: 1 }}
                transition={{ duration: 0.5, delay: 0.1, ease: [0.34, 1.56, 0.64, 1] }}
            />
            <LayoutGroup id={`micro-${macroIndex}`}>
                <div className={styles.content}>
                    {contents.map((content, microIndex) => (
                        <motion.div
                            key={content.id || `fallback-${microIndex}`}
                            className={styles.contentItem}
                            layout
                            initial={editMode ? false : { opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{
                                layout: { 
                                    type: "spring", 
                                    stiffness: 350, 
                                    damping: 30 
                                },
                                duration: 0.4,
                                delay: editMode ? 0 : 0.2 + (microIndex * 0.1),
                                ease: [0.34, 1.56, 0.64, 1]
                            }}
                        >
                            <motion.div
                                className={styles.connector}
                                layout
                                initial={editMode ? false : { scaleX: 0 }}
                                animate={{ scaleX: 1 }}
                                transition={{
                                    layout: { 
                                        type: "spring", 
                                        stiffness: 350, 
                                        damping: 30 
                                    },
                                    duration: 0.3,
                                    delay: editMode ? 0 : 0.3 + (microIndex * 0.1),
                                    ease: [0.34, 1.56, 0.64, 1]
                                }}
                            />
                            <MicroEvent 
                                micro={content}
                                macroIndex={macroIndex}
                                microIndex={microIndex}
                                totalMicros={totalMicros}
                                editMode={editMode}
                                updateField={updateField}
                                deleteMicro={deleteMicro}
                                moveMicro={moveMicro}
                                changeMicroType={changeMicroType}
                            />
                        </motion.div>
                    ))}
                    {editMode && (
                        <motion.button 
                            layout
                            onClick={() => addMicro?.(macroIndex)} 
                            className={styles.addMicroBtn}
                        >
                            <PlusCircle /> Aggiungi Contenuto
                        </motion.button>
                    )}
                </div>
            </LayoutGroup>
        </motion.div>
    )
}

export default MicroTimeline;