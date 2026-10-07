import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();
  const { name, telegram, about, topic, date, time } = body;

  if (!name || !telegram || !about || !topic || !date || !time) {
    return NextResponse.json({ error: "All fields are required" }, { status: 400 });
  }

  // TODO: send to Telegram bot
  console.log("[coffee-chat]", { name, telegram, about, topic, date, time });

  return NextResponse.json({ ok: true });
}
