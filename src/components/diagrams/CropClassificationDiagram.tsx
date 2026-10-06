"use client";

import { useEffect, useState } from "react";
import {
  StepDiagram,
  useAnimationsEnabled,
  useCycle,
  type DiagramStep,
} from "./StepDiagram";

const SCALE = 75;
const CX = 220;
const CY = 165;
const MOVE_MS = 900;

const toX = (x: number) => CX + SCALE * x;
const toY = (y: number) => CY - SCALE * y;

interface Sample {
  id: string;
  crop: string;
  condition: string;
  x: number;
  y: number;
  confidence: number;
  ms: number;
  color: string;
}

const START = { x: 0, y: 0 };

const SAMPLES: Sample[] = [
  { id: "s1", crop: "Tomato", condition: "Healthy", x: 0.5, y: 1.3, confidence: 98.7, ms: 11, color: "#4a9c50" },
  { id: "s2", crop: "Tomato", condition: "Early Blight", x: 1.3, y: 0.0, confidence: 96.1, ms: 14, color: "#c4882e" },
  { id: "s3", crop: "Potato", condition: "Late Blight", x: 0.5, y: -1.3, confidence: 93.4, ms: 18, color: "#7a5033" },
  { id: "s4", crop: "Corn", condition: "Common Rust", x: -1.0, y: -0.8, confidence: 97.2, ms: 13, color: "#b84c3a" },
  { id: "s5", crop: "Apple", condition: "Black Rot", x: -1.2, y: 0.6, confidence: 94.8, ms: 16, color: "#5a4a3a" },
];

const MAX_CONFIDENCE = Math.max(...SAMPLES.map((s) => s.confidence));

const waypoints = [START, ...SAMPLES];

function Scene({ active, animate }: { active: number; animate: boolean }) {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const id = requestAnimationFrame(() => setReady(true));
    return () => cancelAnimationFrame(id);
  }, []);

  const scannerAt = ready ? waypoints[active + 1] : START;
  const move = animate ? `${MOVE_MS}ms` : "0ms";

  return (
    <svg
      viewBox="0 0 440 330"
      role="img"
      aria-label="Crop classification results showing five samples analyzed by the model"
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

      <text x={toX(-2.0)} y={toY(1.85)} fontSize={10} fill="#8d8d88">
        ResNet-18 · PlantVillage
      </text>

      {Array.from({ length: 5 }, (_, i) => i - 2).map((g) => (
        <g key={g} stroke="#e4e4e0" strokeWidth={1}>
          <line x1={toX(g)} y1={toY(2.1)} x2={toX(g)} y2={toY(-2.1)} />
          <line x1={toX(-2.1)} y1={toY(g)} x2={toX(2.1)} y2={toY(g)} />
        </g>
      ))}

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

      {SAMPLES.map((sample, i) => {
        const from = waypoints[i];
        const x1 = toX(from.x);
        const y1 = toY(from.y);
        const x2 = toX(sample.x);
        const y2 = toY(sample.y);
        const length = Math.hypot(x2 - x1, y2 - y1);
        return (
          <line
            key={sample.id}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke="#5b84b8"
            strokeWidth={2}
            strokeLinecap="round"
            strokeDasharray={length}
            strokeDashoffset={i <= active && ready ? 0 : length}
            style={{
              transition: `stroke-dashoffset ${move} ease-in-out`,
            }}
          />
        );
      })}

      {SAMPLES.map((sample, i) => {
        const reached = i <= active;
        const current = i === active;
        return (
          <g key={sample.id}>
            {current && animate && (
              <circle
                cx={toX(sample.x)}
                cy={toY(sample.y)}
                r={9}
                fill="none"
                stroke={sample.color}
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
              cx={toX(sample.x)}
              cy={toY(sample.y)}
              r={9}
              fill={reached ? sample.color : "#f6f7f4"}
              stroke={reached ? sample.color : "#8d8d88"}
              strokeWidth={1.5}
              style={{ transition: "fill 400ms, stroke 400ms" }}
            />
            <text
              x={toX(sample.x)}
              y={toY(sample.y) + 3.5}
              textAnchor="middle"
              fontSize={10}
              fontWeight={600}
              fill={reached ? "#f6f7f4" : "#6f6f6c"}
            >
              {i + 1}
            </text>
            <text
              x={toX(sample.x)}
              y={toY(sample.y) + 22}
              textAnchor="middle"
              fontSize={9}
              fill="#7a7a76"
            >
              {sample.crop}
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
        model
      </text>

      <g
        style={{
          transform: `translate(${toX(scannerAt.x)}px, ${toY(scannerAt.y)}px)`,
          transition: `transform ${move} ease-in-out`,
        }}
      >
        <circle r={8} fill="#37352f" />
        <circle r={3} fill="#e8ebe0" />
      </g>
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
      <span className="mt-3 flex items-center gap-3 font-sans text-xs text-gray-500">
        <span className="w-16 shrink-0">confidence</span>
        <span className="h-1.5 flex-1 bg-gray-300">
          <span
            className="block h-full"
            style={{
              width: `${(sample.confidence / MAX_CONFIDENCE) * 100}%`,
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
