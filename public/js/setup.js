export function renderSetupScreen() {
  fetch("public/components/setup.html")
    .then(res => res.text())
    .then(html => {
      const content = document.getElementById("game-content");
      content.innerHTML = html;

      // Așteptăm până când DOM-ul e actualizat
      requestAnimationFrame(() => {
        initializeSetupForm();
      });
    })
    .catch(err => console.error("Eroare la încărcarea setup.html:", err));
}

function initializeSetupForm() {
  const emblemsContainer = document.getElementById("emblemsContainer");
  const coachInput = document.getElementById("coachNickname");
  const clubInput = document.getElementById("clubName");
  const startButton = document.getElementById("startButton");
  const form = document.getElementById("setupForm");

  if (!emblemsContainer || !coachInput || !clubInput || !startButton || !form) {
    console.error("❌ Element lipsă în setup.html:", {
      emblemsContainer, coachInput, clubInput, startButton, form
    });
    return;
  }

  let selectedEmblem = null;

  for (let i = 1; i <= 20; i++) {
    const img = document.createElement("img");
    const num = String(i).padStart(2, "0");
    img.src = `public/img/emblems/emblema${num}.png`;
    img.alt = `Emblema ${num}`;
    img.classList.add("emblem-option");
    img.addEventListener("click", () => {
      emblemsContainer.querySelectorAll(".emblem-option")
        .forEach(el => el.classList.remove("selected"));
      img.classList.add("selected");
      selectedEmblem = img.src;
      updateStartButton();
    });
    emblemsContainer.appendChild(img);
  }

  coachInput.addEventListener("input", updateStartButton);
  clubInput.addEventListener("input", updateStartButton);

  function updateStartButton() {
    const coachVal = coachInput.value.trim();
    const clubVal = clubInput.value.trim();
    startButton.disabled = !(coachVal && clubVal && selectedEmblem);
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    localStorage.setItem("coachNickname", coachInput.value.trim());
    localStorage.setItem("clubName", clubInput.value.trim());
    localStorage.setItem("clubEmblem", selectedEmblem);
    localStorage.setItem("funds", "100000");

    location.reload(); // Repornește aplicația cu datele salvate
  });
}
