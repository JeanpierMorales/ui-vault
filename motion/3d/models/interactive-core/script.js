import * as THREE
from "https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js";


/* =========================================================
   DOM
========================================================= */

const wrapper =
  document.querySelector("#scene-wrapper");

const canvas =
  document.querySelector("#three-canvas");

const stateNumber =
  document.querySelector("#state-number");

const stateName =
  document.querySelector("#state-name");


/* =========================================================
   SCENE
========================================================= */

const scene =
  new THREE.Scene();


/* =========================================================
   CAMERA
========================================================= */

const camera =
  new THREE.PerspectiveCamera(
    38,
    1,
    0.1,
    100
  );

camera.position.set(
  0,
  0,
  7.4
);


/* =========================================================
   RENDERER
========================================================= */

const renderer =
  new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true
  });

renderer.setPixelRatio(
  Math.min(
    window.devicePixelRatio,
    2
  )
);

renderer.outputColorSpace =
  THREE.SRGBColorSpace;

renderer.toneMapping =
  THREE.ACESFilmicToneMapping;

renderer.toneMappingExposure =
  1.15;


/* =========================================================
   LIGHTS
========================================================= */

/*
  Key light
*/

const keyLight =
  new THREE.DirectionalLight(
    0xffffff,
    5
  );

keyLight.position.set(
  4,
  5,
  5
);

scene.add(keyLight);


/*
  Fill light
*/

const fillLight =
  new THREE.DirectionalLight(
    0x7b8cff,
    2.2
  );

fillLight.position.set(
  -4,
  1,
  3
);

scene.add(fillLight);


/*
  Rim light
*/

const rimLight =
  new THREE.PointLight(
    0xffffff,
    12,
    15
  );

rimLight.position.set(
  0,
  -2,
  -3
);

scene.add(rimLight);


/*
  Ambient
*/

const ambientLight =
  new THREE.AmbientLight(
    0xffffff,
    0.55
  );

scene.add(ambientLight);


/* =========================================================
   GEOMETRIES

   Las creamos una sola vez.
   Así no generamos geometrías nuevas en cada click.
========================================================= */

const geometries = [

  new THREE.SphereGeometry(
    1.55,
    96,
    96
  ),

  new THREE.TorusKnotGeometry(
    1.08,
    0.37,
    220,
    40,
    2,
    3
  ),

  new THREE.IcosahedronGeometry(
    1.55,
    5
  ),

  new THREE.TorusGeometry(
    1.22,
    0.45,
    64,
    160
  )

];


/* =========================================================
   STATES
========================================================= */

const states = [

  {
    name: "Orb",

    color:
      new THREE.Color(
        "#d8d8d4"
      ),

    metalness:
      0.72,

    roughness:
      0.22,

    speed:
      0.18
  },


  {
    name: "Knot",

    color:
      new THREE.Color(
        "#8379ff"
      ),

    metalness:
      0.78,

    roughness:
      0.18,

    speed:
      0.28
  },


  {
    name: "Crystal",

    color:
      new THREE.Color(
        "#d6ffef"
      ),

    metalness:
      0.35,

    roughness:
      0.08,

    speed:
      0.12
  },


  {
    name: "Orbit",

    color:
      new THREE.Color(
        "#ff8f68"
      ),

    metalness:
      0.58,

    roughness:
      0.2,

    speed:
      0.24
  }

];


/* =========================================================
   MATERIAL
========================================================= */

const material =
  new THREE.MeshPhysicalMaterial({

    color:
      states[0].color.clone(),

    metalness:
      states[0].metalness,

    roughness:
      states[0].roughness,

    clearcoat:
      1,

    clearcoatRoughness:
      0.12,

    envMapIntensity:
      1

  });


/* =========================================================
   MESH
========================================================= */

const object =
  new THREE.Mesh(
    geometries[0],
    material
  );

scene.add(object);


/* =========================================================
   SHADOW / FLOOR GLOW

   Es solamente una elipse transparente.
   No necesitamos un plano físico.
========================================================= */

const shadowCanvas =
  document.createElement("canvas");

shadowCanvas.width =
  256;

shadowCanvas.height =
  256;


const context =
  shadowCanvas.getContext("2d");


const gradient =
  context.createRadialGradient(
    128,
    128,
    0,
    128,
    128,
    128
  );

