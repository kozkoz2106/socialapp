"use client";

import styles from "./ReelsScroller.module.css";

export default function ReelsScroller({ items }) {
  return (
    <div className={styles.feed}>
      {items.map((item) => (
        <div className={styles.card} key={item.id}>
          <div className={styles.content}>
            <h2 className={styles.name}>{item.name}</h2>
            {Object.entries(item)
              .filter(([key]) => key !== "id" && key !== "name")
              .map(([key, value]) => (
                <p key={key} className={styles.field}>
                  <span className={styles.label}>{key}</span>
                  {String(value ?? "")}
                </p>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
}
