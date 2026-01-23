import styles from "./TopicCard.module.css";
import Link from "next/link";

function TopicCard({ topic, href }) {
    const { id, title, subtitle, date, description } = topic;
    const linkHref = href || `/topics/${id}`;

    return (
        <Link className={styles.card} href={linkHref}>
            <div className={styles.header}>
                <h2>{title}</h2>
                <p className={styles.subtitle}>{subtitle}</p>
                <p className={styles.date}>{date}</p>
            </div>
            <p>{description} <span>Scopri di più</span></p>
        </Link>
    )
}

export default TopicCard;