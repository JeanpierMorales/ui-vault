import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js";

/* =========================================================
   GSAP
========================================================= */

gsap.registerPlugin(ScrollTrigger);

/* =========================================================
   DOM
========================================================= */

const canvas = document.querySelector("#three-canvas");

const stateNumber = document.querySelector("#state-number");

const stateName = document.querySelector("#state-name");

/* =========================================================
   THREE SCENE
========================================================= */

const scene = new THREE.Scene();

/* =========================================================
   CAMERA
========================================================= */

const camera = new THREE.PerspectiveCamera(
  37,
  window.innerWidth / window.innerHeight,
  0.1,
  100,
);

camera.position.set(0, 0, 8);

/* =========================================================
   RENDERER
========================================================= */

const renderer = new THREE.WebGLRenderer({
  canvas,

  antialias: true,

  alpha: true,
});

renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

renderer.setSize(
  window.innerWidth,

  window.innerHeight,
);

renderer.outputColorSpace = THREE.SRGBColorSpace;

renderer.toneMapping = THREE.ACESFilmicToneMapping;

renderer.toneMappingExposure = 1.15;

/* =========================================================
   LIGHTS
========================================================= */

const keyLight = new THREE.DirectionalLight(0xffffff, 4.5);

keyLight.position.set(4, 5, 6);

scene.add(keyLight);

/* fill */

const fillLight = new THREE.DirectionalLight(0x7285ff, 2);

fillLight.position.set(-4, 1, 3);

scene.add(fillLight);

/* rim */

const rimLight = new THREE.PointLight(0xffffff, 10, 20);

rimLight.position.set(0, -2, -3);

scene.add(rimLight);

/* ambient */

scene.add(new THREE.AmbientLight(0xffffff, 0.5));

/* =========================================================
   GEOMETRIES

   Estas pertenecen a la interacción de click.
========================================================= */

const geometries = [
  new THREE.SphereGeometry(1.5, 96, 96),

  new THREE.TorusKnotGeometry(1.05, 0.36, 220, 40, 2, 3),

  new THREE.IcosahedronGeometry(1.5, 5),

  new THREE.TorusGeometry(1.2, 0.43, 64, 160),
];

/* =========================================================
   CLICK STATES
========================================================= */

const objectStates = [
  {
    name: "Orb",
  },

  {
    name: "Knot",
  },

  {
    name: "Crystal",
  },

  {
    name: "Orbit",
  },
];

let currentObjectState = 0;

/* =========================================================
   MATERIAL
========================================================= */

const material = new THREE.MeshPhysicalMaterial({
  color: new THREE.Color("#d8d8d4"),

  metalness: 0.72,

  roughness: 0.2,

  clearcoat: 1,

  clearcoatRoughness: 0.1,
});

/* =========================================================
   OBJECT
========================================================= */

const object = new THREE.Mesh(
  geometries[0],

  material,
);

scene.add(object);

/* =========================================================
   SCROLL KEYFRAMES

   Esta es la verdadera coreografía.

   Cada estado pertenece a un porcentaje exacto
   del documento.

   Si vuelves al mismo porcentaje,
   obtienes exactamente el mismo resultado.
========================================================= */

const scrollStates = [
  /* HERO */

  {
    progress: 0,

    position: [1.8, 0, 0],

    scale: 1,

    rotation: [0, 0, 0],

    color: "#d8d8d4",

    metalness: 0.72,

    roughness: 0.2,

    cameraZ: 8,
  },

  /* HOLD HERO */

  {
    progress: 0.14,

    position: [1.8, 0.15, 0],

    scale: 1.05,

    rotation: [0.15, 0.35, 0],

    color: "#d8d8d4",

    metalness: 0.72,

    roughness: 0.2,

    cameraZ: 7.8,
  },

  /* SECTION 2 */

  {
    progress: 0.28,

    position: [2.15, -0.2, -0.6],

    scale: 1.1,

    rotation: [0.35, 1.3, 0.2],

    color: "#8792ff",

    metalness: 0.77,

    roughness: 0.15,

    cameraZ: 7.4,
  },

  /* SECTION 3 */

  {
    progress: 0.48,

    position: [-2.15, 0.15, -0.9],

    scale: 0.9,

    rotation: [0.75, 2.4, 0.35],

    color: "#c5fff0",

    metalness: 0.42,

    roughness: 0.08,

    cameraZ: 7,
  },

  /* SECTION 4 */

  {
    progress: 0.69,

    position: [1.65, 0, -0.3],

    scale: 1.18,

    rotation: [1, 3.4, 0],

    color: "#252525",

    metalness: 0.82,

    roughness: 0.22,

    cameraZ: 7.6,
  },

  /* HOLD INSIDE CARD */

  {
    progress: 0.82,

    position: [1.65, 0.08, -0.3],

    scale: 1.23,

    rotation: [1.1, 3.8, 0.1],

    color: "#202020",

    metalness: 0.86,

    roughness: 0.18,

    cameraZ: 7.5,
  },

  /* FINAL */

  {
    progress: 1,

    position: [0, 0.6, -0.5],

    scale: 0.95,

    rotation: [1.3, 5, 0],

    color: "#ff9b78",

    metalness: 0.55,

    roughness: 0.24,

    cameraZ: 7.8,
  },
];

