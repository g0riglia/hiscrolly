"use client"
import { useState, useEffect } from "react";
import Link from "next/link";
import styles from "./Header.module.css";
import { SITE_TITLE } from "@/utils/constants";
import { Sun, Moon, User } from "react-feather";
import Cookie from "js-cookie";
import { LIGHT_TOKENS, DARK_TOKENS } from "@/utils/constants";


function Header({ initialTheme = "light" }) {
    const [theme, setTheme] = useState(initialTheme);

    useEffect(() => {
        const root = document.documentElement;
        const colors = theme === "light" ? LIGHT_TOKENS : DARK_TOKENS;
        root.setAttribute("data-color-theme", theme);
        Object.entries(colors).forEach(([key, value]) => {
            root.style.setProperty(key, value);
        });
    }, [theme]);

    function handleToggleDarkMode() {
        const nextTheme = theme === "light" ? "dark" : "light";
        setTheme(nextTheme);

        Cookie.set("color-theme", nextTheme, { expires: 30 });

        const root = document.documentElement;
        const colors = nextTheme === "light" ? LIGHT_TOKENS : DARK_TOKENS;
        root.setAttribute("data-color-theme", nextTheme);
        Object.entries(colors).forEach(([key, value]) => {
            root.style.setProperty(key, value);
        });
    }

    return (
        <header className={styles.header}>
            <Link href="/">{SITE_TITLE}</Link>
            <div className={styles.buttons}>
                <button className={styles.button} onClick={handleToggleDarkMode}>{theme === 'light' ? <Sun /> : <Moon />}</button>
                <Link className={styles.button} href="/user"><User /></Link>
            </div>
        </header>
    );
}

export default Header;