import type { ComponentType } from "react";
import {
  ExecutionFlowDiagram,
  ExecutionFlowPreview,
} from "./ExecutionFlowDiagram";
import {
  NavigationResultsDiagram,
} from "./NavigationResultsDiagram";
import {
  InferencePipelineDiagram,
  InferencePipelinePreview,
} from "./InferencePipelineDiagram";
import {
  CropClassificationDiagram,
} from "./CropClassificationDiagram";

/** Diagrams a project description can embed with a `[[diagram:name]]` line. */
export const DIAGRAMS: Record<string, ComponentType> = {
  "execution-flow": ExecutionFlowDiagram,
  "navigation-results": NavigationResultsDiagram,
  "inference-pipeline": InferencePipelineDiagram,
  "crop-classification": CropClassificationDiagram,
};

/** Auto-playing, non-interactive versions for project cards; aspect is width / height. */
export const DIAGRAM_PREVIEWS: Record<
  string,
  { Component: ComponentType; aspect: number }
> = {
  "execution-flow": { Component: ExecutionFlowPreview, aspect: 760 / 290 },
  "inference-pipeline": {
    Component: InferencePipelinePreview,
    aspect: 760 / 270,
  },
};
