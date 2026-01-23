import styles from "./TopicsList.module.css"
import TopicCard from "@/components/TopicCard"

function TopicsList({ topics, getHref }) {
    return (
        <div className={styles.list}>
            {topics.map((topic, index) => {
                const href = getHref ? getHref(topic, index) : undefined;
                return (
                    <TopicCard key={topic.id} topic={topic} href={href} />
                );
            })}
        </div>
    )
}

export default TopicsList;