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
    const hobbies = formData.getAll('hobbies')
        .map((h) => h.toString().trim())
        .filter(Boolean)

    const { error } = await supabase
        .from('profiles')
        .upsert({ id: user.id, name, gender, degree, hobbies })

    if (error) {
        redirect(`/?error=${encodeURIComponent(error.message)}`)
    }

    revalidatePath('/')
    redirect('/?saved=1')
}
