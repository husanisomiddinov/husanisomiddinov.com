import { NextResponse } from "next/server";

const FIELDS = ["name", "email", "telegram", "about", "topic", "date", "time", "place"] as const;

function parseHour(raw: string): number {
  const match = raw.toLowerCase().trim().match(/^(\d{1,2})(?::\d{2})?\s*(am|pm)?$/);
  if (!match) return 15;
  const h = parseInt(match[1], 10) % 12;
  return match[2] === "pm" || (!match[2] && parseInt(match[1], 10) >= 12) ? h + 12 : h;
}

function calendarUrl(f: Record<(typeof FIELDS)[number], string>) {
  const day = f.date.replace(/-/g, "");
  const hour = parseHour(f.time);
  const at = (h: number) => `${day}T${String(h).padStart(2, "0")}0000`;

  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: `Coffee chat with ${f.name}`,
    dates: `${at(hour)}/${at(Math.min(hour + 1, 23))}`,
    details: `Topic: ${f.topic}`,
    location: f.place,
    add: f.email,
  });

  return `https://calendar.google.com/calendar/render?${params}`;
}

export async function POST(request: Request) {
  const body = await request.json();

  if (FIELDS.some((k) => !body[k])) {
    return NextResponse.json({ error: "All fields are required" }, { status: 400 });
  }

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    console.error("[coffee-chat] Missing TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID");
    return NextResponse.json({ error: "Server misconfigured" }, { status: 500 });
  }

  const f = body as Record<(typeof FIELDS)[number], string>;
  const date = new Date(`${f.date}T00:00:00`).toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  const text = [
    "☕ New coffee chat request",
    "",
    `Name: ${f.name}`,
    `Email: ${f.email}`,
    `Telegram: ${f.telegram}`,
    `About: ${f.about}`,
    `Topic: ${f.topic}`,
    `Date: ${date}`,
    `Time: ${f.time}`,
    `Place: ${f.place}`,
  ].join("\n");

  const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text,
      reply_markup: {
        inline_keyboard: [[{ text: "📅 Create Calendar Event", url: calendarUrl(f) }]],
      },
    }),
  });

  if (!res.ok) {
    console.error("[coffee-chat] Telegram error:", await res.text());
    return NextResponse.json({ error: "Failed to send" }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
