import type { ReactNode } from "react";

export const INK = "#2a2925";
export const MUTED = "#6b6a64";
const PAPER = "#f6f7f4";
/** Arrows are drawn in a soft ink, like pen lines. */
const LINE = "#6b6a64";
/** The return loop: a dashed teal line, "this goes back around". */
export const LOOP = "#4f9d91";
/** The one moving thing: a terracotta dot carrying the data from step to step. */
const PACKET = "#c2562f";

/**
 * Tile colors, like marker on paper. Each one means a kind of step, so a reader can
 * group the flow at a glance. `key` is the step the diagram is about.
 */
const TONES = {
  plain: { fill: "#eff0e8", edge: "#c4c6b8", text: INK, sub: MUTED },
  infra: { fill: "#d5e1ef", edge: "#7d9cc2", text: "#2f4d73", sub: "#4a6687" },
  source: { fill: "#f6dfa6", edge: "#cf9f3c", text: "#6b4a0e", sub: "#7d5f1f" },
  output: { fill: "#f2cfbf", edge: "#cc7f62", text: "#843a20", sub: "#8f4f37" },
  key: { fill: "#5b6529", edge: "#4d5628", text: "#f6f7f4", sub: "#dfe4cc" },
} as const;

export type Tone = keyof typeof TONES;

const HEAD = 8;
/** Seconds the packet takes to cross one arrow. */
const STEP_S = 0.9;

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

/** Which leg of the packet's trip an arrow is: leg `step` of `of`. */
export type Leg = { step: number; of: number };

const t3 = (n: number) => n.toFixed(3);

/**
 * The packet crossing one arrow. Every packet shares one cycle length, so legs stay in order
 * and only one is visible at a time. Hidden under reduced motion (globals.css).
 */
function Packet({ d, leg }: { d: string; leg: Leg }) {
  const cycle = `${r1(leg.of * STEP_S)}s`;
  const start = leg.step / leg.of;
  const end = (leg.step + 1) / leg.of;
  const fade = Math.min(0.15 / leg.of, (end - start) / 4);
  return (
    <circle r={4.5} fill={PACKET} opacity={0} className="diagram-packet">
      <animateMotion
        path={d}
        dur={cycle}
        repeatCount="indefinite"
        calcMode="linear"
        keyPoints="0;0;1;1"
        keyTimes={`0;${t3(start)};${t3(end)};1`}
      />
      <animate
        attributeName="opacity"
        dur={cycle}
        repeatCount="indefinite"
        values="0;0;1;1;0;0"
        keyTimes={`0;${t3(start)};${t3(start + fade)};${t3(end - fade)};${t3(end)};1`}
      />
    </circle>
  );
}

/** A thin pen-line arrow. Give it a `leg` and the packet crosses it in turn. */
export function FlowArrow({
  points,
  color = LINE,
  radius = 14,
  head = true,
  dashed = false,
  leg,
}: {
  points: Point[];
  color?: string;
  radius?: number;
  head?: boolean;
  dashed?: boolean;
  leg?: Leg;
}) {
  const { d, tip, degrees } = shaftPath(points, radius, head);
  return (
    <g>
      <path
        d={d}
        fill="none"
        stroke={color}
        strokeWidth={1.75}
        strokeLinecap="round"
        strokeDasharray={dashed ? "4 5" : undefined}
      />
      {head && (
        <polygon
          points={`0,0 ${-HEAD},${-HEAD * 0.55} ${-HEAD},${HEAD * 0.55}`}
          fill={color}
          transform={`translate(${r1(tip[0])} ${r1(tip[1])}) rotate(${degrees})`}
        />
      )}
      {leg && <Packet d={d} leg={leg} />}
    </g>
  );
}

/** A straight horizontal arrow with an optional caption above it. */
export function HArrow({
  x1,
  x2,
  y,
  label,
  leg,
}: {
  x1: number;
  x2: number;
  y: number;
  label?: string;
  leg?: Leg;
}) {
  return (
    <g>
      <FlowArrow
        points={[
          [x1 + 4, y],
          [x2 - 4, y],
        ]}
        leg={leg}
      />
      {label && (
        <text x={(x1 + x2) / 2} y={y - 10} textAnchor="middle" fontSize={11} fill={MUTED}>
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
  tone = "plain",
  children,
}: {
  x: number;
  y: number;
  w: number;
  h?: number;
  title: string;
  /** One small fact, set in mono because it is data (`224x224x3`, `.pgm .yaml`). */
  sub?: string;
  /** What kind of step this is. Use `key` once per diagram, for the step it is about. */
  tone?: Tone;
  children?: ReactNode;
}) {
  const { fill, edge, text, sub: subColor } = TONES[tone];
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx={8}
        fill={fill}
        stroke={edge}
        strokeWidth={1.25}
      />
      <text
        x={x + w / 2}
        y={y + h / 2 + (sub ? -3 : 4)}
        textAnchor="middle"
        fontSize={13}
        fontWeight={600}
        fill={text}
      >
        {title}
      </text>
      {sub && (
        <text x={x + w / 2} y={y + h / 2 + 14} textAnchor="middle" fontSize={10} fill={subColor} className="font-mono">
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
        rx={12}
        fill="none"
        stroke="#c4c6b8"
        strokeWidth={1}
        strokeDasharray="4 5"
      />
      <text
        x={x + 18}
        y={y + 4}
        fontSize={13}
        fontWeight={600}
        fill={INK}
        stroke={PAPER}
        strokeWidth={10}
        paintOrder="stroke"
      >
        {title}
      </text>
      {sub && (
        <text x={x + 18} y={y + 24} fontSize={11} fill={MUTED}>
          {sub}
        </text>
      )}
    </g>
  );
}

/** Bold caption above an icon at the edge of a flow. */
export function EndLabel({ x, y, children }: { x: number; y: number; children: string }) {
  return (
    <text x={x} y={y} textAnchor="middle" fontSize={13} fontWeight={600} fill={INK}>
      {children}
    </text>
  );
}

/** The svg frame shared by every diagram: plain paper, sans text. */
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
  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      role="img"
      aria-label={label}
      className={`mx-auto h-auto w-full font-sans ${wide ? "min-w-[560px]" : ""}`}
    >
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
