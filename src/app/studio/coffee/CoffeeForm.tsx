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
  { key: "date", prompt: "Pick a day.", custom: "date" as const },
  { key: "time", prompt: "What time works?", custom: "time" as const },
] as const;

type StepKey = (typeof STEPS)[number]["key"];
type FormData = Record<StepKey, string>;

const INITIAL: FormData = { name: "", telegram: "", about: "", topic: "", date: "", time: "" };

type Status = "filling" | "review" | "submitting" | "sent" | "error";

const DAYS = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function CalendarPicker({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());

  const firstDay = new Date(viewYear, viewMonth, 1);
  const startDow = (firstDay.getDay() + 6) % 7;
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

  function toStr(day: number) {
    return `${viewYear}-${String(viewMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  }

  function isPast(day: number) {
    return toStr(day) < todayStr;
  }

  function prevMonth() {
    if (viewMonth === 0) { setViewYear(viewYear - 1); setViewMonth(11); }
    else setViewMonth(viewMonth - 1);
  }

  function nextMonth() {
    if (viewMonth === 11) { setViewYear(viewYear + 1); setViewMonth(0); }
    else setViewMonth(viewMonth + 1);
  }

  const cells: (number | null)[] = [];
  for (let i = 0; i < startDow; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  return (
    <div className="w-full max-w-[320px]">
      <div className="mb-3 flex items-center justify-between">
        <button
          type="button"
          onClick={prevMonth}
          className="px-2 py-1 text-sm text-gray-400 transition-colors hover:text-gray-800"
        >
          &larr;
        </button>
        <span className="text-sm font-bold text-gray-800">
          {MONTHS[viewMonth]} {viewYear}
        </span>
        <button
          type="button"
          onClick={nextMonth}
          className="px-2 py-1 text-sm text-gray-400 transition-colors hover:text-gray-800"
        >
          &rarr;
        </button>
      </div>

      <div className="grid grid-cols-7 gap-0.5 text-center text-xs">
        {DAYS.map((d) => (
          <span key={d} className="py-1.5 text-gray-400">{d}</span>
        ))}
        {cells.map((day, i) =>
          day === null ? (
            <span key={`e${i}`} />
          ) : (
            <button
              key={day}
              type="button"
              disabled={isPast(day)}
              onClick={() => onChange(toStr(day))}
              className={`rounded py-1.5 text-sm transition-colors ${
                toStr(day) === value
                  ? "bg-brand-500 font-bold text-brand-50"
                  : toStr(day) === todayStr
                    ? "font-bold text-gray-800 hover:bg-gray-200"
                    : isPast(day)
                      ? "text-gray-300"
                      : "text-gray-600 hover:bg-gray-200"
              }`}
            >
              {day}
            </button>
          ),
        )}
      </div>
    </div>
  );
}

const TIME_SLOTS = [
  "9:00", "9:30", "10:00", "10:30", "11:00", "11:30",
  "12:00", "12:30", "13:00", "13:30", "14:00", "14:30",
  "15:00", "15:30", "16:00", "16:30", "17:00", "17:30",
  "18:00", "18:30", "19:00", "19:30", "20:00", "20:30",
];

function formatTimeLabel(t: string) {
  const [h, m] = t.split(":");
  const hour = parseInt(h, 10);
  const suffix = hour >= 12 ? "pm" : "am";
  return `${hour % 12 || 12}:${m} ${suffix}`;
}

function TimePicker({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div className="grid w-full max-w-[320px] grid-cols-4 gap-1.5">
      {TIME_SLOTS.map((t) => (
        <button
          key={t}
          type="button"
          onClick={() => onChange(t)}
          className={`rounded py-2 text-center text-sm transition-colors ${
            t === value
              ? "bg-brand-500 font-bold text-brand-50"
              : "text-gray-600 hover:bg-gray-200"
          }`}
        >
          {formatTimeLabel(t)}
        </button>
      ))}
    </div>
  );
}

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

    if (current.key === "telegram") {
      const handle = form.telegram.trim();
      if (!handle.startsWith("@")) {
        setForm((prev) => ({ ...prev, telegram: `@${handle}` }));
      }
    }

    if (step < STEPS.length - 1) {
      setStep(step + 1);
    } else {
      setStatus("review");
    }
  }

  function handleKey(e: KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
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
    return formatTimeLabel(v);
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
  const isCustom = "custom" in current;

  function handleCustomSelect(value: string) {
    update(current.key, value);
  }

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

        {isCustom && "custom" in current && current.custom === "date" ? (
          <div className="flex flex-col gap-3">
            <CalendarPicker value={form.date} onChange={handleCustomSelect} />
            {form.date && (
              <button
                type="button"
                onClick={advance}
                className="self-start text-sm text-gray-400 transition-colors hover:text-gray-800"
              >
                {formatDate(form.date)} &rarr;
              </button>
            )}
          </div>
        ) : isCustom && "custom" in current && current.custom === "time" ? (
          <div className="flex flex-col gap-3">
            <TimePicker value={form.time} onChange={handleCustomSelect} />
            {form.time && (
              <button
                type="button"
                onClick={advance}
                className="self-start text-sm text-gray-400 transition-colors hover:text-gray-800"
              >
                {formatTime(form.time)} &rarr;
              </button>
            )}
          </div>
        ) : (
          <div className="flex items-end gap-3">
            <div className="min-w-0 flex-1">
              {isMultiline ? (
                <textarea
                  ref={(el) => { inputRef.current = el; }}
                  rows={3}
                  placeholder={current.placeholder}
                  value={form[current.key]}
                  onChange={(e) => update(current.key, e.target.value)}
                  onKeyDown={handleKey}
                  className="w-full resize-none border-b-2 border-gray-300 bg-transparent pb-2 text-base text-gray-800 outline-none transition-colors placeholder:text-gray-400 focus:border-brand-500"
                />
              ) : (
                <input
                  ref={(el) => { inputRef.current = el; }}
                  type="text"
                  placeholder={"placeholder" in current ? current.placeholder : ""}
                  value={form[current.key]}
                  onChange={(e) => update(current.key, e.target.value)}
                  onKeyDown={handleKey}
                  className="w-full border-b-2 border-gray-300 bg-transparent pb-2 text-base text-gray-800 outline-none transition-colors placeholder:text-gray-400 focus:border-brand-500"
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
        )}
      </div>

      <p className="text-xs text-gray-400">{step + 1} / {STEPS.length}</p>
    </div>
  );
}
