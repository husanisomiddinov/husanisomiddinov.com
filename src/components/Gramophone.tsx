"use client";

import Image from "next/image";
import { useState } from "react";
import { Button } from "./Button";
import type { MusicTrack } from "../../content/data/personal/about-media";

/** Turns a normal open.spotify.com link into its embed URL, or null if it is not one. */
function toEmbedUrl(link: string) {
  const match = link.match(/^https:\/\/open\.spotify\.com\/(track|album|playlist)\/([A-Za-z0-9]+)/);
  return match ? `https://open.spotify.com/embed/${match[1]}/${match[2]}` : null;
}

const arrow = "h-4 w-4";

/** Pixel gramophone with a spinning record, and a player below it to switch between tracks. The Spotify iframe loads only after a click. */
export function Gramophone({ tracks, className }: { tracks: MusicTrack[]; className?: string }) {
  const [index, setIndex] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const playable = tracks.filter((track) => toEmbedUrl(track.link));
  const track = playable[index];

  const step = (delta: number) =>
    setIndex((current) => (current + delta + playable.length) % playable.length);

  return (
    <div className={`flex flex-col gap-3 ${className ?? ""}`}>
      <div className="relative">
        <Image
          src="/images/gramophone.webp"
          alt=""
          width={500}
          height={500}
          sizes="(max-width: 640px) 176px, 224px"
          className="h-auto w-full"
        />
        <svg
          viewBox="0 0 500 500"
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 size-full"
        >
          <g transform="translate(245 260) scale(1 0.45)">
            <g className="gramophone-spin">
              <circle r="82" fill="none" stroke="#d9d9d7" strokeOpacity="0.28" strokeWidth="5" strokeDasharray="70 446" />
              <circle r="62" fill="none" stroke="#d9d9d7" strokeOpacity="0.2" strokeWidth="4" strokeDasharray="50 340" strokeDashoffset="-120" />
            </g>
          </g>
        </svg>
      </div>

      {track && (
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between gap-2">
            <Button variant="secondary" size="icon" aria-label="Previous track" onClick={() => step(-1)}>
              <svg viewBox="0 0 16 16" className={arrow} fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M10 3 5 8l5 5" />
              </svg>
            </Button>
            <p className="min-w-0 truncate text-center text-sm font-bold text-gray-700">{track.title}</p>
            <Button variant="secondary" size="icon" aria-label="Next track" onClick={() => step(1)}>
              <svg viewBox="0 0 16 16" className={arrow} fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="m6 3 5 5-5 5" />
              </svg>
            </Button>
          </div>
          {loaded ? (
            <iframe
              key={track.link}
              src={toEmbedUrl(track.link) ?? undefined}
              title={`Player: ${track.title}`}
              width="100%"
              height="152"
              allow="encrypted-media"
              className="rounded-lg border-0"
            />
          ) : (
            <Button variant="primary" size="sm" onClick={() => setLoaded(true)}>
              Play
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
