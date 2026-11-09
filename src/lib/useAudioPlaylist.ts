"use client";

import { useEffect, useRef, useState, useSyncExternalStore, type RefObject } from "react";

const FADE_MS = 5000;
// The events browsers count as a real gesture that unlocks sound (touchstart and pointerdown alone do not on touch screens).
const INTERACTION_EVENTS = ["pointerup", "touchend", "click", "keydown"] as const;

const mod = (n: number, m: number) => ((n % m) + m) % m;

/**
 * Playlist logic for one <audio> element: a random start track per visit, autoplay that
 * fades in from silence, skip and toggle. Browsers block sound before the visitor
 * interacts, so a blocked autoplay waits for their first touch outside `ignoreRef`.
 */
export function useAudioPlaylist(count: number, ignoreRef: RefObject<HTMLElement | null>) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const resume = useRef(false);
  const startRef = useRef<number | null>(null);
  // Null on the server so server and client markup match, then a random pick per visit.
  const start = useSyncExternalStore(
    () => () => {},
    () => (startRef.current ??= Math.floor(Math.random() * count)),
    () => null,
  );
  const [offset, setOffset] = useState(0);
  const [playing, setPlaying] = useState(false);
  const ready = start !== null && count > 0;
  const index = ready ? mod(start + offset, count) : 0;

  useEffect(() => {
    const audio = audioRef.current;
    if (!ready || !audio) return;
    let fade: ReturnType<typeof setInterval> | undefined;

    const fadeIn = () => {
      const began = performance.now();
      clearInterval(fade);
      fade = setInterval(() => {
        const t = Math.min((performance.now() - began) / FADE_MS, 1);
        audio.volume = t * t * (3 - 2 * t);
        if (t === 1 || audio.paused) clearInterval(fade);
      }, 50);
    };
    const begin = () => {
      audio.volume = 0;
      audio.play().then(fadeIn, waitForInteraction);
    };
    const onInteract = (event: Event) => {
      if (ignoreRef.current?.contains(event.target as Node)) return;
      removeListeners();
      begin();
    };
    function waitForInteraction() {
      audio!.volume = 1;
      for (const type of INTERACTION_EVENTS) window.addEventListener(type, onInteract, { passive: true });
    }
    function removeListeners() {
      for (const type of INTERACTION_EVENTS) window.removeEventListener(type, onInteract);
    }

    begin();
    return () => {
      clearInterval(fade);
      removeListeners();
      audio.pause();
    };
  }, [ready, ignoreRef]);

  // Keep playing after a skip or when a track ends.
  useEffect(() => {
    if (resume.current) void audioRef.current?.play();
  }, [index]);

  const step = (delta: number) => {
    resume.current = playing;
    setOffset((current) => current + delta);
  };

  const toggle = () => {
    const audio = audioRef.current;
    if (audio?.paused) void audio.play();
    else audio?.pause();
  };

  const onEnded = () => {
    resume.current = true;
    if (count === 1) void audioRef.current?.play();
    else setOffset((current) => current + 1);
  };

  return {
    ready,
    index,
    playing,
    step,
    toggle,
    audioProps: {
      ref: audioRef,
      preload: "none" as const,
      onPlay: () => setPlaying(true),
      onPause: () => setPlaying(false),
      onEnded,
    },
  };
}
