import Link from 'next/link'
import styles from './page.module.css'
import { login } from './actions'

export default async function LoginPage({ searchParams }) {
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
                    <h1 className={styles.title}>Welcome back 👋</h1>
                    <p className={styles.subtitle}>Sign in to find your people.</p>
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
                            autoComplete="current-password"
                            placeholder="••••••••"
                            required
                            className={styles.input}
                        />
                    </div>

                    <button formAction={login} className={styles.button}>
                        Log in
                    </button>

                    {error && <p className={styles.error}>{error}</p>}
                </form>

                <p className={styles.footer}>
                    New here?{' '}
                    <Link href="/signup" className={styles.link}>Create an account</Link>
                </p>
            </div>
        </div>
    )
}
