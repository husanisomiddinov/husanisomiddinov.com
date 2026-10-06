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
  images?: ProjectImage[];
  /** Images for the projects index card strip, in display order. */
  cover?: ProjectImage[];
}

export interface ProjectImage {
  src: string;
  alt: string;
  caption?: string;
  /** Description heading this image belongs under; it renders after that section's text. */
  section?: string;

  width: number;
  height: number;
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
  logoColor?: string;
  logoScale?: number;
  url?: string;
  /** Optional photo gallery: first image is the large one on the
   * left, the rest stack in a column on the right. Width/height are
   * each photo's real pixel dimensions, used to size both columns so
   * every photo renders at its true aspect ratio — nothing cropped. */
  images?: ExperienceImage[];
}

export interface ExperienceImage {
  src: string;
  width: number;
  height: number;
}

interface DiningPlace {
  name: string;
  description: string;
}

export interface DiningCategory {
  category: string;
  places: DiningPlace[];
}
