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
  {
    title: "I'm Still Standing",
    artist: "Elton John",
    src: "/music/im-still-standing.mp3",
  },
  {
    title: "500 Miles",
    artist: "Peter, Paul and Mary",
    src: "/music/500-miles.mp3",
  },
  {
    title: "Riptide",
    artist: "Vance Joy",
    src: "/music/riptide.mp3",
  },
  {
    title: "Iris",
    artist: "The Goo Goo Dolls",
    src: "/music/iris.mp3",
  },
];
