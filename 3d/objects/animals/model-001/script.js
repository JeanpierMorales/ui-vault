/* ============================================================
   REFERENCES
   ============================================================ */

const ravenWrapper =
  document.getElementById("ravenWrapper");

const raven =
  document.getElementById("raven");

const headGroup =
  document.getElementById("headGroup");

const leftWing =
  document.getElementById("leftWing");

const rightWing =
  document.getElementById("rightWing");

const leftIris =
  document.getElementById("leftIris");

const rightIris =
  document.getElementById("rightIris");

const leftEyelid =
  document.getElementById("leftEyelid");

const rightEyelid =
  document.getElementById("rightEyelid");

const shadow =
  document.querySelector(".raven-shadow");



/* ============================================================
   SETTINGS
   ============================================================ */

const state = {

  scrollProgress: 0,

  targetScrollProgress: 0,

  currentX: 0,
  currentY: 0,

  targetMouseX: 0,
  targetMouseY: 0,

  mouseX: 0,
  mouseY: 0,

  previousScrollY:
    window.scrollY,

  scrollVelocity: 0,

  targetVelocity: 0,

  wingTime: 0,

  lastTime:
    performance.now()

};



/* ============================================================
   FLIGHT PATH

   Los valores están normalizados:
   x = 0 izquierda / 1 derecha
   y = 0 arriba / 1 abajo
   scale = tamaño
   rotation = inclinación
   ============================================================ */

const flightPath = [

  {
    progress: 0,
    x: 0.73,
    y: 0.52,
    scale: 1,
    rotation: -4
  },

  {
    progress: 0.13,
    x: 0.70,
    y: 0.42,
    scale: 0.9,
    rotation: -10
  },

  {
    progress: 0.28,
    x: 0.48,
    y: 0.29,
    scale: 0.76,
    rotation: -7
  },

  {
    progress: 0.43,
    x: 0.24,
    y: 0.44,
    scale: 0.72,
    rotation: 5
  },

  {
    progress: 0.59,
    x: 0.54,
    y: 0.56,
    scale: 0.8,
    rotation: 8
  },

  {
    progress: 0.75,
    x: 0.75,
    y: 0.32,
    scale: 0.7,
    rotation: -9
  },

  {
    progress: 0.89,
    x: 0.51,
    y: 0.47,
    scale: 0.8,
    rotation: 4
  },

  {
    progress: 1,
    x: 0.5,
    y: 0.39,
    scale: 1.02,
    rotation: 0
  }

];



/* ============================================================
   BASIC UTILS
   ============================================================ */

function clamp(
  value,
  min,
  max
) {

  return Math.max(
    min,
    Math.min(
      max,
      value
    )
  );

}



function lerp(
  a,
  b,
  t
) {

  return (
    a +
    (b - a) * t
  );

}



/* ============================================================
   SMOOTHSTEP

   Esto evita transiciones lineales mecánicas.
   ============================================================ */

function smoothstep(t) {

  return (
    t *
    t *
    (3 - 2 * t)
  );

}



/* ============================================================
   GET SCROLL PROGRESS
   ============================================================ */

function updateScrollProgress() {

  const maxScroll =
    document.documentElement.scrollHeight -
    window.innerHeight;

  state.targetScrollProgress =
    clamp(
      window.scrollY /
      maxScroll,
      0,
      1
    );



  /* ----------------------------------------------------------
     Scroll velocity
     ---------------------------------------------------------- */

  const scrollDelta =
    window.scrollY -
    state.previousScrollY;

  state.targetVelocity =
    clamp(
      scrollDelta /
      70,
      -1,
      1
    );

  state.previousScrollY =
    window.scrollY;

}



/* ============================================================
   FIND CURRENT FLIGHT SEGMENT
   ============================================================ */

function getFlightState(progress) {

  let start =
    flightPath[0];

  let end =
    flightPath[
      flightPath.length - 1
    ];



  for (
    let i = 0;
    i < flightPath.length - 1;
    i++
  ) {

    if (
      progress >=
      flightPath[i].progress
      &&
      progress <=
      flightPath[i + 1].progress
    ) {

      start =
        flightPath[i];

      end =
        flightPath[i + 1];

      break;

    }

  }



  const range =
    end.progress -
    start.progress;



  let localProgress =
    range === 0
      ? 0
      :
      (
        progress -
        start.progress
      ) / range;



  localProgress =
    smoothstep(
      clamp(
        localProgress,
        0,
        1
      )
    );



  return {

    x:
      lerp(
        start.x,
        end.x,
        localProgress
      ),

    y:
      lerp(
        start.y,
        end.y,
        localProgress
      ),

    scale:
      lerp(
        start.scale,
        end.scale,
        localProgress
      ),

    rotation:
      lerp(
        start.rotation,
        end.rotation,
        localProgress
      )

  };

}



/* ============================================================
   POINTER TRACKING
   ============================================================ */

window.addEventListener(
  "pointermove",
  event => {

    state.targetMouseX =
      (
        event.clientX /
        window.innerWidth -
        0.5
      ) * 2;

    state.targetMouseY =
      (
        event.clientY /
        window.innerHeight -
        0.5
      ) * 2;

  }
);



document.addEventListener(
  "mouseleave",
  () => {

    state.targetMouseX = 0;
    state.targetMouseY = 0;

  }
);



/* ============================================================
   EYE TRACKING
   ============================================================ */

function updateEyes() {

  const eyeX =
    state.mouseX * 6;

  const eyeY =
    state.mouseY * 4;



  leftIris.style.transform =
    `translate(${eyeX}px, ${eyeY}px)`;

  rightIris.style.transform =
    `translate(${eyeX}px, ${eyeY}px)`;

}



