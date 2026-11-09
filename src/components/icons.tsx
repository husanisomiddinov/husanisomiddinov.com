import type { SVGProps } from "react";

/**
 * Shared inline SVG icons drawn on a 24x24 grid, mostly in a single stroke style
 * (the player transport icons are solid fills). Each accepts
 * standard SVG props, so callers can override size/color via className
 * (e.g. <SearchIcon className="size-4 text-gray-400" />). The `className`
 * default matches each icon's original call sites.
 */

function mergeClassName(defaultClassName: string, className?: string) {
  return className ? `${defaultClassName} ${className}` : defaultClassName;
}

export function ChevronLeftIcon({ className, ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={mergeClassName("size-3", className)}
      {...props}
    >
      <path
        d="M15 6l-6 6 6 6"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ChevronRightIcon({ className, ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={mergeClassName("size-3", className)}
      {...props}
    >
      <path
        d="M9 6l6 6-6 6"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function MenuIcon({ className, ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={mergeClassName("size-4", className)}
      {...props}
    >
      <path
        d="M4 7h16M4 12h16M4 17h16"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function SearchIcon({ className, ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={mergeClassName("size-4", className)}
      {...props}
    >
      <path
        d="M21 21l-4.3-4.3M11 18a7 7 0 100-14 7 7 0 000 14z"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function GridIcon({ className, ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={mergeClassName("size-4", className)}
      {...props}
    >
      <path
        d="M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ListIcon({ className, ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={mergeClassName("size-4", className)}
      {...props}
    >
      <path
        d="M8 6h12M8 12h12M8 18h12M4 6h.01M4 12h.01M4 18h.01"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SolidIcon({ d, className, ...props }: { d: string } & SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={mergeClassName("size-5", className)}
      {...props}
    >
      <path d={d} />
    </svg>
  );
}

export const SkipPreviousIcon = (props: SVGProps<SVGSVGElement>) => (
  <SolidIcon d="M6 5h2v14H6zM20 5v14L9 12z" {...props} />
);
export const SkipNextIcon = (props: SVGProps<SVGSVGElement>) => (
  <SolidIcon d="M16 5h2v14h-2zM4 5v14l11-7z" {...props} />
);
export const PlayIcon = (props: SVGProps<SVGSVGElement>) => (
  <SolidIcon d="M8 5v14l11-7z" {...props} />
);
export const PauseIcon = (props: SVGProps<SVGSVGElement>) => (
  <SolidIcon d="M7 5h3.5v14H7zM13.5 5H17v14h-3.5z" {...props} />
);
