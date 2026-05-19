import Link from 'next/link'
import { redirect } from 'next/navigation'

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

    return (
        <>
            <div className={styles.container}>
                <h1 className={styles.title}>Chats</h1>
                {(!chats || chats.length === 0) ? (
                    <p className={styles.empty}>
                        No chats yet. Connect with someone on the matching page.
                    </p>
                ) : (
                    <ul className={styles.list}>
                        {chats.map((c) => {
                            const otherId = c.user_a === user.id ? c.user_b : c.user_a
                            return (
                                <li key={c.id}>
                                    <Link href={`/chat/${c.id}`} className={styles.item}>
                                        <span className={styles.name}>
                                            {nameById.get(otherId) ?? 'Unknown'}
                                        </span>
                                    </Link>
                                </li>
                            )
                        })}
                    </ul>
                )}
            </div>
            <Navbar />
        </>
    )
}
