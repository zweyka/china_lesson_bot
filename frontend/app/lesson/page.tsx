"use client";

import styles from "../page.module.css";
import Link from "next/link";
import { LessonProvider, useLesson } from "../components/LessonProvider";
import Chat from "../components/Chat";
import { useState, useEffect } from "react";
import { saveLessonToHistory, getNextLessonNumber } from "../utils/storage";

function LessonChat() {
  const { messages, addMessage, resetLesson } = useLesson();
  const [input, setInput] = useState("");
  const [waiting, setWaiting] = useState(false);
  const [finished, setFinished] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lessonNumber, setLessonNumber] = useState<number>(1);
  const [lessonId, setLessonId] = useState<string>("");

  // Получаем номер и id урока при старте
  useEffect(() => {
    const num = getNextLessonNumber();
    setLessonNumber(num);
    setLessonId(Date.now().toString());
  }, []);

  // Генерируем первый вопрос при старте урока
  useEffect(() => {
    if (messages.length === 0) {
      setWaiting(true);
      fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [
            {
              role: "system",
              content:
                "Ты — добрый учитель китайского языка для 7-летнего ребёнка, который говорит по-русски. Придумай первый простой вопрос для урока, объясни на русском и напиши пример на китайском. Не используй сложные слова. Не задавай сразу много вопросов."
            }
          ]
        })
      })
        .then(res => res.json())
        .then(data => {
          addMessage({ role: "bot", text: data.text });
          setWaiting(false);
        })
        .catch(() => {
          setError("Ошибка загрузки вопроса");
          setWaiting(false);
        });
    }
    // eslint-disable-next-line
  }, []);

  // Автоматическое сохранение после каждого сообщения пользователя
  useEffect(() => {
    if (messages.length === 0 || !lessonId) return;
    const last = messages[messages.length - 1];
    if (last.role !== "user") return;
    const summary = messages.filter(m => m.role === "user").map(m => m.text).join(", ");
    saveLessonToHistory({
      id: lessonId,
      date: new Date().toLocaleDateString(),
      summary: `Урок ${lessonNumber}: ` + (summary ? summary.slice(0, 60) + (summary.length > 60 ? '...' : '') : 'Без ответов'),
      messages,
    });
  }, [messages, lessonNumber, lessonId]);

  const handleSend = async () => {
    if (!input.trim()) return;
    addMessage({ role: "user", text: input });
    setWaiting(true);
    setError(null);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [
            { role: "system", content: "Ты — добрый учитель китайского языка для 7-летнего ребёнка, который говорит по-русски. Отвечай просто, объясняй на русском, пиши пример на китайском. Не задавай сразу много вопросов." },
            ...messages.map(m => ({ role: m.role === "user" ? "user" : "assistant", content: m.text })),
            { role: "user", content: input }
          ]
        })
      });
      const data = await res.json();
      addMessage({ role: "bot", text: data.text });
    } catch {
      setError("Ошибка ответа от бота");
    } finally {
      setWaiting(false);
      setInput("");
    }
  };

  const handleFinish = () => {
    setFinished(true);
    resetLesson();
    setLessonId("");
  };

  if (finished) {
    return (
      <div style={{ textAlign: 'center', fontSize: 24, marginTop: 40 }}>
        Урок завершён!<br />
        <Link href="/history" style={{ color: '#ffb300', textDecoration: 'underline', fontSize: 22 }}>Смотреть историю</Link>
      </div>
    );
  }

  return (
    <main className={styles.main}>
      <h1 style={{ fontSize: 28, textAlign: 'center', marginBottom: 24 }}>Урок китайского языка</h1>
      <Chat messages={messages} />
      {error && <div style={{ color: 'red', fontSize: 18, margin: '12px 0' }}>{error}</div>}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', maxWidth: 400, margin: '0 auto' }}>
        <input
          type="text"
          placeholder="Твой ответ..."
          value={input}
          onChange={e => setInput(e.target.value)}
          style={{
            fontSize: 22,
            padding: '16px 20px',
            borderRadius: 16,
            border: '2px solid #ffb300',
            marginTop: 24,
            width: '100%',
            outline: 'none',
          }}
          disabled={waiting}
          onKeyDown={e => { if (e.key === 'Enter') handleSend(); }}
        />
        <button
          onClick={handleSend}
          disabled={waiting || !input.trim()}
          style={{
            marginTop: 16,
            fontSize: 22,
            padding: '12px 32px',
            borderRadius: 20,
            background: '#ffb300',
            color: '#fff',
            border: 'none',
            fontWeight: 'bold',
            cursor: waiting ? 'not-allowed' : 'pointer',
          }}
        >
          {waiting ? 'Ждём ответ...' : 'Отправить'}
        </button>
        <button
          onClick={handleFinish}
          disabled={messages.length === 0 || waiting}
          style={{
            marginTop: 16,
            fontSize: 20,
            padding: '10px 28px',
            borderRadius: 18,
            background: '#fff',
            color: '#ffb300',
            border: '2px solid #ffb300',
            fontWeight: 'bold',
            cursor: messages.length === 0 || waiting ? 'not-allowed' : 'pointer',
          }}
        >
          Завершить урок
        </button>
      </div>
      <Link href="/" style={{ marginTop: 32, fontSize: 20, color: '#ffb300', textDecoration: 'underline', textAlign: 'center' }}>
        На главную
      </Link>
    </main>
  );
}

export default function Lesson() {
  return (
    <div className={styles.page}>
      <LessonProvider>
        <LessonChat />
      </LessonProvider>
    </div>
  );
}
