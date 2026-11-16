import { NextResponse } from "next/server";
import { isDevOnlyAvailable } from "@/lib/dev-only";
import { EMAIL_PATTERN } from "@/lib/validation";

const MAX_EMAIL_LENGTH = 200;
const MAX_SOURCE_LENGTH = 100;

interface Signup {
  email: string;
  source: string;
  /** Hidden form field. People leave it empty, bots fill it in. */
  trap: string;
}

function parseSignup(body: unknown): Signup | null {
  if (typeof body !== "object" || body === null) return null;
  const { email, source, company } = body as Record<string, unknown>;
  if (typeof email !== "string") return null;

  const trimmed = email.trim();
  if (trimmed.length > MAX_EMAIL_LENGTH || !EMAIL_PATTERN.test(trimmed)) return null;

  return {
    email: trimmed,
    source: typeof source === "string" ? source.trim().slice(0, MAX_SOURCE_LENGTH) : "",
    trap: typeof company === "string" ? company : "",
  };
}

/**
 * Records a digest signup. There is no mailing engine yet, so for now each signup
 * is posted to the Telegram group, which doubles as the subscriber list.
 */
export async function POST(request: Request) {
  if (!isDevOnlyAvailable) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const signup = parseSignup(await request.json().catch(() => null));

  if (!signup) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }

  // Tell the bot it worked, and record nothing.
  if (signup.trap) {
    return NextResponse.json({ ok: true });
  }

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    console.error("[newsletter] Missing TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID");
    return NextResponse.json({ error: "Server misconfigured" }, { status: 500 });
  }

  const text = [
    "📬 New digest subscriber",
    "",
    `Email: ${signup.email}`,
    `Signed up on: ${signup.source || "unknown"}`,
  ].join("\n");

  const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text }),
  });

  if (!res.ok) {
    console.error("[newsletter] Telegram error:", await res.text());
    return NextResponse.json({ error: "Failed to record signup" }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
