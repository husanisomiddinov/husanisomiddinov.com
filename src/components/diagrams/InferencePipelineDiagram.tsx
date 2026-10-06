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
const OLIVE = "#5b6529";

interface StageDef {
  id: string;
  label: string;
  sub?: string;
  x: number;
  y: number;
  w: number;
  h: number;
}

const STAGES: StageDef[] = [
  { id: "camera", label: "capture", sub: "phone / drone", x: 20, y: 10, w: 130, h: 36 },
  { id: "telegram", label: "Telegram", sub: "bot polling", x: 290, y: 10, w: 130, h: 36 },
  { id: "nextjs", label: "Next.js 15", sub: "App Router", x: 40, y: 76, w: 160, h: 36 },
  { id: "fastapi", label: "FastAPI", sub: "/predict", x: 125, y: 138, w: 190, h: 36 },
  { id: "preprocess", label: "preprocess", sub: "224×224 · norm", x: 135, y: 200, w: 170, h: 36 },
  { id: "resnet", label: "ResNet-18", sub: "ONNX Runtime", x: 95, y: 262, w: 250, h: 40 },
  { id: "diagnosis", label: "diagnosis", sub: "38 classes", x: 135, y: 322, w: 170, h: 36 },
];

interface LinkDef {
  from: string;
  to: string;
  label?: string;
}

const LINKS: LinkDef[] = [
  { from: "camera", to: "nextjs" },
  { from: "nextjs", to: "fastapi", label: "upload" },
  { from: "telegram", to: "fastapi", label: "photo" },
  { from: "fastapi", to: "preprocess" },
  { from: "preprocess", to: "resnet", label: "tensor" },
  { from: "resnet", to: "diagnosis" },
];

interface StepScene {
  nodes: string[];
  edges: number[];
}

const SCENES: StepScene[] = [
  { nodes: ["camera", "nextjs"], edges: [0] },
  { nodes: ["nextjs", "telegram", "fastapi"], edges: [1, 2] },
  { nodes: ["fastapi", "preprocess", "resnet"], edges: [3, 4] },
  { nodes: ["resnet", "diagnosis"], edges: [5] },
];

const stageById = new Map(STAGES.map((s) => [s.id, s]));

function linkEndpoints(link: LinkDef) {
  const from = stageById.get(link.from)!;
  const to = stageById.get(link.to)!;
  return {
    x1: from.x + from.w / 2,
    y1: from.y + from.h + 3,
    x2: to.x + to.w / 2,
    y2: to.y - 3,
  };
}

function FallingDots({
  x1,
  y1,
  x2,
  y2,
  animate,
  id,
}: {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  animate: boolean;
  id: string;
}) {
  const path = `M ${x1} ${y1} L ${x2} ${y2}`;
  const count = 2;
  const dur = 1.2;
  return (
    <>
      {Array.from({ length: count }, (_, k) => {
        if (!animate) {
          const t = (k + 0.5) / count;
          return (
            <circle
              key={`${id}-${k}`}
              cx={x1 + (x2 - x1) * t}
              cy={y1 + (y2 - y1) * t}
              r={3.5}
              fill={FLOW}
            />
          );
        }
        return (
          <circle key={`${id}-${k}`} r={3.5} fill={FLOW}>
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
  endpoints,
  label,
}: {
  endpoints: { x1: number; y1: number; x2: number; y2: number };
  label: string;
}) {
  const dx = endpoints.x2 - endpoints.x1;
  const dy = endpoints.y2 - endpoints.y1;
  const len = Math.hypot(dx, dy);
  let nx = -dy / len;
  let ny = dx / len;
  if (Math.abs(ny) > Math.abs(nx) ? ny > 0 : nx < 0) {
    nx = -nx;
    ny = -ny;
  }
  const vertical = Math.abs(ny) <= Math.abs(nx);
  return (
    <text
      x={(endpoints.x1 + endpoints.x2) / 2 + nx * 10}
      y={(endpoints.y1 + endpoints.y2) / 2 + ny * 10 + 3}
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
      viewBox="0 0 440 368"
      role="img"
      aria-label="Vertical diagram of the crop inference pipeline"
      className="mx-auto h-auto w-full max-w-[440px] font-sans"
    >
      <rect
        x={26}
        y={58}
        width={388}
        height={310}
        rx={8}
        fill="none"
        stroke="#bdbdb8"
        strokeDasharray="5 4"
      />
      <text x={34} y={72} fontSize={10} fill="#8d8d88">
        Vercel · serverless
      </text>

      {LINKS.map((link, i) => {
        const ep = linkEndpoints(link);
        const on = scene.edges.includes(i);
        return (
          <g key={i}>
            <line
              x1={ep.x1}
              y1={ep.y1}
              x2={ep.x2}
              y2={ep.y2}
              stroke={on ? FLOW : IDLE}
              strokeWidth={on ? 2 : 1.25}
              strokeDasharray={on ? undefined : "3 4"}
              style={{ transition: "stroke 300ms" }}
            />
            {on && <FallingDots {...ep} animate={animate} id={`link-${i}`} />}
            {on && link.label && (
              <EdgeLabel endpoints={ep} label={link.label} />
            )}
          </g>
        );
      })}

      {STAGES.map((s) => {
        const on = scene.nodes.includes(s.id);
        return (
          <g
            key={s.id}
            style={{ opacity: on ? 1 : 0.4, transition: "opacity 300ms" }}
          >
            <rect
              x={s.x}
              y={s.y}
              width={s.w}
              height={s.h}
              rx={8}
              fill={on ? "#e8ebe0" : "#f6f7f4"}
              stroke={on ? OLIVE : "#a9a9a5"}
              strokeWidth={on ? 1.5 : 1}
              style={{ transition: "fill 300ms, stroke 300ms" }}
            />
            <text
              x={s.x + s.w / 2}
              y={s.y + (s.sub ? s.h / 2 - 3 : s.h / 2 + 4)}
              textAnchor="middle"
              fontSize={12}
              fontWeight={600}
              fill="#37352f"
            >
              {s.label}
            </text>
            {s.sub && (
              <text
                x={s.x + s.w / 2}
                y={s.y + s.h / 2 + 11}
                textAnchor="middle"
                fontSize={10.5}
                fill="#7a7a76"
              >
                {s.sub}
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
