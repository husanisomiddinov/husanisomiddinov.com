import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { buildGlobeTexture } from "./globeTexture";

export interface GlobePlace {
  slug: string;
  lat: number;
  lng: number;
  visits: number;
}

/** Where a place currently sits in the host's pixel space. `facing` is false on the far side. */
export interface ProjectedPlace {
  slug: string;
  x: number;
  y: number;
  facing: boolean;
}

export interface GlobeHandlers {
  onHover(slug: string | null): void;
  /** A click/tap on a dot, or `null` for a click on empty space. */
  onPick(slug: string | null): void;
  /** Called every frame so React can move overlays without re-rendering. */
  onProject(places: ProjectedPlace[], distance: number): void;
  onReady(): void;
  onUnavailable(error: unknown): void;
}

export interface GlobeScene {
  flyTo(slug: string): void;
  dispose(): void;
}

const MAP_URL = "/data/countries-50m.json";
const DEFAULT_DISTANCE = 4.4;
const MIN_DISTANCE = 1.04;
const MAX_DISTANCE = 7;
const DOT_COLOR = 0x5b6529;
const CLICK_SLOP_PX = 5;

export function latLngToVector(lat: number, lng: number, radius = 1): THREE.Vector3 {
  const phi = THREE.MathUtils.degToRad(lat);
  const theta = THREE.MathUtils.degToRad(lng);
  return new THREE.Vector3(
    radius * Math.cos(phi) * Math.cos(theta),
    radius * Math.sin(phi),
    -radius * Math.cos(phi) * Math.sin(theta),
  );
}

/** Dot radius on the unit globe: one visit is small, each doubling adds a fixed step. */
function dotRadius(visits: number): number {
  return Math.min(0.045, 0.016 * (1 + 0.6 * Math.log2(visits)));
}

interface Marker {
  place: GlobePlace;
  normal: THREE.Vector3;
  group: THREE.Group;
  hit: THREE.Mesh;
  baseRadius: number;
  hover: number;
  projected: ProjectedPlace;
}

