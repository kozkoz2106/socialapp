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

    const [{ data: profiles }, { data: dismissals }] = await Promise.all([
        supabase.from('profiles').select().neq('id', user.id),
        supabase.from('dismissals').select('dismissed_id').eq('user_id', user.id),
    ])

    const dismissedIds = new Set((dismissals ?? []).map((d) => d.dismissed_id))
    const filtered = (profiles ?? []).filter((p) => !dismissedIds.has(p.id))

    return (
        <>
            <Navbar />
            <ReelsScroller items={filtered} />
        </>
    )
}