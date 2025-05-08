/* ---------- Funcții pentru Login & Selecție Rasă ---------- */
document.getElementById("loginForm").addEventListener("submit", function (e) {
  e.preventDefault();
  var username = document.getElementById("username").value;
  var password = document.getElementById("password").value;
  if (username && password) {
    document.getElementById("login-section").style.display = "none";
    document.getElementById("race-selection").style.display = "flex";
  } else {
    alert("Completează toate câmpurile!");
  }
});

function selectRace() {
  document.getElementById("race-selection").style.display = "none";
  document.getElementById("game-interface").style.display = "block";
  showNotification("Rasă 'Solari' selectată. Bine ai venit în universul Solari!");
}

/* ---------- Funcții pentru Dashboard: Clădirea de Extracție ---------- */
const upgradeDuration = 10; // Durata upgrade-ului în secunde
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
    let progressPercentage =
      ((upgradeDuration - remainingTime) / upgradeDuration) * 100;
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

/* ---------- Funcții pentru Selecția Flotei ---------- */
function addAll(shipType) {
  let quantitySpan, inputElement;
  switch (shipType) {
    case "titan":
      quantitySpan = document.getElementById("quantity-titan");
      inputElement = document.getElementById("input-titan");
      break;
    case "vortex":
      quantitySpan = document.getElementById("quantity-vortex");
      inputElement = document.getElementById("input-vortex");
      break;
    case "dread":
      quantitySpan = document.getElementById("quantity-dread");
      inputElement = document.getElementById("input-dread");
      break;
    default:
      return;
  }
  inputElement.value = quantitySpan.textContent;
}

/* ---------- Funcții pentru Harta Planetei & Tooltip ---------- */
function showTooltip(e) {
  var tooltip = document.getElementById("tooltip");
  var marker = e.currentTarget;
  var name = marker.getAttribute("data-name");
  var points = marker.getAttribute("data-points");
  var coords = marker.getAttribute("data-coords");
  tooltip.textContent = name + " | Puncte: " + points + " | Coords: " + coords;
  tooltip.style.top = e.clientY + 10 + "px";
  tooltip.style.left = e.clientX + 10 + "px";
  tooltip.style.display = "block";
}

function hideTooltip(e) {
  document.getElementById("tooltip").style.display = "none";
}

/* ---------- Funcții pentru Modal: Detalii Jucător & Atac ---------- */
var selectedPlayer = {};

function openPlayerModal(marker) {
  selectedPlayer.name = marker.getAttribute("data-name");
  selectedPlayer.points = marker.getAttribute("data-points");
  selectedPlayer.coords = marker.getAttribute("data-coords");
  selectedPlayer.alliance = "N/A";
  selectedPlayer.description = "Fără descriere.";
  var modal = document.getElementById("playerModal");
  var body = document.getElementById("playerModalBody");
  body.innerHTML =
    "<div><strong>Nume:</strong> " +
    selectedPlayer.name +
    "</div><div><strong>Alianță:</strong> " +
    selectedPlayer.alliance +
    "</div><div><strong>Coordonate:</strong> " +
    selectedPlayer.coords +
    "</div><div><strong>Puncte:</strong> " +
    selectedPlayer.points +
    "</div><div><strong>Descriere:</strong> " +
    selectedPlayer.description +
    "</div>";
  modal.style.display = "flex";
}

function closePlayerModal() {
  document.getElementById("playerModal").style.display = "none";
}

function sendSpy() {
  showNotification(
    "Spion trimis către " +
      selectedPlayer.name +
      " la " +
      selectedPlayer.coords +
      "!"
  );
}

function openAttackModal() {
  document.getElementById("attackModal").style.display = "flex";
  closePlayerModal();
}

function closeAttackModal() {
  document.getElementById("attackModal").style.display = "none";
}

function calculateAttackInfo() {
  var distance = 36.06; // Exemplu: distanță fixă
  var numTitan =
    parseInt(document.getElementById("input-titan-attack").value) || 0;
  var numVortex =
    parseInt(document.getElementById("input-vortex-attack").value) || 0;
  var numDread =
    parseInt(document.getElementById("input-dread-attack").value) || 0;
  var fuel = (numTitan * 1.0 + numVortex * 2.0 + numDread * 3.0) * distance;
  var speeds = [];
  if (numTitan > 0) speeds.push(100);
  if (numVortex > 0) speeds.push(75);
  if (numDread > 0) speeds.push(50);
  var minSpeed = speeds.length ? Math.min.apply(null, speeds) : 0;
  var travelTime = minSpeed > 0 ? (distance / minSpeed) * 100 : 0;
  document.getElementById("fuel-required").textContent = Math.round(fuel);
  document.getElementById("travel-time").textContent = Math.round(travelTime);
}

function sendFleet() {
  calculateAttackInfo();
  showNotification(
    "Flota trimisă către " +
      selectedPlayer.name +
      " la " +
      selectedPlayer.coords +
      "!"
  );
  closeAttackModal();
}

document
  .getElementById("input-titan-attack")
  .addEventListener("input", calculateAttackInfo);
document
  .getElementById("input-vortex-attack")
  .addEventListener("input", calculateAttackInfo);
document
  .getElementById("input-dread-attack")
  .addEventListener("input", calculateAttackInfo);

/* ---------- Funcție pentru Notificare SF ---------- */
function showNotification(message) {
  var notification = document.getElementById("notification");
  notification.textContent = message;
  notification.classList.add("show");
  setTimeout(function () {
    notification.classList.remove("show");
  }, 3000);
}
