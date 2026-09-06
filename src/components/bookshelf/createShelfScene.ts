import * as THREE from "three";
import { getImageProps } from "next/image";
import type { ReadingShelfBook } from "@/types";

export interface ShelfScene {
  select(index: number): void;
  dispose(): void;
}

const BOOK_HEIGHT = 2.5;
const BOOK_SPACING = 0.38;
const CAMERA_TARGET_Y = 1.35;

function bookPose(index: number, selected: number) {
  const distance = index - selected;
  return {
    x:
      distance === 0 ? 0 : distance * BOOK_SPACING + Math.sign(distance) * 0.95,
    y: BOOK_HEIGHT / 2,
    z: distance === 0 ? 0.6 : -0.25,
    rotation: distance === 0 ? -0.2 : Math.PI / 2,
  };
}

/** Owns only GPU resources and pointer input. React owns the selected book. */
export function createShelfScene(
  host: HTMLElement,
  books: ReadingShelfBook[],
  initialIndex: number,
  onSelect: (index: number) => void,
  onUnavailable: (error: unknown) => void,
): ShelfScene {
  if (
    !Number.isInteger(initialIndex) ||
    initialIndex < 0 ||
    initialIndex >= books.length
  ) {
    throw new Error(
      `Bookshelf: invalid initial selection ${initialIndex} for ${books.length} books`,
    );
  }
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFShadowMap;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.1;
  renderer.setClearColor(0, 0);
  host.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-4, 4, 2.5, -2.5, 0.1, 40);
  camera.position.set(0, 3.6, 11);
  camera.lookAt(0, CAMERA_TARGET_Y, 0);
  scene.add(new THREE.HemisphereLight(0xffffff, 0x77746a, 1.8));
  const light = new THREE.DirectionalLight(0xfff6e7, 2.5);
  light.position.set(-3, 7, 5);
  light.castShadow = true;
  light.shadow.mapSize.set(1024, 1024);
  Object.assign(light.shadow.camera, {
    left: -7,
    right: 7,
    top: 5,
    bottom: -5,
  });
  light.shadow.normalBias = 0.03;
  light.shadow.bias = -0.0001;
  light.shadow.radius = 4;
  scene.add(light);

  const geometries = new Set<THREE.BufferGeometry>();
  const materials = new Set<THREE.Material>();
  const textures = new Set<THREE.Texture>();
  const geometry = (width: number, height: number, depth: number) => {
    const value = new THREE.BoxGeometry(width, height, depth);
    geometries.add(value);
    return value;
  };
  const material = (options: THREE.MeshStandardMaterialParameters) => {
    const value = new THREE.MeshStandardMaterial({
      roughness: 0.8,
      ...options,
    });
    materials.add(value);
    return value;
  };
  const canvasTexture = (
    width: number,
    height: number,
    draw: (ctx: CanvasRenderingContext2D) => void,
  ) => {
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx)
      throw new Error(
        "Bookshelf: a 2D canvas context is required for book lettering",
      );
    draw(ctx);
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
    textures.add(texture);
    return texture;
  };

  const paperTexture = canvasTexture(64, 256, (ctx) => {
    ctx.fillStyle = "#eeeadd";
    ctx.fillRect(0, 0, 64, 256);
    ctx.fillStyle = "#d5d0c2";
    for (let y = 0; y < 256; y += 4) ctx.fillRect(0, y, 64, 1);
  });
  const paper = material({ map: paperTexture });
  const floorMaterial = new THREE.ShadowMaterial({ opacity: 0.16 });
  materials.add(floorMaterial);
  const floorGeometry = new THREE.PlaneGeometry(100, 20);
  geometries.add(floorGeometry);
  const floor = new THREE.Mesh(floorGeometry, floorMaterial);
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = -0.035;
  floor.receiveShadow = true;
  scene.add(floor);
  const shelf = new THREE.Mesh(
    geometry(100, 0.035, 1.9),
    material({ color: 0xb9bbae, roughness: 1 }),
  );
  shelf.position.set(0, -0.06, -0.3);
  shelf.receiveShadow = true;
  scene.add(shelf);

  const boardGeometry = geometry(BOOK_HEIGHT * 0.65, BOOK_HEIGHT, 0.028);
  const volumes = books.map((book, index) => {
    const height = BOOK_HEIGHT;
    const width = height * 0.65;
    const thickness = 0.25 + (index % 3) * 0.035;
    const group = new THREE.Group();
    const cloth = material({ color: book.spineColor });
    const spineTexture = canvasTexture(128, 1024, (ctx) => {
      ctx.fillStyle = book.spineColor;
      ctx.fillRect(0, 0, 128, 1024);
      const gradient = ctx.createLinearGradient(0, 0, 128, 0);
      gradient.addColorStop(0, "rgba(0,0,0,.3)");
      gradient.addColorStop(0.25, "rgba(255,255,255,.08)");
      gradient.addColorStop(1, "rgba(0,0,0,.2)");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 128, 1024);
      ctx.fillStyle = book.textColor;
      ctx.globalAlpha = 0.55;
      ctx.fillRect(20, 44, 88, 2);
      ctx.fillRect(20, 950, 88, 2);
      ctx.globalAlpha = 1;
      ctx.save();
      ctx.translate(66, 80);
      ctx.rotate(Math.PI / 2);
      ctx.font = "500 39px Georgia";
      ctx.fillText(book.title, 0, 0, 780);
      ctx.restore();
      ctx.font = "24px Georgia";
      ctx.textAlign = "center";
      ctx.fillText(String(index + 1).padStart(2, "0"), 64, 995);
    });
    const spine = material({ map: spineTexture });
    const fallbackTexture = canvasTexture(384, 576, (ctx) => {
      ctx.fillStyle = book.spineColor;
      ctx.fillRect(0, 0, 384, 576);
      ctx.fillStyle = book.textColor;
      ctx.font = "32px Georgia";
      const words = book.title.split(" ");
      let line = "";
      let y = 100;
      for (const word of words) {
        if (ctx.measureText(`${line} ${word}`).width > 310 && line) {
          ctx.fillText(line, 32, y);
          y += 44;
          line = word;
        } else line = line ? `${line} ${word}` : word;
      }
      ctx.fillText(line, 32, y);
      ctx.font = "20px Georgia";
      ctx.fillText(book.author, 32, 512, 320);
    });
    const cover = material({ map: fallbackTexture });
    const body = new THREE.Mesh(
      geometry(width - 0.035, height - 0.05, thickness),
      [paper, spine, paper, paper, cloth, cloth],
    );
    group.add(body);
    const front = new THREE.Mesh(boardGeometry, [
      cloth,
      cloth,
      cloth,
      cloth,
      cover,
      cloth,
    ]);
    front.position.z = thickness / 2 + 0.014;
    group.add(front);
    const back = new THREE.Mesh(boardGeometry, cloth);
    back.position.z = -thickness / 2 - 0.014;
    group.add(back);
    group.traverse((object) => {
      if (object instanceof THREE.Mesh) {
        object.castShadow = true;
        object.receiveShadow = true;
      }
    });
    scene.add(group);
    return { group, cover, coverRequested: false };
  });

  let selected = initialIndex;
  let disposed = false;
  let frame = 0;
  let visible = true;
  let contextAvailable = true;
  let lastTime = 0;
  let halfWidth = 3;
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const loader = new THREE.TextureLoader();

  function loadCover(index: number) {
    const volume = volumes[index];
    if (!volume || volume.coverRequested) return;
    volume.coverRequested = true;
    const book = books[index];
    // Next's same-origin image optimizer avoids third-party WebGL CORS failures.
    const { props } = getImageProps({
      src: book.coverImage,
      alt: book.title,
      width: 256,
      height: 384,
    });
    loader.load(
      props.src,
      (texture) => {
        if (disposed) {
          texture.dispose();
          return;
        }
        texture.colorSpace = THREE.SRGBColorSpace;
        texture.anisotropy = Math.min(
          8,
          renderer.capabilities.getMaxAnisotropy(),
        );
        textures.add(texture);
        const fallbackTexture = volume.cover.map;
        volume.cover.map = texture;
        if (fallbackTexture) {
          textures.delete(fallbackTexture);
          fallbackTexture.dispose();
        }
        volume.cover.needsUpdate = true;
        invalidate();
      },
      undefined,
      (error) => {
        if (!disposed)
          console.warn(
            `Bookshelf: cover unavailable for ${book.slug}; using its titled cover`,
            error,
          );
      },
    );
  }

  function render(time: number) {
    frame = 0;
    if (disposed || !visible || !contextAvailable || document.hidden) return;
    const delta = Math.min((time - lastTime) / 1000, 0.05);
    lastTime = time;
    const blend = reducedMotion.matches ? 1 : 1 - Math.exp(-12 * delta);
    let moving = false;
    const edge = Math.max(0, halfWidth - 1.6);
    const cameraTarget =
      Math.max(0, edge - selected * BOOK_SPACING) -
      Math.max(0, edge - (books.length - 1 - selected) * BOOK_SPACING);
    const cameraShift = cameraTarget - camera.position.x;
    camera.position.x =
      Math.abs(cameraShift) < 0.001
        ? cameraTarget
        : camera.position.x + cameraShift * blend;
    camera.lookAt(camera.position.x, CAMERA_TARGET_Y, 0);
    moving ||= Math.abs(cameraShift) > 0.001;
    volumes.forEach(({ group }, index) => {
      const { x, y, z, rotation } = bookPose(index, selected);
      for (const [axis, target] of [
        ["x", x],
        ["y", y],
        ["z", z],
      ] as const) {
        const difference = target - group.position[axis];
        group.position[axis] =
          Math.abs(difference) < 0.001
            ? target
            : group.position[axis] + difference * blend;
        moving ||= Math.abs(difference) > 0.001;
      }
      const turn = rotation - group.rotation.y;
      group.rotation.y =
        Math.abs(turn) < 0.001 ? rotation : group.rotation.y + turn * blend;
      moving ||= Math.abs(turn) > 0.001;
      group.visible =
        Math.abs(group.position.x - camera.position.x) < halfWidth + 1.5;
    });
    renderer.render(scene, camera);
    if (moving && !reducedMotion.matches) frame = requestAnimationFrame(render);
  }
  function invalidate() {
    if (
      !frame &&
      !disposed &&
      contextAvailable &&
      visible &&
      !document.hidden
    ) {
      lastTime = performance.now() - 16;
      frame = requestAnimationFrame(render);
    }
  }
  function select(index: number) {
    if (!Number.isInteger(index) || index < 0 || index >= books.length)
      throw new Error(`Bookshelf: invalid selection ${index}`);
    selected = index;
    loadCover(index);
    loadCover(index - 1);
    loadCover(index + 1);
    invalidate();
  }

  volumes.forEach(({ group }, index) => {
    const { x, y, z, rotation } = bookPose(index, selected);
    group.position.set(x, y, z);
    group.rotation.y = rotation;
  });
  const resize = new ResizeObserver(() => {
    const { width, height } = host.getBoundingClientRect();
    if (!width || !height) return;
    const halfHeight = 1.55;
    halfWidth = (halfHeight * width) / height;
    camera.left = -halfWidth;
    camera.right = halfWidth;
    camera.top = halfHeight;
    camera.bottom = -halfHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height, false);
    invalidate();
  });
  resize.observe(host);
  const intersection = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    invalidate();
  });
  intersection.observe(host);
  document.addEventListener("visibilitychange", invalidate);
  reducedMotion.addEventListener("change", invalidate);

  const raycaster = new THREE.Raycaster();
  let gesture: {
    x: number;
    y: number;
    index: number;
    id: number;
    dragged: boolean;
  } | null = null;
  function pointerDown(event: PointerEvent) {
    if (!event.isPrimary || event.button !== 0) return;
    gesture = {
      x: event.clientX,
      y: event.clientY,
      index: selected,
      id: event.pointerId,
      dragged: false,
    };
    host.setPointerCapture(event.pointerId);
  }
  function pointerMove(event: PointerEvent) {
    if (!gesture || event.pointerId !== gesture.id) return;
    const dx = event.clientX - gesture.x;
    const dy = event.clientY - gesture.y;
    if (!gesture.dragged && Math.abs(dy) > 10 && Math.abs(dy) > Math.abs(dx)) {
      gesture = null;
      if (host.hasPointerCapture(event.pointerId))
        host.releasePointerCapture(event.pointerId);
      return;
    }
    if (Math.abs(dx) > 10) gesture.dragged = true;
    if (gesture.dragged)
      onSelect(
        Math.max(
          0,
          Math.min(books.length - 1, gesture.index - Math.round(dx / 44)),
        ),
      );
  }
  function pointerUp(event: PointerEvent) {
    if (!gesture || event.pointerId !== gesture.id) return;
    if (!gesture.dragged && Math.abs(event.clientY - gesture.y) < 10) {
      const bounds = host.getBoundingClientRect();
      raycaster.setFromCamera(
        new THREE.Vector2(
          ((event.clientX - bounds.left) / bounds.width) * 2 - 1,
          (-(event.clientY - bounds.top) / bounds.height) * 2 + 1,
        ),
        camera,
      );
      const hit = raycaster.intersectObjects(
        volumes.filter(({ group }) => group.visible).map(({ group }) => group),
        true,
      )[0];
      if (hit) {
        const index = volumes.findIndex(
          ({ group }) => group === hit.object.parent,
        );
        if (index < 0)
          throw new Error("Bookshelf: selected mesh has no owning book");
        onSelect(index);
      }
    }
    gesture = null;
    if (host.hasPointerCapture(event.pointerId))
      host.releasePointerCapture(event.pointerId);
  }
  function cancelGesture() {
    gesture = null;
  }
  function contextLost(event: Event) {
    event.preventDefault();
    cancelAnimationFrame(frame);
    frame = 0;
    contextAvailable = false;
    onUnavailable(new Error("WebGL context was lost"));
  }
  host.addEventListener("pointerdown", pointerDown);
  host.addEventListener("pointermove", pointerMove);
  host.addEventListener("pointerup", pointerUp);
  host.addEventListener("pointercancel", cancelGesture);
  host.addEventListener("lostpointercapture", cancelGesture);
  renderer.domElement.addEventListener("webglcontextlost", contextLost);
  select(initialIndex);

  return {
    select,
    dispose() {
      disposed = true;
      cancelAnimationFrame(frame);
      resize.disconnect();
      intersection.disconnect();
      document.removeEventListener("visibilitychange", invalidate);
      reducedMotion.removeEventListener("change", invalidate);
      host.removeEventListener("pointerdown", pointerDown);
      host.removeEventListener("pointermove", pointerMove);
      host.removeEventListener("pointerup", pointerUp);
      host.removeEventListener("pointercancel", cancelGesture);
      host.removeEventListener("lostpointercapture", cancelGesture);
      renderer.domElement.removeEventListener("webglcontextlost", contextLost);
      geometries.forEach((value) => value.dispose());
      materials.forEach((value) => value.dispose());
      textures.forEach((value) => value.dispose());
      light.shadow.dispose();
      renderer.dispose();
      renderer.forceContextLoss();
      renderer.domElement.remove();
    },
  };
}
