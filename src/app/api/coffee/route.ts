import { NextResponse } from "next/server";

function buildCalendarUrl(name: string, email: string, topic: string, date: string, time: string, place: string) {
  const dateClean = date.replace(/-/g, "");

  const hour = parseTime(time);
  const startH = String(hour).padStart(2, "0");
  const endH = String(Math.min(hour + 1, 23)).padStart(2, "0");
  const start = `${dateClean}T${startH}0000`;
  const end = `${dateClean}T${endH}0000`;

  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: `Coffee chat with ${name}`,
    dates: `${start}/${end}`,
    details: `Topic: ${topic}`,
    location: place,
    add: email,
  });

  return `https://calendar.google.com/calendar/render?${params}`;
}

function parseTime(raw: string): number {
  const lower = raw.toLowerCase().trim();
  const match = lower.match(/^(\d{1,2})(?::(\d{2}))?\s*(am|pm)?$/);
  if (!match) return 15;
  let h = parseInt(match[1], 10);
  const ampm = match[3];
  if (ampm === "pm" && h < 12) h += 12;
  if (ampm === "am" && h === 12) h = 0;
  return h;
}

export async function POST(request: Request) {
  const body = await request.json();
  const { name, email, telegram, about, topic, date, time, place } = body;

  if (!name || !email || !telegram || !about || !topic || !date || !time || !place) {
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
    `Place: ${place}`,
  ].join("\n");

  const calendarUrl = buildCalendarUrl(name, email, topic, date, time, place);

  const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text,
      reply_markup: {
        inline_keyboard: [[
          { text: "📅 Create Calendar Event", url: calendarUrl },
        ]],
      },
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    console.error("[coffee-chat] Telegram error:", err);
    return NextResponse.json({ error: "Failed to send" }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
