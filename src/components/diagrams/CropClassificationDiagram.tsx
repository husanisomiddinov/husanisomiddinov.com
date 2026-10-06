"use client";

import {
  StepDiagram,
  useAnimationsEnabled,
  useCycle,
  type DiagramStep,
} from "./StepDiagram";

const CARD_W = 120;
const CARD_H = 110;

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

function Scene({ active, animate }: { active: number; animate: boolean }) {
  return (
    <svg
      viewBox="0 0 440 310"
      role="img"
      aria-label="Five crop leaf cards being classified by the model"
      className="mx-auto h-auto w-full max-w-[440px] font-sans"
    >
      {SAMPLES.map((sample, i) => {
        const pos = CARD_POSITIONS[i];
        const reached = i <= active;
        const current = i === active;
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

            {current && animate && (
              <rect
                x={pos.x + 10}
                y={pos.y + 8}
                width={CARD_W - 20}
                height={2}
                rx={1}
                fill={sample.color}
              >
                <animate
                  attributeName="y"
                  values={`${pos.y + 8};${pos.y + CARD_H - 10}`}
                  dur="1.2s"
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="opacity"
                  values="0.6;0.12;0.6"
                  dur="1.2s"
                  repeatCount="indefinite"
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

      <text
        x={220}
        y={298}
        textAnchor="middle"
        fontSize={10}
        fill="#8d8d88"
      >
        {active >= SAMPLES.length - 1
          ? `${SAMPLES.length}/${SAMPLES.length} classified · avg ${(SAMPLES.reduce((s, x) => s + x.confidence, 0) / SAMPLES.length).toFixed(1)}%`
          : `${active + 1}/${SAMPLES.length} classifying...`}
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
  const active = useCycle(SAMPLES.length, 1800, animate);
  return <Scene active={active} animate={animate} />;
}
