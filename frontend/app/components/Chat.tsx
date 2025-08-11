import React from "react";
import Message, { MessageRole } from "./Message";

export interface ChatMessage {
  role: MessageRole;
  text: string;
}

interface ChatProps {
  messages: ChatMessage[];
}

export default function Chat({ messages }: ChatProps) {
  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      gap: 8,
      width: "100%",
      maxWidth: 400,
      margin: "0 auto",
      minHeight: 200,
      background: "#fff8e1",
      borderRadius: 24,
      padding: 16,
    }}>
      {messages.map((msg, idx) => (
        <Message key={idx} role={msg.role} text={msg.text} />
      ))}
    </div>
  );
}
