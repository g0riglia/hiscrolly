import styles from "./page.module.css"
import { getTopicById } from "@/utils/utils";
import Timeline from "@/components/Timeline";
import Quiz from "@/components/Quiz";

export async function generateMetadata({ params }) {
    const id = await params.topicId;
    const topic = await getTopicById(id);

    if (!topic) {
        return {
            title: "Argomento non trovato",
        };
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

    return {
        title: topic.title,
        description: topic.description || `${topic.title}: ${topic.subtitle}. Esplora la timeline interattiva e mettiti alla prova con il quiz.`,
        keywords: [topic.title, topic.subtitle, "storia", "timeline", topic.date],
        openGraph: {
            title: `${topic.title} | Hiscrolly`,
            description: topic.description || `${topic.title}: ${topic.subtitle}`,
            type: "article",
            url: `${siteUrl}/${id}`,
            publishedTime: new Date().toISOString(),
            images: [
                {
                    url: `${siteUrl}/favicon/android-chrome-512x512.png`,
                    width: 512,
                    height: 512,
                    alt: topic.title,
                },
            ],
        },
        twitter: {
            card: "summary_large_image",
            title: topic.title,
            description: topic.description || topic.subtitle,
            images: [`${siteUrl}/favicon/android-chrome-512x512.png`],
        },
    };
}

async function TopicPage({ params }) {
    const id = await params.topicId;
    const topic = await getTopicById(id);

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": topic.title,
        "description": topic.description,
        "datePublished": new Date().toISOString(),
        "author": {
            "@type": "Organization",
            "name": "Hiscrolly"
        },
        "publisher": {
            "@type": "Organization",
            "name": "Hiscrolly"
        }
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <div className={styles.page}>
                <div className={styles.header}>
                    <h1>{topic.title}</h1>
                    <p className={styles.date}>{topic.date}</p>
                    <p>{topic.description}</p>
                </div>
                <h2>Timeline:</h2>
                <Timeline topic={topic} markers={[{ position: 0 }, { position: 26 }, { position: 52 }, { position: 78 }]} />
                <h2>Quiz:</h2>
                <Quiz quiz={topic.quiz || []} />
            </div>
        </>
    )
}

export default TopicPage;