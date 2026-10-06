import type { ComponentType } from "react";
import { ExecutionFlowDiagram } from "./ExecutionFlowDiagram";
import { NavigationResultsDiagram } from "./NavigationResultsDiagram";

/** Diagrams a project description can embed with a `[[diagram:name]]` line. */
export const DIAGRAMS: Record<string, ComponentType> = {
  "execution-flow": ExecutionFlowDiagram,
  "navigation-results": NavigationResultsDiagram,
};
