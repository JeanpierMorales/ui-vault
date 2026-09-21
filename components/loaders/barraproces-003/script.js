/* =========================================================
   DOM
========================================================= */

const screens = document.querySelectorAll(".step-screen");

const segments = document.querySelectorAll(".segment");

const backButton = document.getElementById("backButton");

const continueButton = document.getElementById("continueButton");

const continueText = document.getElementById("continueText");

const stepCounter = document.getElementById("stepCounter");

const progressPercentage = document.getElementById("progressPercentage");

const visualCopy = document.getElementById("visualCopy");

const visualStep = document.getElementById("visualStep");

const visualTitle = document.getElementById("visualTitle");

const visualDescription = document.getElementById("visualDescription");

const visualProgress = document.getElementById("visualProgress");

const stepContainer = document.getElementById("stepContainer");

/* =========================================================
   STATE
========================================================= */

let currentStep = 0;

let isTransitioning = false;

const totalSteps = screens.length;

const answers = {
  discoverySource: null,

  bookGenres: [],

  authorStage: null,

  marketingChannels: [],

  primaryGoal: null,
};

/* =========================================================
   LEFT PANEL CONTENT
========================================================= */

const visualContent = [
  {
    title: "Let’s make MIRA work around you.",

    description:
      "A few quick questions will help us understand your books, your workflow, and how you approach marketing.",
  },

  {
    title: "Every book has a different audience.",

    description:
      "Knowing what you write helps MIRA build a more relevant content and campaign experience.",
  },

  {
    title: "Your author journey shapes your marketing.",

    description:
      "Whether you're launching your first book or managing a growing catalog, your strategy should match where you are.",
  },

  {
    title: "Marketing shouldn’t take over your writing life.",

    description:
      "Tell us how you promote your books today so MIRA can simplify what comes next.",
  },

  {
    title: "Let’s focus on what matters most.",

    description:
      "MIRA is built to make book marketing easier, more consistent, and easier to manage.",
  },
];

/* =========================================================
   STEP 1
   DISCOVERY SOURCE
========================================================= */

const discoveryOptions = screens[0].querySelectorAll(".single-option");

discoveryOptions.forEach((option) => {
  option.addEventListener("click", () => {
    discoveryOptions.forEach((item) => item.classList.remove("selected"));

    option.classList.add("selected");

    answers.discoverySource = option.dataset.value;

    updateContinueState();
  });
});

/* =========================================================
   STEP 2
   BOOK GENRES
========================================================= */

const genreOptions = screens[1].querySelectorAll(".multi-option");

genreOptions.forEach((option) => {
  option.addEventListener("click", () => {
    const value = option.dataset.value;

    option.classList.toggle("selected");

    if (option.classList.contains("selected")) {
      if (!answers.bookGenres.includes(value)) {
        answers.bookGenres.push(value);
      }
    } else {
      answers.bookGenres = answers.bookGenres.filter((item) => item !== value);
    }

    updateContinueState();
  });
});

/* =========================================================
   STEP 3
   AUTHOR JOURNEY
========================================================= */

const journeyOptions = screens[2].querySelectorAll(".journey-option");

journeyOptions.forEach((option) => {
  option.addEventListener("click", () => {
    journeyOptions.forEach((item) => item.classList.remove("selected"));

    option.classList.add("selected");

    answers.authorStage = option.dataset.value;

    updateContinueState();
  });
});

/* =========================================================
   STEP 4
   MARKETING CHANNELS
========================================================= */

const marketingOptions = screens[3].querySelectorAll(".marketing-option");

marketingOptions.forEach((option) => {
  option.addEventListener("click", () => {
    const value = option.dataset.value;

    /*
          If user selects:
          "I'm not marketing consistently yet"

          We clear the other channels because
          conceptually it conflicts with selecting
          active channels.
        */

    if (value === "not-consistent") {
      const alreadySelected = option.classList.contains("selected");

      marketingOptions.forEach((item) => item.classList.remove("selected"));

      answers.marketingChannels = [];

      if (!alreadySelected) {
        option.classList.add("selected");

        answers.marketingChannels = ["not-consistent"];
      }

      updateContinueState();

      return;
    }

    /*
          If another channel is selected,
          remove "not-consistent".
        */

    marketingOptions.forEach((item) => {
      if (item.dataset.value === "not-consistent") {
        item.classList.remove("selected");
      }
    });

    answers.marketingChannels = answers.marketingChannels.filter(
      (item) => item !== "not-consistent",
    );

    option.classList.toggle("selected");

    if (option.classList.contains("selected")) {
      if (!answers.marketingChannels.includes(value)) {
        answers.marketingChannels.push(value);
      }
    } else {
      answers.marketingChannels = answers.marketingChannels.filter(
        (item) => item !== value,
      );
    }

    updateContinueState();
  });
});

/* =========================================================
   STEP 5
   PRIMARY GOAL
========================================================= */

const goalOptions = screens[4].querySelectorAll(".goal-option");

goalOptions.forEach((option) => {
  option.addEventListener("click", () => {
    goalOptions.forEach((item) => item.classList.remove("selected"));

    option.classList.add("selected");

    answers.primaryGoal = option.dataset.value;

    updateContinueState();
  });
});

