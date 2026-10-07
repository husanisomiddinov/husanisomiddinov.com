"use client";

import { useRef, useState, useEffect, type KeyboardEvent } from "react";

const STEPS = [
  { key: "name", prompt: "What's your name?", placeholder: "First name is fine" },
  { key: "telegram", prompt: "How do I reach you?", placeholder: "@telegram_handle" },
  {
    key: "about",
    prompt: "Tell me something interesting about yourself.",
    placeholder: "What you build, what you care about, what you can't shut up about",
    multiline: true,
  },
  {
    key: "topic",
    prompt: "What should we talk about?",
    placeholder: "A question, a project, a half-baked theory",
  },
  { key: "date", prompt: "Pick a day.", placeholder: "", type: "date" as const },
  { key: "time", prompt: "What time works?", placeholder: "", type: "time" as const },
] as const;

type StepKey = (typeof STEPS)[number]["key"];
type FormData = Record<StepKey, string>;

const INITIAL: FormData = { name: "", telegram: "", about: "", topic: "", date: "", time: "" };

type Status = "filling" | "review" | "submitting" | "sent" | "error";

export function CoffeeForm() {
  const [form, setForm] = useState<FormData>(INITIAL);
  const [step, setStep] = useState(0);
  const [status, setStatus] = useState<Status>("filling");
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement | null>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, [step, status]);

  function update(key: StepKey, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function advance() {
    const current = STEPS[step];
    if (!form[current.key].trim()) return;

    if (step < STEPS.length - 1) {
      setStep(step + 1);
    } else {
      setStatus("review");
    }
  }

  function handleKey(e: KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      const current = STEPS[step];
      if ("multiline" in current && current.multiline) return;
      e.preventDefault();
      advance();
    }
  }

  async function submit() {
    setStatus("submitting");
    try {
      const res = await fetch("/api/coffee", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  }

  function reset() {
    setForm(INITIAL);
    setStep(0);
    setStatus("filling");
  }

  function editStep(i: number) {
    setStep(i);
    setStatus("filling");
  }

  function formatDate(v: string) {
    if (!v) return v;
    const d = new Date(`${v}T00:00:00`);
    return d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
  }

  function formatTime(v: string) {
    if (!v) return v;
    const [h, m] = v.split(":");
    const hour = parseInt(h, 10);
    const suffix = hour >= 12 ? "pm" : "am";
    return `${hour % 12 || 12}:${m}${suffix}`;
  }

  function formatAnswer(i: number) {
    const s = STEPS[i];
    const v = form[s.key];
    if (s.key === "date") return formatDate(v);
    if (s.key === "time") return formatTime(v);
    return v;
  }

  if (status === "sent") {
    return (
      <div className="w-full">
        <div className="flex flex-col gap-1">
          <p className="text-sm text-gray-500">husan</p>
          <p className="text-base text-gray-800">
            Got it, {form.name}. I&apos;ll message you on Telegram.
          </p>
        </div>
        <button
          type="button"
          onClick={reset}
          className="mt-6 text-sm text-gray-400 transition-colors hover:text-gray-600"
        >
          Start over
        </button>
      </div>
    );
  }

  if (status === "review" || status === "submitting" || status === "error") {
    return (
      <div className="flex w-full flex-col gap-4">
        {STEPS.map((s, i) => (
          <button
            key={s.key}
            type="button"
            onClick={() => editStep(i)}
            className="group flex flex-col gap-1 text-left"
          >
            <p className="text-sm text-gray-400">{s.prompt}</p>
            <p className="text-base text-gray-800 group-hover:text-brand-500 transition-colors">
              {formatAnswer(i)}
            </p>
          </button>
        ))}

        {status === "error" && (
          <p className="text-sm text-red-600">Something went wrong. Try again.</p>
        )}

        <div className="mt-2 flex items-center gap-4">
          <button
            type="button"
            onClick={submit}
            disabled={status === "submitting"}
            className="rounded-lg bg-brand-500 px-5 py-2.5 font-sans text-sm font-bold text-brand-50 transition-colors hover:bg-brand-600 disabled:opacity-50"
          >
            {status === "submitting" ? "Sending..." : "Looks good, send it"}
          </button>
          <button
            type="button"
            onClick={() => editStep(0)}
            className="text-sm text-gray-400 transition-colors hover:text-gray-600"
          >
            Edit
          </button>
        </div>
      </div>
    );
  }

  const current = STEPS[step];
  const isMultiline = "multiline" in current && current.multiline;

  return (
    <div className="flex w-full flex-col gap-6">
      {STEPS.slice(0, step).map((s, i) => (
        <button
          key={s.key}
          type="button"
          onClick={() => editStep(i)}
          className="group flex flex-col gap-1 text-left"
        >
          <p className="text-sm text-gray-400">{s.prompt}</p>
          <p className="text-base text-gray-800 group-hover:text-brand-500 transition-colors">
            {formatAnswer(i)}
          </p>
        </button>
      ))}

      <div className="flex flex-col gap-3">
        <p className="text-base text-gray-600">{current.prompt}</p>
        <div className="flex items-end gap-3">
          <div className="min-w-0 flex-1">
            {isMultiline ? (
              <textarea
                ref={(el) => { inputRef.current = el; }}
                rows={3}
                placeholder={current.placeholder}
                value={form[current.key]}
                onChange={(e) => update(current.key, e.target.value)}
                className="w-full resize-none border-b-2 border-gray-300 bg-transparent pb-2 text-base text-gray-800 outline-none transition-colors placeholder:text-gray-400 focus:border-brand-500"
              />
            ) : (
              <input
                ref={(el) => { inputRef.current = el; }}
                type={("type" in current && current.type) || "text"}
                placeholder={current.placeholder}
                value={form[current.key]}
                onChange={(e) => update(current.key, e.target.value)}
                onKeyDown={handleKey}
                className="w-full border-b-2 border-gray-300 bg-transparent pb-2 text-base text-gray-800 outline-none transition-colors placeholder:text-gray-400 focus:border-brand-500"
                style={
                  "type" in current && (current.type === "date" || current.type === "time")
                    ? { colorScheme: "light" }
                    : undefined
                }
              />
            )}
          </div>
          <button
            type="button"
            onClick={advance}
            disabled={!form[current.key].trim()}
            className="shrink-0 pb-2 text-sm text-gray-400 transition-colors hover:text-gray-800 disabled:opacity-30"
          >
            {step < STEPS.length - 1 ? "next" : "review"} &rarr;
          </button>
        </div>
      </div>

      <div className="flex gap-1">
        {STEPS.map((_, i) => (
          <div
            key={i}
            className={`h-0.5 flex-1 rounded-full transition-colors ${
              i <= step ? "bg-brand-500" : "bg-gray-300"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
