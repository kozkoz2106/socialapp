"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import styles from "./page.module.css";
import Navbar from "@/components/navbar";
import { saveMbti } from "./actions";

const mbtiTypes = [
  "INTJ", "INTP", "ENTJ", "ENTP",
  "INFJ", "INFP", "ENFJ", "ENFP",
  "ISTJ", "ISFJ", "ESTJ", "ESFJ",
  "ISTP", "ISFP", "ESTP", "ESFP"
];

// Inner component to safely handle useSearchParams
function MbtiFormContent() {
  const [selected, setSelected] = useState("");
  const searchParams = useSearchParams();
  const error = searchParams.get("error");
  const testUrl = "https://www.16personalities.com/free-personality-test";

  return (
    <div className={styles.card}>
      <h1 className={styles.title}>MBTI Profile Setup</h1>
      <div className={styles.testSection}>
        <p className={styles.description}>
          Don't know your MBTI? Take the official assessment.
        </p>
        <p className={styles.description}>
           Then Select and Save Your MBTI.
        </p>
        <a
          href={testUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.externalLink}
        >
          Take me to the Free MBTI Test ↗
        </a>
      </div>

      <hr className={styles.divider} />

      <h2 className={styles.subtitle}>Select and Save Your MBTI</h2>

      <form action={saveMbti} className={styles.form}>
        <input type="hidden" name="mbtiType" value={selected} />

        <div className={styles.grid}>
          {mbtiTypes.map((type) => (
            <button
              key={type}
              type="button"
              className={`${styles.mbtiButton} ${
                selected === type ? styles.active : ""
              }`}
              onClick={() => setSelected(type)}
            >
              {type}
            </button>
          ))}
        </div>

        {error && <p className={styles.errorText}>{error}</p>}

        <button
          type="submit"
          className={styles.saveButton}
          disabled={!selected}
        >
          Save MBTI
        </button>
      </form>
    </div>
  );
}


export default function MbtiPage() {
  return (
    <>
      <Navbar />
      <div className={styles.page}>
        <Suspense fallback={<div className={styles.loading}>Loading form...</div>}>
          <MbtiFormContent />
        </Suspense>
      </div>
    </>
  );
}
