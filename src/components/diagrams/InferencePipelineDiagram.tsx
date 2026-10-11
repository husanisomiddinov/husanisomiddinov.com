"use client";

import {
  InlineCode,
  StepDiagram,
  startMotion,
  useAnimationsEnabled,
  useBeats,
  useTick,
  type DiagramStep,
} from "./StepDiagram";

const FLOW = "#5b84b8";
const IDLE = "#c9c9c6";
const OLIVE = "#5b6529";
const BEAT_MS = 1400;
/** A packet crosses its link in a bit less than a beat, so each hop lands before the next starts. */
const PACKET_S = 1.05;

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

/** What travels along a link: the photo, then the tensor made from it, then the class scores. */
type Payload = "photo" | "tensor" | "scores";

interface LinkDef {
  from: string;
  to: string;
  label?: string;
  payload: Payload;
}

const LINKS: LinkDef[] = [
  { from: "camera", to: "nextjs", payload: "photo" },
  { from: "nextjs", to: "fastapi", label: "upload", payload: "photo" },
  { from: "telegram", to: "fastapi", label: "photo", payload: "photo" },
  { from: "fastapi", to: "preprocess", payload: "photo" },
  { from: "preprocess", to: "resnet", label: "tensor", payload: "tensor" },
  { from: "resnet", to: "diagnosis", label: "scores", payload: "scores" },
];

interface StepScene {
  nodes: string[];
  /** Every link in the step; the beat picks which one carries a packet right now. */
  edges: number[];
  beats: number[][];
}

