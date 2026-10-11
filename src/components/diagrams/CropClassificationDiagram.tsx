"use client";

import { useEffect, useState } from "react";
import {
  StepDiagram,
  startMotion,
  useAnimationsEnabled,
  useCycle,
  type DiagramStep,
} from "./StepDiagram";

const CARD_W = 120;
const CARD_H = 110;
/** How long the scan sweeps the leaf before the model's answer appears. */
const SCAN_MS = 1200;

interface Sample {
  id: string;
  crop: string;
  condition: string;
  confidence: number;
  ms: number;
  color: string;
  tint: string;
}

const SAMPLES: Sample[] = [
  { id: "s1", crop: "Tomato", condition: "Healthy", confidence: 98.7, ms: 11, color: "#4a9c50", tint: "#eaf5eb" },
  { id: "s2", crop: "Tomato", condition: "Early Blight", confidence: 96.1, ms: 14, color: "#c4882e", tint: "#f8f0e4" },
  { id: "s3", crop: "Potato", condition: "Late Blight", confidence: 93.4, ms: 18, color: "#7a5033", tint: "#f2ebe5" },
  { id: "s4", crop: "Corn", condition: "Common Rust", confidence: 97.2, ms: 13, color: "#b84c3a", tint: "#f6e8e5" },
  { id: "s5", crop: "Apple", condition: "Black Rot", confidence: 94.8, ms: 16, color: "#5a4a3a", tint: "#edebe8" },
];

const CARD_POSITIONS = [
  { x: 28, y: 36 },
  { x: 164, y: 36 },
  { x: 300, y: 36 },
  { x: 92, y: 166 },
  { x: 228, y: 166 },
];

/** Lesion spots on the leaf, as offsets from its centre. Healthy leaves have none. */
const SPOTS = [
  [-4, -4, 2.2],
  [4, 2, 1.8],
  [-2, 8, 1.5],
];

/** False while the current sample is still being scanned, true once the model has answered. */
function useAnswered(active: number, animate: boolean): boolean {
  const [answered, setAnswered] = useState({ active, done: false });
  useEffect(() => {
    if (!animate) return;
    const id = setTimeout(() => setAnswered({ active, done: true }), SCAN_MS);
    return () => clearTimeout(id);
  }, [active, animate]);
  return !animate || (answered.active === active && answered.done);
}

