"use client";

import {
  InlineCode,
  StepDiagram,
  useAnimationsEnabled,
  useCycle,
  type DiagramStep,
} from "./StepDiagram";

const FLOW = "#5b84b8";
const IDLE = "#c9c9c6";
const NODE_H = 44;

interface NodeDef {
  id: string;
  label: string;
  sub?: string;
  x: number;
  y: number;
  w: number;
}

const COL = [146, 306, 466];
const ROW = [46, 130, 214];

const NODES: NodeDef[] = [
  { id: "compose", label: "docker", sub: "compose up", x: 4, y: ROW[0], w: 96 },
  {
    id: "colcon",
    label: "colcon build",
    sub: "md25010_nav",
    x: COL[0],
    y: ROW[0],
    w: 116,
  },
  {
    id: "gazebo",
    label: "Gazebo",
    sub: "TurtleBot3 sim",
    x: COL[1],
    y: ROW[0],
    w: 116,
  },
  {
    id: "slam",
    label: "SLAM Toolbox",
    sub: "lifelong mode",
    x: COL[2],
    y: ROW[0],
    w: 116,
  },
  {
    id: "teleop",
    label: "teleop",
    sub: "keyboard",
    x: COL[0],
    y: ROW[1],
    w: 116,
  },
  { id: "rviz", label: "RViz", sub: "live map", x: COL[2], y: ROW[1], w: 116 },
  {
    id: "goals",
    label: "send_nav_goals",
    sub: "5 goals",
    x: COL[0],
    y: ROW[2],
    w: 116,
  },
  {
    id: "nav2",
    label: "Nav2 + AMCL",
    sub: "plan + localize",
    x: COL[1],
    y: ROW[2],
    w: 116,
  },
  {
    id: "maps",
    label: "maps/ volume",
    sub: ".pgm .yaml .csv",
    x: 556,
    y: ROW[2],
    w: 150,
  },
];

interface EdgeDef {
  from: string;
  to: string;
  label?: string;
  shift?: number;
  labelBelow?: boolean;
}

const EDGES: EdgeDef[] = [
  { from: "compose", to: "colcon" },
  { from: "teleop", to: "gazebo", label: "cmd_vel" },
  { from: "gazebo", to: "slam", label: "scan" },
  { from: "slam", to: "rviz", label: "map" },
  { from: "slam", to: "maps", label: "save" },
  { from: "maps", to: "nav2", label: "load", shift: -9 },
  { from: "goals", to: "nav2", label: "goal" },
  { from: "nav2", to: "gazebo", label: "cmd_vel" },
  { from: "nav2", to: "maps", label: "log", shift: 9, labelBelow: true },
];

interface StepScene {
  nodes: string[];
  edges: number[];
}

const SCENES: StepScene[] = [
  { nodes: ["compose", "colcon"], edges: [0] },
  { nodes: ["teleop", "gazebo", "slam", "rviz"], edges: [1, 2, 3] },
  { nodes: ["slam", "maps"], edges: [4] },
  { nodes: ["maps", "nav2", "goals", "gazebo"], edges: [5, 6, 7, 8] },
];

const byId = new Map(NODES.map((n) => [n.id, n]));

function center(n: NodeDef) {
  return { x: n.x + n.w / 2, y: n.y + NODE_H / 2 };
}

function edgeGeometry(edge: EdgeDef) {
  const a = byId.get(edge.from)!;
  const b = byId.get(edge.to)!;
  const ca = center(a);
  const cb = center(b);
  const dx = cb.x - ca.x;
  const dy = cb.y - ca.y;
  const len = Math.hypot(dx, dy);
  const ux = dx / len;
  const uy = dy / len;
  const nx = -uy * (edge.shift ?? 0);
  const ny = ux * (edge.shift ?? 0);

  const clip = (n: NodeDef, dirX: number, dirY: number) => {
    const tx = dirX === 0 ? Infinity : n.w / 2 / Math.abs(dirX);
    const ty = dirY === 0 ? Infinity : NODE_H / 2 / Math.abs(dirY);
    return Math.min(tx, ty) + 5;
  };

  const startT = clip(a, ux, uy);
  const endT = clip(b, -ux, -uy);
  return {
    x1: ca.x + ux * startT + nx,
    y1: ca.y + uy * startT + ny,
    x2: cb.x - ux * endT + nx,
    y2: cb.y - uy * endT + ny,
  };
}

function FlowDots({
  x1,
  y1,
  x2,
  y2,
  animate,
}: {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  animate: boolean;
}) {
  const path = `M ${x1} ${y1} L ${x2} ${y2}`;
  const count = 3;
  const dur = 1.8;
  return (
    <>
      {Array.from({ length: count }, (_, k) => {
        if (!animate) {
          const t = (k + 0.5) / count;
          return (
            <circle
              key={k}
              cx={x1 + (x2 - x1) * t}
              cy={y1 + (y2 - y1) * t}
              r={3.5}
              fill={FLOW}
            />
          );
        }
        return (
          <circle key={k} r={3.5} fill={FLOW}>
            <animateMotion
              dur={`${dur}s`}
              begin={`${-(dur / count) * k}s`}
              repeatCount="indefinite"
              path={path}
            />
          </circle>
        );
      })}
    </>
  );
}

