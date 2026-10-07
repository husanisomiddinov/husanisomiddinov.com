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

const inlineInput =
  "border-b border-dashed border-gray-400 bg-transparent px-0.5 pb-0.5 font-sans text-gray-800 outline-none transition-colors placeholder:text-gray-400 focus:border-brand-500";

function InlineInput({
  value,
  onChange,
  placeholder,
  type = "text",
  width,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  type?: string;
  width?: string;
}) {
  return (
    <input
      type={type}
      required
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`${inlineInput} ${width ?? "w-40"}`}
      style={type === "date" || type === "time" ? { colorScheme: "light" } : undefined}
    />
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
      <div className="w-full py-8">
        <p className="text-base leading-[1.6] text-gray-800">
          Request sent. I&apos;ll ping you on Telegram if I&apos;m around.
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-4 border-b border-dashed border-gray-400 font-sans text-sm text-gray-500 transition-colors hover:border-brand-500 hover:text-gray-800"
        >
          Send another request
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="flex flex-col gap-6 text-base leading-[2.2] text-gray-600">
        <p>
          Hey, I&apos;m{" "}
          <InlineInput
            value={form.name}
            onChange={(v) => update("name", v)}
            placeholder="your name"
            width="w-36 sm:w-44"
          />
          . You can find me on Telegram at{" "}
          <InlineInput
            value={form.telegram}
            onChange={(v) => update("telegram", v)}
            placeholder="@handle"
            width="w-28 sm:w-36"
          />
          .
        </p>

        <div>
          <p className="mb-2">A bit about me:</p>
          <textarea
            required
            rows={3}
            placeholder="What you work on, what you're into, what makes you tick"
            value={form.about}
            onChange={(e) => update("about", e.target.value)}
            className="w-full resize-none border-b border-dashed border-gray-400 bg-transparent pb-1 font-sans text-sm leading-relaxed text-gray-800 outline-none transition-colors placeholder:text-gray-400 focus:border-brand-500"
          />
        </div>

        <p>
          I&apos;d love to talk about{" "}
          <InlineInput
            value={form.topic}
            onChange={(v) => update("topic", v)}
            placeholder="a topic or question"
            width="w-44 sm:w-56"
          />
          .
        </p>

        <p>
          How about{" "}
          <InlineInput
            value={form.date}
            onChange={(v) => update("date", v)}
            placeholder="pick a day"
            type="date"
            width="w-36 sm:w-40"
          />{" "}
          at{" "}
          <InlineInput
            value={form.time}
            onChange={(v) => update("time", v)}
            placeholder="time"
            type="time"
            width="w-28 sm:w-32"
          />
          ?
        </p>
      </div>

      {status === "error" && (
        <p className="mt-4 text-sm text-red-600">
          Something went wrong. Try again.
        </p>
      )}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="mt-8 rounded-lg bg-brand-500 px-5 py-2.5 font-sans text-sm font-bold text-brand-50 transition-colors hover:bg-brand-600 disabled:opacity-50"
      >
        {status === "submitting" ? "Sending..." : "Send request"}
      </button>
    </form>
  );
}
