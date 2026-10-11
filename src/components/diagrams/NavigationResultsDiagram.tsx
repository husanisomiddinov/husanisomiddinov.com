"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import {
  InlineCode,
  StepDiagram,
  useAnimationsEnabled,
  useCycle,
  type DiagramStep,
} from "./StepDiagram";

const FLOW = "#5b84b8";
const OLIVE = "#5b6529";
const SCAN = "#2f9e8f";
const SCALE = 75;
const CX = 220;
const CY = 165;

const toX = (x: number) => CX + SCALE * x;
const toY = (y: number) => CY - SCALE * y;

interface Goal {
  id: string;
  x: number;
  y: number;
  seconds: number;
  error: number;
}

const START = { x: 0, y: 0 };

const GOALS: Goal[] = [
  { id: "goal_1", x: 1.5, y: 0.0, seconds: 135, error: 0.04 },
  { id: "goal_2", x: 1.5, y: 1.5, seconds: 61, error: 0.07 },
  { id: "goal_3", x: -1.0, y: 1.5, seconds: 33, error: 0.03 },
  { id: "goal_4", x: -1.0, y: -1.0, seconds: 78, error: 0.11 },
  { id: "goal_5_home", x: 0.0, y: 0.0, seconds: 39, error: 0.05 },
];

const PILLARS = [
  [-0.5, 1],
  [0.5, 1],
  [-0.5, -1],
  [0.5, -1],
  [1.5, -1],
  [-1.5, 0],
];

const TIME_SCALE = 150;

const ROOM = 2.1;
const PILLAR_R = 11;
const RAY_COUNT = 120;
/** The TurtleBot3 laser reaches 3.5 m. */
const LIDAR_RANGE = 3.5 * SCALE;
/** Drive speed in px/s: cruise on the straights, slow down into each goal. */
const CRUISE = 150;
const MIN_SPEED = 30;

const waypoints = [START, ...GOALS];

/** The drive as one polyline in screen px, with the distance travelled at each waypoint. */
const ROUTE = waypoints.map((w) => ({ x: toX(w.x), y: toY(w.y) }));
const CUMULATIVE = ROUTE.reduce<number[]>(
  (acc, point, i) => (i === 0 ? [0] : [...acc, acc[i - 1] + Math.hypot(point.x - ROUTE[i - 1].x, point.y - ROUTE[i - 1].y)]),
  [],
);

interface Pose {
  /** Distance driven along ROUTE, px. */
  s: number;
  /** Radians, screen space (0 faces right). */
  heading: number;
}

/** Index of the leg the robot is on; at a corner, the leg it is driving into (or back out of). */
function legAt(s: number, direction: number): number {
  const last = ROUTE.length - 2;
  for (let i = 0; i <= last; i++) {
    const inside = direction >= 0 ? s < CUMULATIVE[i + 1] : s <= CUMULATIVE[i + 1];
    if (inside) return i;
  }
  return last;
}

function legAngle(leg: number, direction: number): number {
  const angle = Math.atan2(ROUTE[leg + 1].y - ROUTE[leg].y, ROUTE[leg + 1].x - ROUTE[leg].x);
  return direction < 0 ? angle + Math.PI : angle;
}

function positionAt(s: number) {
  const leg = legAt(s, 1);
  const t = (s - CUMULATIVE[leg]) / (CUMULATIVE[leg + 1] - CUMULATIVE[leg]);
  return {
    x: ROUTE[leg].x + (ROUTE[leg + 1].x - ROUTE[leg].x) * t,
    y: ROUTE[leg].y + (ROUTE[leg + 1].y - ROUTE[leg].y) * t,
  };
}