gradient.addColorStop(
  0,
  "rgba(255,255,255,.16)"
);

gradient.addColorStop(
  0.25,
  "rgba(255,255,255,.07)"
);

gradient.addColorStop(
  1,
  "rgba(255,255,255,0)"
);

context.fillStyle =
  gradient;

context.fillRect(
  0,
  0,
  256,
  256
);


const shadowTexture =
  new THREE.CanvasTexture(
    shadowCanvas
  );


const shadowMaterial =
  new THREE.SpriteMaterial({

    map:
      shadowTexture,

    transparent:
      true,

    opacity:
      0.55,

    depthWrite:
      false

  });


const shadow =
  new THREE.Sprite(
    shadowMaterial
  );

shadow.scale.set(
  4.6,
  1.15,
  1
);

shadow.position.set(
  0,
  -2.05,
  -1.3
);

scene.add(shadow);


/* =========================================================
   POINTER
========================================================= */

const pointer = {

  x: 0,
  y: 0,

  targetX: 0,
  targetY: 0

};


wrapper.addEventListener(
  "pointermove",
  event => {

    const rect =
      wrapper.getBoundingClientRect();


    pointer.targetX =
      (
        (event.clientX - rect.left)
        /
        rect.width
        -
        0.5
      );


    pointer.targetY =
      (
        (event.clientY - rect.top)
        /
        rect.height
        -
        0.5
      );

  }
);


wrapper.addEventListener(
  "pointerleave",
  () => {

    pointer.targetX = 0;
    pointer.targetY = 0;

  }
);


/* =========================================================
   RAYCASTER

   Esto hace que el cambio ocurra solamente
   cuando realmente pulsamos el objeto 3D.
========================================================= */

const raycaster =
  new THREE.Raycaster();

const mouse =
  new THREE.Vector2();


/* =========================================================
   INTERACTION STATE
========================================================= */

let currentState = 0;

let transitioning = false;


/*
  Variables utilizadas para crear nuestra propia
  transición suave.
*/

let transitionProgress = 0;

let transitionPhase = 0;


/* =========================================================
   CHANGE STATE
========================================================= */

function requestStateChange() {

  /*
    Evitamos clics repetidos durante una transición.
  */

  if (transitioning) {
    return;
  }


  transitioning = true;

  transitionProgress = 0;

  transitionPhase = 1;

}


/* =========================================================
   CLICK / TAP
========================================================= */

wrapper.addEventListener(
  "pointerup",
  event => {

    const rect =
      canvas.getBoundingClientRect();


    mouse.x =
      (
        (
          event.clientX
          -
          rect.left
        )
        /
        rect.width
      )
      *
      2
      -
      1;


    mouse.y =
      -
      (
        (
          event.clientY
          -
          rect.top
        )
        /
        rect.height
      )
      *
      2
      +
      1;


    raycaster.setFromCamera(
      mouse,
      camera
    );


    const hits =
      raycaster.intersectObject(
        object,
        false
      );


    if (
      hits.length > 0
    ) {

      requestStateChange();

    }

  }
);


/* =========================================================
   EASING

   Nuestra propia función.

   Mismo comportamiento siempre.
========================================================= */

function easeInOutCubic(t) {

  return t < 0.5

    ?

    4 * t * t * t

    :

    1 -
    Math.pow(
      -2 * t + 2,
      3
    )
    /
    2;

}


/* =========================================================
   APPLY NEXT STATE
========================================================= */

function applyNextState() {

  currentState =
    (
      currentState + 1
    )
    %
    states.length;


  object.geometry =
    geometries[currentState];


  /*
    Rotamos ligeramente cada nueva geometría
    para que no todas aparezcan iguales.
  */

  object.rotation.x +=
    0.5;

  object.rotation.y +=
    0.65;


  updateInterface();

}


/* =========================================================
   UI
========================================================= */

function updateInterface() {

  const number =
    String(
      currentState + 1
    )
    .padStart(
      2,
      "0"
    );


  stateNumber.textContent =
    number;


  stateName.textContent =
    states[currentState].name;

}


/* =========================================================
   TRANSITION ENGINE
========================================================= */

