import styles from "./MicroEvent.module.css";
import { Calendar } from "react-feather";

function MicroEvent({ micro }) {
    //type = event | list | focus | text (more below)
    const { type, title, date, content } = micro;

    //the normal type: title, date and text
    if (type === "event") {
        return (
            <div className={styles.event}>
                <h6 className={styles.title}>{title}</h6>
                {date && <p className={styles.date}><Calendar />{date}</p>}
                <p>{content}</p>
            </div>
        );
    }

    //a list (with a title maybe)
    if (type === "list") {
        return (
            <div className={styles.list}>
                {title && <h6 className={styles.title}>{title}</h6>}
                {content.map((item, index) => (
                    <li key={index}>{item}</li>
                ))}
            </div>
        );
    }

    //important informations
    if (type === "focus") {
        return (
            <div className={styles.focus}>
                <h6>{title}</h6>
                {date && <p>{date}</p>}
            </div>
        );
    }

    //long texts
    if (type === "text") {
        return (
            <div className={styles.text}>
                <h6 className={styles.title}>{title}</h6>
                <p>{content}</p>
            </div>
        )
    }
}

export default MicroEvent;