/* =========================================================
   VALIDATION
========================================================= */

function isCurrentStepValid() {
  switch (currentStep) {
    case 0:
      return Boolean(answers.discoverySource);

    case 1:
      return answers.bookGenres.length > 0;

    case 2:
      return Boolean(answers.authorStage);

    case 3:
      return answers.marketingChannels.length > 0;

    case 4:
      return Boolean(answers.primaryGoal);

    default:
      return true;
  }
}

/* =========================================================
   CONTINUE STATE
========================================================= */

function updateContinueState() {
  continueButton.disabled = !isCurrentStepValid();
}

/* =========================================================
   PROGRESS
========================================================= */

function updateProgress() {
  segments.forEach((segment, index) => {
    segment.classList.remove("active", "completed");

    if (index < currentStep) {
      segment.classList.add("completed");
    }

    if (index === currentStep) {
      segment.classList.add("active");
    }
  });

  const percentage = Math.round(((currentStep + 1) / totalSteps) * 100);

  stepCounter.textContent = `Step ${currentStep + 1} of ${totalSteps}`;

  progressPercentage.textContent = `${percentage}%`;

  visualProgress.textContent = `${currentStep + 1} / ${totalSteps}`;

  visualStep.textContent = String(currentStep + 1).padStart(2, "0");
}

/* =========================================================
   LEFT PANEL UPDATE
========================================================= */

function updateVisualPanel() {
  const content = visualContent[currentStep];

  visualCopy.classList.remove("is-entering");

  visualCopy.classList.add("is-leaving");

  setTimeout(() => {
    visualTitle.textContent = content.title;

    visualDescription.textContent = content.description;

    visualCopy.classList.remove("is-leaving");

    void visualCopy.offsetWidth;

    visualCopy.classList.add("is-entering");
  }, 210);
}

/* =========================================================
   NAVIGATION
========================================================= */

function updateNavigation() {
  backButton.disabled = currentStep === 0;

  if (currentStep === totalSteps - 1) {
    continueText.textContent = "Finish setup";
  } else {
    continueText.textContent = "Continue";
  }

  updateContinueState();
}

/* =========================================================
   UPDATE ALL
========================================================= */

function updateUI() {
  updateProgress();

  updateVisualPanel();

  updateNavigation();
}

/* =========================================================
   CHANGE STEP
========================================================= */

function changeStep(nextStep) {
  if (isTransitioning) return;

  if (nextStep < 0 || nextStep >= totalSteps) return;

  isTransitioning = true;

  const previousStep = currentStep;

  const oldScreen = screens[previousStep];

  const newScreen = screens[nextStep];

  const movingForward = nextStep > previousStep;

  oldScreen.classList.remove("active");

  oldScreen.classList.add(movingForward ? "exit-forward" : "exit-back");

  setTimeout(() => {
    oldScreen.classList.remove("exit-forward", "exit-back");

    currentStep = nextStep;

    newScreen.classList.add("active");

    updateUI();

    setTimeout(() => {
      isTransitioning = false;
    }, 430);
  }, 230);
}

/* =========================================================
   CONTINUE
========================================================= */

continueButton.addEventListener("click", () => {
  if (!isCurrentStepValid()) return;

  if (currentStep < totalSteps - 1) {
    changeStep(currentStep + 1);

    return;
  }

  completeOnboarding();
});

/* =========================================================
   BACK
========================================================= */

backButton.addEventListener("click", () => {
  if (currentStep > 0) {
    changeStep(currentStep - 1);
  }
});

/* =========================================================
   COMPLETION
========================================================= */

function completeOnboarding() {
  console.log("MIRA onboarding answers:", answers);

  segments.forEach((segment) => {
    segment.classList.remove("active");

    segment.classList.add("completed");
  });

  progressPercentage.textContent = "100%";

  stepCounter.textContent = "Setup complete";

  visualProgress.textContent = "5 / 5";

  visualStep.textContent = "✓";

  visualTitle.textContent = "Your MIRA experience is ready.";

  visualDescription.textContent =
    "We’ll use your answers to make your content, campaigns, and marketing workflow more relevant from the start.";

  stepContainer.innerHTML = `
    <section class="completion-screen">

      <div class="completion-symbol">

        <svg viewBox="0 0 24 24">
          <path d="M5 12.5L9.2 16.5L19 7" />
        </svg>

      </div>

      <h2>
        You’re ready to start with MIRA.
      </h2>

      <p>
        Your setup is complete. MIRA can now tailor your
        content creation, campaigns, and workflow around
        the way you write and promote your books.
      </p>

    </section>
  `;

  backButton.style.display = "none";

  continueButton.disabled = false;

  continueText.textContent = "Enter MIRA";

  const arrow = continueButton.querySelector(".continue-arrow");

  if (arrow) {
    arrow.textContent = "→";
  }

  continueButton.onclick = () => {
    /*
        Replace with your real destination.
      */

    console.log("Entering MIRA...");
  };
}

/* =========================================================
   INITIALIZE
========================================================= */

updateProgress();

updateNavigation();
