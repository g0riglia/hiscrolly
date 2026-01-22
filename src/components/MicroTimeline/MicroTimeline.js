"use client";
import { motion } from "framer-motion";
import styles from "./MicroTimeline.module.css";
import MicroEvent from "@/components/MicroEvent";

function MicroTimeline({ contents = [] }) {
    console.log(contents)
    return (
        <motion.div
            className={styles.container}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4, ease: [0.34, 1.56, 0.64, 1] }}
        >
            <motion.div
                className={styles.line}
                initial={{ scaleY: 0 }}
                animate={{ scaleY: 1 }}
                transition={{ duration: 0.5, delay: 0.1, ease: [0.34, 1.56, 0.64, 1] }}
            />
            <div className={styles.content}>
                {contents.map((content, index) => (
                    <motion.div
                        key={index}
                        className={styles.contentItem}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{
                            duration: 0.4,
                            delay: 0.2 + (index * 0.1),
                            ease: [0.34, 1.56, 0.64, 1]
                        }}
                    >
                        <motion.div
                            className={styles.connector}
                            initial={{ scaleX: 0 }}
                            animate={{ scaleX: 1 }}
                            transition={{
                                duration: 0.3,
                                delay: 0.3 + (index * 0.1),
                                ease: [0.34, 1.56, 0.64, 1]
                            }}
                        />
                        <MicroEvent micro={content} />
                    </motion.div>
                ))}
            </div>
        </motion.div>
    )
}

export default MicroTimeline;