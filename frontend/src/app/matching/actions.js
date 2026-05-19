'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { createClient } from '@/utils/supabase/server'

export async function connectWithUser(otherUserId) {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        redirect('/login')
    }

    if (!otherUserId || otherUserId === user.id) {
        return
    }

    const [userA, userB] = user.id < otherUserId
        ? [user.id, otherUserId]
        : [otherUserId, user.id]

    const { error } = await supabase
        .from('chats')
        .upsert({ user_a: userA, user_b: userB }, { onConflict: 'user_a,user_b' })

    if (error) {
        redirect(`/matching?error=${encodeURIComponent(error.message)}`)
    }

    revalidatePath('/chat')
    redirect('/chat')
}

export async function dismissUser(otherUserId) {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        redirect('/login')
    }

    if (!otherUserId || otherUserId === user.id) {
        return
    }

    await supabase
        .from('dismissals')
        .upsert({ user_id: user.id, dismissed_id: otherUserId })

    revalidatePath('/matching')
}