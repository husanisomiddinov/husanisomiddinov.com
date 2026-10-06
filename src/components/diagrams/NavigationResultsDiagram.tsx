"use client";

import { useEffect, useState } from "react";
import {
  InlineCode,
  StepDiagram,
  useAnimationsEnabled,
  useCycle,
  type DiagramStep,
} from "./StepDiagram";

const FLOW = "#5b84b8";
const OLIVE = "#5b6529";
const SCALE = 75;
const CX = 220;
const CY = 165;
const MOVE_MS = 900;

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

const waypoints = [START, ...GOALS];

function Scene({ active, animate }: { active: number; animate: boolean }) {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const id = requestAnimationFrame(() => setReady(true));
    return () => cancelAnimationFrame(id);
  }, []);

  const robotAt = ready ? waypoints[active + 1] : START;
  const move = animate ? `${MOVE_MS}ms` : "0ms";

  return (
    <svg
      viewBox="0 0 440 330"
      role="img"
      aria-label="Schematic of the test room with the robot driving to five navigation goals"
      className="mx-auto h-auto w-full max-w-[440px] font-sans"
    >
      <rect
        x={toX(-2.1)}
        y={toY(2.1)}
        width={SCALE * 4.2}
        height={SCALE * 4.2}
        rx={14}
        fill="#fbfbf9"
        stroke="#37352f"
        strokeWidth={3}
      />

      {Array.from({ length: 5 }, (_, i) => i - 2).map((g) => (
        <g key={g} stroke="#e4e4e0" strokeWidth={1}>
          <line x1={toX(g)} y1={toY(2.1)} x2={toX(g)} y2={toY(-2.1)} />
          <line x1={toX(-2.1)} y1={toY(g)} x2={toX(2.1)} y2={toY(g)} />
        </g>
      ))}

      {PILLARS.map(([x, y]) => (
        <circle
          key={`${x},${y}`}
          cx={toX(x)}
          cy={toY(y)}
          r={11}
          fill="#c9cbc3"
          stroke="#37352f"
          strokeWidth={2}
        />
      ))}

      {GOALS.map((goal, i) => {
        const from = waypoints[i];
        const x1 = toX(from.x);
        const y1 = toY(from.y);
        const x2 = toX(goal.x);
        const y2 = toY(goal.y);
        const length = Math.hypot(x2 - x1, y2 - y1);
        return (
          <line
            key={goal.id}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke={FLOW}
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeDasharray={length}
            strokeDashoffset={i <= active && ready ? 0 : length}
            style={{
              transition: `stroke-dashoffset ${move} ease-in-out`,
            }}
          />
        );
      })}

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
        const reached = i <= active;
        const current = i === active;
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

      <g
        style={{
          transform: `translate(${toX(robotAt.x)}px, ${toY(robotAt.y)}px)`,
          transition: `transform ${move} ease-in-out`,
        }}
      >
        <circle r={8} fill="#37352f" />
        <circle r={3} fill="#e8ebe0" />
      </g>
    </svg>
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
          The five-goal run: <strong>5/5 reached</strong>. Room layout is a
          schematic; coordinates, times and errors are from the real run.
        </>
      }
    >
      {({ active, animate }) => <Scene active={active} animate={animate} />}
    </StepDiagram>
  );
}

export function NavigationResultsPreview() {
  const animate = useAnimationsEnabled();
  const active = useCycle(GOALS.length, 1800, animate);
  return <Scene active={active} animate={animate} />;
}
