import { showPlayerModal } from "./player-modal.js";

export function renderRoster(players) {
  const container = document.createElement("div");
  fetch("public/components/roster-tab.html")
    .then(res => res.text())
    .then(html => {
      container.innerHTML = html;
      document.getElementById("game-content").innerHTML = "";
      document.getElementById("game-content").appendChild(container);

      const tbody = document.getElementById("roster-table-body");
      renderPlayers(players, tbody);

      document.getElementById("sort-squad").addEventListener("change", (e) => {
        const sorted = sortPlayers(players, e.target.value);
        renderPlayers(sorted, tbody);
      });
    });
}

function renderPlayers(players, container) {
  container.innerHTML = "";
  players.forEach(player => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>
        <div class="player-initials-circle-roster-table">
          <span class="player-initials-roster">${player.initials}</span>
          <span class="player-pos-initial-roster">${player.position}</span>
        </div>
      </td>
      <td>${player.name}</td>
      <td>${player.position}</td>
      <td class="ovr-value">${player.ovr}</td>
      <td class="player-stars-table">${renderStars(player.stars)}</td>
    `;
    tr.addEventListener("click", () => showPlayerModal(player));
    container.appendChild(tr);
  });
}

function sortPlayers(players, type) {
  const sorted = [...players];
  if (type === "name") {
    return sorted.sort((a, b) => a.name.localeCompare(b.name));
  } else if (type === "stars") {
    return sorted.sort((a, b) => b.stars - a.stars);
  } else if (type === "position") {
    return sorted.sort((a, b) => a.position.localeCompare(b.position));
  }
  return players;
}

function renderStars(count) {
  return "★".repeat(count) + "☆".repeat(5 - count);
}
