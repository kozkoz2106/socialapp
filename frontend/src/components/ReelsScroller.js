"use client";

import Avatar from "@/components/Avatar";
import { connectWithUser } from "@/app/matching/actions";
import styles from "./ReelsScroller.module.css";

const BANNER_PALETTES = [
  ['#ffe6dd', '#ffd6f0'],
  ['#dbeafe', '#e0e7ff'],
  ['#d1fae5', '#dbeafe'],
  ['#fef3c7', '#ffe6dd'],
  ['#fce7f3', '#e0e7ff'],
  ['#e0f2fe', '#d1fae5'],
]

function hash(s) {
  let h = 0
  const str = String(s ?? '')
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) | 0
  return Math.abs(h)
}

function pickQuote(item, hobbies) {
  if (hobbies.length > 0) {
    const top = hobbies.slice(0, 2).join(' and ')
    return `Into ${top}.`
  }
  if (item.degree) return `Studying ${item.degree}.`
  return `Looking for friends on campus.`
}

const META_ICONS = {
  degree: '🎓',
  gender: '✨',
}

const META_LABELS = {
  degree: 'Studying',
  gender: 'Pronouns',
}

const PRONOUNS = {
  female: 'She / her',
  male: 'He / him',
  'non-binary': 'They / them',
  other: 'Other',
}

export default function ReelsScroller({ items }) {
  if (!items || items.length === 0) {
    return (
      <div className={styles.empty}>
        <span className={styles.emptyEmoji}>🌱</span>
        <h2 className={styles.emptyTitle}>No one new yet</h2>
        <p className={styles.emptyText}>
          Check back soon — new readers are joining all the time.
        </p>
      </div>
    )
  }

  return (
    <div className={styles.feed}>
      {items.map((item, i) => {
        const connect = connectWithUser.bind(null, item.id)
        const hobbies = Array.isArray(item.hobbies) ? item.hobbies : []
        const [c1, c2] = BANNER_PALETTES[hash(item.id) % BANNER_PALETTES.length]

        return (
          <div className={styles.cardWrap} key={item.id}>
            <article className={styles.card}>
              <div className={styles.banner} style={{ background: `linear-gradient(135deg, ${c1}, ${c2})` }}>
                <span className={styles.bannerBlob} style={{ background: c1, top: '-40px', left: '20%' }} />
                <span className={styles.bannerBlob} style={{ background: c2, bottom: '-60px', right: '10%' }} />
              </div>

              <div className={styles.avatarWrap}>
                <div className={styles.avatarRing}>
                  <Avatar name={item.name} seed={item.id} size={86} avatarUrl={item.avatar_url} />
                </div>
                <span className={styles.indexBadge}>
                  {i + 1} of {items.length}
                </span>
              </div>

              <div>
                <h2 className={styles.name}>{item.name || 'Anonymous'}</h2>
                <p className={styles.quote}>{pickQuote(item, hobbies)}</p>
              </div>

              <div className={styles.meta}>
                {item.degree && (
                  <div className={styles.metaRow}>
                    <span className={styles.metaIcon}>{META_ICONS.degree}</span>
                    <span className={styles.metaLabel}>{META_LABELS.degree}</span>
                    <span className={styles.metaValue}>{item.degree}</span>
                  </div>
                )}
                {item.gender && (
                  <div className={styles.metaRow}>
                    <span className={styles.metaIcon}>{META_ICONS.gender}</span>
                    <span className={styles.metaLabel}>{META_LABELS.gender}</span>
                    <span className={styles.metaValue}>{PRONOUNS[item.gender] ?? item.gender}</span>
                  </div>
                )}
              </div>

              {hobbies.length > 0 && (
                <div>
                  <p className={styles.hobbiesLabel}>Hobbies</p>
                  <div className={styles.hobbies}>
                    {hobbies.map((h, j) => (
                      <span key={j} className={styles.hobbyChip}>{h}</span>
                    ))}
                  </div>
                </div>
              )}

              <div className={styles.actions}>
                <form action={connect} className={styles.connectForm}>
                  <button type="submit" className={styles.connect}>
                    Connect →
                  </button>
                </form>
              </div>
            </article>
          </div>
        )
      })}
    </div>
  )
}
