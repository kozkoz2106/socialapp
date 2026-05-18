import Link from "next/link";
import styles from "./navbar.module.css";

export default function Navbar() {
    return (
        <nav className={styles.nav}>
            <Link href="/" className={styles.link}>Main Profile</Link>
            <Link href="/matching" className={styles.link}>Matching</Link>
            <Link href="/chat" className={styles.link}>Chat</Link>
        </nav>
    )
}