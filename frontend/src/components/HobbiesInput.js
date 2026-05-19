'use client'

import { useState } from 'react'
import styles from '@/app/page.module.css'

function normalize(input) {
    if (Array.isArray(input)) return input
    if (typeof input === 'string') {
        const s = input.trim()
        if (!s || s === '{}') return []
        if (s.startsWith('{') && s.endsWith('}')) {
            return s.slice(1, -1).split(',').map((x) => x.trim().replace(/^"|"$/g, '')).filter(Boolean)
        }
        try {
            const p = JSON.parse(s)
            if (Array.isArray(p)) return p
        } catch {}
    }
    return []
}

export default function HobbiesInput({ initial }) {
    const arr = normalize(initial)
    const [hobbies, setHobbies] = useState(arr.length > 0 ? arr : [''])

    function update(i, value) {
        setHobbies((prev) => prev.map((h, j) => (j === i ? value : h)))
    }

    function add() {
        setHobbies((prev) => [...prev, ''])
    }

    function remove(i) {
        setHobbies((prev) => prev.length === 1 ? [''] : prev.filter((_, j) => j !== i))
    }

    return (
        <div className={styles.tags}>
            {hobbies.map((hobby, i) => (
                <div key={i} className={styles.hobbyRow}>
                    <input
                        name="hobbies"
                        type="text"
                        value={hobby}
                        onChange={(e) => update(i, e.target.value)}
                        placeholder={`Hobby ${i + 1}`}
                        className={styles.tagInput}
                    />
                    <button
                        type="button"
                        onClick={() => remove(i)}
                        className={styles.hobbyRemove}
                        aria-label="Remove"
                    >
                        ✕
                    </button>
                </div>
            ))}
            <button type="button" onClick={add} className={styles.hobbyAdd}>
                + Add hobby
            </button>
        </div>
    )
}
