import path from "path";
import fs from "fs";
import type {
  Quote,
  Fact,
  Heuristic,
  Project,
  Arsenal,
  StudioLink,
  DiningCategory,
} from "@/types/data";

const dataDir = path.join(process.cwd(), "content", "data");

function loadJson<T>(category: string, filename: string): T {
  const filePath = path.join(dataDir, category, `${filename}.json`);
  let raw: string;
  try {
    raw = fs.readFileSync(filePath, "utf8");
  } catch {
    throw new Error(`Data file not found: ${filePath}`);
  }
  try {
    return JSON.parse(raw) as T;
  } catch (error) {
    throw new Error(
      `Failed to parse JSON in ${filePath}: ${(error as Error).message}`
    );
  }
}

// Personal data
export function getQuotes(): Quote[] {
  return loadJson<Quote[]>("personal", "quotes");
}

export function getFacts(): Fact[] {
  return loadJson<Fact[]>("personal", "facts");
}

export function getHeuristics(): Heuristic[] {
  return loadJson<Heuristic[]>("personal", "heuristics");
}

// Portfolio data
export function getProjects(): Project[] {
  return loadJson<Project[]>("portfolio", "projects");
}

export function getProject(slug: string): Project | undefined {
  return getProjects().find((p) => p.slug === slug);
}

export function getAllProjectSlugs(): string[] {
  return getProjects().map((p) => p.slug);
}

// Resources data
export function getArsenal(): Arsenal {
  return loadJson<Arsenal>("resources", "arsenal");
}

export function getStudioLinks(): StudioLink[] {
  return loadJson<StudioLink[]>("resources", "studio-links");
}

export function getTashkentDining(): DiningCategory[] {
  return loadJson<DiningCategory[]>("resources", "tashkent-dining");
}
