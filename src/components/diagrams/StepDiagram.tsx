"use client";

import {
  useEffect,
  useId,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from "react";

export interface DiagramStep {
  label: string;
  body: ReactNode;
}

export function InlineCode({ children }: { children: ReactNode }) {
  return (
    <code className="rounded border border-gray-200 bg-brand-50 px-1 py-0.5 text-[0.85em] text-code">
      {children}
    </code>
  );
}

export function useAnimationsEnabled(): boolean {
  const [enabled, setEnabled] = useState(true);
  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setEnabled(!media.matches);
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);
  return enabled;
}

/** Steps through 0..length-1 on a timer, for auto-playing previews. */
export function useCycle(length: number, ms: number, enabled: boolean): number {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    if (!enabled) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % length), ms);
    return () => clearInterval(id);
  }, [length, ms, enabled]);
  return index;
}

/** Click-through diagram: a scene that reacts to the active step, tabs to pick a step, and a text panel. */
export function StepDiagram({
  steps,
  caption,
  children,
}: {
  steps: DiagramStep[];
  caption: ReactNode;
  children: (state: { active: number; animate: boolean }) => ReactNode;
}) {
  const [active, setActive] = useState(0);
  const animate = useAnimationsEnabled();
  const baseId = useId();

  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
    event.preventDefault();
    const delta = event.key === "ArrowRight" ? 1 : -1;
    const next = (active + delta + steps.length) % steps.length;
    setActive(next);
    document.getElementById(`${baseId}-tab-${next}`)?.focus();
  };

  return (
    <figure className="my-4 w-full rounded-md bg-brand-50 p-3 sm:p-6">
      <div className="mx-auto w-full overflow-x-auto">{children({ active, animate })}</div>

      <div role="tablist" aria-label="Steps" className="mt-4 flex w-full">
        {steps.map((step, i) => (
          <button
            key={step.label}
            id={`${baseId}-tab-${i}`}
            role="tab"
            type="button"
            aria-selected={i === active}
            aria-controls={`${baseId}-panel`}
            tabIndex={i === active ? 0 : -1}
            onClick={() => setActive(i)}
            onKeyDown={onKeyDown}
            className={`-ml-px min-w-0 flex-1 cursor-pointer truncate border px-1 py-2 font-sans text-xs transition-colors duration-200 first:ml-0 sm:text-sm ${
              i === active
                ? "border-gray-900 bg-gray-900 text-brand-50"
                : "border-gray-300 text-gray-500 hover:text-gray-800"
            }`}
          >
            {step.label}
          </button>
        ))}
      </div>

      <div
        role="tabpanel"
        id={`${baseId}-panel`}
        aria-labelledby={`${baseId}-tab-${active}`}
        className="bg-gray-200/60 p-4 text-[0.9375rem] leading-[1.7] text-gray-700"
      >
        {steps[active].body}
      </div>

      <figcaption className="mt-3 font-sans text-sm text-gray-600">
        {caption}
      </figcaption>
    </figure>
  );
}
