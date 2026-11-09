"use client";

import { useState } from "react";
import { Button } from "./Button";

/** Turns a normal open.spotify.com link into its embed URL, or null if it is not one. */
function toEmbedUrl(link: string) {
  const match = link.match(/^https:\/\/open\.spotify\.com\/(track|album|playlist)\/([A-Za-z0-9]+)/);
  return match ? `https://open.spotify.com/embed/${match[1]}/${match[2]}` : null;
}

/** Spotify player that loads its iframe only after a click, so the page stays fast. */
export function MusicEmbed({ link, className }: { link: string; className?: string }) {
  const [loaded, setLoaded] = useState(false);
  const embedUrl = toEmbedUrl(link);
  if (!embedUrl) return null;

  return (
    <div className={className}>
      {loaded ? (
        <iframe
          src={embedUrl}
          title="Music I am listening to"
          width="100%"
          height="152"
          allow="encrypted-media"
          className="rounded-lg border-0"
        />
      ) : (
        <Button variant="secondary" onClick={() => setLoaded(true)}>
          Play what I listen to
        </Button>
      )}
    </div>
  );
}