function Scene({ active, animate }: { active: number; animate: boolean }) {
  const answered = useAnswered(active, animate);
  const shown = SAMPLES[active];
  const finished = active >= SAMPLES.length - 1 && answered;

  return (
    <svg
      viewBox="0 0 440 352"
      role="img"
      aria-label="Five crop leaf cards being classified by the model"
      className="mx-auto h-auto w-full max-w-[440px] font-sans"
    >
      {SAMPLES.map((sample, i) => {
        const pos = CARD_POSITIONS[i];
        const current = i === active;
        // A card is "done" once it's been classified; the current one waits for its scan to finish.
        const reached = i < active || (current && answered);
        const cx = pos.x + CARD_W / 2;
        const leafCy = pos.y + 38;

        return (
          <g key={sample.id}>
            <rect
              x={pos.x}
              y={pos.y}
              width={CARD_W}
              height={CARD_H}
              rx={8}
              fill={reached ? sample.tint : "#f6f7f4"}
              stroke={current ? sample.color : reached ? sample.color : "#c9c9c6"}
              strokeWidth={current ? 2 : 1}
              style={{ transition: "fill 400ms, stroke 400ms" }}
            />

            {current && animate && !answered && (
              <rect
                key={`scan-${active}`}
                x={pos.x + 10}
                y={pos.y + 8}
                width={CARD_W - 20}
                height={2}
                rx={1}
                fill={sample.color}
              >
                {/* One sweep, started by hand so it lines up with the moment the card becomes current. */}
                <animate
                  ref={startMotion}
                  begin="indefinite"
                  attributeName="y"
                  values={`${pos.y + 8};${pos.y + CARD_H - 10}`}
                  dur={`${SCAN_MS}ms`}
                  fill="freeze"
                />
              </rect>
            )}

            <g transform={`translate(${cx}, ${leafCy})`}>
              <path
                d="M0-15 Q14-8 11 8 Q6 18 0 20 Q-6 18-11 8 Q-14-8 0-15Z"
                fill={reached ? sample.color : "none"}
                stroke={reached ? sample.color : "#a9a9a5"}
                strokeWidth={1.5}
                style={{ transition: "fill 400ms, stroke 400ms" }}
              />
              {sample.condition !== "Healthy" && reached &&
                SPOTS.map(([dx, dy, r]) => (
                  <circle key={`${dx},${dy}`} cx={dx} cy={dy} r={r} fill="#37352f" fillOpacity={0.45} />
                ))}
              <line
                x1={0}
                y1={16}
                x2={0}
                y2={26}
                stroke={reached ? sample.color : "#a9a9a5"}
                strokeWidth={1.5}
                style={{ transition: "stroke 400ms" }}
              />
            </g>

            <text
              x={cx}
              y={pos.y + 80}
              textAnchor="middle"
              fontSize={11}
              fontWeight={600}
              fill={reached ? "#37352f" : "#7a7a76"}
              style={{ transition: "fill 300ms" }}
            >
              {sample.crop}
            </text>

            <text
              x={cx}
              y={pos.y + 96}
              textAnchor="middle"
              fontSize={9}
              fill={reached ? sample.color : "transparent"}
              style={{ transition: "fill 400ms" }}
            >
              {sample.condition}
            </text>
          </g>
        );
      })}

      {/* The model's answer for the current sample: top class and how sure it is. */}
      <g style={{ transition: "opacity 300ms" }} opacity={answered ? 1 : 0.5}>
        <text x={28} y={300} fontSize={11} fontWeight={600} fill="#37352f">
          {answered ? `${shown.crop} · ${shown.condition}` : "classifying..."}
        </text>
        <rect x={28} y={310} width={384} height={8} rx={4} fill="#dcdcd8" />
        <rect
          x={28}
          y={310}
          height={8}
          rx={4}
          fill={shown.color}
          // CSS width, not the attribute, so it can transition.
          style={{
            width: answered ? (384 * shown.confidence) / 100 : 0,
            transition: animate ? "width 700ms ease-out, fill 300ms" : "none",
          }}
        />
        <text x={28} y={334} fontSize={9.5} fill="#7a7a76">
          {answered ? `${shown.confidence}% confident · ${shown.ms} ms · the rest is spread over 37 other classes` : "\u00a0"}
        </text>
      </g>

      <text x={412} y={300} textAnchor="end" fontSize={10} fill="#8d8d88">
        {finished
          ? `${SAMPLES.length}/${SAMPLES.length} done · avg ${(SAMPLES.reduce((sum, x) => sum + x.confidence, 0) / SAMPLES.length).toFixed(1)}%`
          : `${active + 1}/${SAMPLES.length}`}
      </text>
    </svg>
  );
}

const STEPS: DiagramStep[] = SAMPLES.map((sample, i) => ({
  label: `sample ${i + 1}`,
  body: (
    <>
      <strong>{sample.crop}</strong> leaf classified as{" "}
      <strong>{sample.condition}</strong> with {sample.confidence}% confidence in{" "}
      {sample.ms} ms.
      <span className="mt-3 flex items-center gap-2 font-sans text-xs text-gray-500">
        <span className="w-16 shrink-0">confidence</span>
        <span className="h-2 flex-1 rounded-full bg-gray-300">
          <span
            className="block h-full rounded-full"
            style={{
              width: `${sample.confidence}%`,
              backgroundColor: sample.color,
            }}
          />
        </span>
        <span className="w-12 shrink-0 text-right">{sample.confidence}%</span>
      </span>
    </>
  ),
}));

export function CropClassificationDiagram() {
  return (
    <StepDiagram
      steps={STEPS}
      caption={
        <>
          Five samples classified by the ResNet-18 model. Confidence scores
          reflect demo-class performance on the PlantVillage dataset.
        </>
      }
    >
      {({ active, animate }) => <Scene active={active} animate={animate} />}
    </StepDiagram>
  );
}

export function CropClassificationPreview() {
  const animate = useAnimationsEnabled();
  const active = useCycle(SAMPLES.length, 2800, animate);
  return <Scene active={active} animate={animate} />;
}
