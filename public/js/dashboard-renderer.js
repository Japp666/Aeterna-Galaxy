// public/js/dashboard-renderer.js

import { getGameState } from './game-state.js';

// Funcția pentru a încărca conținutul HTML al tab-ului Dashboard
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

// Funcția pentru a inițializa logica tab-ului Dashboard (trebuie EXPORTATĂ)
export function initDashboardTab() { // <-- Aici am adăugat "export"
    console.log("dashboard-renderer.js: initDashboardTab() - Inițializarea logicii dashboard-ului.");
    const gameState = getGameState();

    const clubNameElement = document.getElementById('dashboard-club-name');
    const clubFundsElement = document.getElementById('dashboard-club-funds');
    const coachNicknameElement = document.getElementById('dashboard-coach-nickname');
    const currentSeasonElement = document.getElementById('dashboard-current-season');
    const currentDayElement = document.getElementById('dashboard-current-day');
    const clubEmblemElement = document.getElementById('dashboard-club-emblem'); // Adăugat pentru emblemă pe dashboard

    if (clubNameElement) clubNameElement.textContent = gameState.club.name;
    if (clubFundsElement) clubFundsElement.textContent = gameState.club.funds.toLocaleString('ro-RO');
    if (coachNicknameElement) coachNicknameElement.textContent = gameState.coach.nickname;
    if (currentSeasonElement) currentSeasonElement.textContent = gameState.currentSeason;
    if (currentDayElement) currentDayElement.textContent = gameState.currentDay;
    if (clubEmblemElement) clubEmblemElement.src = gameState.club.emblemUrl; // Setează src pentru emblemă

    console.log("dashboard-renderer.js: Informații dashboard actualizate.");
}
