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

const ROW = [46, 140, 234];

const NODES: NodeDef[] = [
  { id: "camera", label: "capture", sub: "phone / drone", x: 4, y: ROW[0], w: 108 },
  { id: "nextjs", label: "Next.js 15", sub: "App Router", x: 166, y: ROW[0], w: 126 },
  { id: "fastapi", label: "FastAPI", sub: "/predict", x: 360, y: ROW[0], w: 126 },
  { id: "telegram", label: "Telegram", sub: "bot polling", x: 4, y: ROW[1], w: 108 },
  { id: "preprocess", label: "preprocess", sub: "224×224 · norm", x: 360, y: ROW[1], w: 126 },
  { id: "resnet", label: "ResNet-18", sub: "ONNX Runtime", x: 544, y: ROW[1], w: 144 },
  { id: "diagnosis", label: "diagnosis", sub: "38 classes", x: 544, y: ROW[2], w: 144 },
];

interface EdgeDef {
  from: string;
  to: string;
  label?: string;
  shift?: number;
  labelBelow?: boolean;
}

const EDGES: EdgeDef[] = [
  { from: "camera", to: "nextjs" },
  { from: "nextjs", to: "fastapi", label: "upload" },
  { from: "telegram", to: "fastapi", label: "photo" },
  { from: "fastapi", to: "preprocess", label: "image" },
  { from: "preprocess", to: "resnet", label: "tensor" },
  { from: "resnet", to: "diagnosis", label: "top-k" },
];

interface StepScene {
  nodes: string[];
  edges: number[];
}

const SCENES: StepScene[] = [
  { nodes: ["camera", "nextjs"], edges: [0] },
  { nodes: ["nextjs", "fastapi", "telegram"], edges: [1, 2] },
  { nodes: ["fastapi", "preprocess", "resnet"], edges: [3, 4] },
  { nodes: ["resnet", "diagnosis"], edges: [5] },
];

const byId = new Map(NODES.map((n) => [n.id, n]));

function nodeCenter(n: NodeDef) {
  return { x: n.x + n.w / 2, y: n.y + NODE_H / 2 };
}

function edgeGeometry(edge: EdgeDef) {
  const a = byId.get(edge.from)!;
  const b = byId.get(edge.to)!;
  const ca = nodeCenter(a);
  const cb = nodeCenter(b);
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
      aria-label="Diagram of the crop classification inference pipeline"
      className="h-auto w-full font-sans"
    >
      <defs>
        <marker
          id="pipe-flow-arrow"
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
          id="pipe-idle-arrow"
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
        x={152}
        y={8}
        width={548}
        height={276}
        rx={8}
        fill="none"
        stroke="#bdbdb8"
        strokeDasharray="5 4"
      />
      <text x={160} y={26} fontSize={10} fill="#8d8d88">
        Vercel · serverless functions
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
              markerEnd={`url(#pipe-${on ? "flow" : "idle"}-arrow)`}
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
    label: "1. capture",
    body: (
      <>
        A farmer photographs a crop leaf using their <strong>phone camera</strong>{" "}
        or captures it via drone. The image lands in the Next.js frontend, which
        provides a responsive, mobile-first upload experience.
      </>
    ),
  },
  {
    label: "2. send",
    body: (
      <>
        The frontend sends the image to <InlineCode>/predict</InlineCode> on the
        FastAPI backend. The <strong>Telegram bot</strong> offers the same
        endpoint for users who prefer messaging-first interactions.
      </>
    ),
  },
  {
    label: "3. infer",
    body: (
      <>
        FastAPI preprocesses the image to <strong>224x224</strong> pixels and
        normalizes it. The tensor is passed to <InlineCode>ResNet-18</InlineCode>{" "}
        running on ONNX Runtime for efficient serverless inference.
      </>
    ),
  },
  {
    label: "4. classify",
    body: (
      <>
        The model outputs probabilities across <strong>38 crop classes</strong>{" "}
        from the PlantVillage dataset. The top prediction is returned as a
        diagnosis card with confidence score.
      </>
    ),
  },
];

export function InferencePipelineDiagram() {
  return (
    <StepDiagram
      steps={STEPS}
      caption={
        <>
          How an image moves through the system, from <strong>capture</strong> to
          crop diagnosis.
        </>
      }
    >
      {({ active, animate }) => <Scene active={active} animate={animate} />}
    </StepDiagram>
  );
}

export function InferencePipelinePreview() {
  const animate = useAnimationsEnabled();
  const active = useCycle(SCENES.length, 2600, animate);
  return <Scene active={active} animate={animate} />;
}
