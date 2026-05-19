'use client'

import { useEffect, useRef, useState } from 'react'

import { createClient } from '@/utils/supabase/client'
import { sendMessage } from './actions'
import styles from './page.module.css'

export default function ChatRoom({ chatId, currentUserId, initialMessages }) {
    const [messages, setMessages] = useState(initialMessages)
    const [error, setError] = useState(null)
    const formRef = useRef(null)
    const endRef = useRef(null)

    useEffect(() => {
        const supabase = createClient()
        const channel = supabase
            .channel(`chat:${chatId}`)
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'messages',
                    filter: `chat_id=eq.${chatId}`,
                },
                (payload) => {
                    setMessages((prev) =>
                        prev.some((m) => m.id === payload.new.id)
                            ? prev
                            : [...prev, payload.new]
                    )
                }
            )
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [chatId])

    useEffect(() => {
        endRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages])

    async function action(formData) {
        const body = formData.get('body')
        formRef.current?.reset()
        setError(null)
        try {
            const inserted = await sendMessage(chatId, body)
            if (inserted) {
                setMessages((prev) =>
                    prev.some((m) => m.id === inserted.id) ? prev : [...prev, inserted]
                )
            }
        } catch (e) {
            setError(e.message ?? 'Failed to send')
        }
    }

    return (
        <div className={styles.room}>
            <ul className={styles.messages}>
                {messages.map((m) => (
                    <li
                        key={m.id}
                        className={
                            m.sender_id === currentUserId
                                ? styles.mine
                                : styles.theirs
                        }
                    >
                        <span className={styles.bubble}>{m.body}</span>
                    </li>
                ))}
                <li ref={endRef} />
            </ul>
            {error && <p className={styles.error}>{error}</p>}
            <form ref={formRef} action={action} className={styles.composer}>
                <input
                    name="body"
                    autoComplete="off"
                    placeholder="Message"
                    className={styles.input}
                />
                <button type="submit" className={styles.send}>
                    Send
                </button>
            </form>
        </div>
    )
}
