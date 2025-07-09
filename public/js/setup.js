export function renderSetupScreen() {
  const setupContainer = document.createElement("div");
  fetch("public/components/setup.html")
    .then((res) => res.text())
    .then((html) => {
      setupContainer.innerHTML = html;
      document.getElementById("game-content").innerHTML = "";
      document.getElementById("game-content").appendChild(setupContainer);
      renderEmblems();
      setupFormEvents();
    });
}

function renderEmblems() {
  const container = document.getElementById("emblemsContainer");
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

let selectedEmblem = null;

function checkFormValidity() {
  const coach = document.getElementById("coachNickname").value.trim();
  const club = document.getElementById("clubName").value.trim();
  const startButton = document.getElementById("startButton");
  startButton.disabled = !(coach && club && selectedEmblem);
}

function setupFormEvents() {
  const form = document.getElementById("setupForm");
  document.getElementById("coachNickname").addEventListener("input", checkFormValidity);
  document.getElementById("clubName").addEventListener("input", checkFormValidity);

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    const nickname = document.getElementById("coachNickname").value.trim();
    const clubName = document.getElementById("clubName").value.trim();

    localStorage.setItem("clubEmblem", selectedEmblem);
    localStorage.setItem("coachNickname", nickname);
    localStorage.setItem("clubName", clubName);
    localStorage.setItem("funds", "100000");

    location.reload(); // sau se poate naviga către dashboard direct
  });
}