/* ============================================================
   HEAD MOVEMENT
   ============================================================ */

function updateHead() {

  const rotateY =
    state.mouseX * 4;

  const rotateX =
    state.mouseY * -2.5;



  headGroup.style.transform =
    `
      translate(
        ${state.mouseX * 1.4}px,
        ${state.mouseY * 1}px
      )
      rotate(
        ${rotateY * 0.35}deg
      )
    `;

}



/* ============================================================
   BLINK
   ============================================================ */

function blink() {

  leftEyelid.style.opacity = "1";
  rightEyelid.style.opacity = "1";



  setTimeout(
    () => {

      leftEyelid.style.opacity = "0";
      rightEyelid.style.opacity = "0";

    },
    110
  );



  const nextBlink =
    2600 +
    Math.random() * 4200;



  setTimeout(
    blink,
    nextBlink
  );

}



/* ============================================================
   WING ANIMATION
   ============================================================ */

function updateWings(
  deltaTime
) {

  /* ----------------------------------------------------------
     velocidad del scroll suavizada
     ---------------------------------------------------------- */

  state.scrollVelocity =
    lerp(
      state.scrollVelocity,
      state.targetVelocity,
      0.08
    );



  state.targetVelocity *=
    0.92;



  /* ----------------------------------------------------------
     Aleteo
     ---------------------------------------------------------- */

  const absoluteVelocity =
    Math.abs(
      state.scrollVelocity
    );



  const flightIntensity =
    clamp(
      absoluteVelocity * 1.6,
      0,
      1
    );



  const baseWingSpeed =
    1.2;

  const speedBoost =
    absoluteVelocity * 8;



  state.wingTime +=
    deltaTime *
    (
      baseWingSpeed +
      speedBoost
    );



  const flap =
    Math.sin(
      state.wingTime
    );



  /*
    Cuando estamos prácticamente quietos
    las alas permanecen más cerradas.
  */

  const idleWingMotion =
    Math.sin(
      state.wingTime * 0.45
    ) * 1.7;



  const flapAngle =
    idleWingMotion +
    (
      flap *
      25 *
      flightIntensity
    );



  const spread =
    flightIntensity * 5;



  leftWing.style.transform =
    `
      translate(
        ${-spread}px,
        0px
      )
      rotate(
        ${-flapAngle}deg
      )
    `;



  rightWing.style.transform =
    `
      translate(
        ${spread}px,
        0px
      )
      rotate(
        ${flapAngle}deg
      )
    `;

}



/* ============================================================
   UPDATE RAVEN POSITION
   ============================================================ */

function updateFlight() {

  /* ----------------------------------------------------------
     Smooth scroll progress
     ---------------------------------------------------------- */

  state.scrollProgress =
    lerp(
      state.scrollProgress,
      state.targetScrollProgress,
      0.065
    );



  const flight =
    getFlightState(
      state.scrollProgress
    );



  const viewportWidth =
    window.innerWidth;

  const viewportHeight =
    window.innerHeight;



  const x =
    flight.x *
    viewportWidth;

  const y =
    flight.y *
    viewportHeight;



  /* ----------------------------------------------------------
     vertical floating
     ---------------------------------------------------------- */

  const floating =
    Math.sin(
      performance.now() *
      0.0014
    ) * 4;



  /*
     El cuervo gira ligeramente
     según la dirección del scroll.
  */

  const movementTilt =
    state.scrollVelocity * 8;



  ravenWrapper.style.left =
    `${x}px`;

  ravenWrapper.style.top =
    `${y + floating}px`;



  ravenWrapper.style.transform =
    `
      translate(-50%, -50%)

      rotateZ(
        ${
          flight.rotation +
          movementTilt
        }deg
      )

      rotateY(
        ${
          state.scrollVelocity *
          -9
        }deg
      )

      scale(
        ${flight.scale}
      )
    `;



  /* ----------------------------------------------------------
     Shadow changes according to scale / height
     ---------------------------------------------------------- */

  const shadowScale =
    0.8 +
    flight.scale * 0.2;



  shadow.style.transform =
    `
      translateX(-50%)
      scaleX(${shadowScale})
    `;



  shadow.style.opacity =
    clamp(
      flight.scale * 0.6,
      0.18,
      0.7
    );

}



/* ============================================================
   ANIMATION FRAME
   ============================================================ */

function animationLoop(time) {

  const deltaTime =
    Math.min(
      (
        time -
        state.lastTime
      ) / 1000,
      0.04
    );



  state.lastTime =
    time;



  /* ----------------------------------------------------------
     Smooth mouse values
     ---------------------------------------------------------- */

  state.mouseX =
    lerp(
      state.mouseX,
      state.targetMouseX,
      0.07
    );

  state.mouseY =
    lerp(
      state.mouseY,
      state.targetMouseY,
      0.07
    );



  updateFlight();

  updateWings(
    deltaTime
  );

  updateEyes();

  updateHead();



  requestAnimationFrame(
    animationLoop
  );

}



/* ============================================================
   SCROLL EVENT
   ============================================================ */

window.addEventListener(
  "scroll",
  updateScrollProgress,
  {
    passive: true
  }
);



window.addEventListener(
  "resize",
  updateScrollProgress
);



/* ============================================================
   INITIALIZE
   ============================================================ */

updateScrollProgress();



requestAnimationFrame(
  animationLoop
);



setTimeout(
  blink,
  1800
);