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

const DATA = "#d4573b";
const FLOW = "#5b84b8";
const API = "#5b6529";
const MODEL = "#e3b341";
const MODEL_TINT = "#f6e7b4";
const IDLE_LINE = "#dcdcd8";
const IDLE_TILE = "#e4e4e0";
const INK = "#2a2925";
const MUTED = "#6b6a64";

const BEAT_MS = 1400;
/** A packet crosses its lane in a bit less than a beat, so each hop lands before the next starts. */
const PACKET_S = 1.05;

const BUS_X = 190;
const NUM_X = 236;
const API_X = 410;
const BAR_X = 438;
const PANEL_X = 448;

/** One horizontal lane per step, like a row of a sequence diagram. */
interface Lane {
  y: number;
  label: string;
  caption: string;
  /** Beats within the step; the lane has one beat per way in. */
  beats: number;
}

const LANES: Lane[] = [
  { y: 90, label: "capture", caption: "photo", beats: 1 },
  { y: 152, label: "POST /predict", caption: "web | bot", beats: 2 },
  { y: 214, label: "preprocess", caption: "224x224x3", beats: 1 },
  { y: 276, label: "resnet18", caption: "38 classes", beats: 1 },
];

const LEGEND = [
  { x: 20, color: DATA, label: "photo" },
  { x: 160, color: FLOW, label: "app" },
  { x: 372, color: API, label: "FastAPI" },
  { x: 448, color: MODEL, label: "model" },
];

/** Fixed class scores for the output bars; index WINNER is the diagnosis. */
const SCORES = [0.12, 0.2, 0.08, 0.3, 0.15, 0.1, 0.22, 0.92, 0.18, 0.09, 0.26, 0.14, 0.07, 0.19, 0.11, 0.24, 0.1, 0.16, 0.08];
const WINNER = 7;

const PHOTO = { x: 20, y: 52, cell: 22, gap: 4, cols: 4, rows: 9 };
const photoEdge = PHOTO.x + PHOTO.cols * PHOTO.cell + (PHOTO.cols - 1) * PHOTO.gap;

const mono = "font-mono";

function PhotoGrid({ active, scanRow }: { active: boolean; scanRow: number }) {
  return (
    <g>
      {Array.from({ length: PHOTO.rows }, (_, r) =>
        Array.from({ length: PHOTO.cols }, (_, c) => (
          <rect
            key={`${r},${c}`}
            x={PHOTO.x + c * (PHOTO.cell + PHOTO.gap)}
            y={PHOTO.y + r * (PHOTO.cell + PHOTO.gap)}
            width={PHOTO.cell}
            height={PHOTO.cell}
            rx={2}
            fill={active ? DATA : IDLE_TILE}
            fillOpacity={active ? (r === scanRow ? 1 : 0.62) : 0.7}
            style={{ transition: "fill 300ms, fill-opacity 300ms" }}
          />
        )),
      )}
    </g>
  );
}