/* =========================================================
   CURRENT SCROLL PROGRESS
========================================================= */

let scrollProgress = 0;

/* =========================================================
   HELPERS
========================================================= */

function clamp01(value) {
  return Math.max(0, Math.min(1, value));
}

/*
  Smoothstep.

  Muy importante:

  funciona exactamente igual al avanzar
  y retroceder.

  No depende del tiempo.
*/

function smoothstep(t) {
  t = clamp01(t);

  return t * t * (3 - 2 * t);
}

/* =========================================================
   FIND CURRENT SEGMENT
========================================================= */

function getScrollSegment(progress) {
  for (let i = 0; i < scrollStates.length - 1; i++) {
    const current = scrollStates[i];

    const next = scrollStates[i + 1];

    if (progress >= current.progress && progress <= next.progress) {
      return {
        current,
        next,
      };
    }
  }

  return {
    current: scrollStates[scrollStates.length - 2],

    next: scrollStates[scrollStates.length - 1],
  };
}

/* =========================================================
   INTERPOLATION
========================================================= */

function interpolateState(progress) {
  const segment = getScrollSegment(progress);

  const a = segment.current;

  const b = segment.next;

  const range = b.progress - a.progress;

  let localProgress = (progress - a.progress) / range;

  localProgress = smoothstep(localProgress);

  /* POSITION */

  object.position.x = THREE.MathUtils.lerp(
    a.position[0],

    b.position[0],

    localProgress,
  );

  object.position.y = THREE.MathUtils.lerp(
    a.position[1],

    b.position[1],

    localProgress,
  );

  object.position.z = THREE.MathUtils.lerp(
    a.position[2],

    b.position[2],

    localProgress,
  );

  /* SCALE */

  const scale = THREE.MathUtils.lerp(
    a.scale,

    b.scale,

    localProgress,
  );

  /*
    Aquí aplicamos escala scroll.

    Después añadiremos la escala del click.
  */

  scrollScale = scale;

  /* ROTATION */

  baseRotation.x = THREE.MathUtils.lerp(
    a.rotation[0],

    b.rotation[0],

    localProgress,
  );

  baseRotation.y = THREE.MathUtils.lerp(
    a.rotation[1],

    b.rotation[1],

    localProgress,
  );

  baseRotation.z = THREE.MathUtils.lerp(
    a.rotation[2],

    b.rotation[2],

    localProgress,
  );

  /* COLOR */

  const colorA = new THREE.Color(a.color);

  const colorB = new THREE.Color(b.color);

  scrollColor.copy(colorA).lerp(colorB, localProgress);

  material.metalness = THREE.MathUtils.lerp(
    a.metalness,

    b.metalness,

    localProgress,
  );

  material.roughness = THREE.MathUtils.lerp(
    a.roughness,

    b.roughness,

    localProgress,
  );

  camera.position.z = THREE.MathUtils.lerp(
    a.cameraZ,

    b.cameraZ,

    localProgress,
  );
}

/* =========================================================
   SCROLLTRIGGER

   ÚNICAMENTE OBTIENE EL PROGRESO.

   No controla directamente Three.js.
========================================================= */

ScrollTrigger.create({
  trigger: "#experience",

  start: "top top",

  end: "bottom bottom",

  onUpdate(self) {
    scrollProgress = self.progress;
  },
});

/* =========================================================
   POINTER
========================================================= */

const pointer = {
  x: 0,

  y: 0,

  targetX: 0,

  targetY: 0,
};

window.addEventListener("pointermove", (event) => {
  pointer.targetX = event.clientX / window.innerWidth - 0.5;

  pointer.targetY = event.clientY / window.innerHeight - 0.5;
});

/* =========================================================
   RAYCASTING
========================================================= */

const raycaster = new THREE.Raycaster();

const mouse = new THREE.Vector2();

