// public/js/dashboard-renderer.js - Randare pentru tab-ul Dashboard

import { getGameState } from './game-state.js';

// Am redenumit funcția din initDashboardTab în renderDashboard pentru a se potrivi cu importul din game-ui.js
export function renderDashboard(dashboardContentElement) {
    console.log("dashboard-renderer.js: renderDashboard() - Inițializarea logicii dashboard-ului.");

    const rootElement = dashboardContentElement || document.getElementById('dashboard-content');
    if (!rootElement) {
        console.error("dashboard-renderer.js: Elementul rădăcină pentru dashboard (#dashboard-content) nu a fost găsit.");
        return;
    }

    const gameState = getGameState();
    const club = gameState.club;
    const players = gameState.players;

    // Calculează media overall a jucătorilor
    const totalOverall = players.reduce((sum, player) => sum + player.overall, 0);
    const averageOverall = players.length > 0 ? (totalOverall / players.length).toFixed(1) : 'N/A';

    // Număr de jucători accidentați
    const injuredPlayersCount = players.filter(p => p.isInjured).length;

    // Actualizează conținutul dashboard-ului
    rootElement.innerHTML = `
        <h2 class="text-3xl font-bold text-blue-400 mb-6 pb-2 border-b border-gray-600">Dashboard</h2>
        <p class="text-gray-300 mb-6">Bun venit în biroul tău de manager! Aici vei vedea o privire de ansamblu asupra clubului.</p>
        
        <div class="dashboard-details">
            <div class="club-info-summary">
                <img id="dashboard-club-emblem" src="${club.emblemUrl}" alt="Emblemă Club" class="club-emblem">
                <h3 class="club-name">${club.name}</h3>
                <p>Antrenor: <strong>${gameState.coach.nickname}</strong></p>
            </div>
            <p>Buget Club: <strong>${club.finances.balance.toLocaleString('ro-RO')} €</strong></p>
            <p>Jucători în lot: <strong>${players.length}</strong></p>
            <p>Sezon curent: <strong>${gameState.currentSeason}</strong></p>
            <p>Ziua curentă: <strong>${gameState.currentDay}</strong></p>

            <div class="dashboard-metrics">
                <div class="metric-card">
                    <h4>Reputație Club</h4>
                    <p class="value">${club.reputation}</p>
                </div>
                <div class="metric-card">
                    <h4>Nivel Facilități</h4>
                    <p class="value">${club.facilitiesLevel}</p>
                </div>
                <div class="metric-card">
                    <h4>Reputație Antrenor</h4>
                    <p class="value">${gameState.coach.reputation}</p>
                </div>
                <div class="metric-card">
                    <h4>Experiență Antrenor</h4>
                    <p class="value">${gameState.coach.experience}</p>
                </div>
                <div class="metric-card">
                    <h4>OVR Mediu Lot</h4>
                    <p class="value">${averageOverall}</p>
                </div>
                <div class="metric-card">
                    <h4>Jucători Accidentați</h4>
                    <p class="value">${injuredPlayersCount}</p>
                </div>
            </div>
        </div>
    `;
    console.log("dashboard-renderer.js: Informații dashboard actualizate.");
}
