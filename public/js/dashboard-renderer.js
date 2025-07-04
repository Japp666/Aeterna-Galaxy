// js/dashboard-renderer.js
import { getGameData } from './game-state.js'; // Schimbat 'getGameState' în 'getGameData'

export function renderDashboard(rootElement) {
    console.log("dashboard-renderer.js: renderDashboard() - Se randează dashboard-ul.");
    if (!rootElement) {
        console.error("dashboard-renderer.js: Elementul rădăcină pentru dashboard nu a fost furnizat.");
        return;
    }

    const gameData = getGameData();
    const coachName = gameData.coachName;
    const selectedTeamId = gameData.selectedTeamId;
    const currentDay = gameData.currentDay;

    const team = gameData.divisions.flatMap(d => d.teams).find(t => t.id === selectedTeamId);

    if (!team) {
        rootElement.innerHTML = `<p class="error-message">Eroare: Echipa selectată nu a fost găsită în datele jocului.</p>`;
        console.error("dashboard-renderer.js: Echipa selectată nu a fost găsită.");
        return;
    }

    rootElement.innerHTML = `
        <h2>Bun venit, ${coachName}!</h2>
        <p>Echipa ta: <span class="team-name">${team.name}</span></p>
        <img src="${team.emblemUrl}" alt="${team.name} Emblem" style="max-width: 150px; max-height: 150px;">
        <p>Overall Rating: ${team.overallRating}</p>
        <p>Ziua curentă: <span id="current-day">${currentDay}</span></p>
        <div class="dashboard-stats">
            <h3>Statistici Ligă</h3>
            <p>Divizia ta: ${team.divisionName || 'N/A'}</p>
            <button id="viewStandingsBtn">Vezi Clasament</button>
        </div>
        <div class="next-match-info">
            <h3>Următorul Meci</h3>
            <p>Adversar: N/A</p>
            <p>Data: N/A</p>
            <p>Locație: N/A</p>
            </div>
    `;

    console.log("dashboard-renderer.js: Dashboard-ul a fost randat cu succes.");

    // Example of event listener for a button
    const viewStandingsBtn = rootElement.querySelector('#viewStandingsBtn');
    if (viewStandingsBtn) {
        viewStandingsBtn.addEventListener('click', () => {
            // Implementează logica pentru a schimba tab-ul la clasament
            console.log("dashboard-renderer.js: Butonul 'Vezi Clasament' a fost apăsat.");
            // showTab('standings'); // Presupunând că ai o funcție showTab globală sau o gestionezi prin main.js
        });
    }
}
