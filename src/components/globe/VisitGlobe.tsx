"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { BackLink } from "@/components";
import type { Place } from "@/types";
import { createGlobeScene, type GlobeScene, type ProjectedPlace } from "./createGlobeScene";
import { PlaceCard } from "./PlaceCard";
import { formatVisitDate } from "./formatVisitDate";

const CARD_WIDTH = 264;
const CARD_GAP = 18;
const EDGE = 8;
/** Below this host width the card docks to the bottom instead of following the dot. */
const DOCK_BELOW = 560;
/** Camera distance under which every visited place gets a name label. */
const LABEL_DISTANCE = 2.7;

type Status = "loading" | "ready" | "unavailable";

export function VisitGlobe({ places }: { places: Place[] }) {
  const [status, setStatus] = useState<Status>("loading");
  const [hovered, setHovered] = useState<string | null>(null);
  const [pinned, setPinned] = useState<string | null>(null);
  const [listOpen, setListOpen] = useState(false);
  const host = useRef<HTMLDivElement>(null);
  const card = useRef<HTMLDivElement>(null);
  const labels = useRef(new Map<string, HTMLSpanElement>());
  const scene = useRef<GlobeScene | null>(null);

  const activeSlug = pinned ?? hovered;
  const active = places.find((place) => place.slug === activeSlug);
  const activeRef = useRef<string | null>(null);
  useEffect(() => {
    activeRef.current = activeSlug;
  }, [activeSlug]);

  const project = useCallback((points: ProjectedPlace[], distance: number) => {
    const stage = host.current;
    if (!stage) return;
    const { clientWidth: width, clientHeight: height } = stage;
    const current = activeRef.current;

    for (const point of points) {
      const label = labels.current.get(point.slug);
      if (!label) continue;
      label.style.transform = `translate(${point.x + 12}px, ${point.y - 9}px)`;
      const show = point.facing && (distance < LABEL_DISTANCE || point.slug === current);
      label.style.opacity = show ? "1" : "0";
    }

    const cardEl = card.current;
    const point = points.find((p) => p.slug === current);
    if (!cardEl || !point) return;
    const cardHeight = cardEl.offsetHeight;
    let x: number;
    let y: number;
    if (width < DOCK_BELOW) {
      x = (width - CARD_WIDTH) / 2;
      y = height - cardHeight - EDGE;
    } else {
      x = point.x + CARD_GAP;
      if (x + CARD_WIDTH > width - EDGE) x = point.x - CARD_GAP - CARD_WIDTH;
      x = Math.max(EDGE, x);
      y = Math.min(Math.max(EDGE, point.y - cardHeight / 2), height - cardHeight - EDGE);
    }
    cardEl.style.transform = `translate(${x}px, ${y}px)`;
    cardEl.style.visibility = point.facing || width < DOCK_BELOW ? "visible" : "hidden";
  }, []);

  useEffect(() => {
    const stage = host.current;
    if (!stage || places.length === 0) return;
    const latest = [...places].sort((a, b) => (b.visits[0].date ?? "").localeCompare(a.visits[0].date ?? ""))[0];
    try {
      scene.current = createGlobeScene(
        stage,
        places.map(({ slug, lat, lng }) => ({ slug, lat, lng })),
        {
          onHover: setHovered,
          onPick: setPinned,
          onProject: project,
          onReady: () => setStatus("ready"),
          onUnavailable: (error) => {
            console.error("Globe unavailable:", error);
            setStatus("unavailable");
          },
        },
        latest.slug,
      );
    } catch (error) {
      console.error("Globe unavailable:", error);
      // eslint-disable-next-line react-hooks/set-state-in-effect -- reporting a setup failure from the effect that attempted it
      setStatus("unavailable");
    }
    return () => {
      scene.current?.dispose();
      scene.current = null;
    };
  }, [places, project]);

  useEffect(() => {
    if (!pinned) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setPinned(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [pinned]);

  const choose = (slug: string) => {
    setPinned(slug);
    scene.current?.flyTo(slug);
    setListOpen(false);
  };

  return (
    <div
      className="fixed inset-0 z-[300] bg-page-bg"
      role="group"
      aria-label="Interactive globe of places I have visited"
    >
      <div ref={host} className="absolute inset-0 select-none overflow-hidden">
        {status === "loading" && (
          <p className="absolute inset-0 grid place-items-center text-sm text-gray-500">Drawing the earth…</p>
        )}
        {status === "unavailable" && (
          <p className="absolute inset-0 grid place-items-center px-6 text-center text-sm text-gray-500">
            The globe needs WebGL, which isn&apos;t available here. Open the list for everything.
          </p>
        )}

        {places.map((place) => (
          <span
            key={place.slug}
            ref={(node) => {
              if (node) labels.current.set(place.slug, node);
              else labels.current.delete(place.slug);
            }}
            aria-hidden
            className="pointer-events-none absolute top-0 left-0 whitespace-nowrap text-xs font-bold text-gray-800 opacity-0 transition-opacity duration-200 [text-shadow:0_0_3px_var(--color-page-bg),0_0_6px_var(--color-page-bg)]"
          >
            {place.name}
          </span>
        ))}

        <div
          ref={card}
          style={{ width: CARD_WIDTH }}
          className={`absolute top-0 left-0 z-10 ${pinned ? "" : "pointer-events-none"} ${active ? "" : "invisible"}`}
        >
          {active && <PlaceCard place={active} pinned={pinned === active.slug} onClose={() => setPinned(null)} />}
        </div>
      </div>

      <div className="absolute top-5 left-5 z-20 sm:top-6 sm:left-6">
        <BackLink href="/studio">← idk</BackLink>
      </div>

      <div className="absolute bottom-5 left-5 z-20 flex max-h-[60vh] flex-col items-start gap-2 sm:bottom-6 sm:left-6">
        {listOpen && (
          <ul className="flex w-72 max-w-[calc(100vw-2.5rem)] flex-col overflow-y-auto rounded-lg border border-gray-300 bg-page-bg p-1 shadow-[0_10px_30px_-12px_rgba(35,41,19,0.35)]">
            {places.map((place) => (
              <li key={place.slug}>
                <button
                  type="button"
                  onClick={() => choose(place.slug)}
                  className="flex w-full cursor-pointer items-baseline justify-between gap-3 rounded-md px-3 py-2 text-left transition-colors duration-200 hover:bg-gray-800/[0.04]"
                >
                  <span className="min-w-0">
                    <span className="block font-sans text-sm font-bold text-gray-800">{place.name}</span>
                    <span className="block text-xs text-gray-600">{place.country}</span>
                  </span>
                  <span className="shrink-0 text-right text-xs text-gray-500">
                    {place.home ? "home" : `${place.visits.length}x`}
                    {!place.home && place.visits[0].date && (
                      <span className="block">{formatVisitDate(place.visits[0].date)}</span>
                    )}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
        <button
          type="button"
          onClick={() => setListOpen((open) => !open)}
          aria-expanded={listOpen}
          className="cursor-pointer rounded-md border border-gray-300 bg-page-bg px-3 py-1.5 text-sm text-gray-600 transition-colors duration-200 hover:border-brand-500 hover:text-brand-500"
        >
          {listOpen ? "Hide list" : "All places"}
        </button>
      </div>

      <p className="pointer-events-none absolute right-5 bottom-5 z-20 hidden text-xs text-gray-500 sm:block">
        Drag to spin, scroll to zoom
      </p>
    </div>
  );
}
