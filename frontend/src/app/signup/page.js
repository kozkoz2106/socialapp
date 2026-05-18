import Link from 'next/link'
import styles from '../login/page.module.css'
import { signup } from '../login/actions'

export default async function SignupPage({ searchParams }) {
    const params = await searchParams
    const error = params?.error

    return (
        <div className={styles.container}>
            <form className={styles.form}>
                <h1 className={styles.title}>Sign up</h1>

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
                    autoComplete="new-password"
                    required
                    className={styles.input}
                />

                <button formAction={signup} className={styles.button}>Create account</button>

                {error && <p className={styles.error}>{error}</p>}

                <p className={styles.footer}>
                    Already have an account?{' '}
                    <Link href="/login" className={styles.link}>Log in</Link>
                </p>
            </form>
        </div>
    )
}
