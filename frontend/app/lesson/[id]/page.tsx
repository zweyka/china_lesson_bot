"use client";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { getLessonById, saveLessonToHistory } from "../../utils/storage";
import Chat from "../../components/Chat";
import styles from "../../page.module.css";
import Link from "next/link";

export default function LessonById() {
  const params = useParams();
  const router = useRouter();
  const id = typeof params.id === "string" ? params.id : Array.isArray(params.id) ? params.id[0] : "";
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<any[]>([]);
  const [waiting, setWaiting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const lesson = getLessonById(id);
    if (!lesson) {
      setNotFound(true);
      return;
    }
    setMessages(lesson.messages || []);
  }, [id]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const newMessages = [...messages, { role: "user", text: input }];
    setMessages(newMessages);
    setWaiting(true);
    setError(null);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [
            { role: "system", content: "Ты — добрый учитель китайского языка для 7-летнего ребёнка, который говорит по-русски. Отвечай просто, объясняй на русском, пиши пример на китайском. Не задавай сразу много вопросов." },
            ...newMessages.map(m => ({ role: m.role === "user" ? "user" : "assistant", content: m.text })),
            { role: "user", content: input }
          ]
        })
      });
      const data = await res.json();
      const updated = [...newMessages, { role: "bot", text: data.text }];
      setMessages(updated);
      // Сохраняем обновлённый урок
      const lesson = getLessonById(id);
      if (lesson) {
        saveLessonToHistory({ ...lesson, messages: updated });
      }
    } catch {
      setError("Ошибка ответа от бота");
    } finally {
      setWaiting(false);
      setInput("");
    }
  };

  if (notFound) {
    return <div style={{ fontSize: 22, color: 'red', textAlign: 'center', marginTop: 40 }}>Урок не найден</div>;
  }

  return (
    <main className={styles.main}>
      <h1 style={{ fontSize: 28, textAlign: 'center', marginBottom: 24 }}>Просмотр урока</h1>
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
      </div>
      <Link href="/history" style={{ marginTop: 32, fontSize: 20, color: '#ffb300', textDecoration: 'underline', textAlign: 'center' }}>
        К истории
      </Link>
    </main>
  );
}
