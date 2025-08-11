"use client";

import styles from "../page.module.css";
import Link from "next/link";
import HistoryList, { LessonHistoryItem } from "../components/HistoryList";
import { useEffect, useState } from "react";
import { loadHistory } from "../utils/storage";

export default function History() {
  const [history, setHistory] = useState<LessonHistoryItem[]>([]);

  useEffect(() => {
    setHistory(loadHistory());
  }, []);

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <h1 style={{ fontSize: 28, textAlign: 'center', marginBottom: 24 }}>История уроков</h1>
        <HistoryList lessons={history} />
        <Link href="/" style={{ marginTop: 32, fontSize: 20, color: '#ffb300', textDecoration: 'underline' }}>
          На главную
        </Link>
      </main>
    </div>
  );
}
