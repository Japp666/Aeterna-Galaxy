// roster-renderer.js
import { getGameState } from './game-state.js';

export function initializeRoster(rosterRootElement) {
    console.log("roster-renderer.js: Inițializare lot jucători...");

    const gameState = getGameState();
    const players = gameState.players;

    const rosterTableBody = rosterRootElement.querySelector('#rosterTableBody');
    if (!rosterTableBody) {
        console.error("roster-renderer.js: Elementul #rosterTableBody nu a fost găsit.");
        return;
    }

    rosterTableBody.innerHTML = ''; // Clear existing rows

    players.forEach(player => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${player.name}</td>
            <td>${player.position}</td>
            <td>${player.overall}</td>
            <td>${player.age}</td>
            <td>${player.value.toLocaleString('ro-RO')} €</td>
        `;
        rosterTableBody.appendChild(row);
    });
}
