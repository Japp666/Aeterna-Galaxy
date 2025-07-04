// js/roster-renderer.js
import { getGameData } from './game-state.js'; // Schimbat 'getGameState' în 'getGameData'

export function renderRoster(rootElement) {
    console.log("roster-renderer.js: renderRoster() - Se randează lotul.");
    if (!rootElement) {
        console.error("roster-renderer.js: Elementul rădăcină pentru lot nu a fost furnizat.");
        return;
    }

    const gameData = getGameData();
    const selectedTeamId = gameData.selectedTeamId;
    const team = gameData.divisions.flatMap(d => d.teams).find(t => t.id === selectedTeamId);

    if (!team) {
        rootElement.innerHTML = `<p class="error-message">Eroare: Echipa selectată nu a fost găsită pentru afișarea lotului.</p>`;
        console.error("roster-renderer.js: Echipa selectată nu a fost găsită în datele jocului pentru lot.");
        return;
    }

    // Placeholder pentru generarea jucătorilor (dacă nu există)
    if (team.players.length === 0) {
        console.log("roster-renderer.js: Generăm jucători placeholder pentru echipă.");
        // Aici ar trebui să generezi jucători reali, cu statistici
        for (let i = 1; i <= 25; i++) { // 25 de jucători
            team.players.push({
                id: `player-${team.id}-${i}`,
                name: `Jucator ${i}`,
                overall: Math.floor(Math.random() * (90 - 50 + 1)) + 50, // OVR între 50 și 90
                position: 'N/A', // Ex: GK, DEF, MID, FWD
                age: Math.floor(Math.random() * (35 - 18 + 1)) + 18,
                value: Math.floor(Math.random() * (10000000 - 100000 + 1)) + 100000, // Valoare de piață
                wage: Math.floor(Math.random() * (50000 - 5000 + 1)) + 5000, // Salariu săptămânal
                contract: Math.floor(Math.random() * (5 - 1 + 1)) + 1, // Ani de contract
            });
        }
        // După generare, salvează starea jocului pentru a persista jucătorii
        // updateGameData({ divisions: gameData.divisions }); // Acest lucru ar declanșa saveGameData
    }

    let playersHtml = team.players.map(player => `
        <div class="player-card">
            <h3>${player.name}</h3>
            <p>OVR: ${player.overall}</p>
            <p>Pozitie: ${player.position}</p>
            <p>Varsta: ${player.age}</p>
            <p>Valoare: ${player.value.toLocaleString()} Cr</p>
            <p>Salariu: ${player.wage.toLocaleString()} Cr/spt</p>
            <p>Contract: ${player.contract} ani</p>
            <button class="view-player-details" data-player-id="${player.id}">Detalii</button>
        </div>
    `).join('');

    rootElement.innerHTML = `
        <h2>Lotul Echipei Tale: ${team.name}</h2>
        <div class="roster-grid">
            ${playersHtml}
        </div>
    `;

    // Adaugă event listener-e pentru butoanele "Detalii"
    rootElement.querySelectorAll('.view-player-details').forEach(button => {
        button.addEventListener('click', (event) => {
            const playerId = event.target.dataset.playerId;
            // Aici vei implementa logica pentru a afișa detalii jucător într-un modal
            console.log(`roster-renderer.js: A fost apăsat butonul 'Detalii' pentru jucătorul: ${playerId}`);
            // displayPlayerDetailsModal(playerId); // O funcție modală pe care o vei implementa
        });
    });

    console.log("roster-renderer.js: Lotul a fost randat cu succes.");
}