/** What the lane carries, drawn as tiles to the right of the FastAPI line. */
function Panel({ lane, y, on, beat, tick }: { lane: number; y: number; on: boolean; beat: number; tick: number }) {
  const top = y - 17;
  if (lane === 0) {
    return (
      <g>
        {Array.from({ length: 2 }, (_, r) =>
          Array.from({ length: 11 }, (_, c) => (
            <rect
              key={`${r},${c}`}
              x={PANEL_X + c * 15}
              y={top + r * 18}
              width={12}
              height={15}
              rx={2}
              fill={on ? DATA : IDLE_TILE}
              fillOpacity={on ? 0.4 + (((c * 5 + r * 3) % 7) / 10) : 0.7}
              style={{ transition: "fill 300ms, fill-opacity 300ms" }}
            />
          )),
        )}
      </g>
    );
  }
  if (lane === 1) {
    return (
      <g>
        {["web", "bot"].map((name, i) => {
          const lit = on && beat === i;
          return (
            <g key={name}>
              <rect
                x={PANEL_X + i * 92}
                y={top}
                width={84}
                height={34}
                rx={3}
                fill={lit ? MODEL_TINT : IDLE_TILE}
                stroke={lit ? MODEL : "none"}
                strokeWidth={1.5}
                style={{ transition: `fill 300ms ${PACKET_S * 0.75}s, stroke 300ms ${PACKET_S * 0.75}s` }}
              />
              <text
                x={PANEL_X + i * 92 + 42}
                y={y + 4}
                textAnchor="middle"
                fontSize={11}
                fill={lit ? INK : MUTED}
                className={mono}
              >
                {name}
              </text>
            </g>
          );
        })}
      </g>
    );
  }
  if (lane === 2) {
    return (
      <g>
        {Array.from({ length: 2 }, (_, r) =>
          Array.from({ length: 14 }, (_, c) => {
            const wave = on ? 0.35 + 0.65 * (((c + r * 3 + tick * 2) % 6) / 5) : 0.7;
            return (
              <rect
                key={`${r},${c}`}
                x={PANEL_X + c * 12.5}
                y={top + r * 18}
                width={10}
                height={15}
                rx={2}
                fill={on ? MODEL : IDLE_TILE}
                fillOpacity={wave}
                style={{ transition: "fill 300ms, fill-opacity 500ms" }}
              />
            );
          }),
        )}
      </g>
    );
  }
  return (
    <g>
      {SCORES.map((score, i) => {
        const win = on && i === WINNER;
        const height = Math.max(score * 34, 3);
        return (
          <rect
            key={i}
            x={PANEL_X + i * 9.2}
            y={y + 17 - height}
            width={6}
            height={height}
            rx={1.5}
            fill={win ? MODEL : IDLE_TILE}
            style={{
              transformBox: "fill-box",
              transformOrigin: "bottom",
              transform: `scaleY(${on ? 1 : 0.35})`,
              transition: "transform 600ms, fill 300ms",
            }}
          />
        );
      })}
    </g>
  );
}

/** One packet making a single trip down a lane; mount it with a fresh key to send another. */
function Packet({ y }: { y: number }) {
  return (
    <g>
      <circle r={4.5} fill={FLOW} />
      <animateMotion
        ref={startMotion}
        begin="indefinite"
        dur={`${PACKET_S}s`}
        fill="freeze"
        path={`M ${BUS_X} ${y} L ${API_X} ${y}`}
      />
      <animate
        ref={startMotion}
        attributeName="opacity"
        values="1;1;0"
        keyTimes="0;0.85;1"
        begin="indefinite"
        dur={`${PACKET_S}s`}
        fill="freeze"
      />
    </g>
  );
}

