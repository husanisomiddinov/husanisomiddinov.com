export interface MusicTrack {
  title: string;
  artist: string;
  /** Path under /public, for example "/music/song.mp3". Only host audio you have the rights to. */
  src: string;
}

/** Tracks the About page gramophone plays. Empty hides the player controls. */
export const musicTracks: MusicTrack[] = [
  {
    title: "A Horse with No Name",
    artist: "America, George Martin",
    src: "/music/a-horse-with-no-name.mp3",
  },
];
