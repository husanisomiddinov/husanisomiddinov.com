"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { MusicTrack } from "../../content/data/personal/about-media";

const iconClass = "size-5";
const controlClass =
  "inline-flex size-8 cursor-pointer items-center justify-center rounded transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500";

/** Pixel gramophone whose record spins while the track plays, with shuffle, previous, play/pause, next and repeat below it. */
export function Gramophone({ tracks, className }: { tracks: MusicTrack[]; className?: string }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const resume = useRef(false);
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState(false);
  const track = tracks[index];

  // Start the new track after a skip if music was already playing.
  useEffect(() => {
    if (resume.current) void audioRef.current?.play();
  }, [index]);

  const go = (next: number) => {
    resume.current = playing;
    setIndex(next);
  };

  const randomOther = () => {
    if (tracks.length < 2) return index;
    let next = index;
    while (next === index) next = Math.floor(Math.random() * tracks.length);
    return next;
  };

  const skip = (delta: number) =>
    go(shuffle && delta > 0 ? randomOther() : (index + delta + tracks.length) % tracks.length);

  const toggle = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) void audio.play();
    else audio.pause();
  };

  const onEnded = () => {
    const audio = audioRef.current;
    if (repeat && audio) {
      audio.currentTime = 0;
      void audio.play();
    } else {
      resume.current = true;
      setIndex(shuffle ? randomOther() : (index + 1) % tracks.length);
    }
  };

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
          <g transform="translate(255 260) scale(1 0.45)">
            <g className="gramophone-spin" style={{ animationPlayState: playing ? "running" : "paused" }}>
              <circle r="82" fill="none" stroke="#d9d9d7" strokeOpacity="0.28" strokeWidth="5" strokeDasharray="70 446" />
              <circle r="62" fill="none" stroke="#d9d9d7" strokeOpacity="0.2" strokeWidth="4" strokeDasharray="50 340" strokeDashoffset="-120" />
            </g>
          </g>
        </svg>
      </div>

      {track && (
        <div className="flex flex-col gap-2">
          {/* eslint-disable-next-line jsx-a11y/media-has-caption -- music only, there is nothing to caption */}
          <audio
            ref={audioRef}
            src={track.src}
            preload="none"
            onPlay={() => setPlaying(true)}
            onPause={() => setPlaying(false)}
            onEnded={onEnded}
          />
          <div className="min-w-0 text-center">
            <p className="truncate text-sm font-bold text-gray-700">{track.title}</p>
            <p className="truncate text-xs text-gray-500">{track.artist}</p>
          </div>
          <div className="flex items-center justify-between">
            <button
              type="button"
              aria-label="Shuffle"
              aria-pressed={shuffle}
              onClick={() => setShuffle(!shuffle)}
              className={`${controlClass} ${shuffle ? "text-brand-500" : "text-gray-500 hover:text-brand-500"}`}
            >
              <svg viewBox="0 0 24 24" className={iconClass} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M16 3h5v5M4 20 21 3M21 16v5h-5M15 15l6 6M4 4l5 5" />
              </svg>
            </button>
            <button
              type="button"
              aria-label="Previous track"
              onClick={() => skip(-1)}
              className={`${controlClass} text-gray-600 hover:text-brand-500`}
            >
              <svg viewBox="0 0 24 24" className={iconClass} fill="currentColor" aria-hidden="true">
                <path d="M6 5h2v14H6zM20 5v14L9 12z" />
              </svg>
            </button>
            <button
              type="button"
              aria-label={playing ? "Pause" : "Play"}
              onClick={toggle}
              className="inline-flex size-10 cursor-pointer items-center justify-center rounded-full bg-gray-900 text-brand-50 transition-colors duration-200 hover:bg-brand-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500"
            >
              <svg viewBox="0 0 24 24" className={iconClass} fill="currentColor" aria-hidden="true">
                {playing ? <path d="M7 5h3.5v14H7zM13.5 5H17v14h-3.5z" /> : <path d="M8 5v14l11-7z" />}
              </svg>
            </button>
            <button
              type="button"
              aria-label="Next track"
              onClick={() => skip(1)}
              className={`${controlClass} text-gray-600 hover:text-brand-500`}
            >
              <svg viewBox="0 0 24 24" className={iconClass} fill="currentColor" aria-hidden="true">
                <path d="M16 5h2v14h-2zM4 5v14l11-7z" />
              </svg>
            </button>
            <button
              type="button"
              aria-label="Repeat track"
              aria-pressed={repeat}
              onClick={() => setRepeat(!repeat)}
              className={`${controlClass} ${repeat ? "text-brand-500" : "text-gray-500 hover:text-brand-500"}`}
            >
              <svg viewBox="0 0 24 24" className={iconClass} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="m17 2 4 4-4 4M3 11V9a3 3 0 0 1 3-3h15M7 22l-4-4 4-4M21 13v2a3 3 0 0 1-3 3H3" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
