import Link from "next/link";
import styles from "./navbar.module.css";
import { signOut } from "@/app/login/actions";

export default function Navbar() {
    return (
        <nav className={styles.nav}>
            <Link href="/" className={styles.link}>Main Profile</Link>
            <Link href="/matching" className={styles.link}>Matching</Link>
            <Link href="/chat" className={styles.link}>Chat</Link>
            <form action={signOut}>
                <button type="submit" className={styles.signOut}>Sign out</button>
            </form>
        </nav>
    )
}
