import { useId, type ReactNode } from "react";

export const INK = "#2a2925";
export const MUTED = "#6b6a64";
export const PAPER = "#f6f7f4";
const FLOW = "#e3b341";
export const LOOP = "#9bb06a";
const TILE = "#ecede6";
const TILE_EDGE = "#d3d5c8";
const HOT = "#f5d56f";
const HOT_EDGE = "#c9a93a";

const HEAD = 14;

/** Rounded so server and browser print the same digits and hydration stays quiet. */
const r1 = (n: number) => Math.round(n * 10) / 10;

type Point = [number, number];

/** Shaft of a polyline with rounded corners, stopping short of the last point so the head sits on it. */
function shaftPath(points: Point[], radius: number, head: boolean) {
  const pts = points.map(([x, y]) => [x, y] as Point);
  const n = pts.length;
  const [px, py] = pts[n - 2];
  const [ex, ey] = pts[n - 1];
  const angle = Math.atan2(ey - py, ex - px);
  if (head) pts[n - 1] = [ex - Math.cos(angle) * HEAD, ey - Math.sin(angle) * HEAD];

  let d = `M ${r1(pts[0][0])} ${r1(pts[0][1])}`;
  for (let i = 1; i < n - 1; i++) {
    const [ax, ay] = pts[i - 1];
    const [bx, by] = pts[i];
    const [cx, cy] = pts[i + 1];
    const inLen = Math.hypot(bx - ax, by - ay);
    const outLen = Math.hypot(cx - bx, cy - by);
    const t = Math.min(radius, inLen / 2, outLen / 2);
    const inX = (bx - ax) / inLen;
    const inY = (by - ay) / inLen;
    const outX = (cx - bx) / outLen;
    const outY = (cy - by) / outLen;
    d += ` L ${r1(bx - inX * t)} ${r1(by - inY * t)} Q ${r1(bx)} ${r1(by)} ${r1(bx + outX * t)} ${r1(by + outY * t)}`;
  }
  d += ` L ${r1(pts[n - 1][0])} ${r1(pts[n - 1][1])}`;
  return { d, tip: [ex, ey] as Point, degrees: r1((angle * 180) / Math.PI) };
}

/** A thick arrow with a lighter dash stream running along it, so it reads as data in motion. */
export function FlowArrow({
  points,
  color = FLOW,
  radius = 16,
  head = true,
}: {
  points: Point[];
  color?: string;
  radius?: number;
  head?: boolean;
}) {
  const { d, tip, degrees } = shaftPath(points, radius, head);
  return (
    <g>
      <path d={d} fill="none" stroke={color} strokeWidth={5} strokeLinecap="butt" />
      <path
        d={d}
        fill="none"
        stroke={PAPER}
        strokeWidth={1.6}
        strokeDasharray="6 16"
        className="diagram-flow"
      />
      {head && (
        <polygon
          points={`0,0 ${-HEAD},${-HEAD * 0.6} ${-HEAD},${HEAD * 0.6}`}
          fill={color}
          transform={`translate(${r1(tip[0])} ${r1(tip[1])}) rotate(${degrees})`}
        />
      )}
    </g>
  );
}

/** A straight horizontal arrow with an optional caption above it. */
export function HArrow({ x1, x2, y, label }: { x1: number; x2: number; y: number; label?: string }) {
  return (
    <g>
      <FlowArrow
        points={[
          [x1 + 4, y],
          [x2 - 4, y],
        ]}
      />
      {label && (
        <text x={(x1 + x2) / 2} y={y - 16} textAnchor="middle" fontSize={11} fill={INK} className="font-mono">
          {label}
        </text>
      )}
    </g>
  );
}

export function Tile({
  x,
  y,
  w,
  h = 56,
  title,
  sub,
  hot,
  children,
}: {
  x: number;
  y: number;
  w: number;
  h?: number;
  title: string;
  sub?: string;
  hot?: boolean;
  children?: ReactNode;
}) {
  return (
    <g>
      {hot && (
        <rect
          x={x - 4}
          y={y - 4}
          width={w + 8}
          height={h + 8}
          rx={13}
          fill="none"
          stroke={HOT_EDGE}
          strokeWidth={2}
          className="diagram-pulse"
        />
      )}
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx={10}
        fill={hot ? HOT : TILE}
        stroke={hot ? HOT_EDGE : TILE_EDGE}
        strokeWidth={1.25}
      />
      <text
        x={x + w / 2}
        y={y + h / 2 + (sub ? -2 : 4)}
        textAnchor="middle"
        fontSize={12.5}
        fontWeight={700}
        fill={INK}
        className="font-mono"
      >
        {title}
      </text>
      {sub && (
        <text x={x + w / 2} y={y + h / 2 + 15} textAnchor="middle" fontSize={10.5} fill={MUTED} className="font-mono">
          {sub}
        </text>
      )}
      {children}
    </g>
  );
}

/** Dashed boundary with a title that breaks the line, like a grouping box. */
export function Group({
  x,
  y,
  w,
  h,
  title,
  sub,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  title: string;
  sub?: string;
}) {
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx={16}
        fill="none"
        stroke="#bfc2b2"
        strokeWidth={1.5}
        strokeDasharray="5 5"
      />
      <text
        x={x + 20}
        y={y + 4}
        fontSize={14}
        fontWeight={700}
        fill={INK}
        stroke={PAPER}
        strokeWidth={10}
        paintOrder="stroke"
        className="font-mono"
      >
        {title}
      </text>
      {sub && (
        <text x={x + 20} y={y + 26} fontSize={10.5} fill={MUTED} className="font-mono">
          {sub}
        </text>
      )}
    </g>
  );
}

/** Bold caption above an icon at the edge of a flow. */
export function EndLabel({ x, y, children }: { x: number; y: number; children: string }) {
  return (
    <text x={x} y={y} textAnchor="middle" fontSize={12.5} fontWeight={700} fill={INK} className="font-mono">
      {children}
    </text>
  );
}

/** The svg frame shared by every diagram: a faint dot grid behind the content. */
export function DiagramSvg({
  width,
  height,
  label,
  wide,
  children,
}: {
  width: number;
  height: number;
  label: string;
  /** Keeps a readable minimum width; the figure scrolls sideways on narrow screens. */
  wide?: boolean;
  children: ReactNode;
}) {
  const dots = useId();
  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      role="img"
      aria-label={label}
      className={`mx-auto h-auto w-full font-sans ${wide ? "min-w-[560px]" : ""}`}
    >
      <defs>
        <pattern id={dots} width={16} height={16} patternUnits="userSpaceOnUse">
          <circle cx={2} cy={2} r={0.9} fill="#d9dccf" />
        </pattern>
      </defs>
      <rect width={width} height={height} fill={`url(#${dots})`} />
      {children}
    </svg>
  );
}

export function DiagramFigure({ caption, children }: { caption: ReactNode; children: ReactNode }) {
  return (
    <figure className="my-4 w-full rounded-md bg-brand-50 p-3 sm:p-6">
      <div className="mx-auto w-full overflow-x-auto">{children}</div>
      <figcaption className="mt-3 font-sans text-sm text-gray-600">{caption}</figcaption>
    </figure>
  );
}
