import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();
  const { name, email, telegram, about, topic, date, time } = body;

  if (!name || !email || !telegram || !about || !topic || !date || !time) {
    return NextResponse.json({ error: "All fields are required" }, { status: 400 });
  }

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    console.error("[coffee-chat] Missing TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID");
    return NextResponse.json({ error: "Server misconfigured" }, { status: 500 });
  }

  const d = new Date(`${date}T00:00:00`);
  const formatted = d.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" });

  const text = [
    "☕ New coffee chat request",
    "",
    `Name: ${name}`,
    `Email: ${email}`,
    `Telegram: ${telegram}`,
    `About: ${about}`,
    `Topic: ${topic}`,
    `Date: ${formatted}`,
    `Time: ${time}`,
  ].join("\n");

  const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text, parse_mode: "HTML" }),
  });

  if (!res.ok) {
    const err = await res.text();
    console.error("[coffee-chat] Telegram error:", err);
    return NextResponse.json({ error: "Failed to send" }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
