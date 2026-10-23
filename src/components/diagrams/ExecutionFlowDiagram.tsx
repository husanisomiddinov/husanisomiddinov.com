import {
  DiagramFigure,
  DiagramSvg,
  FlowArrow,
  Group,
  HArrow,
  INK,
  LOOP,
  MUTED,
  Tile,
} from "./FlowKit";

const ROW_Y = 72;
const ROW_MID = ROW_Y + 28;
const LOOP_Y = 232;
const GAZEBO_X = 318;
const GAZEBO_W = 116;
const MAPS_X = 630;
const MAPS_W = 120;

/** A lidar puck: the sweep line turns while Gazebo streams scans. */
function Lidar({ cx, cy }: { cx: number; cy: number }) {
  return (
    <g>
      <circle cx={cx} cy={cy} r={7} fill="none" stroke="#a89a5b" strokeWidth={1.25} />
      <line
        x1={cx}
        y1={cy}
        x2={cx + 7}
        y2={cy}
        stroke="#8a6d1a"
        strokeWidth={1.5}
        strokeLinecap="round"
        className="diagram-sweep"
        style={{ transformOrigin: `${cx}px ${cy}px` }}
      />
    </g>
  );
}

function Scene({ wide }: { wide?: boolean }) {
  const gazeboMid = GAZEBO_X + GAZEBO_W / 2;
  const mapsMid = MAPS_X + MAPS_W / 2;
  return (
    <DiagramSvg
      width={760}
      height={290}
      label="Diagram of the ROS2 pipeline: a Docker build, then Gazebo streaming scans into SLAM Toolbox, which saves a map that Nav2 loads to drive five goals"
      wide={wide}
    >
      <Group x={142} y={22} w={468} h={126} title="Docker container" sub="ROS2 Humble" />

      <Tile x={14} y={ROW_Y} w={96} title="docker" sub="compose up" />
      <Tile x={158} y={ROW_Y} w={116} title="colcon build" sub="md25010_nav" />
      <Tile x={GAZEBO_X} y={ROW_Y} w={GAZEBO_W} title="Gazebo" sub="TurtleBot3 sim">
        <Lidar cx={GAZEBO_X + 16} cy={ROW_Y + 16} />
      </Tile>
      <Tile x={478} y={ROW_Y} w={116} title="SLAM Toolbox" sub="lifelong mode" hot />
      <Tile x={MAPS_X} y={ROW_Y} w={MAPS_W} title="maps/ volume" sub=".pgm .yaml .csv" />

      <HArrow x1={110} x2={158} y={ROW_MID} />
      <HArrow x1={274} x2={GAZEBO_X} y={ROW_MID} />
      <HArrow x1={434} x2={478} y={ROW_MID} label="scan" />
      <HArrow x1={594} x2={MAPS_X} y={ROW_MID} />

      {/* Back around the bottom: Nav2 loads the saved map and drives the goals in Gazebo. */}
      <FlowArrow
        color={LOOP}
        head={false}
        points={[
          [mapsMid, ROW_Y + 56 + 8],
          [mapsMid, LOOP_Y],
          [580, LOOP_Y],
        ]}
      />
      <FlowArrow
        color={LOOP}
        points={[
          [404, LOOP_Y],
          [gazeboMid, LOOP_Y],
          [gazeboMid, ROW_Y + 56 + 6],
        ]}
      />
      <text x={492} y={LOOP_Y - 2} textAnchor="middle" fontSize={13} fontWeight={700} fill={INK} className="font-mono">
        Navigate
      </text>
      <text x={492} y={LOOP_Y + 16} textAnchor="middle" fontSize={10.5} fill={MUTED} className="font-mono">
        Nav2 loads the map, drives 5 goals
      </text>
    </DiagramSvg>
  );
}

export function ExecutionFlowDiagram() {
  return (
    <DiagramFigure
      caption={
        <>
          How data moves through the pipeline, from <strong>container build</strong> to autonomous
          navigation.
        </>
      }
    >
      <Scene wide />
    </DiagramFigure>
  );
}

export function ExecutionFlowPreview() {
  return <Scene />;
}
