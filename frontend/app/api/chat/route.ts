import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { messages } = await req.json();
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "No API key" }, { status: 500 });
  }

  const res = await fetch("https://openai.api.proxyapi.ru/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages,
      temperature: 0.7,
      max_tokens: 256,
    }),
  });

  if (!res.ok) {
    return NextResponse.json({ error: "OpenAI error" }, { status: 500 });
  }

  const data = await res.json();
  const text = data.choices?.[0]?.message?.content || "Ошибка ответа";
  return NextResponse.json({ text });
}
