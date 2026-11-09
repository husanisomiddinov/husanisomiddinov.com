export interface MusicTrack {
  title: string;
  /** open.spotify.com link to a track, album or playlist. */
  link: string;
}

/** Tracks the About page gramophone can switch between. Empty hides the player. */
export const musicTracks: MusicTrack[] = [
  {
    title: "My playlist",
    link: "https://open.spotify.com/playlist/3hRgMuahevtXQWsq3vFSPg",
  },
];
