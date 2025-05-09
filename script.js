/* ---------- Funcții pentru Login & Selecție Rasă ---------- */
document.getElementById("loginForm").addEventListener("submit", function (e) {
  e.preventDefault();
  var username = document.getElementById("username").value;
  var password = document.getElementById("password").value;
  if (username && password) {
    // Logica de autentificare poate fi extinsă aici.
    document.getElementById("login-section").style.display = "none";
    document.getElementById("race-selection").style.display = "flex";
  } else {
    alert("Completează toate câmpurile!");
  }
});

document.getElementById("register-btn").addEventListener("click", function () {
  document.getElementById("login-section").style.display = "none";
  document.getElementById("register-section").style.display = "flex";
});

document.getElementById("back-to-login").addEventListener("click", function () {
  document.getElementById("register-section").style.display = "none";
  document.getElementById("login-section").style.display = "flex";
});

document.getElementById("registerForm").addEventListener("submit", function (e) {
  e.preventDefault();
  // Logica de înregistrare poate fi implementată.
  document.getElementById("register-section").style.display = "none";
  document.getElementById("race-selection").style.display = "flex";
});

/* selectRace - dacă se alege Solari */
function selectRace(rasa) {
  if (rasa === "Solari") {
    document.getElementById("race-selection").style.display = "none";
    document.getElementById("game-interface").style.display = "block";
    showNotification("Rasă 'Solari' selectată. Bine ai venit în universul Solari!");
  }
}

/* ---------- Meniu de Navigare ---------- */
const menuLinks = document.querySelectorAll(".menu-link");
menuLinks.forEach(link => {
  link.addEventListener("click", function (e) {
    e.preventDefault();
    menuLinks.forEach(l => l.classList.remove("active"));
    this.classList.add("active");
    const target = this.getAttribute("data-target");
    document.querySelectorAll("#game-interface > section").forEach(sec => {
      sec.style.display = "none";
    });
    document.getElementById(target).style.display = "block";
  });
});

/* ---------- Dashboard: Clădirea de Extracție ---------- */
const upgradeDuration = 10; // în secunde
let remainingTime = upgradeDuration;
let upgradeInterval;
const buildButton = document.getElementById("build-extractor");
const levelSpan = document.getElementById("extractor-level");
const progressBar = document.getElementById("extractor-progress");
const timerDisplay = document.getElementById("extractor-timer");

function formatTime(sec) {
  return "00:" + (sec < 10 ? "0" + sec : sec);
}

function startUpgrade() {
  buildButton.disabled = true;
  buildButton.textContent = "Upgrade în progres...";
  remainingTime = upgradeDuration;
  timerDisplay.textContent = formatTime(remainingTime);
  progressBar.style.width = "0%";
  upgradeInterval = setInterval(() => {
    remainingTime--;
    let progressPercentage = ((upgradeDuration - remainingTime) / upgradeDuration) * 100;
    progressBar.style.width = progressPercentage + "%";
    timerDisplay.textContent = formatTime(remainingTime);
    if (remainingTime <= 0) {
      clearInterval(upgradeInterval);
      finishUpgrade();
    }
  }, 1000);
}

function finishUpgrade() {
  let currentLevel = parseInt(levelSpan.textContent);
  currentLevel++;
  levelSpan.textContent = currentLevel;
  progressBar.style.width = "0%";
  timerDisplay.textContent = "00:00";
  buildButton.textContent = "Upgrade";
  buildButton.disabled = false;
}

buildButton.addEventListener("click", startUpgrade);

/* Digital Clock */
function updateDigitalClock() {
  const clockElem = document.getElementById("digital-clock");
  const now = new Date();
  const hrs = now.getHours().toString().padStart(2, "0");
  const mins = now.getMinutes().toString().padStart(2, "0");
  const secs = now.getSeconds().toString().padStart(2, "0");
  clockElem.textContent = `${hrs}:${mins}:${secs}`;
}
setInterval(updateDigitalClock, 1000);
updateDigitalClock();

/* Production Chart Dummy */
function updateProductionChart() {
  const chartBar = document.getElementById("chart-bar");
  const randomWidth = Math.floor(Math.random() * 100);
  chartBar.style.width = randomWidth + "%";
}
setInterval(updateProductionChart, 3000);
updateProductionChart();

/* ---------- Fleet Section ---------- */
/* Pentru moment, secțiunea de flotă afișează doar un mesaj Coming Soon. */

/* ---------- Harta Planetei & Tooltip ---------- */
function showTooltip(e) {
  const tooltip = document.getElementById("tooltip");
  const marker = e.currentTarget;
  const name = marker.getAttribute("data-name");
  const points = marker.getAttribute("data-points");
  const coords = marker.getAttribute("data-coords");
  tooltip.textContent = `${name} | Puncte: ${points} | Coords: ${coords}`;
  tooltip.style.top = e.clientY + 10 + "px";
  tooltip.style.left = e.clientX + 10 + "px";
  tooltip.style.display = "block";
}

function hideTooltip(e) {
  document.getElementById("tooltip").style.display = "none";
}

/* ---------- Modal: Detalii Jucător & Atac ---------- */
var selectedPlayer = {};

function openPlayerModal(marker) {
  selectedPlayer.name = marker.getAttribute("data-name");
  selectedPlayer.points = marker.getAttribute("data-points");
  selectedPlayer.coords = marker.getAttribute("data-coords");
  selectedPlayer.alliance = "N/A";
  selectedPlayer.description = "Fără descriere.";
  const modal = document.getElementById("playerModal");
  const modalBody = document.getElementById("playerModalBody");
  modalBody.innerHTML =
    "<div><strong>Nume:</strong> " + selectedPlayer.name + "</div>" +
    "<div><strong>Alianță:</strong> " + selectedPlayer.alliance + "</div>" +
    "<div><strong>Coordonate:</strong> " + selectedPlayer.coords + "</div>" +
    "<div><strong>Puncte:</strong> " + selectedPlayer.points + "</div>" +
    "<div><strong>Descriere:</strong> " + selectedPlayer.description + "</div>";
  modal.style.display = "flex";
}

function closePlayerModal() {
  document.getElementById("playerModal").style.display = "none";
}

function sendSpy() {
  showNotification("Spion trimis către " + selectedPlayer.name + " la " + selectedPlayer.coords + "!");
}

function openAttackModal() {
  document.getElementById("attackModal").style.display = "flex";
  closePlayerModal();
}

function closeAttackModal() {
  document.getElementById("attackModal").style.display = "none";
}

function sendFleet() {
  // Pentru moment, doar afișăm o notificare
  showNotification("Flota trimisă către " + selectedPlayer.name + " la " + selectedPlayer.coords + "!");
  closeAttackModal();
}

/* ---------- Notificare SF ---------- */
function showNotification(message) {
  const notification = document.getElementById("notification");
  notification.textContent = message;
  notification.classList.add("show");
  setTimeout(function () {
    notification.classList.remove("show");
  }, 3000);
}
