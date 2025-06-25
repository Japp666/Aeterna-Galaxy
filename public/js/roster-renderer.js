// public/js/roster-renderer.js

import { getGameState } from './game-state.js';
import { getRarity } from './player-generator.js';

// Funcția pentru a încărca conținutul HTML al tab-ului Roster
export async function loadRosterTabContent() {
    console.log("roster-renderer.js: loadRosterTabContent() - Se încarcă conținutul HTML pentru roster.");
    try {
        const response = await fetch('components/roster-tab.html');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const html = await response.text();
        console.log("roster-renderer.js: Conținutul HTML pentru roster a fost încărcat.");
        return html;
    } catch (error) {
        console.error("roster-renderer.js: Eroare la încărcarea conținutului roster-tab.html:", error);
        return `<p class="error-message">Eroare la încărcarea Lotului de Jucători: ${error.message}</p>`;
    }
}

// Funcția pentru a inițializa logica tab-ului Roster și a afișa jucătorii
export function initRosterTab() {
    console.log("roster-renderer.js: initRosterTab() - Inițializarea logicii roster-ului.");
    const gameState = getGameState();
    const rosterListContainer = document.getElementById('roster-list');

    if (!rosterListContainer) {
        console.error("roster-renderer.js: Elementul '#roster-list' nu a fost găsit în DOM.");
        // Aici ai putea injecta un mesaj de eroare direct în game-content
        const gameContent = document.getElementById('game-content');
        if(gameContent) {
            gameContent.innerHTML = `<p class="error-message">Eroare la inițializarea Lotului: Elementul principal nu a fost găsit.</p>`;
        }
        return;
    }

    rosterListContainer.innerHTML = ''; // Curățăm orice conținut existent

    const positions = ['GK', 'DF', 'MF', 'AT']; // Ordinea pozițiilor

    // Grupăm jucătorii după poziție
    const playersByPosition = {};
    positions.forEach(pos => playersByPosition[pos] = []);
    gameState.players.forEach(player => {
        if (playersByPosition[player.position]) {
            playersByPosition[player.position].push(player);
        }
    });

    positions.forEach(pos => {
        const playersInThisPosition = playersByPosition[pos];
        
        const categoryDiv = document.createElement('div');
        categoryDiv.className = 'roster-category';
        rosterListContainer.appendChild(categoryDiv);

        const categoryTitle = document.createElement('h3');
        categoryTitle.textContent = getFullPositionName(pos);
        categoryDiv.appendChild(categoryTitle);

        if (playersInThisPosition.length === 0) {
            const noPlayersMsg = document.createElement('p');
            noPlayersMsg.className = 'no-players-message';
            noPlayersMsg.textContent = `Nu există jucători pe poziția de ${getFullPositionName(pos)}.`;
            categoryDiv.appendChild(noPlayersMsg);
        } else {
            const playerGrid = document.createElement('div');
            playerGrid.className = 'roster-player-grid';
            categoryDiv.appendChild(playerGrid);

            playersInThisPosition.forEach(player => {
                const playerCard = document.createElement('div');
                playerCard.classList.add('player-card', `rarity-${getRarity(player.ovr)}`);
                playerCard.dataset.playerId = player.id;

                const playerImageHtml = player.image 
                    ? `<img class="player-card-img" src="${player.image}" alt="${player.name}">`
                    : `<div class="player-placeholder-roster" style="width:60px;height:60px;border-radius:50%;background-color:var(--primary-color);display:flex;align-items:center;justify-content:center;color:var(--text-color-dark);font-size:14px;">${player.position}</div>`;

                playerCard.innerHTML = `
                    ${playerImageHtml}
                    <div class="player-card-info">
                        <p class="player-card-name">${player.name}</p>
                        <p class="player-card-position">Poziție: ${player.position}</p>
                        <p class="player-card-ovr">OVR: <span>${player.ovr}</span></p>
                        <!-- Adaugă aici mai multe detalii dacă vrei, ex: vârstă, salariu -->
                    </div>
                `;
                playerGrid.appendChild(playerCard);
            });
        }
    });

    console.log("roster-renderer.js: Lotul de jucători a fost afișat.");
}

// Funcție ajutătoare pentru a obține numele complet al poziției
function getFullPositionName(shortName) {
    switch (shortName) {
        case 'GK': return 'Portari';
        case 'DF': return 'Fundași';
        case 'MF': return 'Mijlocași';
        case 'AT': return 'Atacanți';
        default: return shortName;
    }
}
