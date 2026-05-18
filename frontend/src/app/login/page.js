import Link from 'next/link'
import styles from './page.module.css'
import { login } from './actions'

export default async function LoginPage({ searchParams }) {
    const params = await searchParams
    const error = params?.error

    return (
        <div className={styles.container}>
            <form className={styles.form}>
                <h1 className={styles.title}>Login</h1>

                <label className={styles.label} htmlFor="email">Email</label>
                <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className={styles.input}
                />

                <label className={styles.label} htmlFor="password">Password</label>
                <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    className={styles.input}
                />

                <button formAction={login} className={styles.button}>Log in</button>

                {error && <p className={styles.error}>{error}</p>}

                <p className={styles.footer}>
                    No account?{' '}
                    <Link href="/signup" className={styles.link}>Sign up</Link>
                </p>
            </form>
        </div>
    )
}
