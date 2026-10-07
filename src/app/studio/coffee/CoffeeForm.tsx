"use client";

import { useState, type FormEvent } from "react";

interface FormData {
  name: string;
  telegram: string;
  about: string;
  topic: string;
  date: string;
  time: string;
}

const INITIAL: FormData = {
  name: "",
  telegram: "",
  about: "",
  topic: "",
  date: "",
  time: "",
};

type Status = "idle" | "submitting" | "sent" | "error";

const inputClass =
  "w-full rounded-lg border border-gray-300 bg-page-bg px-3 py-2.5 font-sans text-sm text-gray-800 outline-none transition-colors placeholder:text-gray-400 focus:border-brand-400 focus:ring-1 focus:ring-brand-400";

const labelClass = "block font-sans text-sm font-bold text-gray-800";

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className={labelClass}>{label}</span>
      {hint && <span className="text-xs text-gray-500">{hint}</span>}
      {children}
    </label>
  );
}

export function CoffeeForm() {
  const [form, setForm] = useState<FormData>(INITIAL);
  const [status, setStatus] = useState<Status>("idle");

  function update(field: keyof FormData, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus("submitting");

    try {
      const res = await fetch("/api/coffee", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error("Request failed");
      setStatus("sent");
      setForm(INITIAL);
    } catch {
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div className="w-full rounded-lg border border-brand-300 bg-brand-50 px-6 py-8 text-center">
        <p className="font-sans text-base font-bold text-gray-800">
          Request sent
        </p>
        <p className="mt-2 text-sm text-gray-600">
          I&apos;ll reach out on Telegram if I&apos;m free. Talk soon.
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-4 rounded-lg border border-gray-300 px-4 py-2 font-sans text-sm text-gray-600 transition-colors hover:border-gray-400 hover:text-gray-800"
        >
          Send another
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full flex-col gap-5">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Field label="Name">
          <input
            type="text"
            required
            placeholder="Your name"
            value={form.name}
            onChange={(e) => update("name", e.target.value)}
            className={inputClass}
          />
        </Field>

        <Field label="Telegram" hint="So I can reach you">
          <input
            type="text"
            required
            placeholder="@username"
            value={form.telegram}
            onChange={(e) => update("telegram", e.target.value)}
            className={inputClass}
          />
        </Field>
      </div>

      <Field
        label="About you"
        hint="What do you work on? What are you into? Help me know you're interesting."
      >
        <textarea
          required
          rows={3}
          placeholder="A few sentences about yourself"
          value={form.about}
          onChange={(e) => update("about", e.target.value)}
          className={`${inputClass} resize-none`}
        />
      </Field>

      <Field label="What should we talk about?" hint="A topic, a question, or just vibes">
        <input
          type="text"
          required
          placeholder="e.g. AI agents, startups, Tashkent food scene"
          value={form.topic}
          onChange={(e) => update("topic", e.target.value)}
          className={inputClass}
        />
      </Field>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Field label="Suggested date">
          <input
            type="date"
            required
            value={form.date}
            onChange={(e) => update("date", e.target.value)}
            className={inputClass}
          />
        </Field>

        <Field label="Suggested time">
          <input
            type="time"
            required
            value={form.time}
            onChange={(e) => update("time", e.target.value)}
            className={inputClass}
          />
        </Field>
      </div>

      {status === "error" && (
        <p className="text-sm text-red-600">
          Something went wrong. Try again.
        </p>
      )}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="mt-1 w-full rounded-lg bg-brand-500 px-4 py-2.5 font-sans text-sm font-bold text-brand-50 transition-colors hover:bg-brand-600 disabled:opacity-50 sm:w-auto sm:self-start"
      >
        {status === "submitting" ? "Sending..." : "Request a chat"}
      </button>
    </form>
  );
}
