import type { ComponentType } from "react";
import {
  ExecutionFlowDiagram,
  ExecutionFlowPreview,
} from "./ExecutionFlowDiagram";
import {
  NavigationResultsDiagram,
  NavigationResultsPreview,
} from "./NavigationResultsDiagram";

/** Diagrams a project description can embed with a `[[diagram:name]]` line. */
export const DIAGRAMS: Record<string, ComponentType> = {
  "execution-flow": ExecutionFlowDiagram,
  "navigation-results": NavigationResultsDiagram,
};

/** Auto-playing, non-interactive versions for project cards; aspect is width / height. */
export const DIAGRAM_PREVIEWS: Record<
  string,
  { Component: ComponentType; aspect: number }
> = {
  "execution-flow": { Component: ExecutionFlowPreview, aspect: 760 / 290 },
  "navigation-results": {
    Component: NavigationResultsPreview,
    aspect: 440 / 330,
  },
};
