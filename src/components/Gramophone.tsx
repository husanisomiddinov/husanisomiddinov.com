"use client";

import Image from "next/image";
import { useRef, type ReactNode } from "react";
import { useAudioPlaylist } from "@/lib/useAudioPlaylist";
import type { MusicTrack } from "../../content/data/personal/about-media";
import { PauseIcon, PlayIcon, SkipNextIcon, SkipPreviousIcon } from "./icons";

const focusRing =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500";

function ControlButton({
  label,
  onClick,
  className,
  children,
}: {
  label: string;
  onClick: () => void;
  className: string;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className={`inline-flex cursor-pointer items-center justify-center transition-colors duration-200 ${focusRing} ${className}`}
    >
      {children}
    </button>
  );
}

/** Pixel gramophone whose record spins while the track plays, with previous, play/pause and next below it. */
export function Gramophone({ tracks, className }: { tracks: MusicTrack[]; className?: string }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const { ready, index, playing, step, toggle, audioProps } = useAudioPlaylist(tracks.length, rootRef);
  const track = tracks[index];
  const skipClass = "size-8 rounded text-brand-500 hover:text-brand-600";

  return (
    <div ref={rootRef} className={`flex flex-col gap-3 ${className ?? ""}`}>
      <div className="relative">
        <Image
          src="/images/gramophone.webp"
          alt=""
          width={500}
          height={500}
          sizes="(max-width: 640px) 176px, 224px"
          className="h-auto w-full"
        />
        {/* Hand-measured to sit on the record in gramophone.webp (500x500). Redo if the art changes. */}
        <svg
          viewBox="0 0 500 500"
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 size-full"
        >
          <g transform="translate(255 260) scale(1 0.45)">
            <g className="gramophone-spin text-gray-300" data-playing={playing} fill="none" stroke="currentColor">
              <circle r="82" strokeOpacity="0.28" strokeWidth="5" strokeDasharray="70 446" />
              <circle r="62" strokeOpacity="0.2" strokeWidth="4" strokeDasharray="50 340" strokeDashoffset="-120" />
            </g>
          </g>
        </svg>
      </div>

      {track && (
        <div className={`flex flex-col gap-2 ${ready ? "" : "invisible"}`}>
          {/* eslint-disable-next-line jsx-a11y/media-has-caption -- music only, there is nothing to caption */}
          <audio {...audioProps} src={ready ? track.src : undefined} />
          <div className="min-w-0 text-center">
            <p className="truncate text-sm font-bold text-gray-700">{track.title}</p>
            <p className="truncate text-xs text-gray-500">{track.artist}</p>
          </div>
          <div className="flex items-center justify-center gap-5">
            <ControlButton label="Previous track" onClick={() => step(-1)} className={skipClass}>
              <SkipPreviousIcon />
            </ControlButton>
            <ControlButton
              label={playing ? "Pause" : "Play"}
              onClick={toggle}
              className="size-10 rounded-full bg-brand-500 text-brand-50 hover:bg-brand-600"
            >
              {playing ? <PauseIcon /> : <PlayIcon />}
            </ControlButton>
            <ControlButton label="Next track" onClick={() => step(1)} className={skipClass}>
              <SkipNextIcon />
            </ControlButton>
          </div>
        </div>
      )}
    </div>
  );
}
