import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'

import Avatar from '@/components/Avatar'
import { createClient } from '@/utils/supabase/server'
import ChatRoom from './ChatRoom'
import styles from './page.module.css'

export default async function ChatDetail({ params }) {
    const { id } = await params

    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        redirect('/login')
    }

    const { data: chat } = await supabase
        .from('chats')
        .select('id, user_a, user_b, created_at')
        .eq('id', id)
        .maybeSingle()

    if (!chat || (chat.user_a !== user.id && chat.user_b !== user.id)) {
        notFound()
    }

    const otherId = chat.user_a === user.id ? chat.user_b : chat.user_a

    const [{ data: otherProfile }, { data: messages }] = await Promise.all([
        supabase.from('profiles').select('name').eq('id', otherId).maybeSingle(),
        supabase
            .from('messages')
            .select('id, sender_id, body, created_at')
            .eq('chat_id', id)
            .order('created_at', { ascending: true }),
    ])

    const name = otherProfile?.name ?? 'Unknown'

    return (
        <div className={styles.shell}>
            <header className={styles.header}>
                <Link href="/chat" className={styles.back} aria-label="Back">←</Link>
                <Avatar name={name} seed={otherId} size={40} />
                <div className={styles.titleWrap}>
                    <span className={styles.title}>{name}</span>
                </div>
            </header>
            <ChatRoom
                chatId={id}
                currentUserId={user.id}
                initialMessages={messages ?? []}
            />
        </div>
    )
}
