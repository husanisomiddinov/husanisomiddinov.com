export interface Quote {
  quote: string;
  author: string;
}

export type Fact = string;

export type Heuristic = string;

export type ProjectKind = "robotics" | "ml" | "web";

type ProjectStatus = "completed" | "in-progress" | "planned";

interface ProjectLinks {
  github?: string;
  live?: string;
  twitter?: string;
}

export interface ProjectPainting {
  src: string;
  credit: string;
  width: number;
  height: number;
}

interface ProjectPaper {
  title: string;
  notes?: string;
}

export interface Project {
  slug: string;
  kind: ProjectKind;
  title: string;
  summary: string;
  description?: string;
  tech?: string[];
  date?: string;
  status?: ProjectStatus;
  links?: ProjectLinks;
  painting?: ProjectPainting;
  papers?: ProjectPaper[];
}

interface ArsenalItem {
  name: string;
  description: string;
}

export interface Arsenal {
  software: ArsenalItem[];
  hardware: ArsenalItem[];
}

export interface StudioLink {
  name: string;
  description?: string;
  url: string;
}

interface DiningPlace {
  name: string;
  description: string;
}

export interface DiningCategory {
  category: string;
  places: DiningPlace[];
}
