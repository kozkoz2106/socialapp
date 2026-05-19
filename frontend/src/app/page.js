import { redirect } from 'next/navigation'

import Navbar from '@/components/navbar'
import HobbiesInput from '@/components/HobbiesInput'
import { createClient } from '@/utils/supabase/server'
import styles from './page.module.css'
import { updateProfile } from './actions'

export default async function ProfilePage({ searchParams }) {
    const params = await searchParams
    const error = params?.error
    const saved = params?.saved

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        redirect('/login')
    }

    const { data: profile } = await supabase
        .from('profiles')
        .select('name, gender, degree, hobbies')
        .eq('id', user.id)
        .maybeSingle()

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Main Profile</h1>

            <form action={updateProfile} className={styles.form}>
                <label className={styles.label} htmlFor="name">Name</label>
                <input
                    id="name"
                    name="name"
                    type="text"
                    defaultValue={profile?.name ?? ''}
                    placeholder="Your name"
                    required
                    className={styles.input}
                />

                <label className={styles.label} htmlFor="gender">Gender</label>
                <select
                    id="gender"
                    name="gender"
                    defaultValue={profile?.gender ?? ''}
                    className={styles.input}
                >
                    <option value="">Prefer not to say</option>
                    <option value="female">Female</option>
                    <option value="male">Male</option>
                    <option value="non-binary">Non-binary</option>
                    <option value="other">Other</option>
                </select>

                <label className={styles.label} htmlFor="degree">Degree</label>
                <input
                    id="degree"
                    name="degree"
                    type="text"
                    defaultValue={profile?.degree ?? ''}
                    placeholder="e.g. BSc Computer Science"
                    className={styles.input}
                />

                <label className={styles.label} htmlFor="hobbies">Hobbies</label>
                <HobbiesInput initial={profile?.hobbies ?? []} />

                <button type="submit" className={styles.button}>Save</button>

                {error && <p className={styles.error}>{error}</p>}
                {saved && !error && <p className={styles.saved}>Saved.</p>}
            </form>

            <Navbar />
        </div>
    )
}
