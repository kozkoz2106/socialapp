const PALETTES = [
    ['#ff6b4a', '#ffb14a'],
    ['#60a5fa', '#a78bfa'],
    ['#34d399', '#60a5fa'],
    ['#fb7185', '#f472b6'],
    ['#fde68a', '#ff6b4a'],
    ['#a78bfa', '#fb7185'],
    ['#5eead4', '#34d399'],
    ['#fdba74', '#fb7185'],
]

function hash(str) {
    let h = 0
    const s = String(str ?? '')
    for (let i = 0; i < s.length; i++) {
        h = (h * 31 + s.charCodeAt(i)) | 0
    }
    return Math.abs(h)
}

export default function Avatar({ name, seed, size = 48 }) {
    const display = (name || '?').trim()
    const initial = display.charAt(0).toUpperCase() || '?'
    const idx = hash(seed ?? display) % PALETTES.length
    const [a, b] = PALETTES[idx]
    return (
        <span
            style={{
                width: size,
                height: size,
                borderRadius: '50%',
                background: `linear-gradient(135deg, ${a} 0%, ${b} 100%)`,
                color: 'white',
                fontWeight: 700,
                fontSize: size * 0.4,
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                letterSpacing: '-0.02em',
                boxShadow: '0 4px 12px rgba(15, 15, 20, 0.08)',
            }}
            aria-hidden
        >
            {initial}
        </span>
    )
}
