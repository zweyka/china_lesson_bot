import React, { createContext, useContext, useState } from "react";
import type { ChatMessage } from "./Chat";

interface LessonContextType {
  messages: ChatMessage[];
  addMessage: (msg: ChatMessage) => void;
  resetLesson: () => void;
}

const LessonContext = createContext<LessonContextType | undefined>(undefined);

export function LessonProvider({ children }: { children: React.ReactNode }) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const addMessage = (msg: ChatMessage) => setMessages((prev) => [...prev, msg]);
  const resetLesson = () => setMessages([]);

  return (
    <LessonContext.Provider value={{ messages, addMessage, resetLesson }}>
      {children}
    </LessonContext.Provider>
  );
}

export function useLesson() {
  const ctx = useContext(LessonContext);
  if (!ctx) throw new Error("useLesson must be used within LessonProvider");
  return ctx;
}
