class InfiniteMarquee {
  constructor(row) {
    this.row = row;

    this.direction = row.dataset.direction || "left";

    /*
      Más velocidad = mayor número.

      Antes podrías usar algo como:
      70 px/s

      Ahora estamos aproximadamente
      30% por encima:

      70 * 1.30 ≈ 91

      En HTML estoy utilizando
      aproximadamente 95 - 105 px/s.
    */

    this.speed = Number(row.dataset.speed) || 55;

    this.originalCards = [...row.children].map((card) => card.cloneNode(true));

    this.animationFrame = null;

    this.position = 0;

    this.lastTime = null;

    this.groupWidth = 0;

    this.isPaused = false;

    this.init();
  }

  /* ============================
     INITIALIZE
  ============================ */

  init() {
    this.createStructure();

    this.calculateWidth();

    this.setInitialPosition();

    this.addEvents();

    this.animate();
  }

  /* ============================
     CREATE GROUPS
  ============================ */

  createStructure() {
    this.row.innerHTML = "";

    this.track = document.createElement("div");

    this.track.className = "marquee-track";

    this.group1 = document.createElement("div");

    this.group1.className = "marquee-group";

    /*
      Añadimos cards hasta que el grupo
      sea mucho más ancho que la pantalla.

      Esto evita huecos incluso en
      monitores ultrawide.
    */

    this.fillGroup(this.group1);

    /*
      Segundo bloque idéntico.

      Cuando el primero termina,
      el segundo está exactamente detrás.

      Ahí obtenemos el loop infinito.
    */

    this.group2 = this.group1.cloneNode(true);

    this.track.appendChild(this.group1);

    this.track.appendChild(this.group2);

    this.row.appendChild(this.track);
  }

  /* ============================
     FILL GROUP
  ============================ */

  fillGroup(group) {
    /*
      Queremos al menos el doble
      del viewport para garantizar
      cobertura completa.
    */

    const minimumWidth = window.innerWidth * 2;

    let estimatedWidth = 0;

    let index = 0;

    /*
      Como todavía no está renderizado,
      utilizamos una estimación inicial.
    */

    while (estimatedWidth < minimumWidth) {
      const card =
        this.originalCards[index % this.originalCards.length].cloneNode(true);

      group.appendChild(card);

      /*
        Card aprox 390
        gap aprox 12
      */

      estimatedWidth += 402;

      index++;
    }
  }

  /* ============================
     CALCULATE REAL WIDTH
  ============================ */

  calculateWidth() {
    this.groupWidth = this.group1.getBoundingClientRect().width;
  }

  /* ============================
     INITIAL POSITION
  ============================ */

  setInitialPosition() {
    if (this.direction === "right") {
      this.position = -this.groupWidth;
    } else {
      this.position = 0;
    }

    this.updateTransform();
  }

  /* ============================
     ANIMATION
  ============================ */

  animate(timestamp) {
    if (!timestamp) {
      this.animationFrame = requestAnimationFrame((time) => this.animate(time));

      return;
    }

    if (!this.lastTime) {
      this.lastTime = timestamp;
    }

    const delta = (timestamp - this.lastTime) / 1000;

    this.lastTime = timestamp;

    if (!this.isPaused) {
      const movement = this.speed * delta;

      /*
        IZQUIERDA
      */

      if (this.direction === "left") {
        this.position -= movement;

        /*
          Cuando desplazamos exactamente
          el ancho del primer grupo,
          volvemos a 0.

          Visualmente no cambia nada
          porque group2 es idéntico.
        */

        if (this.position <= -this.groupWidth) {
          this.position += this.groupWidth;
        }
      } else {

      /*
        DERECHA
      */
        this.position += movement;

        if (this.position >= 0) {
          this.position -= this.groupWidth;
        }
      }

      this.updateTransform();
    }

    this.animationFrame = requestAnimationFrame((time) => this.animate(time));
  }

  /* ============================
     TRANSFORM
  ============================ */

  updateTransform() {
    this.track.style.transform = `translate3d(${this.position}px, 0, 0)`;
  }

  /* ============================
     EVENTS
  ============================ */

  addEvents() {
    /*
      Pause al poner el mouse.
      Puedes eliminarlo si quieres
      que nunca se detenga.
    */

    this.row.addEventListener("mouseenter", () => {
      this.isPaused = true;
    });

    this.row.addEventListener("mouseleave", () => {
      this.isPaused = false;

      /*
          Evita salto grande al volver
          después de haber pausado.
        */

      this.lastTime = null;
    });

    /*
      Recalculamos cuando cambia
      el tamaño de pantalla.
    */

    window.addEventListener("resize", () => {
      this.calculateWidth();
    });
  }
}

/* ================================
   INITIALIZE ALL ROWS
================================ */

document.querySelectorAll(".marquee-row").forEach((row) => {
  new InfiniteMarquee(row);
});
