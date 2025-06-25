// public/js/dashboard-renderer.js

import { getGameState } from './game-state.js';

// Funcția pentru a încărca conținutul HTML al tab-ului Dashboard
export async function loadDashboardTabContent() {
    console.log("dashboard-renderer.js: loadDashboardTabContent() - Se încarcă conținutul HTML pentru dashboard.");
    try {
        // CORECTAT: numele fișierului este acum 'dashboard.html'
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

// Funcția pentru a inițializa logica tab-ului Dashboard
export function initDashboardTab() { 
    console.log("dashboard-renderer.js: initDashboardTab() - Inițializarea logicii dashboard-ului.");
    const gameState = getGameState();

    // Selectăm elementul principal 'dashboard-content' din HTML-ul încărcat
    // Acesta este div-ul cu clasa "card" din dashboard.html
    const dashboardContent = document.querySelector('.dashboard-content');
    if (!dashboardContent) {
        console.error("dashboard-renderer.js: Elementul cu clasa 'dashboard-content' nu a fost găsit în DOM.");
        // Încearcă să injectezi un mesaj de eroare dacă elementul principal nu există
        const gameContent = document.getElementById('game-content');
        if(gameContent) {
            gameContent.innerHTML = `<p class="error-message">Eroare la inițializarea Dashboard-ului: Elementul principal nu a fost găsit.</p>`;
        }
        return;
    }

    // Curățăm conținutul existent (textul "Bun venit...") și injectăm structura cu datele dinamice
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

    // Acum, deoarece am injectat direct HTML-ul cu datele actualizate,
    // nu mai e nevoie să facem querySelector și să setăm textContent pentru fiecare element individual.
    // Lăsăm comentate rândurile pentru a nu crea confuzie:
    // const clubNameElement = dashboardContent.querySelector('#dashboard-club-name');
    // if (clubNameElement) clubNameElement.textContent = gameState.club.name;
    // ...și celelalte elemente

    console.log("dashboard-renderer.js: Informații dashboard actualizate.");
}
