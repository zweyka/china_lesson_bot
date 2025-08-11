import React from "react";

export type MessageRole = "user" | "bot";

export interface MessageProps {
  role: MessageRole;
  text: string;
}

// Функция для извлечения китайского текста для озвучки
function extractChinese(text: string): string | null {
  // 1. Ищем после паттерна 'На китайском это будет:'
  const pattern = /На китайском это будет:([^\n\r\(\)\[\]\{\}]+)/i;
  const match = text.match(pattern);
  if (match && match[1]) {
    // Обрезаем до первой скобки или конца
    const clean = match[1].split(/[\(\[\{]/)[0].trim();
    if (clean.match(/[\u4e00-\u9fff]/)) return clean;
  }
  // 2. Fallback: самая длинная последовательность иероглифов
  const all = text.match(/[\u4e00-\u9fff\u3400-\u4dbf]+/g);
  if (all && all.length > 0) {
    // Берём самую длинную
    return all.reduce((a, b) => (b.length > a.length ? b : a), "");
  }
  return null;
}

export default function Message({ role, text }: MessageProps) {
  const chinese = role === "bot" ? extractChinese(text) : null;

  const handleSpeak = () => {
    if (!chinese) return;
    const utter = new window.SpeechSynthesisUtterance(chinese);
    utter.lang = "zh-CN";
    utter.rate = 0.3;
    window.speechSynthesis.speak(utter);
  };

  return (
    <div
      style={{
        background: role === "user" ? "#ffe082" : "#fff",
        color: "#333",
        borderRadius: 20,
        padding: "16px 20px",
        margin: "8px 0",
        alignSelf: role === "user" ? "flex-end" : "flex-start",
        maxWidth: 320,
        fontSize: 22,
        boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
        position: 'relative',
      }}
    >
      {text}
      {chinese && (
        <button
          onClick={handleSpeak}
          style={{
            position: 'absolute',
            right: 8,
            bottom: 8,
            background: '#ffb300',
            color: '#fff',
            border: 'none',
            borderRadius: '50%',
            width: 36,
            height: 36,
            fontSize: 20,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 1px 4px rgba(0,0,0,0.08)'
          }}
          aria-label="Озвучить по-китайски"
        >
          🔊
        </button>
      )}
    </div>
  );
}
