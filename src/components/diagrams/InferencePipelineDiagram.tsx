import {
  DiagramFigure,
  DiagramSvg,
  EndLabel,
  FlowArrow,
  Group,
  HArrow,
  INK,
  Tile,
} from "./FlowKit";

const ROW_Y = 150;
const ROW_MID = ROW_Y + 28;
const LEAF = "M0-15 Q14-8 11 8 Q6 18 0 20 Q-6 18-11 8 Q-14-8 0-15Z";
const SCORES = [0.3, 0.18, 0.92, 0.22, 0.12, 0.26];

/** A stack of photos with a scan line crossing the front one. */
function PhotoStack({ cx, cy }: { cx: number; cy: number }) {
  return (
    <g>
      <rect x={cx - 30} y={cy - 36} width={56} height={56} rx={8} fill="#ecede6" stroke="#d3d5c8" />
      <rect x={cx - 36} y={cy - 28} width={56} height={56} rx={8} fill="#ecede6" stroke="#d3d5c8" />
      <g transform={`translate(${cx - 12} ${cy})`}>
        <rect x={-32} y={-28} width={56} height={56} rx={8} fill="#f6f7f4" stroke="#bfc2b2" strokeWidth={1.25} />
        <g transform="translate(-4 0)">
          <path d={LEAF} fill="#8da05a" fillOpacity={0.8} />
          <line x1={0} y1={-12} x2={0} y2={22} stroke="#5b6529" strokeWidth={1.2} />
        </g>
        <line
          x1={-28}
          y1={-22}
          x2={20}
          y2={-22}
          stroke="#d4573b"
          strokeWidth={2}
          strokeLinecap="round"
          className="diagram-scan"
        />
      </g>
    </g>
  );
}

/** The model's verdict: a leaf and a row of class scores where one bar stands out. */
function Diagnosis({ cx, cy }: { cx: number; cy: number }) {
  return (
    <g>
      <g transform={`translate(${cx} ${cy - 22})`}>
        <path d={LEAF} fill="#c4882e" fillOpacity={0.85} />
        <circle cx={-3} cy={-3} r={2} fill="#37352f" fillOpacity={0.5} />
        <circle cx={4} cy={3} r={1.6} fill="#37352f" fillOpacity={0.5} />
      </g>
      {SCORES.map((score, i) => (
        <rect
          key={i}
          x={cx - 33 + i * 12}
          y={cy + 38 - score * 34}
          width={8}
          height={score * 34}
          rx={2}
          fill={i === 2 ? "#e3b341" : "#cfd1c4"}
          className="diagram-bar"
          style={{ animationDelay: `${i * 0.25}s` }}
        />
      ))}
      <text x={cx} y={cy + 56} textAnchor="middle" fontSize={10.5} fill={INK} className="font-mono">
        Tomato, Early Blight
      </text>
    </g>
  );
}

function Scene({ wide }: { wide?: boolean }) {
  return (
    <DiagramSvg
      width={760}
      height={270}
      label="Diagram of the crop inference pipeline: a leaf photo from the web app or Telegram bot goes to a FastAPI endpoint, is preprocessed, classified by ResNet-18 and returned as a diagnosis"
      wide={wide}
    >
      <Group x={104} y={22} w={500} h={214} title="FastAPI" sub="Serverless inference" />

      <EndLabel x={50} y={126}>Leaf photo</EndLabel>
      <PhotoStack cx={64} cy={ROW_MID + 4} />
      <EndLabel x={690} y={126}>Diagnosis</EndLabel>
      <Diagnosis cx={690} cy={ROW_MID + 4} />

      <Tile x={120} y={74} w={150} h={36} title="Web | Telegram bot" />
      <FlowArrow
        points={[
          [195, 114],
          [195, ROW_Y - 4],
        ]}
      />

      <Tile x={134} y={ROW_Y} w={122} title="POST /predict" sub="image upload" />
      <Tile x={300} y={ROW_Y} w={122} title="Preprocess" sub="224x224x3" />
      <Tile x={466} y={ROW_Y} w={122} title="ResNet-18" sub="ONNX Runtime" hot />

      <HArrow x1={98} x2={134} y={ROW_MID} />
      <HArrow x1={256} x2={300} y={ROW_MID} />
      <HArrow x1={422} x2={466} y={ROW_MID} />
      <HArrow x1={588} x2={636} y={ROW_MID} />
    </DiagramSvg>
  );
}

export function InferencePipelineDiagram() {
  return (
    <DiagramFigure
      caption={
        <>
          How an image moves through the system, from <strong>capture</strong> to crop diagnosis.
        </>
      }
    >
      <Scene wide />
    </DiagramFigure>
  );
}

export function InferencePipelinePreview() {
  return <Scene />;
}