/** Where a ray from (ox, oy) first hits a wall or pillar, in screen px. */
function castRay(ox: number, oy: number, angle: number) {
  const dx = Math.cos(angle);
  const dy = Math.sin(angle);
  let t = LIDAR_RANGE;

  const left = toX(-ROOM);
  const right = toX(ROOM);
  const top = toY(ROOM);
  const bottom = toY(-ROOM);
  if (dx > 0) t = Math.min(t, (right - ox) / dx);
  if (dx < 0) t = Math.min(t, (left - ox) / dx);
  if (dy > 0) t = Math.min(t, (bottom - oy) / dy);
  if (dy < 0) t = Math.min(t, (top - oy) / dy);

  for (const [px, py] of PILLARS) {
    const fx = ox - toX(px);
    const fy = oy - toY(py);
    const b = dx * fx + dy * fy;
    const disc = b * b - (fx * fx + fy * fy - PILLAR_R * PILLAR_R);
    if (disc < 0) continue;
    const hit = -b - Math.sqrt(disc);
    if (hit > 0 && hit < t) t = hit;
  }
  // Rounded: sin/cos can differ in the last digit between server and browser, which breaks hydration.
  return { x: Math.round((ox + dx * t) * 10) / 10, y: Math.round((oy + dy * t) * 10) / 10 };
}

function angleDelta(from: number, to: number) {
  return Math.atan2(Math.sin(to - from), Math.cos(to - from));
}