const SCENES: StepScene[] = [
  { nodes: ["camera", "nextjs"], edges: [0], beats: [[0]] },
  // The web upload and the Telegram bot are two ways in, so they take turns.
  { nodes: ["nextjs", "telegram", "fastapi"], edges: [1, 2], beats: [[1], [2]] },
  { nodes: ["fastapi", "preprocess", "resnet"], edges: [3, 4], beats: [[3], [4]] },
  { nodes: ["resnet", "diagnosis"], edges: [5], beats: [[5]] },
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

/** Resting state for reduced motion: dots spread along the link. */
function StaticDots({ x1, y1, x2, y2 }: { x1: number; y1: number; x2: number; y2: number }) {
  return (
    <>
      {[0.33, 0.67].map((t) => (
        <circle key={t} cx={x1 + (x2 - x1) * t} cy={y1 + (y2 - y1) * t} r={3.5} fill={FLOW} />
      ))}
    </>
  );
}

/** The little picture of what is being sent, centred on (0, 0). */
function PayloadGlyph({ payload }: { payload: Payload }) {
  if (payload === "photo") {
    return (
      <>
        <rect x={-8} y={-6} width={16} height={12} rx={2} fill="#fbfbf9" stroke={FLOW} strokeWidth={1.5} />
        <circle cx={-2.5} cy={-1.5} r={1.8} fill={FLOW} />
        <path d="M -8 6 L -3 0 L 1 4 L 4 1 L 8 6 z" fill={FLOW} fillOpacity={0.55} />
      </>
    );
  }
  if (payload === "tensor") {
    return (
      <>
        {[-6, 0, 6].flatMap((x) => [-6, 0, 6].map((y) => (
          <rect key={`${x},${y}`} x={x - 2.5} y={y - 2.5} width={5} height={5} rx={1} fill={FLOW} fillOpacity={0.35 + ((x + y + 12) % 7) / 12} />
        )))}
      </>
    );
  }
  return (
    <>
      <rect x={-8} y={-8} width={16} height={16} rx={2} fill="#fbfbf9" stroke={FLOW} strokeWidth={1.5} />
      {[-4.5, -0.5, 3.5].map((y, i) => (
        <rect key={y} x={-5.5} y={y - 1} width={[10, 5, 2.5][i]} height={2.4} rx={1} fill={FLOW} />
      ))}
    </>
  );
}

/** One packet making a single trip along a link; mount it with a fresh key to send another. */
function Packet({
  x1,
  y1,
  x2,
  y2,
  payload,
}: {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  payload: Payload;
}) {
  return (
    <g>
      <PayloadGlyph payload={payload} />
      <animateMotion
        ref={startMotion}
        begin="indefinite"
        dur={`${PACKET_S}s`}
        fill="freeze"
        path={`M ${x1} ${y1} L ${x2} ${y2}`}
      />
    </g>
  );
}

function EdgeLabel({
  endpoints,
  label,
  dim,
}: {
  endpoints: { x1: number; y1: number; x2: number; y2: number };
  label: string;
  dim?: boolean;
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
      style={{ opacity: dim ? 0.45 : 1, transition: "opacity 300ms" }}
    >
      {label}
    </text>
  );
}

function Scene({
  active,
  beat,
  tick,
  animate,
}: {
  active: number;
  beat: number;
  /** Counts every beat since the scene started, so a repeated beat still sends a fresh packet. */
  tick: number;
  animate: boolean;
}) {
  const scene = SCENES[active];
  const current = scene.beats[beat];
  const receiving = new Set(animate ? current.map((i) => LINKS[i].to) : []);

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
        const inScene = scene.edges.includes(i);
        const live = animate ? current.includes(i) : inScene;
        return (
          <g key={i} style={{ opacity: inScene && !live ? 0.4 : 1, transition: "opacity 300ms" }}>
            <line
              x1={ep.x1}
              y1={ep.y1}
              x2={ep.x2}
              y2={ep.y2}
              stroke={inScene ? FLOW : IDLE}
              strokeWidth={live ? 2 : inScene ? 1.5 : 1.25}
              strokeDasharray={inScene ? undefined : "3 4"}
              style={{ transition: "stroke 300ms, stroke-width 300ms" }}
            />
            {live && (animate ? <Packet key={tick} {...ep} payload={link.payload} /> : <StaticDots {...ep} />)}
            {inScene && link.label && <EdgeLabel endpoints={ep} label={link.label} dim={!live} />}
          </g>
        );
      })}

      {STAGES.map((s) => {
        const on = scene.nodes.includes(s.id);
        const arriving = receiving.has(s.id);
        // The last step ends with an actual answer, so show one instead of the class count.
        const sub = s.id === "diagnosis" && active === 3 ? "Tomato · Early Blight" : s.sub;
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
              stroke={arriving ? FLOW : on ? OLIVE : "#a9a9a5"}
              strokeWidth={arriving ? 2.5 : on ? 1.5 : 1}
              // Wait for the packet to land before lighting the box up.
              style={{ transition: `fill 300ms, stroke 300ms ${PACKET_S * 0.75}s, stroke-width 300ms ${PACKET_S * 0.75}s` }}
            />
            <text
              x={s.x + s.w / 2}
              y={s.y + (sub ? s.h / 2 - 3 : s.h / 2 + 4)}
              textAnchor="middle"
              fontSize={12}
              fontWeight={600}
              fill="#37352f"
            >
              {s.label}
            </text>
            {sub && (
              <text
                x={s.x + s.w / 2}
                y={s.y + s.h / 2 + 11}
                textAnchor="middle"
                fontSize={10.5}
                fill="#7a7a76"
              >
                {sub}
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

function LiveScene({ active, animate }: { active: number; animate: boolean }) {
  const { beat, tick } = useBeats(active, SCENES[active].beats.length, BEAT_MS, animate);
  return <Scene active={active} beat={beat} tick={tick} animate={animate} />;
}

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
      {({ active, animate }) => <LiveScene active={active} animate={animate} />}
    </StepDiagram>
  );
}

export function InferencePipelinePreview() {
  const animate = useAnimationsEnabled();
  const tick = useTick(animate, BEAT_MS);
  // Walk every step's beats in order, then start over.
  const timeline = SCENES.flatMap((scene, active) => scene.beats.map((_, beat) => ({ active, beat })));
  const { active, beat } = timeline[tick % timeline.length];
  return <Scene active={active} beat={beat} tick={tick} animate={animate} />;
}
