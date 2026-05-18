"use client";

import { useState } from "react";
import styles from "./page.module.css";
import Navbar from "@/components/navbar";

export default function ProfileEditor() {
  const [profile, setProfile] = useState({
    name: "",
    tags: ["", "", "", "", ""],
    pfpFile: null,
  });

  const [preview, setPreview] = useState(null);

  function handleName(e) {
    setProfile((prev) => ({ ...prev, name: e.target.value }));
  }

  function handleTagChange(index, value) {
    const updated = [...profile.tags];
    updated[index] = value;

    setProfile((prev) => ({ ...prev, tags: updated }));
  }

  function handleImage(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    setProfile((prev) => ({ ...prev, pfpFile: file }));
    setPreview(URL.createObjectURL(file));
  }

  function handleSubmit(e) {
    e.preventDefault();

    const cleaned = {
      name: profile.name,
      tags: profile.tags.filter((t) => t.trim() !== ""),
      pfpFile: profile.pfpFile,
    };

  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Main Profile</h1>

      <form onSubmit={handleSubmit} className={styles.form}>
        {/* PROFILE PICTURE */}
        <div className={styles.pfpWrapper}>
          <input
            id="pfp-upload"
            type="file"
            accept="image/*"
            onChange={handleImage}
            className={styles.hiddenInput}
          />

          <label htmlFor="pfp-upload" className={styles.pfpCircle}>
            {preview ? (
              <img src={preview} className={styles.pfpImage} />
            ) : (
              <span className={styles.plus}>+</span>
            )}
          </label>
        </div>

        {/* NAME */}
        <label className={styles.label}>Name</label>
        <input
          value={profile.name}
          onChange={handleName}
          className={styles.input}
          placeholder="Your name"
        />

        {/* TAGS */}
        <label className={styles.label}>Tags (max 5)</label>

        <div className={styles.tags}>
          {profile.tags.map((tag, i) => (
            <input
              key={i}
              value={tag}
              onChange={(e) => handleTagChange(i, e.target.value)}
              className={styles.tagInput}
              placeholder={`Tag ${i + 1}`}
              maxLength={20}
            />
          ))}
        </div>

        {/* SAVE */}
        <button type="submit" className={styles.button}>
          Save
        </button>
      </form>
      <Navbar />
    </div>
  );
}