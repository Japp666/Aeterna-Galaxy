export function renderTactics(players) {
  fetch("public/components/tactics.html")
    .then(res => res.text())
    .then(html => {
      const container = document.createElement("div");
      container.innerHTML = html;
      document.getElementById("game-content").innerHTML = "";
      document.getElementById("game-content").appendChild(container);

      renderFormationButtons();
      renderMentalityButtons();
      renderAvailablePlayers(players);
    });
}

function renderFormationButtons() {
  const formations = ["4-4-2", "4-3-3", "3-5-2", "5-3-2"];
  const container = document.getElementById("formation-buttons");

  formations.forEach(form => {
    const btn = document.createElement("button");
    btn.textContent = form;
    btn.className = "formation-button";
    btn.addEventListener("click", () => {
      document.querySelectorAll(".formation-button").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      // TODO: aplica formația pe teren
    });
    container.appendChild(btn);
  });
}

function renderMentalityButtons() {
  document.querySelectorAll(".mentality-button").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".mentality-button").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      // TODO: aplică mentalitatea
    });
  });

  document.getElementById("auto-arrange-btn").addEventListener("click", () => {
    // TODO: Algoritm simplu de auto-arrangement
    alert("Auto aranjare jucători (în dezvoltare)");
  });
}

function renderAvailablePlayers(players) {
  const container = document.getElementById("available-players-list");
  container.innerHTML = "";

  players.forEach(player => {
    const item = document.createElement("div");
    item.className = "available-player-item";

    item.innerHTML = `
      <div class="player-info">
        <div class="player-name">${player.name}</div>
        <div class="player-overall">OVR ${player.ovr}</div>
      </div>
      <div class="player-details">
        <div class="player-pos">${player.position}</div>
        <div class="player-value">${player.value.toLocaleString()} €</div>
      </div>
    `;

    container.appendChild(item);
  });
}
