'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { createClient } from '@/utils/supabase/server'

export async function updateProfile(formData) {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        redirect('/login')
    }

    const name = formData.get('name')?.toString().trim() ?? ''
    const gender = formData.get('gender')?.toString().trim() ?? ''
    const degree = formData.get('degree')?.toString().trim() ?? ''
    const hobbies = formData.getAll('hobbies').map((h) => h.toString().trim()).filter(Boolean)
    const avatarFile = formData.get('avatar')

    let avatar_url = formData.get('existing_avatar_url')?.toString() || null

    if (avatarFile && avatarFile.size > 0) {
    const ext = avatarFile.name.split('.').pop()
    const path = `${user.id}/avatar.${ext}`

    const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(path, avatarFile, { upsert: true })

    console.log('upload error:', uploadError)
    console.log('avatar file size:', avatarFile.size)

    if (!uploadError) {
        const { data: { publicUrl } } = supabase.storage
            .from('avatars')
            .getPublicUrl(path)
        avatar_url = `${publicUrl}?t=${Date.now()}`
        console.log('avatar_url set to:', avatar_url)
    }
}

    const { error } = await supabase
        .from('profiles')
        .upsert({ id: user.id, name, gender, degree, hobbies, avatar_url })

    if (error) {
        redirect(`/?error=${encodeURIComponent(error.message)}`)
    }

    revalidatePath('/')
    redirect('/?saved=1')
}

