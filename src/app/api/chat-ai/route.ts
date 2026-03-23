import { NextResponse } from "next/server";
import { KNOWLEDGE_BASE } from "@/lib/knowledge-base";

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const MODEL = "stepfun/step-3.5-flash:free";

const SYSTEM_PROMPT = `You are Zaila, the AI assistant for Zaila AI Designs — a web design and AI chatbot agency based in Hamilton, Ontario.

RULES:
- ONLY answer questions using the knowledge base provided below. Do not make up information.
- If someone asks something not covered in the knowledge base, say: "I don't have that info, but our team can help! Email hello@zailaaidesigns.com or I can collect your details."
- Be friendly, concise, and helpful. Keep responses to 1-2 short sentences. Never exceed 3 sentences. Do NOT use markdown formatting like ** or bullet points — use plain text only.
- Use a warm, professional tone. You can be casual but not sloppy.
- When relevant, guide users toward booking a free consultation or sharing their contact info.
- Never reveal that you are reading from a knowledge base. Speak as if you naturally know this information.
- Format prices clearly. Use bullet points for lists if needed.
- Do not discuss competitors by name.
- If asked about topics unrelated to Zaila AI Designs or web design/AI chatbots, politely redirect to how Zaila can help their business.

KNOWLEDGE BASE:
${KNOWLEDGE_BASE}`;

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export async function POST(request: Request) {
  if (!OPENROUTER_API_KEY) {
    return NextResponse.json(
      { error: "Chat AI not configured" },
      { status: 500 }
    );
  }

  const body = await request.json();
  const userMessage =
    typeof body.message === "string" ? body.message.slice(0, 1000) : "";
  const history: ChatMessage[] = Array.isArray(body.history)
    ? body.history.slice(-10)
    : [];

  if (!userMessage.trim()) {
    return NextResponse.json(
      { error: "Message is required" },
      { status: 400 }
    );
  }

  const messages = [
    { role: "system" as const, content: SYSTEM_PROMPT },
    ...history.map((m: ChatMessage) => ({
      role: m.role as "user" | "assistant",
      content: typeof m.content === "string" ? m.content.slice(0, 1000) : "",
    })),
    { role: "user" as const, content: userMessage },
  ];

  try {
    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://zailai.com",
        "X-Title": "Zaila AI Designs Chatbot",
      },
      body: JSON.stringify({
        model: MODEL,
        messages,
        max_tokens: 500,
        temperature: 0.7,
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error("OpenRouter error:", res.status, errText);
      return NextResponse.json(
        { error: "AI service unavailable" },
        { status: 502 }
      );
    }

    const data = await res.json();
    const reply =
      data.choices?.[0]?.message?.content?.trim() ||
      "Sorry, I couldn't generate a response. Please try again!";

    return NextResponse.json({ reply });
  } catch (err) {
    console.error("Chat AI error:", err);
    return NextResponse.json(
      { error: "Failed to reach AI service" },
      { status: 502 }
    );
  }
}