/* =========================================================
   CLICK TRANSITION VARIABLES
========================================================= */

let clickTransitionActive = false;

let clickTransitionPhase = 0;

let clickTransitionProgress = 0;

let clickScale = 1;

let scrollScale = 1;

const baseRotation = {
  x: 0,

  y: 0,

  z: 0,
};

const scrollColor = new THREE.Color();

/* =========================================================
   CLICK
========================================================= */

canvas.addEventListener("pointerup", (event) => {
  const rect = canvas.getBoundingClientRect();

  mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;

  mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);

  const hits = raycaster.intersectObject(object);

  if (hits.length && !clickTransitionActive) {
    clickTransitionActive = true;

    clickTransitionPhase = 1;

    clickTransitionProgress = 0;
  }
});

/* =========================================================
   CHANGE GEOMETRY
========================================================= */

function switchGeometry() {
  currentObjectState = (currentObjectState + 1) % geometries.length;

  object.geometry = geometries[currentObjectState];

  stateNumber.textContent = String(currentObjectState + 1).padStart(2, "0");

  stateName.textContent = objectStates[currentObjectState].name;
}

/* =========================================================
   CLICK TRANSITION
========================================================= */

function updateClickTransition(delta) {
  if (!clickTransitionActive) {
    clickScale = THREE.MathUtils.lerp(
      clickScale,

      1,

      0.08,
    );

    return;
  }

  /* collapse */

  if (clickTransitionPhase === 1) {
    clickTransitionProgress += delta * 4;

    const t = Math.min(clickTransitionProgress, 1);

    clickScale = THREE.MathUtils.lerp(1, 0.12, smoothstep(t));

    if (t >= 1) {
      switchGeometry();

      clickTransitionPhase = 2;

      clickTransitionProgress = 0;
    }
  } else {

  /* expand */
    clickTransitionProgress += delta * 3.2;

    const t = Math.min(clickTransitionProgress, 1);

    clickScale = THREE.MathUtils.lerp(0.12, 1, smoothstep(t));

    if (t >= 1) {
      clickScale = 1;

      clickTransitionActive = false;

      clickTransitionPhase = 0;
    }
  }
}

/* =========================================================
   CLOCK
========================================================= */

const clock = new THREE.Clock();

/* =========================================================
   ANIMATION LOOP
========================================================= */

function animate() {
  const delta = Math.min(clock.getDelta(), 0.033);

  /* =============================================
     SCROLL STATE
  ============================================= */

  interpolateState(scrollProgress);

  /* =============================================
     POINTER SMOOTHING
  ============================================= */

  pointer.x = THREE.MathUtils.lerp(
    pointer.x,

    pointer.targetX,

    0.035,
  );

  pointer.y = THREE.MathUtils.lerp(
    pointer.y,

    pointer.targetY,

    0.035,
  );

  /* =============================================
     CLICK
  ============================================= */

  updateClickTransition(delta);

  /* =============================================
     SCALE
  ============================================= */

  const finalScale = scrollScale * clickScale;

  object.scale.setScalar(finalScale);

  /* =============================================
     ROTATION

     Scroll determina la rotación principal.

     Pointer solamente añade micro-movimiento.
  ============================================= */

  object.rotation.x = baseRotation.x - pointer.y * 0.18;

  object.rotation.y = baseRotation.y + pointer.x * 0.22;

  object.rotation.z = baseRotation.z;

  /*
    ligera vida autónoma.

    Muy pequeña para no romper la
    relación con el scroll.
  */

  object.rotation.y += Math.sin(performance.now() * 0.0003) * 0.035;

  /* =============================================
     MATERIAL
  ============================================= */

  material.color.lerp(
    scrollColor,

    0.1,
  );

  /* =============================================
     CAMERA POINTER
  ============================================= */

  camera.position.x = THREE.MathUtils.lerp(
    camera.position.x,

    pointer.x * 0.18,

    0.03,
  );

  camera.position.y = THREE.MathUtils.lerp(
    camera.position.y,

    -pointer.y * 0.14,

    0.03,
  );

  camera.lookAt(0, 0, 0);

  renderer.render(scene, camera);

  requestAnimationFrame(animate);
}

/* =========================================================
   RESIZE
========================================================= */

function resize() {
  const width = window.innerWidth;

  const height = window.innerHeight;

  camera.aspect = width / height;

  camera.updateProjectionMatrix();

  renderer.setSize(width, height);

  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  ScrollTrigger.refresh();
}

window.addEventListener("resize", resize);

/* =========================================================
   START
========================================================= */

resize();

animate();
