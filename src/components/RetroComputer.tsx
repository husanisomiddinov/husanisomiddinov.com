import Image from "next/image";

/** The retro computer illustration with a blinking cursor and a faint CRT flicker on its screen. Pure CSS, no extra assets. */
export function RetroComputer({ className }: { className?: string }) {
  return (
    <div className={`relative ${className ?? ""}`}>
      <Image
        src="/images/retro-computer.png"
        alt=""
        width={500}
        height={500}
        sizes="(max-width: 640px) 112px, 144px"
        className="h-auto w-full"
      />
      <svg
        viewBox="0 0 500 500"
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 size-full"
      >
        <polygon
          className="computer-flicker"
          points="181,124 292,152 288,256 181,215"
          fill="#d8e0cf"
        />
        <polygon
          className="computer-cursor"
          points="198,140 210,143 210,155 198,152"
          fill="#d8e0cf"
        />
      </svg>
    </div>
  );
}
