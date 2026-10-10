"use client";

import { useCallback, useEffect, useRef, useState } from "react";
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
    const latest = [...places].sort((a, b) => b.visits[0].date.localeCompare(a.visits[0].date))[0];
    try {
      scene.current = createGlobeScene(
        stage,
        places.map(({ slug, lat, lng, visits }) => ({ slug, lat, lng, visits: visits.length })),
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
    host.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  };

  const totalVisits = places.reduce((sum, place) => sum + place.visits.length, 0);

  return (
    <div className="flex flex-col gap-6">
      <div
        className="relative left-1/2 w-[min(calc(100vw-2rem),60rem)] -translate-x-1/2"
        role="group"
        aria-label="Interactive globe of places I have visited"
      >
        <div ref={host} className="relative h-[min(72vh,640px)] min-h-[420px] w-full select-none overflow-hidden">
          {status === "loading" && (
            <p className="absolute inset-0 grid place-items-center text-sm text-gray-500">Drawing the earth…</p>
          )}
          {status === "unavailable" && (
            <p className="absolute inset-0 grid place-items-center px-6 text-center text-sm text-gray-500">
              The globe needs WebGL, which isn&apos;t available here. The list below has everything.
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
      </div>

      <p className="text-sm text-gray-500">
        {places.length} {places.length === 1 ? "place" : "places"}, {totalVisits}{" "}
        {totalVisits === 1 ? "visit" : "visits"}. Bigger dot, more visits. Drag to spin, scroll to zoom, hover or tap a dot.
      </p>

      <ul className="flex flex-col">
        {places.map((place, i) => (
          <li key={place.slug}>
            <button
              type="button"
              onClick={() => choose(place.slug)}
              className="group -mx-4 flex w-[calc(100%+2rem)] cursor-pointer items-baseline justify-between gap-4 rounded-lg px-4 py-3 text-left transition-colors duration-300 ease-out hover:bg-gray-800/[0.04]"
            >
              <span className="min-w-0">
                <span className="block font-sans text-base font-bold text-gray-800">{place.name}</span>
                <span className="block text-sm text-gray-600">{place.country}</span>
              </span>
              <span className="shrink-0 text-right text-xs text-gray-500">
                {place.visits.length} {place.visits.length === 1 ? "visit" : "visits"}
                <span className="block">last {formatVisitDate(place.visits[0].date)}</span>
              </span>
            </button>
            {i < places.length - 1 && <hr className="border-gray-300" />}
          </li>
        ))}
      </ul>
    </div>
  );
}
