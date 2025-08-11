"use client";
import styles from "./page.module.css";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <h1 style={{ fontSize: 32, textAlign: 'center', marginBottom: 32 }}>Изучаем китайский язык вместе!</h1>
        <div className={styles.ctas}>
          <button
            className={styles.primary}
            style={{ fontSize: 24, padding: '24px 40px', borderRadius: 32 }}
            onClick={() => router.push('/lesson')}
          >
            Начать урок
          </button>
          <button
            className={styles.secondary}
            style={{ fontSize: 24, padding: '24px 40px', borderRadius: 32 }}
            onClick={() => router.push('/history')}
          >
            История
          </button>
        </div>
      </main>
    </div>
  );
}
