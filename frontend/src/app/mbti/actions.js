'use server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export async function saveMbti(formData) {
  const mbtiType = formData.get('mbtiType')

  if (!mbtiType) {
    redirect('/mbti?error=Please choose an MBTI type.')
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Updates your profiles table using the authenticated user id
  const { error } = await supabase
    .from('profiles')
    .update({ personality: mbtiType })
    .eq('id', user.id)

  if (error) {
    redirect(`/mbti?error=${encodeURIComponent(error.message)}`)
  }

  // Redirect to chat or next setup step
  redirect('/chat')
}
