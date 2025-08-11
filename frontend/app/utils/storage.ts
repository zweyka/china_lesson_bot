import type { LessonHistoryItem } from "../components/HistoryList";
import type { ChatMessage } from "../components/Chat";

const HISTORY_KEY = "lesson_history";

export function saveLessonToHistory(lesson: LessonHistoryItem) {
  if (typeof window === "undefined") return;
  const history = loadHistory();
  // Если уже есть урок с таким id — обновляем
  const idx = history.findIndex(l => l.id === lesson.id);
  if (idx !== -1) {
    history[idx] = lesson;
  } else {
    history.unshift(lesson);
  }
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history.slice(0, 30)));
}

export function loadHistory(): LessonHistoryItem[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(HISTORY_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function getNextLessonNumber(): number {
  if (typeof window === "undefined") return 1;
  const history = loadHistory();
  const numbers = history
    .map(item => {
      const match = item.summary.match(/^Урок (\d+)/);
      return match ? parseInt(match[1], 10) : null;
    })
    .filter(Boolean) as number[];
  return numbers.length > 0 ? Math.max(...numbers) + 1 : 1;
}

export function getLessonById(id: string): LessonHistoryItem | undefined {
  return loadHistory().find(l => l.id === id);
}
