import Link from 'next/link'
import { redirect } from 'next/navigation'

import Avatar from "@/components/Avatar";
import Navbar from "@/components/navbar";
import { createClient } from '@/utils/supabase/server'
import styles from "./page.module.css";

export default async function Chat() {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        redirect('/login')
    }

    const { data: chats } = await supabase
        .from('chats')
        .select('id, user_a, user_b, created_at')
        .or(`user_a.eq.${user.id},user_b.eq.${user.id}`)
        .order('created_at', { ascending: false })

    const otherIds = (chats ?? []).map((c) =>
        c.user_a === user.id ? c.user_b : c.user_a
    )

    const { data: profiles } = otherIds.length
        ? await supabase.from('profiles').select('id, name').in('id', otherIds)
        : { data: [] }

    const nameById = new Map((profiles ?? []).map((p) => [p.id, p.name]))
    const count = chats?.length ?? 0

    return (
        <div className={styles.shell}>
            <Navbar />

            <main className={styles.container}>
                <header className={styles.header}>
                    <div>
                        <p className={styles.eyebrow}>Inbox</p>
                        <h1 className={styles.title}>Chats</h1>
                    </div>
                    {count > 0 && (
                        <span className={styles.countPill}>{count} active</span>
                    )}
                </header>

                {count === 0 ? (
                    <section className={styles.empty}>
                        <span className={styles.emptyEmoji}>💬</span>
                        <h2 className={styles.emptyTitle}>No chats yet</h2>
                        <p className={styles.emptyText}>
                            Tap Connect on someone you like in Discover, and your chat will appear here.
                        </p>
                        <Link href="/matching" className={styles.emptyLink}>
                            Discover people →
                        </Link>
                    </section>
                ) : (
                    <ul className={styles.list}>
                        {chats.map((c) => {
                            const otherId = c.user_a === user.id ? c.user_b : c.user_a
                            const name = nameById.get(otherId) ?? 'Unknown'
                            return (
                                <li key={c.id}>
                                    <Link href={`/chat/${c.id}`} className={styles.item}>
                                        <Avatar name={name} seed={otherId} size={44} />
                                        <div className={styles.text}>
                                            <span className={styles.name}>{name}</span>
                                            <span className={styles.subtitle}>Tap to open</span>
                                        </div>
                                        <span className={styles.arrow}>→</span>
                                    </Link>
                                </li>
                            )
                        })}
                    </ul>
                )}
            </main>
        </div>
    )
}
