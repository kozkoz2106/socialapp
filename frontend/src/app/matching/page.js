import Navbar from "@/components/navbar";
import ReelsScroller from "@/components/ReelsScroller";
import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'

export default async function Matching() {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  const { data } = await supabase.from('data').select()

  return (
    <>
      <ReelsScroller items={data ?? []} />
      <Navbar />
    </>
  )
}
