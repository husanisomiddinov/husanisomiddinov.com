import * as THREE from "three";
import { feature, mesh } from "topojson-client";
import type { GeometryCollection, Topology } from "topojson-specification";

const OCEAN = "#d3dac2";
const LAND = "#f7f7f2";
const GRATICULE = "rgba(91,101,41,0.10)";
const BORDER = "rgba(91,101,41,0.30)";
const COAST = "rgba(77,86,40,0.75)";

type Ring = number[][];
type Line = number[][];

/**
 * Source rings can cross the antimeridian (longitude jumps ~360 between neighbours). Unwrap them
 * into a continuous run, then draw copies at -360/0/+360 so the overhang lands on the far edge.
 */
function trace(ctx: CanvasRenderingContext2D, ring: Ring | Line, w: number, h: number) {
  const lngs: number[] = [];
  let offset = 0;
  ring.forEach(([lng], i) => {
    if (i > 0) {
      const delta = lng + offset - lngs[i - 1];
      if (delta > 180) offset -= 360;
      else if (delta < -180) offset += 360;
    }
    lngs.push(lng + offset);
  });
  for (const shift of [-360, 0, 360]) {
    ring.forEach(([, lat], i) => {
      const x = ((lngs[i] + shift + 180) / 360) * w;
      const y = ((90 - lat) / 180) * h;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
  }
}

/** Paints the equirectangular world in the site's palette; the sphere UVs map 1:1 onto it. */
export async function buildGlobeTexture(
  url: string,
  width: number,
  maxAnisotropy: number,
): Promise<THREE.CanvasTexture> {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Globe: ${url} responded ${response.status}`);
  const topology = (await response.json()) as Topology;
  const countries = topology.objects.countries as GeometryCollection;

  const height = width / 2;
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Globe: 2D canvas unavailable");
  const px = width / 8192;

  ctx.fillStyle = OCEAN;
  ctx.fillRect(0, 0, width, height);

  ctx.strokeStyle = GRATICULE;
  ctx.lineWidth = 1.5 * px;
  ctx.beginPath();
  for (let lng = -180; lng <= 180; lng += 15) trace(ctx, [[lng, -90], [lng, 90]], width, height);
  for (let lat = -75; lat <= 75; lat += 15) trace(ctx, [[-180, lat], [180, lat]], width, height);
  ctx.stroke();

  ctx.fillStyle = LAND;
  ctx.beginPath();
  for (const country of feature(topology, countries).features) {
    const g = country.geometry;
    if (!g) continue;
    const polygons = g.type === "Polygon" ? [g.coordinates] : g.type === "MultiPolygon" ? g.coordinates : [];
    for (const polygon of polygons) {
      for (const ring of polygon) {
        trace(ctx, ring, width, height);
        ctx.closePath();
      }
    }
  }
  ctx.fill("evenodd");

  const strokeMesh = (geometry: ReturnType<typeof mesh>, color: string, lineWidth: number) => {
    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth * px;
    ctx.lineJoin = "round";
    ctx.beginPath();
    for (const line of geometry.coordinates) trace(ctx, line, width, height);
    ctx.stroke();
  };
  strokeMesh(mesh(topology, countries, (a, b) => a !== b), BORDER, 1.6);
  strokeMesh(mesh(topology, countries, (a, b) => a === b), COAST, 2.4);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = maxAnisotropy;
  texture.wrapS = THREE.RepeatWrapping;
  texture.needsUpdate = true;
  return texture;
}
