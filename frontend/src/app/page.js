import { redirect } from 'next/navigation'

import Avatar from '@/components/Avatar'
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
        <div className={styles.shell}>
            <Navbar />

            <main className={styles.container}>
                <div className={styles.header}>
                    <Avatar name={profile?.name} seed={user.id} size={64} />
                    <div className={styles.headerText}>
                        <p className={styles.eyebrow}>Your profile</p>
                        <h1 className={styles.title}>
                            {profile?.name ? `Hey, ${profile.name} 👋` : 'Set up your profile'}
                        </h1>
                    </div>
                </div>

                <section className={styles.card}>
                    <form action={updateProfile} className={styles.form}>
                        <div className={`${styles.field} ${styles.fieldWide}`}>
                            <label className={styles.label} htmlFor="name">Name</label>
                            <input
                                id="name"
                                name="name"
                                type="text"
                                defaultValue={profile?.name ?? ''}
                                placeholder="What should people call you?"
                                required
                                className={styles.input}
                            />
                        </div>

                        <div className={styles.field}>
                            <label className={styles.label} htmlFor="gender">Pronouns</label>
                            <select
                                id="gender"
                                name="gender"
                                defaultValue={profile?.gender ?? ''}
                                className={styles.select}
                            >
                                <option value="">Prefer not to say</option>
                                <option value="female">She / her</option>
                                <option value="male">He / him</option>
                                <option value="non-binary">They / them</option>
                                <option value="other">Other</option>
                            </select>
                        </div>

                        <div className={styles.field}>
                            <label className={styles.label} htmlFor="degree">Degree</label>
                            <input
                                id="degree"
                                name="degree"
                                type="text"
                                defaultValue={profile?.degree ?? ''}
                                placeholder="e.g. BSc Computer Science"
                                className={styles.input}
                            />
                        </div>

                        <h2 className={styles.sectionTitle}>Hobbies</h2>
                        <div className={`${styles.field} ${styles.fieldWide}`}>
                            <HobbiesInput initial={profile?.hobbies ?? []} />
                        </div>

                        <div className={styles.actions}>
                            <div>
                                {error && <span className={`${styles.status} ${styles.statusError}`}>{error}</span>}
                                {saved && !error && <span className={`${styles.status} ${styles.statusSaved}`}>Saved</span>}
                            </div>
                            <button type="submit" className={styles.button}>
                                Save changes
                            </button>
                        </div>
                    </form>
                </section>
            </main>
        </div>
    )
}
