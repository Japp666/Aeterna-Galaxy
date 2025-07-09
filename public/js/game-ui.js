import { renderSetupScreen } from "./setup.js";
import { renderDashboard } from "./dashboard-renderer.js";
import { renderRoster } from "./squad-manager.js";
import { renderTactics } from "./formations.js";
// import other tabs when functional

let currentPlayers = [];

window.addEventListener("DOMContentLoaded", () => {
  const nickname = localStorage.getItem("coachNickname");
  if (!nickname) {
    renderSetupScreen();
  } else {
    loadPlayers();
    renderDashboard(currentPlayers);
    setupMenuEvents();
    loadHeaderData();
  }

  document.getElementById("reset-game-button").addEventListener("click", () => {
    localStorage.clear();
    location.reload();
  });
});

function setupMenuEvents() {
  const buttons = document.querySelectorAll(".menu-button");

  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      buttons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      const tab = btn.getAttribute("data-tab");
      switch (tab) {
        case "dashboard":
          renderDashboard(currentPlayers);
          break;
        case "roster":
          renderRoster(currentPlayers);
          break;
        case "tactics":
          renderTactics(currentPlayers);
          break;
        default:
          loadStaticTab(tab);
      }
    });
  });
}

function loadHeaderData() {
  const name = localStorage.getItem("coachNickname");
  const club = localStorage.getItem("clubName");
  const funds = localStorage.getItem("funds");
  const emblem = localStorage.getItem("clubEmblem");

  document.getElementById("header-coach-nickname").textContent = name || "-";
  document.getElementById("header-club-name").textContent = club || "-";
  document.getElementById("header-club-funds").textContent = `${funds || 0} €`;
  document.getElementById("header-club-emblem").src = emblem || "public/img/emblems/emblema01.png";
}

function loadStaticTab(tabName) {
  fetch(`public/components/${tabName}.html`)
    .then(res => res.text())
    .then(html => {
      const container = document.createElement("div");
      container.innerHTML = html;
      document.getElementById("game-content").innerHTML = "";
      document.getElementById("game-content").appendChild(container);
    });
}

function loadPlayers() {
  // EXEMPLU: poți înlocui asta cu fetch din backend sau localStorage
  currentPlayers = [
    {
      name: "John Defender",
      initials: "JD",
      age: 24,
      ovr: 62,
      position: "DC",
      stars: 3,
      team: "FC Galactic",
      rarity: "Rare",
      potential: "Legendary",
      value: 25000,
      attributes: {
        deposedare: 65,
        marcaj: 62,
        pozitionare: 60,
        lovitura_de_cap: 58,
        curaj: 66,
        pase: 50,
        dribling: 40,
        centrari: 30,
        sutare: 45,
        finalizare: 38,
        creativitate: 52,
        vigoare: 70,
        forta: 68,
        agresivitate: 66,
        viteza: 55
      }
    },
    // Poți adăuga mai mulți jucători aici
  ];
}
