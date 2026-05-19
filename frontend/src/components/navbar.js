'use client'

import Link from "next/link";
import { usePathname } from "next/navigation";

import { signOut } from "@/app/login/actions";
import styles from "./navbar.module.css";

const links = [
    { href: "/", label: "Profile" },
    { href: "/matching", label: "Discover" },
    { href: "/chat", label: "Chats" },
    { href: "/mbti", label: "MBTI" }
]

export default function Navbar() {
    const pathname = usePathname()

    return (
        <header className={styles.bar}>
            <Link href="/" className={styles.brand} aria-label="FriendLink — home">
                <span className={styles.brandDot} aria-hidden />
                <span className={styles.brandText}>FriendLink</span>
            </Link>

            <nav className={styles.nav}>
                {links.map((l) => {
                    const active = pathname === l.href ||
                        (l.href !== "/" && pathname.startsWith(l.href))
                    return (
                        <Link
                            key={l.href}
                            href={l.href}
                            className={`${styles.link} ${active ? styles.linkActive : ""}`}
                        >
                            {l.label}
                        </Link>
                    )
                })}
            </nav>

            <form action={signOut} className={styles.signOutForm}>
                <button type="submit" className={styles.signOut}>
                    Sign out
                </button>
            </form>
        </header>
    )
}
