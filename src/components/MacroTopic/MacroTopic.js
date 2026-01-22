"use client";
import { AnimatePresence } from "framer-motion";
import styles from "./MacroTopic.module.css";
import { ChevronDown } from "react-feather";
import MicroTimeline from "../MicroTimeline";

function MacroTopic({ topic, isOpen, setOpenedMacro }) {
    console.log(topic.micros)
    return (
        <div className={styles.container}>
            <button className={styles.card} onClick={() => setOpenedMacro(isOpen ? null : topic.id)}>
                <h5>{topic.title}</h5>
                <p className={styles.date}>{topic.date}</p>
                <p className={styles.summary}>{topic.summary}</p>
                <div className={styles.cta}>
                    <span>Approfondisci</span>
                    <ChevronDown />
                </div>
            </button>
            <AnimatePresence>
                {isOpen && <MicroTimeline contents={topic.micros} />}
            </AnimatePresence>
        </div>
    )
}

export default MacroTopic;