function EdgeLabel({
  geometry,
  label,
  below,
}: {
  geometry: { x1: number; y1: number; x2: number; y2: number };
  label: string;
  below?: boolean;
}) {
  const dx = geometry.x2 - geometry.x1;
  const dy = geometry.y2 - geometry.y1;
  const len = Math.hypot(dx, dy);
  let nx = -dy / len;
  let ny = dx / len;
  if (Math.abs(ny) > Math.abs(nx) ? ny > 0 : nx < 0) {
    nx = -nx;
    ny = -ny;
  }
  if (below) {
    nx = -nx;
    ny = -ny;
  }
  const vertical = Math.abs(ny) <= Math.abs(nx);
  return (
    <text
      x={(geometry.x1 + geometry.x2) / 2 + nx * 10}
      y={(geometry.y1 + geometry.y2) / 2 + ny * 10 + (below ? 8 : 3)}
      textAnchor={vertical ? "start" : "middle"}
      fontSize={10.5}
      fill={FLOW}
    >
      {label}
    </text>
  );
}

function Scene({ active, animate }: { active: number; animate: boolean }) {
  const scene = SCENES[active];

  return (
    <svg
      viewBox="0 0 760 290"
      role="img"
      aria-label="Diagram of the ROS2 SLAM and navigation pipeline"
      className="h-auto w-full font-sans"
    >
      <defs>
        <marker
          id="flow-arrow"
          viewBox="0 0 10 10"
          refX="8"
          refY="5"
          markerWidth="7"
          markerHeight="7"
          orient="auto"
        >
          <path d="M 0 0 L 10 5 L 0 10 z" fill={FLOW} />
        </marker>
        <marker
          id="idle-arrow"
          viewBox="0 0 10 10"
          refX="8"
          refY="5"
          markerWidth="7"
          markerHeight="7"
          orient="auto"
        >
          <path d="M 0 0 L 10 5 L 0 10 z" fill={IDLE} />
        </marker>
      </defs>

      <rect
        x={134}
        y={8}
        width={472}
        height={274}
        rx={8}
        fill="none"
        stroke="#bdbdb8"
        strokeDasharray="5 4"
      />
      <text x={142} y={26} fontSize={10} fill="#8d8d88">
        Docker container · ROS2 Humble
      </text>

      {EDGES.map((edge, i) => {
        const g = edgeGeometry(edge);
        const on = scene.edges.includes(i);
        return (
          <g key={i}>
            <line
              x1={g.x1}
              y1={g.y1}
              x2={g.x2}
              y2={g.y2}
              stroke={on ? FLOW : IDLE}
              strokeWidth={on ? 2 : 1.25}
              strokeDasharray={on ? undefined : "3 4"}
              markerEnd={`url(#${on ? "flow" : "idle"}-arrow)`}
              style={{ transition: "stroke 300ms" }}
            />
            {on && <FlowDots {...g} animate={animate} />}
            {on && edge.label && (
              <EdgeLabel
                geometry={g}
                label={edge.label}
                below={edge.labelBelow}
              />
            )}
          </g>
        );
      })}

      {NODES.map((n) => {
        const on = scene.nodes.includes(n.id);
        return (
          <g
            key={n.id}
            style={{ opacity: on ? 1 : 0.4, transition: "opacity 300ms" }}
          >
            <rect
              x={n.x}
              y={n.y}
              width={n.w}
              height={NODE_H}
              rx={4}
              fill={on ? "#e8ebe0" : "#f6f7f4"}
              stroke={on ? "#5b6529" : "#a9a9a5"}
              strokeWidth={on ? 1.5 : 1}
              style={{ transition: "fill 300ms, stroke 300ms" }}
            />
            <text
              x={n.x + n.w / 2}
              y={n.y + (n.sub ? 19 : 26)}
              textAnchor="middle"
              fontSize={12}
              fontWeight={600}
              fill="#37352f"
            >
              {n.label}
            </text>
            {n.sub && (
              <text
                x={n.x + n.w / 2}
                y={n.y + 34}
                textAnchor="middle"
                fontSize={10.5}
                fill="#7a7a76"
              >
                {n.sub}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}

const STEPS: DiagramStep[] = [
  {
    label: "1. build",
    body: (
      <>
        Docker Compose builds <strong>one container</strong> with ROS2 Humble,
        Gazebo, Nav2 and SLAM Toolbox, so every run starts from the same
        environment. Then <InlineCode>colcon</InlineCode> builds the{" "}
        <InlineCode>md25010_nav</InlineCode> package inside it.
      </>
    ),
  },
  {
    label: "2. map",
    body: (
      <>
        <InlineCode>slam.launch.py</InlineCode> starts Gazebo, SLAM Toolbox and
        RViz. The simulated robot streams <strong>laser scans</strong>, SLAM
        Toolbox turns them into an occupancy grid, and RViz shows the map as it
        grows. I drive with keyboard teleop until the room is covered.
      </>
    ),
  },
  {
    label: "3. save",
    body: (
      <>
        <InlineCode>map_saver_cli</InlineCode> exports the grid as{" "}
        <InlineCode>turtlebot3_map.pgm</InlineCode> and a{" "}
        <InlineCode>.yaml</InlineCode> file into a{" "}
        <strong>mounted folder</strong>, so the map survives after the container
        stops.
      </>
    ),
  },
  {
    label: "4. navigate",
    body: (
      <>
        Nav2 loads the saved map, localizes with AMCL and plans paths.{" "}
        <InlineCode>send_nav_goals</InlineCode> feeds it five goals in a row,
        Nav2 sends <strong>velocity commands</strong> to the robot, and every
        result is written to a CSV log.
      </>
    ),
  },
];

export function ExecutionFlowDiagram() {
  return (
    <StepDiagram
      steps={STEPS}
      caption={
        <>
          How data moves through the pipeline, from{" "}
          <strong>container build</strong> to autonomous navigation.
        </>
      }
    >
      {({ active, animate }) => <Scene active={active} animate={animate} />}
    </StepDiagram>
  );
}

export function ExecutionFlowPreview() {
  const animate = useAnimationsEnabled();
  const active = useCycle(SCENES.length, 2600, animate);
  return <Scene active={active} animate={animate} />;
}
