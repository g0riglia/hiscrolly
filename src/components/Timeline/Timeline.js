"use client"
import { useState } from "react";
import styles from "./Timeline.module.css";
import MacroTopic from "@/components/MacroTopic";

function Timeline({ topic, markers = [] }) {
    const [openedMacro, setOpenedMacro] = useState(null);

    return (
        <div className={styles.timeline}>
            <div className={styles.line}>
                {markers.map((marker, index) => (
                    <div
                        key={index}
                        className={styles.marker}
                        style={{ top: marker.top || `${marker.position}%` }}
                    />
                ))}
            </div>
            <div className={styles.content}>
                {topic.macros.map(macroTopic => (
                    <MacroTopic key={macroTopic.id} topic={macroTopic} isOpen={macroTopic.id === openedMacro ? true : false} setOpenedMacro={setOpenedMacro} />
                ))}
            </div>
        </div>
    )
}

export default Timeline;