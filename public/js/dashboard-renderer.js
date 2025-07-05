// public/js/dashboard-renderer.js

import { getGameState } from './game-state.js';
import { showSuccess } from './notification.js';

export async function loadDashboardTabContent() {
  console.log("dashboard-renderer.js: loadDashboardTabContent() - Se încarcă conținutul HTML pentru dashboard.");
  try {
    const response = await fetch('components/dashboard.html');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const html = await response.text();
    console.log("dashboard-renderer.js: Conținutul HTML pentru dashboard a fost încărcat.");
    return html;
  } catch (error) {
    console.error("dashboard-renderer.js: Eroare la încărcarea conținutului dashboard.html:", error);
    return `<p class="error-message">Eroare la încărcarea Dashboard-ului: ${error.message}</p>`;
  }
}

export function initDashboardTab() {
  console.log("dashboard-renderer.js: initDashboardTab() - Inițializarea logicii dashboard-ului.");

  // notificare toast în loc de alert
  showSuccess("Dashboard încărcat cu succes!");

  const gameState = getGameState();
  const dashboardDetailsContainer = document.querySelector('.dashboard-details');
  if (!dashboardDetailsContainer) {
    console.error("dashboard-renderer.js: Elementul cu clasa 'dashboard-details' nu a fost găsit în DOM.");
    const gameContent = document.getElementById('game-content');
    if (gameContent) {
      gameContent.innerHTML = `<p class="error-message">Eroare la inițializarea Dashboard-ului: Elementul principal nu a fost găsit.</p>`;
    }
    return;
  }

  // Populează zona de dashboard cu date din gameState
  dashboardDetailsContainer.innerHTML = `
    <div class="club-info-summary">
      <img id="dashboard-club-emblem"
           src="${gameState.club.emblemUrl}"
           alt="Emblemă Club"
           class="club-emblem">
      <h3 class="club-name">${gameState.club.name}</h3>
      <p>Antrenor: <strong>${gameState.coach.nickname}</strong></p>
    </div>

    <p>Buget Club: <strong>${gameState.club.funds.toLocaleString('ro-RO')} €</strong></p>
    <p>Jucători în lot: <strong>${gameState.players.length}</strong></p>
    <p>Sezon curent: <strong>${gameState.currentSeason}</strong></p>
    <p>Ziua curentă: <strong>${gameState.currentDay}</strong></p>

    <div class="dashboard-metrics">
      <div class="metric-card">
        <h4>Reputație Club</h4>
        <p class="value">${gameState.club.reputation}</p>
      </div>
      <div class="metric-card">
        <h4>Nivel Facilități</h4>
        <p class="value">${gameState.club.facilitiesLevel}</p>
      </div>
      <div class="metric-card">
        <h4>Reputație Antrenor</h4>
        <p class="value">${gameState.coach.reputation}</p>
      </div>
      <div class="metric-card">
        <h4>Experiență Antrenor</h4>
        <p class="value">${gameState.coach.experience}</p>
      </div>
    </div>
  `;

  console.log("dashboard-renderer.js: Informații dashboard actualizate.");
}
