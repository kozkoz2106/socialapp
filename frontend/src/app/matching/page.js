import { redirect } from 'next/navigation'

import Navbar from "@/components/navbar";
import ReelsScroller from "@/components/ReelsScroller";
import { createClient } from '@/utils/supabase/server'

function overlapScore(a, b) {
    if (!a?.length || !b?.length) return 0
    const setA = new Set(a.map((h) => h.toLowerCase().trim()))
    return b.filter((h) => setA.has(h.toLowerCase().trim())).length
}

export default async function Matching() {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        redirect('/login')
    }

    const [{ data: profiles }, { data: dismissals }, { data: myProfile }] = await Promise.all([
        supabase.from('profiles').select().neq('id', user.id),
        supabase.from('dismissals').select('dismissed_id').eq('user_id', user.id),
        supabase.from('profiles').select('hobbies').eq('id', user.id).maybeSingle(),
    ])

    const dismissedIds = new Set((dismissals ?? []).map((d) => d.dismissed_id))
    const myHobbies = myProfile?.hobbies ?? []

    const filtered = (profiles ?? [])
        .filter((p) => !dismissedIds.has(p.id))
        .map((p) => ({ ...p, _score: overlapScore(myHobbies, p.hobbies ?? []) }))
        .sort((a, b) => b._score - a._score)

    return (
        <>
            <Navbar />
            <ReelsScroller items={filtered} />
        </>
    )
}