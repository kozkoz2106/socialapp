import { redirect } from 'next/navigation'

import Navbar from "@/components/navbar";
import ReelsScroller from "@/components/ReelsScroller";
import { createClient } from '@/utils/supabase/server'

export default async function Matching() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/login')
  }

  const { data } = await supabase
    .from('profiles')
    .select()
    .neq('id', user.id)

  return (
    <>
      <Navbar />
      <ReelsScroller items={data ?? []} />
    </>
  )
}