/** Drives the robot toward the end of `target` along the route, turning to face where it is going. */
function useRobot(targetS: number, animate: boolean): Pose {
  const [pose, setPose] = useState<Pose>({ s: 0, heading: legAngle(0, 1) });
  const latest = useRef(pose);

  useEffect(() => {
    if (!animate) return;
    let frame = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = Math.min(now - last, 50) / 1000;
      last = now;
      const { s, heading } = latest.current;
      const remaining = targetS - s;
      const direction = remaining === 0 ? 1 : Math.sign(remaining);
      const speed = Math.min(CRUISE, Math.max(MIN_SPEED, Math.abs(remaining) * 4));
      const nextS = Math.abs(remaining) <= speed * dt ? targetS : s + direction * speed * dt;
      const wanted = legAngle(legAt(nextS, direction), direction);
      const next = { s: nextS, heading: heading + angleDelta(heading, wanted) * Math.min(1, dt * 10) };
      latest.current = next;
      setPose(next);
      if (nextS !== targetS) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [targetS, animate]);

  return animate ? pose : { s: targetS, heading: legAngle(legAt(targetS - 0.001, 1), 1) };
}

/** Top-down TurtleBot3 Burger, facing +x: two drive wheels, the body, the laser puck on top. */
function Robot({ x, y, heading }: { x: number; y: number; heading: number }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${(heading * 180) / Math.PI})`}>
      <rect x={-4} y={-12} width={8} height={3.5} rx={1} fill="#37352f" />
      <rect x={-4} y={8.5} width={8} height={3.5} rx={1} fill="#37352f" />
      <circle r={9} fill="#4a4840" stroke="#37352f" strokeWidth={1.5} />
      <path d="M 9 -3.5 L 14 0 L 9 3.5 z" fill={FLOW} />
      <circle r={4.5} fill="#e8ebe0" stroke="#37352f" strokeWidth={1} />
      <circle cx={2} r={1.3} fill="#37352f" />
    </g>
  );
}

function Scene({ active, animate }: { active: number; animate: boolean }) {
  const { s, heading } = useRobot(CUMULATIVE[active + 1], animate);
  const robot = positionAt(s);

  const gradientId = useId();
  const hits = Array.from({ length: RAY_COUNT }, (_, i) =>
    castRay(robot.x, robot.y, heading + (i / RAY_COUNT) * Math.PI * 2),
  );
  const scan = hits.map((hit) => `${hit.x},${hit.y}`).join(" ");

  const driven = [
    ...ROUTE.filter((_, i) => CUMULATIVE[i] < s),
    robot,
  ]
    .map((point) => `${point.x.toFixed(1)},${point.y.toFixed(1)}`)
    .join(" ");

  return (
    <svg
      viewBox="0 0 440 330"
      role="img"
      aria-label="Schematic of the test room with the robot driving to five navigation goals"
      className="mx-auto h-auto w-full max-w-[440px] font-sans"
    >
      <rect
        x={toX(-ROOM)}
        y={toY(ROOM)}
        width={SCALE * ROOM * 2}
        height={SCALE * ROOM * 2}
        rx={14}
        fill="#fbfbf9"
        stroke="#37352f"
        strokeWidth={3}
      />

      {Array.from({ length: 5 }, (_, i) => i - 2).map((g) => (
        <g key={g} stroke="#e4e4e0" strokeWidth={1}>
          <line x1={toX(g)} y1={toY(ROOM)} x2={toX(g)} y2={toY(-ROOM)} />
          <line x1={toX(-ROOM)} y1={toY(g)} x2={toX(ROOM)} y2={toY(g)} />
        </g>
      ))}

      <defs>
        {/* Strongest at the robot, fading out toward the laser's range, like a beam. */}
        <radialGradient id={gradientId} gradientUnits="userSpaceOnUse" cx={robot.x} cy={robot.y} r={LIDAR_RANGE}>
          <stop offset="0" stopColor={SCAN} stopOpacity={0.4} />
          <stop offset="1" stopColor={SCAN} stopOpacity={0.04} />
        </radialGradient>
      </defs>
      <polygon points={scan} fill={`url(#${gradientId})`} />
      {/* The points where the laser actually touched something. */}
      {hits.map((hit, i) =>
        i % 2 === 0 ? <circle key={i} cx={hit.x} cy={hit.y} r={1.3} fill={SCAN} fillOpacity={0.85} /> : null,
      )}

      {PILLARS.map(([x, y]) => (
        <circle
          key={`${x},${y}`}
          cx={toX(x)}
          cy={toY(y)}
          r={PILLAR_R}
          fill="#c9cbc3"
          stroke="#37352f"
          strokeWidth={2}
        />
      ))}

      <polyline
        points={driven}
        fill="none"
        stroke={FLOW}
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <rect
        x={toX(0) - 7}
        y={toY(0) - 7}
        width={14}
        height={14}
        rx={2}
        fill="none"
        stroke="#8d8d88"
        strokeDasharray="3 2"
      />

      {GOALS.slice(0, 4).map((goal, i) => {
        const reached = s >= CUMULATIVE[i + 1] - 0.5;
        const current = i === active && reached;
        return (
          <g key={goal.id}>
            {current && animate && (
              <circle
                cx={toX(goal.x)}
                cy={toY(goal.y)}
                r={9}
                fill="none"
                stroke={OLIVE}
                strokeWidth={1.5}
              >
                <animate
                  attributeName="r"
                  values="9;19"
                  dur="1.6s"
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="opacity"
                  values="0.7;0"
                  dur="1.6s"
                  repeatCount="indefinite"
                />
              </circle>
            )}
            <circle
              cx={toX(goal.x)}
              cy={toY(goal.y)}
              r={9}
              fill={reached ? OLIVE : "#f6f7f4"}
              stroke={reached ? OLIVE : "#8d8d88"}
              strokeWidth={1.5}
              style={{ transition: "fill 400ms, stroke 400ms" }}
            />
            <text
              x={toX(goal.x)}
              y={toY(goal.y) + 3.5}
              textAnchor="middle"
              fontSize={10}
              fontWeight={600}
              fill={reached ? "#f6f7f4" : "#6f6f6c"}
            >
              {i + 1}
            </text>
          </g>
        );
      })}

      <text
        x={toX(0)}
        y={toY(0) + 22}
        textAnchor="middle"
        fontSize={9.5}
        fill="#7a7a76"
      >
        start / goal 5
      </text>

      <Robot x={robot.x} y={robot.y} heading={heading} />
    </svg>
  );
}

function LegendItem({ icon, children }: { icon: ReactNode; children: ReactNode }) {
  return (
    <li className="flex items-start gap-2.5">
      <svg viewBox="-16 -16 32 32" aria-hidden className="mt-px size-6 shrink-0">
        {icon}
      </svg>
      <span>{children}</span>
    </li>
  );
}

