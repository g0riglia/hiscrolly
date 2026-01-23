import styles from "./page.module.css";
import { getAllTopics } from "@/utils/utils";
import TopicCard from "@/components/TopicCard";
import Link from "next/link";
import ScrollButton from "@/components/ScrollButton";
import TopicsList from "@/components/TopicsList";

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
          <div className={styles.hero}>
            <h1>Trasforma la storia in un timeline</h1>
            <p>Trasforma un argomento, un PDF o degli appunti in una timeline interattiva, semplice e visiva.</p>
            <div className={styles.ctas}>
              <Link href="/create" className={styles.primary}>Crea ora</Link>
              <ScrollButton targetId="topics-section" className={styles.secondary}>
                Esplora timeline già create
              </ScrollButton>
            </div>
          </div>
          <h2 id="topics-section">Argomenti già creati:</h2>
          <TopicsList topics={topicsList} />
        </main>
      </div>
    </>
  );
}

export default Home;
