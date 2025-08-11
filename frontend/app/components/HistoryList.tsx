import React from "react";
import Link from "next/link";
import type { ChatMessage } from "./Chat";

export interface LessonHistoryItem {
  id: string;
  date: string;
  summary: string;
  messages: ChatMessage[];
}

interface HistoryListProps {
  lessons: LessonHistoryItem[];
}

export default function HistoryList({ lessons }: HistoryListProps) {
  return (
    <div style={{ width: '100%', maxWidth: 480, margin: '0 auto' }}>
      {lessons.length === 0 ? (
        <p style={{ fontSize: 20, color: '#888', textAlign: 'center' }}>Нет уроков</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {lessons.map((lesson) => (
            <li key={lesson.id} style={{
              background: '#fff',
              borderRadius: 16,
              margin: '12px 0',
              padding: 0,
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
            }}>
              <Link href={`/lesson/${lesson.id}`} style={{
                display: 'block',
                padding: '16px 20px',
                textDecoration: 'none',
                color: '#333',
                borderRadius: 16,
              }}>
                <div style={{ fontWeight: 'bold', fontSize: 18 }}>{lesson.date}</div>
                <div style={{ fontSize: 16, marginTop: 4 }}>{lesson.summary}</div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
