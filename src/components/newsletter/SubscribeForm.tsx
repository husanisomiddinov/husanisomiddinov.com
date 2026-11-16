"use client";

import { useId, useState, useSyncExternalStore, type FormEvent } from "react";
import { Button } from "@/components/Button";
import { EMAIL_PATTERN } from "@/lib/validation";

type Status = "idle" | "submitting" | "invalid" | "error";

/** Remembers the signup in this browser, so a returning reader sees the confirmation and not the form. */
const STORAGE_KEY = "digest-subscriber";
const CHANGE_EVENT = "digest-subscriber-change";

function listen(onChange: () => void) {
  window.addEventListener("storage", onChange);
  window.addEventListener(CHANGE_EVENT, onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener(CHANGE_EVENT, onChange);
  };
}

function readSaved(): string | null {
  try {
    return window.localStorage.getItem(STORAGE_KEY);
  } catch {
    return null; // Storage can be blocked. The form still works, it just forgets.
  }
}

function save(email: string | null) {
  try {
    if (email) window.localStorage.setItem(STORAGE_KEY, email);
    else window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Same as above: nothing to do when storage is blocked.
  }
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

const MESSAGES: Record<"invalid" | "error", string> = {
  invalid: "That does not look like an email address.",
  error: "Something went wrong. Try again.",
};

interface SubscribeFormProps {
  /** Where the form sits, recorded with the signup (for example "newsletter" or an issue slug). */
  source: string;
  /** Weekday the issue goes out, used in the confirmation. */
  sendDay: string;
}

/** The digest signup: one email field and a button, with a confirmation that replaces the form. */
export function SubscribeForm({ source, sendDay }: SubscribeFormProps) {
  const id = useId();
  const saved = useSyncExternalStore(listen, readSaved, () => null);
  const [justSubscribed, setJustSubscribed] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");

  const subscribed = saved ?? justSubscribed;

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const value = email.trim();
    if (!EMAIL_PATTERN.test(value)) {
      setStatus("invalid");
      return;
    }

    // A hidden field people never see. Anything typed into it came from a bot.
    const company = new FormData(event.currentTarget).get("company");

    setStatus("submitting");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: value, source, company }),
      });
      if (!res.ok) throw new Error();
      setJustSubscribed(value);
      save(value);
      setEmail("");
      setStatus("idle");
    } catch {
      setStatus("error");
    }
  }

  function startOver() {
    setJustSubscribed(null);
    save(null);
  }

  if (subscribed) {
    return (
      <div role="status" className="rounded-md border border-gray-200 bg-brand-50 px-4 py-3">
        <p className="text-prose-sm text-ink">
          <strong className="font-bold">You are on the list.</strong> The next issue goes to{" "}
          <span className="break-all">{subscribed}</span> on {sendDay}.
        </p>
        <button
          type="button"
          onClick={startOver}
          className="mt-1 cursor-pointer rounded text-sm text-gray-500 transition-colors duration-200 hover:text-brand-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500"
        >
          Use a different email
        </button>
      </div>
    );
  }

  const problem = status === "invalid" || status === "error" ? MESSAGES[status] : null;

  return (
    <form onSubmit={submit} noValidate className="flex w-full flex-col gap-2">
      <label htmlFor={id} className="sr-only">
        Email address
      </label>
      <div className="flex items-end gap-3">
        <input
          id={id}
          type="email"
          name="email"
          autoComplete="email"
          inputMode="email"
          required
          placeholder="you@example.com"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (problem) setStatus("idle");
          }}
          aria-invalid={status === "invalid"}
          aria-describedby={`${id}-note`}
          className="min-w-0 flex-1 border-b-2 border-gray-300 bg-transparent pb-2 text-base text-gray-800 outline-none transition-colors duration-200 placeholder:text-gray-400 focus:border-brand-500"
        />
        <input type="text" name="company" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />
        <Button type="submit" disabled={status === "submitting"} className="shrink-0">
          {status === "submitting" ? "Subscribing..." : "Subscribe"}
        </Button>
      </div>
      <p id={`${id}-note`} aria-live="polite" className={`text-sm ${problem ? "text-red-600" : "text-gray-500"}`}>
        {problem ?? "Free. One email a week. Leave whenever."}
      </p>
    </form>
  );
}