function Legend() {
  return (
    <ul className="mx-auto mt-4 grid max-w-[440px] grid-cols-1 gap-x-6 gap-y-2.5 font-sans text-xs leading-snug text-gray-600 sm:grid-cols-2">
      <LegendItem icon={<Robot x={0} y={0} heading={0} />}>
        <strong className="text-gray-800">Robot.</strong> A TurtleBot3; the blue wedge is its front.
      </LegendItem>
      <LegendItem
        icon={
          <>
            <path d="M -14 0 L 12 -13 A 14 14 0 0 1 12 13 z" fill={SCAN} fillOpacity={0.3} />
            <circle cx={12} cy={-8} r={1.6} fill={SCAN} />
            <circle cx={14} cy={0} r={1.6} fill={SCAN} />
            <circle cx={12} cy={8} r={1.6} fill={SCAN} />
          </>
        }
      >
        <strong className="text-gray-800">Laser scan.</strong> What the robot can see right now; obstacles block it and leave shadows.
      </LegendItem>
      <LegendItem icon={<circle r={9} fill="#c9cbc3" stroke="#37352f" strokeWidth={2} />}>
        <strong className="text-gray-800">Obstacle.</strong> A pillar the robot has to drive around.
      </LegendItem>
      <LegendItem
        icon={
          <>
            <circle r={9} fill={OLIVE} stroke={OLIVE} strokeWidth={1.5} />
            <text textAnchor="middle" y={3.5} fontSize={10} fontWeight={600} fill="#f6f7f4">
              1
            </text>
          </>
        }
      >
        <strong className="text-gray-800">Goal.</strong> A target to reach; it turns green once the robot arrives.
      </LegendItem>
      <LegendItem icon={<line x1={-13} y1={0} x2={13} y2={0} stroke={FLOW} strokeWidth={2.5} strokeLinecap="round" />}>
        <strong className="text-gray-800">Path.</strong> The route driven so far.
      </LegendItem>
      <LegendItem
        icon={<rect x={-7} y={-7} width={14} height={14} rx={2} fill="none" stroke="#8d8d88" strokeDasharray="3 2" />}
      >
        <strong className="text-gray-800">Start.</strong> Where the run begins and ends (goal 5).
      </LegendItem>
    </ul>
  );
}

const STEPS: DiagramStep[] = GOALS.map((goal, i) => ({
  label: i === GOALS.length - 1 ? "goal 5" : `goal ${i + 1}`,
  body: (
    <>
      <InlineCode>{goal.id}</InlineCode> at ({goal.x.toFixed(1)},{" "}
      {goal.y.toFixed(1)}) m: <strong>reached</strong> in {goal.seconds} s with{" "}
      {goal.error.toFixed(2)} m arrival error.
      <span className="mt-3 flex items-center gap-2 font-sans text-xs text-gray-500">
        <span className="w-12 shrink-0">time</span>
        <span className="h-2 flex-1 rounded-full bg-gray-300">
          <span
            className="block h-full rounded-full bg-brand-500"
            style={{ width: `${Math.min((goal.seconds / TIME_SCALE) * 100, 100)}%` }}
          />
        </span>
        <span className="w-10 shrink-0 text-right">{goal.seconds} s</span>
      </span>
    </>
  ),
}));

export function NavigationResultsDiagram() {
  return (
    <StepDiagram
      steps={STEPS}
      caption={
        <>
          The five-goal run: <strong>5/5 reached</strong>. Room layout is a schematic; coordinates,
          times and errors are from the real run.
        </>
      }
    >
      {({ active, animate }) => (
        <>
          <Scene active={active} animate={animate} />
          <Legend />
        </>
      )}
    </StepDiagram>
  );
}

export function NavigationResultsPreview() {
  const animate = useAnimationsEnabled();
  const active = useCycle(GOALS.length, 1800, animate);
  return <Scene active={active} animate={animate} />;
}
