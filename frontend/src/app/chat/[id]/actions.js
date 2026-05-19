'use server'

import { redirect } from 'next/navigation'

import { createClient } from '@/utils/supabase/server'

export async function sendMessage(chatId, body) {
    const trimmed = body?.toString().trim()
    if (!chatId || !trimmed) return

    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        redirect('/login')
    }

    const { data, error } = await supabase
        .from('messages')
        .insert({ chat_id: chatId, sender_id: user.id, body: trimmed })
        .select('id, sender_id, body, created_at')
        .single()

    if (error) {
        throw new Error(error.message)
    }

    return data
}
