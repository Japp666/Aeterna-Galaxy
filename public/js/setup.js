export function renderSetupScreen() {
  const setupContainer = document.createElement("div");

  fetch("public/components/setup.html")
    .then((res) => res.text())
    .then((html) => {
      setupContainer.innerHTML = html;
      const content = document.getElementById("game-content");
      content.innerHTML = "";
      content.appendChild(setupContainer);

      // Asigură-te că DOM-ul este complet atașat înainte de a căuta elementele
      requestAnimationFrame(() => {
        renderEmblems();
        setupFormEvents();
      });
    });
}

let selectedEmblem = null;

function renderEmblems() {
  const container = document.getElementById("emblemsContainer");
  if (!container) {
    console.error("❌ Nu s-a găsit #emblemsContainer în DOM!");
    return;
  }

  for (let i = 1; i <= 20; i++) {
    const emblem = document.createElement("img");
    const number = String(i).padStart(2, "0");
    emblem.src = `public/img/emblems/emblema${number}.png`;
    emblem.alt = `Emblema ${i}`;
    emblem.classList.add("emblem-option");

    emblem.addEventListener("click", () => {
      document.querySelectorAll(".emblem-option").forEach(e => e.classList.remove("selected"));
      emblem.classList.add("selected");
      selectedEmblem = emblem.src;
      checkFormValidity();
    });

    container.appendChild(emblem);
  }
}

function checkFormValidity() {
  const coach = document.getElementById("coachNickname")?.value.trim();
  const club = document.getElementById("clubName")?.value.trim();
  const startButton = document.getElementById("startButton");

  if (coach && club && selectedEmblem) {
    startButton.disabled = false;
  } else {
    startButton.disabled = true;
  }
}

function setupFormEvents() {
  const coachInput = document.getElementById("coachNickname");
  const clubInput = document.getElementById("clubName");
  const form = document.getElementById("setupForm");

  if (!coachInput || !clubInput || !form) {
    console.error("❌ Nu s-au găsit elementele formularului!");
    return;
  }

  coachInput.addEventListener("input", checkFormValidity);
  clubInput.addEventListener("input", checkFormValidity);

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    const nickname = coachInput.value.trim();
    const clubName = clubInput.value.trim();

    localStorage.setItem("clubEmblem", selectedEmblem);
    localStorage.setItem("coachNickname", nickname);
    localStorage.setItem("clubName", clubName);
    localStorage.setItem("funds", "100000");

    location.reload(); // Reîncarcă aplicația pentru a porni jocul
  });
}
