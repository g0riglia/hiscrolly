"use client"
import { useState, useEffect, useRef } from "react";
import { LayoutGroup, motion } from "framer-motion";
import styles from "./Timeline.module.css";
import MacroTopic from "@/components/MacroTopic";
import { PlusCircle } from "react-feather";

function Timeline({ 
    topic, 
    editMode, 
    updateField, 
    markers = [], 
    addMacro,
    deleteMacro,
    moveMacro,
    addMicro,
    deleteMicro,
    moveMicro,
    changeMicroType
}) {
    const [openedMacro, setOpenedMacro] = useState(null);
    const openedMacroRef = useRef();
    const totalMacros = topic.macros?.length || 0;

    useEffect(() => {
        if (openedMacro && openedMacroRef.current) {
            setTimeout(() => {
                openedMacroRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
            }, 100);
        }
    }, [openedMacro])

    return (
        <div className={`${styles.timeline} ${editMode ? styles.editMode : ""}`}>
            <div className={styles.line}>
                {markers.map((marker, index) => (
                    <div
                        key={index}
                        className={styles.marker}
                        style={{ top: marker.top || `${marker.position}%` }}
                    />
                ))}
            </div>
            <LayoutGroup>
                <div className={styles.content}>
                    {topic.macros.map((macroTopic, macroIndex) => (
                        <motion.div
                            key={macroTopic.id}
                            layout
                            transition={{
                                layout: { 
                                    type: "spring", 
                                    stiffness: 350, 
                                    damping: 30 
                                }
                            }}
                        >
                            <MacroTopic
                                topic={macroTopic}
                                macroIndex={macroIndex}
                                totalMacros={totalMacros}
                                isOpen={macroTopic.id === openedMacro}
                                ref={macroTopic.id === openedMacro ? openedMacroRef : null}
                                setOpenedMacro={setOpenedMacro}
                                editMode={editMode}
                                updateField={updateField}
                                deleteMacro={deleteMacro}
                                moveMacro={moveMacro}
                                addMicro={addMicro}
                                deleteMicro={deleteMicro}
                                moveMicro={moveMicro}
                                changeMicroType={changeMicroType}
                            />
                        </motion.div>
                    ))}
                    {editMode && (
                        <motion.button 
                            layout
                            onClick={() => addMacro()} 
                            className={styles.newMacroBtn}
                        >
                            <PlusCircle /> Aggiungi Capitolo
                        </motion.button>
                    )}
                </div>
            </LayoutGroup>
        </div>
    )
}

export default Timeline;