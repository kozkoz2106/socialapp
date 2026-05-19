"use client";

import { useState } from "react";
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

export default function MbtiPage() {
  const [selected, setSelected] = useState("");
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  return (
    <>
      <Navbar />
      <div className={styles.page}>
        <div className={styles.card}>
          <h1 className={styles.title}>Choose Your MBTI</h1>

          {/* Form wrapper pointing to your server action */}
          <form action={saveMbti} className={styles.form}>
            {/* Hidden field containing selected personality data */}
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
      </div>
    </>
  );
}
