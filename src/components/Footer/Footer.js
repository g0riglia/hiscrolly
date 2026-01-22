import styles from "./Footer.module.css"
import { SITE_TITLE } from "@/utils/constants";
import Link from "next/link";

const FOOTER_LINKS = [
    {
        link: "https://www.linkedin.com/in/raffaele-nini-b21703373/",
        name: "LinkedIn",
    },
    {
        link: "https://www.youtube.com/@poRINIOfficial",
        name: "poRINI Youtube",
    },
    {
        link: "mailto:raffaelenini99@gmail.com",
        name: "Email"
    }
]

function Footer() {
    return (
        <footer className={styles.footer}>
            <div className={styles.column}>

                <p className={styles.title}>{SITE_TITLE}</p>
                <p>Sito, con design incluso, programmato interamente da <strong>Raffaele G. Nini</strong></p>
            </div>
            <div className={styles.column}>
                <p className={styles.title}>
                    Links
                </p>
                <ul className={styles.links}>
                    {FOOTER_LINKS.map((link, index) => (
                        <li key={index}><Link href={link.link} className={styles.link}>{link.name}</Link></li>
                    ))}
                </ul>
            </div>
        </footer>
    )
}

export default Footer;