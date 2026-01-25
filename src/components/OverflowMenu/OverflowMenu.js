"use client"
import { useState, useEffect, useRef } from "react";
import styles from "./OverflowMenu.module.css"
import { MoreVertical } from "react-feather";

function OverflowMenu({ buttons }) {
    const [isExpanded, setIsExpanded] = useState(false);
    const containerRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(event) {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setIsExpanded(false);
            }
        }

        window.addEventListener('click', handleClickOutside);
        return () => {
            window.removeEventListener('click', handleClickOutside)
        }
    }, [])

    function handleClick(action) {
        action();
        setIsExpanded(false);
    }

    return (
        <div className={styles.container} ref={containerRef}>
            <button className={styles.primaryBtn} onClick={() => setIsExpanded(!isExpanded)}><MoreVertical /></button>
            {isExpanded ? <div className={styles.buttons}>
                {buttons.map(button => (
                    <button className={styles.button} key={button.name} onClick={() => handleClick(button.action)}>{button.icon}{button.name}</button>
                ))}
            </div> : null}
        </div>
    )
}

export default OverflowMenu;