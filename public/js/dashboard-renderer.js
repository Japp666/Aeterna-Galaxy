// public/js/dashboard-renderer.js

// Nu mai este nevoie să importăm getGameState aici dacă primim starea ca argument
// import { getGameState } from './game-state.js'; 

/**
 * Randează informațiile dashboard-ului în elementul rădăcină specificat.
 * @param {HTMLElement} rootElement - Elementul DOM în care se va randa dashboard-ul.
 * @param {object} gameState - Starea curentă a jocului.
 */
export function renderDashboard(rootElement, gameState) {
    console.log("dashboard-renderer.js: renderDashboard() - Inițializarea logicii dashboard-ului.");
    console.log("dashboard-renderer.js: renderDashboard() - Starea jocului primită:", gameState);

    // Asigură-te că gameState și club sunt definite
    if (!gameState || !gameState.club || !gameState.coach) {
        console.error("dashboard-renderer.js: Starea jocului sau informațiile despre club/antrenor sunt nedefinite. Nu se poate randa dashboard-ul.");
        rootElement.innerHTML = '<p class="error-message">Eroare la încărcarea datelor dashboard-ului. Informații esențiale lipsă.</p>';
        return;
    }

    const clubInfo = gameState.club;
    const coachInfo = gameState.coach;
    const players = gameState.players; // Poate fi folosit pentru statistici rapide

    // Construiește conținutul HTML pentru dashboard
    let dashboardHtml = `
        <div class="dashboard-section">
            <h3>Informații Club</h3>
            <p><strong>Nume Club:</strong> ${clubInfo.name}</p>
            <p><strong>Campionat:</strong> ${clubInfo.league}</p>
            <p><strong>Balanță Financiară:</strong> ${clubInfo.balance.toLocaleString('ro-RO', { style: 'currency', currency: 'CREDITS' })}</p>
            <p><strong>Reputație:</strong> ${clubInfo.reputation}</p>
        </div>
        <div class="dashboard-section">
            <h3>Informații Antrenor</h3>
            <p><strong>Nume:</strong> ${coachInfo.name}</p>
            <p><strong>Vârstă:</strong> ${coachInfo.age}</p>
            <p><strong>Reputație Antrenor:</strong> ${coachInfo.reputation}</p>
        </div>
        <div class="dashboard-section">
            <h3>Stare Generală Joc</h3>
            <p><strong>Sezon Curent:</strong> ${gameState.currentSeason}</p>
            <p><strong>Ziua Curentă:</strong> ${gameState.currentDay}</p>
            <p><strong>Număr Jucători în Lot:</strong> ${players.length}</p>
            <!-- Aici poți adăuga mai multe statistici generale -->
        </div>
    `;

    rootElement.innerHTML = dashboardHtml;
    console.log("dashboard-renderer.js: Dashboard randat cu succes.");
}