function Scene({
  active,
  beat,
  tick,
  animate,
  wide,
}: {
  active: number;
  beat: number;
  /** Counts every beat since the scene started, so a repeated beat still sends a fresh packet. */
  tick: number;
  animate: boolean;
  /** The full-size diagram keeps a readable minimum width and scrolls on narrow screens. */
  wide?: boolean;
}) {
  const busY = LANES[active].y;
  const resultLabel = active === 3 ? "Tomato · Early Blight" : LANES[3].caption;

  return (
    <svg
      viewBox="0 0 640 316"
      role="img"
      aria-label="Diagram of the crop inference pipeline, one row per step from capture to diagnosis"
      className={`mx-auto h-auto w-full max-w-[640px] font-sans ${wide ? "min-w-[560px]" : ""}`}
    >
      {LEGEND.map((item) => (
        <g key={item.label}>
          <circle cx={item.x} cy={22} r={3.5} fill={item.color} />
          <text x={item.x + 9} y={26} fontSize={11} fill={MUTED} className={mono}>
            {item.label}
          </text>
        </g>
      ))}

      <PhotoGrid active={active === 0} scanRow={animate ? tick % PHOTO.rows : -1} />

      {/* The bus the app sits on: grey all the way down, blue down to the active lane. */}
      <line x1={BUS_X} y1={LANES[0].y} x2={BUS_X} y2={LANES[3].y} stroke={IDLE_LINE} strokeWidth={3} />
      <line
        x1={BUS_X}
        y1={LANES[0].y}
        x2={BUS_X}
        y2={busY}
        stroke={FLOW}
        strokeWidth={3}
        style={{ transition: "all 400ms" }}
      />
      <line
        x1={photoEdge + 8}
        y1={LANES[0].y}
        x2={BUS_X}
        y2={LANES[0].y}
        stroke={active === 0 ? DATA : IDLE_LINE}
        strokeWidth={3}
        style={{ transition: "stroke 300ms" }}
      />
      <circle
        cx={photoEdge + 4}
        cy={LANES[0].y}
        r={6}
        fill={active === 0 ? DATA : IDLE_LINE}
        stroke="#f6f7f4"
        strokeWidth={2.5}
        style={{ transition: "fill 300ms" }}
      />

      <line
        x1={API_X}
        y1={LANES[0].y}
        x2={API_X}
        y2={LANES[3].y}
        stroke="#b9b9b4"
        strokeWidth={1.5}
        strokeDasharray="2 4"
      />

      {LANES.map((lane, i) => {
        const on = i === active;
        const reached = i <= active;
        return (
          <g key={lane.label}>
            <line x1={BUS_X} y1={lane.y} x2={API_X} y2={lane.y} stroke={IDLE_LINE} strokeWidth={2.5} />
            <line
              x1={BUS_X}
              y1={lane.y}
              x2={API_X}
              y2={lane.y}
              stroke={FLOW}
              strokeWidth={2.5}
              style={{ opacity: on ? 1 : 0, transition: "opacity 300ms" }}
            />
            <line
              x1={API_X}
              y1={lane.y}
              x2={BAR_X}
              y2={lane.y}
              stroke={on ? API : IDLE_LINE}
              strokeWidth={2.5}
              style={{ transition: `stroke 300ms ${animate ? PACKET_S * 0.75 : 0}s` }}
            />

            <circle cx={BUS_X} cy={lane.y} r={6} fill={reached ? FLOW : IDLE_LINE} style={{ transition: "fill 300ms" }} />
            {on && <circle cx={BUS_X} cy={lane.y} r={10.5} fill="none" stroke={FLOW} strokeWidth={2} />}

            <circle
              cx={NUM_X}
              cy={lane.y}
              r={11}
              fill={on ? "#111111" : "#ffffff"}
              stroke={on ? "#111111" : "#cfcfcb"}
              strokeWidth={1.25}
              style={{ transition: "fill 300ms, stroke 300ms" }}
            />
            <text
              x={NUM_X}
              y={lane.y + 4}
              textAnchor="middle"
              fontSize={11.5}
              fill={on ? "#ffffff" : INK}
              className={mono}
            >
              {i + 1}
            </text>

            <text
              x={API_X - 14}
              y={lane.y - 10}
              textAnchor="end"
              fontSize={11.5}
              fill={on ? "#274b7a" : MUTED}
              className={mono}
              style={{ transition: "fill 300ms" }}
            >
              {lane.label}
            </text>

            <circle
              cx={API_X}
              cy={lane.y}
              r={6.5}
              fill={on ? API : "#f6f7f4"}
              stroke={API}
              strokeWidth={2}
              style={{ transition: `fill 300ms ${animate ? PACKET_S * 0.75 : 0}s` }}
            />

            <rect
              x={BAR_X}
              y={lane.y - 21}
              width={3}
              height={42}
              fill={on ? API : "#cfcfcb"}
              style={{ transition: "fill 300ms" }}
            />
            <Panel lane={i} y={lane.y} on={on} beat={beat} tick={tick} />
            <text x={PANEL_X} y={lane.y + 33} fontSize={10.5} fill={on && i === 3 ? INK : MUTED} className={mono}>
              {i === 3 ? resultLabel : lane.caption}
            </text>

            {on && animate && <Packet key={`${tick}-${i}`} y={lane.y} />}
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
  const { beat, tick } = useBeats(active, LANES[active].beats, BEAT_MS, animate);
  return <Scene active={active} beat={beat} tick={tick} animate={animate} wide />;
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
  const timeline = LANES.flatMap((lane, active) => Array.from({ length: lane.beats }, (_, beat) => ({ active, beat })));
  const { active, beat } = timeline[tick % timeline.length];
  return <Scene active={active} beat={beat} tick={tick} animate={animate} />;
}
