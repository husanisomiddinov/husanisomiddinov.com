import * as THREE from "three";
import { feature, mesh } from "topojson-client";
import type { GeometryCollection, Topology } from "topojson-specification";

const OCEAN = "#d3dac2";
const LAND = "#f7f7f2";
const GRATICULE = "rgba(91,101,41,0.10)";
const BORDER = "rgba(91,101,41,0.30)";
const COAST = "rgba(77,86,40,0.75)";

/** A polyline with longitudes unwrapped to be continuous, plus its bounds for culling. */
interface Path {
  pts: number[][];
  minLng: number;
  maxLng: number;
  minLat: number;
  maxLat: number;
}

export interface World {
  land: Path[];
  borders: Path[];
  coast: Path[];
}

/** Degrees of longitude/latitude covered by a canvas, top-left at (lngMin, latMax). */
export interface View {
  lngMin: number;
  lngMax: number;
  latMin: number;
  latMax: number;
}

export const FULL_VIEW: View = { lngMin: -180, lngMax: 180, latMin: -90, latMax: 90 };

export interface LineWidths {
  graticule: number;
  border: number;
  coast: number;
}

/**
 * Source rings can cross the antimeridian (longitude jumps ~360 between neighbours). Unwrapping
 * makes them continuous; paint() then draws -360/0/+360 copies so the overhang lands on the far edge.
 */
function toPath(line: number[][]): Path {
  const pts: number[][] = [];
  let offset = 0;
  let minLng = Infinity;
  let maxLng = -Infinity;
  let minLat = Infinity;
  let maxLat = -Infinity;
  line.forEach(([lng, lat], i) => {
    if (i > 0) {
      const delta = lng + offset - pts[i - 1][0];
      if (delta > 180) offset -= 360;
      else if (delta < -180) offset += 360;
    }
    const unwrapped = lng + offset;
    pts.push([unwrapped, lat]);
    if (unwrapped < minLng) minLng = unwrapped;
    if (unwrapped > maxLng) maxLng = unwrapped;
    if (lat < minLat) minLat = lat;
    if (lat > maxLat) maxLat = lat;
  });
  return { pts, minLng, maxLng, minLat, maxLat };
}

export async function loadWorld(url: string): Promise<World> {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Globe: ${url} responded ${response.status}`);
  const topology = (await response.json()) as Topology;
  const countries = topology.objects.countries as GeometryCollection;

  const land: Path[] = [];
  for (const country of feature(topology, countries).features) {
    const g = country.geometry;
    if (!g) continue;
    const polygons = g.type === "Polygon" ? [g.coordinates] : g.type === "MultiPolygon" ? g.coordinates : [];
    for (const polygon of polygons) for (const ring of polygon) land.push(toPath(ring));
  }
  return {
    land,
    borders: mesh(topology, countries, (a, b) => a !== b).coordinates.map(toPath),
    coast: mesh(topology, countries, (a, b) => a === b).coordinates.map(toPath),
  };
}

const SHIFTS = [-360, 0, 360];

function tracePaths(ctx: CanvasRenderingContext2D, paths: Path[], view: View, sx: number, sy: number) {
  for (const path of paths) {
    if (path.maxLat < view.latMin || path.minLat > view.latMax) continue;
    for (const shift of SHIFTS) {
      if (path.maxLng + shift < view.lngMin || path.minLng + shift > view.lngMax) continue;
      path.pts.forEach(([lng, lat], i) => {
        const x = (lng + shift - view.lngMin) * sx;
        const y = (view.latMax - lat) * sy;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
    }
  }
}

function graticuleStep(span: number): number {
  if (span > 60) return 15;
  if (span > 20) return 5;
  if (span > 6) return 1;
  if (span > 2) return 0.25;
  return 0.05;
}

/** Paints `view` of the world onto `canvas` in the site's palette (equirectangular). */
export function paintWorld(canvas: HTMLCanvasElement, world: World, view: View, widths: LineWidths) {
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Globe: 2D canvas unavailable");
  const sx = canvas.width / (view.lngMax - view.lngMin);
  const sy = canvas.height / (view.latMax - view.latMin);

  ctx.fillStyle = OCEAN;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const step = graticuleStep(Math.max(view.lngMax - view.lngMin, view.latMax - view.latMin));
  ctx.strokeStyle = GRATICULE;
  ctx.lineWidth = widths.graticule;
  ctx.beginPath();
  for (let lng = Math.ceil(view.lngMin / step) * step; lng <= view.lngMax; lng += step) {
    const x = (lng - view.lngMin) * sx;
    ctx.moveTo(x, 0);
    ctx.lineTo(x, canvas.height);
  }
  for (let lat = Math.ceil(view.latMin / step) * step; lat <= view.latMax; lat += step) {
    if (Math.abs(lat) >= 90) continue;
    const y = (view.latMax - lat) * sy;
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y);
  }
  ctx.stroke();

  ctx.fillStyle = LAND;
  ctx.beginPath();
  tracePaths(ctx, world.land, view, sx, sy);
  ctx.fill("evenodd");

  ctx.lineJoin = "round";
  ctx.strokeStyle = BORDER;
  ctx.lineWidth = widths.border;
  ctx.beginPath();
  tracePaths(ctx, world.borders, view, sx, sy);
  ctx.stroke();

  ctx.strokeStyle = COAST;
  ctx.lineWidth = widths.coast;
  ctx.beginPath();
  tracePaths(ctx, world.coast, view, sx, sy);
  ctx.stroke();
}

export function makeTexture(canvas: HTMLCanvasElement, maxAnisotropy: number): THREE.CanvasTexture {
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = maxAnisotropy;
  texture.needsUpdate = true;
  return texture;
}

/** The whole-earth base texture; sphere UVs map 1:1 onto it. */
export function buildGlobeTexture(world: World, width: number, maxAnisotropy: number): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = width / 2;
  const px = width / 8192;
  paintWorld(canvas, world, FULL_VIEW, { graticule: 1.5 * px, border: 1.6 * px, coast: 2.4 * px });
  const texture = makeTexture(canvas, maxAnisotropy);
  texture.wrapS = THREE.RepeatWrapping;
  return texture;
}
