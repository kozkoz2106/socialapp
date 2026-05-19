import Link from 'next/link'
import styles from '../login/page.module.css'
import { signup } from '../login/actions'

export default async function SignupPage({ searchParams }) {
    const params = await searchParams
    const error = params?.error

    return (
        <div className={styles.shell}>
            <div className={styles.card}>
                <div className={styles.brandRow}>
                    <span className={styles.brandDot} aria-hidden />
                    <span className={styles.brandText}>quad</span>
                </div>

                <div>
                    <h1 className={styles.title}>Join Quad ✨</h1>
                    <p className={styles.subtitle}>Make friends on campus, the easy way.</p>
                </div>

                <form className={styles.form}>
                    <div className={styles.field}>
                        <label className={styles.label} htmlFor="email">Email</label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            placeholder="you@unsw.edu.au"
                            required
                            className={styles.input}
                        />
                    </div>

                    <div className={styles.field}>
                        <label className={styles.label} htmlFor="password">Password</label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            autoComplete="new-password"
                            placeholder="At least 8 characters"
                            required
                            className={styles.input}
                        />
                    </div>

                    <button formAction={signup} className={styles.button}>
                        Create account
                    </button>

                    {error && <p className={styles.error}>{error}</p>}
                </form>

                <p className={styles.footer}>
                    Already have one?{' '}
                    <Link href="/login" className={styles.link}>Log in</Link>
                </p>
            </div>
        </div>
    )
}
