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

export interface Experience {
  slug: string;
  name: string;
  role: string;
  date: string;
  description: string;
  logo: string;
  url?: string;
}

interface DiningPlace {
  name: string;
  description: string;
}

export interface DiningCategory {
  category: string;
  places: DiningPlace[];
}