/** Owns only GPU resources and pointer input. React owns the hovered/pinned place and the overlays. */
export function createGlobeScene(
  host: HTMLElement,
  places: GlobePlace[],
  handlers: GlobeHandlers,
  initialSlug: string | undefined,
): GlobeScene {
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.setClearColor(0, 0);
  host.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(35, 1, 0.01, 30);

  const initial = places.find((p) => p.slug === initialSlug) ?? places[0];
  const start = initial ? latLngToVector(initial.lat, initial.lng) : new THREE.Vector3(1, 0.3, 0);
  camera.position.copy(start.clone().setY(start.y * 0.6 + 0.25).normalize().multiplyScalar(DEFAULT_DISTANCE));

  // The light rides with the camera so the lit side always faces the viewer.
  scene.add(camera);
  camera.add(new THREE.HemisphereLight(0xffffff, 0xb9bfa6, 1.9));
  const sun = new THREE.DirectionalLight(0xfff7e8, 1.7);
  sun.position.set(-2.5, 3, 4);
  camera.add(sun);

  const globeGeometry = new THREE.SphereGeometry(1, 192, 128);
  const globeMaterial = new THREE.MeshLambertMaterial({ color: 0xffffff });
  const globe = new THREE.Mesh(globeGeometry, globeMaterial);
  scene.add(globe);

  const discGeometry = new THREE.CircleGeometry(1, 40);
  const haloMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff, depthWrite: false });
  const dotMaterial = new THREE.MeshBasicMaterial({ color: DOT_COLOR, depthWrite: false });
  const hitMaterial = new THREE.MeshBasicMaterial({ visible: false });

  const markers: Marker[] = places.map((place) => {
    const normal = latLngToVector(place.lat, place.lng);
    const group = new THREE.Group();
    group.position.copy(normal).multiplyScalar(1.004);
    group.lookAt(normal.clone().multiplyScalar(2));

    const halo = new THREE.Mesh(discGeometry, haloMaterial);
    halo.scale.setScalar(1.4);
    halo.renderOrder = 2;
    const dot = new THREE.Mesh(discGeometry, dotMaterial);
    dot.position.z = 0.0005;
    dot.renderOrder = 3;
    const hit = new THREE.Mesh(discGeometry, hitMaterial);
    hit.position.z = 0.001;
    hit.userData.slug = place.slug;
    group.add(halo, dot, hit);
    scene.add(group);

    return {
      place,
      normal,
      group,
      hit,
      baseRadius: dotRadius(place.visits),
      hover: 0,
      projected: { slug: place.slug, x: 0, y: 0, facing: false },
    };
  });
  const projected = markers.map((m) => m.projected);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enablePan = false;
  controls.enableDamping = true;
  controls.dampingFactor = 0.08;
  controls.minDistance = MIN_DISTANCE;
  controls.maxDistance = MAX_DISTANCE;
  controls.autoRotate = !reducedMotion;
  controls.autoRotateSpeed = 0.45;
  controls.zoomSpeed = 0.9;

  const stopAutoRotate = () => {
    controls.autoRotate = false;
  };
  controls.addEventListener("start", stopAutoRotate);

  // Pointer handling: hover is resolved once per frame; a press that barely moved is a click.
  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();
  let pointerInside = false;
  let pointerDirty = false;
  let downAt: { x: number; y: number } | null = null;
  let hovered: Marker | null = null;

  const setPointer = (event: PointerEvent) => {
    const rect = renderer.domElement.getBoundingClientRect();
    pointer.set(
      ((event.clientX - rect.left) / rect.width) * 2 - 1,
      -((event.clientY - rect.top) / rect.height) * 2 + 1,
    );
  };

  const pickMarker = (): Marker | null => {
    raycaster.setFromCamera(pointer, camera);
    const hits = raycaster.intersectObjects([globe, ...markers.map((m) => m.hit)], false);
    const first = hits[0];
    if (!first || first.object === globe) return null;
    return markers.find((m) => m.hit === first.object) ?? null;
  };

  const setHovered = (marker: Marker | null) => {
    if (marker === hovered) return;
    hovered = marker;
    renderer.domElement.style.cursor = marker ? "pointer" : "";
    handlers.onHover(marker?.place.slug ?? null);
  };

  const onPointerMove = (event: PointerEvent) => {
    pointerInside = true;
    pointerDirty = true;
    setPointer(event);
  };
  const onPointerLeave = () => {
    pointerInside = false;
    setHovered(null);
  };
  const onPointerDown = (event: PointerEvent) => {
    downAt = { x: event.clientX, y: event.clientY };
    setPointer(event);
  };
  const onPointerUp = (event: PointerEvent) => {
    if (!downAt) return;
    const moved = Math.hypot(event.clientX - downAt.x, event.clientY - downAt.y);
    downAt = null;
    if (moved > CLICK_SLOP_PX) return;
    setPointer(event);
    const marker = pickMarker();
    if (marker) flyTo(marker.place.slug);
    handlers.onPick(marker?.place.slug ?? null);
  };
  const el = renderer.domElement;
  el.addEventListener("pointermove", onPointerMove);
  el.addEventListener("pointerleave", onPointerLeave);
  el.addEventListener("pointerdown", onPointerDown);
  el.addEventListener("pointerup", onPointerUp);

  // Camera fly-to: ease the viewing direction (and distance) toward a place.
  let fly: {
    from: THREE.Vector3;
    to: THREE.Vector3;
    fromDistance: number;
    toDistance: number;
    startedAt: number;
  } | null = null;

  function flyTo(slug: string) {
    const marker = markers.find((m) => m.place.slug === slug);
    if (!marker) return;
    stopAutoRotate();
    const distance = camera.position.length();
    const toDistance = Math.min(distance, 2.1);
    const to = marker.normal.clone();
    if (reducedMotion) {
      camera.position.copy(to.multiplyScalar(toDistance));
      return;
    }
    fly = {
      from: camera.position.clone().normalize(),
      to,
      fromDistance: distance,
      toDistance,
      startedAt: performance.now(),
    };
  }

  const FLY_MS = 1100;
  const stepFly = (now: number) => {
    if (!fly) return;
    const t = Math.min(1, (now - fly.startedAt) / FLY_MS);
    const eased = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    const q = new THREE.Quaternion().setFromUnitVectors(fly.from, fly.to);
    const step = new THREE.Quaternion().identity().slerp(q, eased);
    const dir = fly.from.clone().applyQuaternion(step);
    camera.position.copy(dir.multiplyScalar(THREE.MathUtils.lerp(fly.fromDistance, fly.toDistance, eased)));
    if (t >= 1) fly = null;
  };
  // A user drag cancels a flight in progress.
  controls.addEventListener("start", () => {
    fly = null;
  });

  const resize = () => {
    const { clientWidth: w, clientHeight: h } = host;
    if (!w || !h) return;
    renderer.setSize(w, h);
    camera.aspect = w / h;
    // Keep the whole globe in frame on narrow (portrait) hosts.
    camera.fov = w / h < 1 ? 35 / Math.max(0.6, w / h) : 35;
    camera.updateProjectionMatrix();
  };
  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(host);
  resize();

  const tmp = new THREE.Vector3();

  const frame = (now: number) => {
    stepFly(now);
    controls.update();

    const distance = camera.position.length();
    // Near plane tracks the surface so close zooms don't clip the globe.
    camera.near = Math.max(0.002, (distance - 1) * 0.4);
    camera.updateProjectionMatrix();
    // Rotation and zoom slow down as the surface gets closer.
    const closeness = THREE.MathUtils.clamp((distance - 1) / (DEFAULT_DISTANCE - 1), 0.04, 1);
    controls.rotateSpeed = 0.15 + 0.85 * closeness;
    controls.zoomSpeed = 0.5 + 0.6 * closeness;

    if (pointerInside && pointerDirty && !downAt) {
      pointerDirty = false;
      setHovered(pickMarker());
    }

    const zoomScale = THREE.MathUtils.clamp((distance - 1) / 2.6, 0.18, 1);
    const w = host.clientWidth;
    const h = host.clientHeight;
    for (const marker of markers) {
      const target = marker === hovered ? 1 : 0;
      marker.hover += (target - marker.hover) * 0.2;
      const radius = marker.baseRadius * zoomScale * (1 + 0.3 * marker.hover);
      marker.group.scale.setScalar(radius);
      marker.hit.scale.setScalar(Math.max(1.7, 0.012 / radius));

      tmp.copy(marker.group.position).project(camera);
      marker.projected.x = ((tmp.x + 1) / 2) * w;
      marker.projected.y = ((1 - tmp.y) / 2) * h;
      // A point on the unit sphere is visible when n·camera > 1; the margin hides overlays before the limb.
      marker.projected.facing = marker.normal.dot(camera.position) > 1.03;
    }
    handlers.onProject(projected, distance);

    renderer.render(scene, camera);
  };

  let raf = 0;
  let running = false;
  const loop = (now: number) => {
    frame(now);
    raf = requestAnimationFrame(loop);
  };
  const setRunning = (on: boolean) => {
    if (on === running) return;
    running = on;
    if (on) raf = requestAnimationFrame(loop);
    else cancelAnimationFrame(raf);
  };
  let visible = true;
  const syncRunning = () => setRunning(visible && !document.hidden);
  const intersection = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    syncRunning();
  });
  intersection.observe(host);
  document.addEventListener("visibilitychange", syncRunning);

  let disposed = false;
  let texture: THREE.Texture | null = null;
  const width = Math.min(
    renderer.capabilities.maxTextureSize,
    window.innerWidth < 768 ? 4096 : 8192,
  );
  buildGlobeTexture(MAP_URL, width, renderer.capabilities.getMaxAnisotropy())
    .then((built) => {
      if (disposed) {
        built.dispose();
        return;
      }
      texture = built;
      globeMaterial.map = built;
      globeMaterial.needsUpdate = true;
      handlers.onReady();
      syncRunning();
    })
    .catch((error) => {
      if (!disposed) handlers.onUnavailable(error);
    });

  return {
    flyTo,
    dispose() {
      disposed = true;
      setRunning(false);
      intersection.disconnect();
      resizeObserver.disconnect();
      document.removeEventListener("visibilitychange", syncRunning);
      el.removeEventListener("pointermove", onPointerMove);
      el.removeEventListener("pointerleave", onPointerLeave);
      el.removeEventListener("pointerdown", onPointerDown);
      el.removeEventListener("pointerup", onPointerUp);
      controls.dispose();
      texture?.dispose();
      for (const geometry of [globeGeometry, discGeometry]) geometry.dispose();
      for (const material of [globeMaterial, haloMaterial, dotMaterial, hitMaterial]) {
        material.dispose();
      }
      renderer.dispose();
      renderer.domElement.remove();
    },
  };
}
