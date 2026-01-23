import "./globals.css";
import { SITE_TITLE, LIGHT_TOKENS, DARK_TOKENS } from "@/utils/constants";
import { Poppins } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import GeneratedTimelineProvider from "@/components/GeneratedTimelineProvider";
import { cookies } from "next/headers";

const poppins = Poppins({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
  variable: "--font-poppins",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

export const metadata = {
  title: {
    default: SITE_TITLE,
    template: `%s | ${SITE_TITLE}`
  },
  description: "Impara la storia in modo interattivo con timeline scrollabili. Esplora eventi storici, quiz interattivi e scopri come il passato ha plasmato il presente.",
  keywords: ["storia", "timeline", "apprendimento", "educazione", "storia mondiale", "prima guerra mondiale", "rivoluzione russa", "belle epoque"],
  authors: [{ name: "Hiscrolly" }],
  creator: "Hiscrolly",
  publisher: "Hiscrolly",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(siteUrl),
  icons: {
    icon: [
      { url: '/favicon/favicon.ico', sizes: 'any' },
      { url: '/favicon/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/favicon/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    other: [
      { rel: 'android-chrome-192x192', url: '/favicon/android-chrome-192x192.png', sizes: '192x192', type: 'image/png' },
      { rel: 'android-chrome-512x512', url: '/favicon/android-chrome-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
  },
  manifest: '/favicon/site.webmanifest',
  openGraph: {
    type: "website",
    locale: "it_IT",
    url: siteUrl,
    siteName: SITE_TITLE,
    title: SITE_TITLE,
    description: "Impara la storia in modo interattivo con timeline scrollabili. Esplora eventi storici e quiz interattivi.",
    images: [
      {
        url: `${siteUrl}/favicon/android-chrome-512x512.png`,
        width: 512,
        height: 512,
        alt: SITE_TITLE,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: "Impara la storia in modo interattivo con timeline scrollabili.",
    images: [`${siteUrl}/favicon/android-chrome-512x512.png`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

async function RootLayout({ children }) {
  const savedTheme = (await cookies()).get("color-theme");
  const theme = savedTheme?.value || "light";

  return (
    <html lang="it" className={poppins.variable} data-color-theme={theme} style={theme === "light" ? LIGHT_TOKENS : DARK_TOKENS}>
      <body>
        <GeneratedTimelineProvider>
          <div className="mainContainer">
            <Header initialTheme={theme} />
            {children}
            <Footer />
          </div>
        </GeneratedTimelineProvider>
      </body>
    </html>
  );
}

export default RootLayout;