import styles from "./page.module.css";
import { getAllTopics } from "@/utils/utils";
import TopicCard from "@/components/TopicCard";
import Link from "next/link";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

export const metadata = {
  title: "Home",
  description: "Benvenuto in Hiscrolly: esplora la storia scrollando e scopri gli eventi che hanno cambiato il mondo. Timeline interattive e quiz per imparare la storia in modo divertente.",
  openGraph: {
    title: "Hiscrolly - Impara la storia in modo interattivo",
    description: "Esplora la storia scrollando e scopri gli eventi che hanno cambiato il mondo.",
    type: "website",
    url: siteUrl,
    images: [
      {
        url: `${siteUrl}/favicon/android-chrome-512x512.png`,
        width: 512,
        height: 512,
        alt: "Hiscrolly",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Hiscrolly - Impara la storia in modo interattivo",
    description: "Esplora la storia scrollando e scopri gli eventi che hanno cambiato il mondo.",
    images: [`${siteUrl}/favicon/android-chrome-512x512.png`],
  },
};

async function Home() {
  const topicsList = await getAllTopics();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Hiscrolly",
    "description": "Impara la storia in modo interattivo con timeline scrollabili",
    "url": process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className={styles.page}>
        <main className={styles.main}>
          <p className={styles.welcome}>Benvenuto in Hiscrolly: esplora la storia scrollando e scopri gli eventi che hanno cambiato il mondo.</p>
          <h1>Argomenti più recenti:</h1>
          <div className={styles.topicsList}>
            {topicsList.map(topic => (
              <TopicCard key={topic.id} topic={topic} />
            ))}
          </div>
        </main>
      </div>
    </>
  );
}

export default Home;
