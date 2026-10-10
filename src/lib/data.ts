import path from "path";
import fs from "fs";
import type {
  Quote,
  Fact,
  Heuristic,
  Project,
  Arsenal,
  StudioLink,
  Experience,
  Place,
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

export function getExperiences(): Experience[] {
  return loadJson<Experience[]>("personal", "experiences");
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

const VISIT_DATE = /^\d{4}(-\d{2}(-\d{2})?)?$/;

/** Places I've been, newest visit first within each place. Fails loudly on bad data. */
export function getPlaces(): Place[] {
  const places = loadJson<Place[]>("personal", "places");
  const seen = new Set<string>();
  return places.map((place) => {
    const where = `places.json "${place.slug ?? place.name}"`;
    if (seen.has(place.slug)) throw new Error(`${where}: duplicate slug`);
    seen.add(place.slug);
    if (!(place.lat >= -90 && place.lat <= 90) || !(place.lng >= -180 && place.lng <= 180)) {
      throw new Error(`${where}: lat/lng out of range`);
    }
    if (!place.visits?.length) throw new Error(`${where}: needs at least one visit`);
    for (const visit of place.visits) {
      if (visit.date !== undefined && !VISIT_DATE.test(visit.date)) {
        throw new Error(`${where}: bad date "${visit.date}" (use YYYY, YYYY-MM or YYYY-MM-DD)`);
      }
    }
    return {
      ...place,
      // Newest first; visits without a date go last, in their given order.
      visits: [...place.visits].sort((a, b) => (b.date ?? "").localeCompare(a.date ?? "")),
    };
  });
}