function updateTransition(delta) {

  if (!transitioning) {
    return;
  }


  /*
    Primera mitad:
    objeto se contrae.
  */

  if (transitionPhase === 1) {

    transitionProgress +=
      delta * 3.4;


    const t =
      Math.min(
        transitionProgress,
        1
      );


    const eased =
      easeInOutCubic(t);


    object.scale.setScalar(
      1 -
      eased * 0.82
    );


    object.rotation.y +=
      delta * 3.2;


    object.rotation.x +=
      delta * 1.6;


    if (t >= 1) {

      applyNextState();

      transitionProgress = 0;

      transitionPhase = 2;

    }

  }


  /*
    Segunda mitad:
    nueva geometría aparece.
  */

  else if (
    transitionPhase === 2
  ) {

    transitionProgress +=
      delta * 2.7;


    const t =
      Math.min(
        transitionProgress,
        1
      );


    const eased =
      easeInOutCubic(t);


    object.scale.setScalar(
      0.18
      +
      eased * 0.82
    );


    if (t >= 1) {

      object.scale.setScalar(
        1
      );

      transitioning = false;

      transitionPhase = 0;

      transitionProgress = 0;

    }

  }

}


/* =========================================================
   MATERIAL TRANSITION

   El color y las propiedades físicas no saltan.
   Se interpolan poco a poco.
========================================================= */

function updateMaterial(delta) {

  const targetState =
    states[currentState];


  material.color.lerp(
    targetState.color,
    Math.min(
      delta * 4,
      1
    )
  );


  material.metalness =
    THREE.MathUtils.lerp(

      material.metalness,

      targetState.metalness,

      Math.min(
        delta * 3,
        1
      )

    );


  material.roughness =
    THREE.MathUtils.lerp(

      material.roughness,

      targetState.roughness,

      Math.min(
        delta * 3,
        1
      )

    );

}


/* =========================================================
   RESIZE
========================================================= */

function resize() {

  const width =
    wrapper.clientWidth;

  const height =
    wrapper.clientHeight;


  renderer.setSize(
    width,
    height,
    false
  );


  camera.aspect =
    width
    /
    height;


  camera.updateProjectionMatrix();

}


/* =========================================================
   CLOCK
========================================================= */

const clock =
  new THREE.Clock();


/* =========================================================
   RENDER LOOP
========================================================= */

function animate() {

  const delta =
    Math.min(
      clock.getDelta(),
      0.033
    );


  /*
    Pointer smoothing.
  */

  pointer.x =
    THREE.MathUtils.lerp(
      pointer.x,
      pointer.targetX,
      0.045
    );


  pointer.y =
    THREE.MathUtils.lerp(
      pointer.y,
      pointer.targetY,
      0.045
    );


  /*
    Rotación autónoma.

    Cada estado puede tener una velocidad diferente.
  */

  if (!transitioning) {

    object.rotation.y +=
      delta
      *
      states[currentState].speed;


    object.rotation.x +=
      delta
      *
      states[currentState].speed
      *
      0.28;

  }


  /*
    Movimiento sutil con cursor.
  */

  object.position.x =
    THREE.MathUtils.lerp(

      object.position.x,

      pointer.x * 0.34,

      0.035

    );


  object.position.y =
    THREE.MathUtils.lerp(

      object.position.y,

      -pointer.y * 0.25,

      0.035

    );


  /*
    Cámara reacciona todavía menos.
    Esto produce sensación de profundidad.
  */

  camera.position.x =
    THREE.MathUtils.lerp(

      camera.position.x,

      pointer.x * 0.35,

      0.025

    );


  camera.position.y =
    THREE.MathUtils.lerp(

      camera.position.y,

      -pointer.y * 0.25,

      0.025

    );


  camera.lookAt(
    0,
    0,
    0
  );


  updateTransition(
    delta
  );


  updateMaterial(
    delta
  );


  renderer.render(
    scene,
    camera
  );


  requestAnimationFrame(
    animate
  );

}


/* =========================================================
   INIT
========================================================= */

resize();

updateInterface();

animate();


/* =========================================================
   RESIZE OBSERVER

   Mejor que escuchar solamente window.resize.

   También funciona si posteriormente metemos
   este componente dentro de otra estructura.
========================================================= */

const resizeObserver =
  new ResizeObserver(
    resize
  );

resizeObserver.observe(
  wrapper
);