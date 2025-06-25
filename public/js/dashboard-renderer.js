// public/js/dashboard-renderer.js

import { getGameState } from './game-state.js';

// Funcția pentru a încărca conținutul HTML al tab-ului Dashboard
export async function loadDashboardTabContent() {
    console.log("dashboard-renderer.js: loadDashboardTabContent() - Se încarcă conținutul HTML pentru dashboard.");
    try {
        // Asigură-te că numele fișierului HTML este corect, conform structurii tale
        const response = await fetch('components/dashboard-tab.html'); 
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const html = await response.text();
        console.log("dashboard-renderer.js: Conținutul HTML pentru dashboard a fost încărcat.");
        return html;
    } catch (error) {
        console.error("dashboard-renderer.js: Eroare la încărcarea conținutului dashboard-tab.html:", error);
        return `<p class="error-message">Eroare la încărcarea Dashboard-ului: ${error.message}</p>`;
    }
}

// Funcția pentru a inițializa logica tab-ului Dashboard
// Am adăugat "export" aici pentru a o face disponibilă altor module (e.g., game-ui.js)
export function initDashboardTab() { 
    console.log("dashboard-renderer.js: initDashboardTab() - Inițializarea logicii dashboard-ului.");
    const gameState = getGameState();

    const dashboardContent = document.getElementById('dashboard-content');
    if (!dashboardContent) {
        console.error("dashboard-renderer.js: Elementul 'dashboard-content' nu a fost găsit în DOM.");
        // Încearcă să injectezi un mesaj de eroare dacă elementul principal nu există
        const gameContent = document.getElementById('game-content');
        if(gameContent) {
            gameContent.innerHTML = `<p class="error-message">Eroare la inițializarea Dashboard-ului: Elementul principal nu a fost găsit.</p>`;
        }
        return;
    }

    // Curățăm conținutul existent și injectăm structura de bază și datele
    dashboardContent.innerHTML = `
        <h2>Dashboard</h2>
        <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; margin-bottom: var(--spacing-lg);">
            <img id="dashboard-club-emblem" src="${gameState.club.emblemUrl}" alt="Emblemă Club" class="club-emblem" style="width: 80px; height: 80px; margin-bottom: var(--spacing-md); border: 3px solid var(--primary-color);">
            <h3 id="dashboard-club-name" style="color: var(--primary-color); font-size: var(--font-size-h2); margin-bottom: var(--spacing-sm);">Nume Club</h3>
        </div>
        <p>Antrenor: <strong id="dashboard-coach-nickname">${gameState.coach.nickname}</strong></p>
        <p>Buget: <strong id="dashboard-club-funds">${gameState.club.funds.toLocaleString('ro-RO')} €</strong></p>
        <p>Sezon: <strong id="dashboard-current-season">${gameState.currentSeason}</strong>, Ziua: <strong id="dashboard-current-day">${gameState.currentDay}</strong></p>
        <p>Număr jucători în lot: <strong>${gameState.players.length}</strong></p>
    `;

    // Aceste querySelector-uri nu mai sunt strict necesare după innerHTML,
    // dar le lăsăm pentru claritate dacă vrei să faci alte modificări ulterioare.
    // const clubNameElement = dashboardContent.querySelector('#dashboard-club-name');
    // const clubFundsElement = dashboardContent.querySelector('#dashboard-club-funds');
    // const coachNicknameElement = dashboardContent.querySelector('#dashboard-coach-nickname');
    // const currentSeasonElement = dashboardContent.querySelector('#dashboard-current-season');
    // const currentDayElement = dashboardContent.querySelector('#dashboard-current-day');
    // const clubEmblemElement = dashboardContent.querySelector('#dashboard-club-emblem'); 

    // Datele sunt deja injectate în innerHTML, așa că nu mai e nevoie să le setăm individual aici,
    // decât dacă ai nevoie să le actualizezi dinamic după încărcare.

    console.log("dashboard-renderer.js: Informații dashboard actualizate.");
}
