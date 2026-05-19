import Navbar from "@/components/navbar";
import ReelsScroller from "@/components/ReelsScroller";
import { createClient } from '@/utils/supabase/server'

export default async function Matching() {
  const supabase = await createClient()

  const { data } = await supabase.from('profiles').select()

  return (
    <>
      <ReelsScroller items={data ?? []} />
      <Navbar />
    </>
  )
}
