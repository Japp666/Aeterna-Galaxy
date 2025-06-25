// public/js/roster-renderer.js

import { getGameState } from './game-state.js';

// Funcția pentru a încărca conținutul HTML al tab-ului Roster
// Trebuie să fie exportată
export async function loadRosterTabContent() { // Adăugat 'export' aici
    console.log("roster-renderer.js: loadRosterTabContent() - Se încarcă conținutul HTML pentru roster.");
    try {
        // Asigură-te că numele fișierului HTML este corect
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

// Funcția pentru a inițializa logica tab-ului Roster
// Trebuie să fie exportată
export function initRosterTab() { // Adăugat 'export' aici
    console.log("roster-renderer.js: initRosterTab() - Inițializarea logicii roster-ului.");
    const gameState = getGameState();
    const rosterListContainer = document.getElementById('roster-list'); // Containerul principal din HTML-ul roster-tab.html

    if (!rosterListContainer) {
        console.error("roster-renderer.js: Elementul '#roster-list' nu a fost găsit în DOM.");
        const gameContent = document.getElementById('game-content');
        if(gameContent) {
            gameContent.innerHTML = `<p class="error-message">Eroare la inițializarea Lotului: Elementul principal nu a fost găsit.</p>`;
        }
        return;
    }

    rosterListContainer.innerHTML = ''; // Curățăm orice conținut existent

    const positions = ['GK', 'DF', 'MF', 'AT']; // Ordinea pozițiilor

    positions.forEach(pos => {
        const playersByPosition = gameState.players.filter(player => player.position === pos);

        const categoryDiv = document.createElement('div');
        categoryDiv.className = 'roster-category';
        rosterListContainer.appendChild(categoryDiv);

        const categoryTitle = document.createElement('h3');
        categoryTitle.textContent = getFullPositionName(pos); // Funcție ajutătoare pentru nume complet
        categoryDiv.appendChild(categoryTitle);

        if (playersByPosition.length === 0) {
            const noPlayersMsg = document.createElement('p');
            noPlayersMsg.className = 'no-players-message';
            noPlayersMsg.textContent = `Nu există jucători pe poziția de ${getFullPositionName(pos)}.`;
            categoryDiv.appendChild(noPlayersMsg);
        } else {
            const playerGrid = document.createElement('div');
            playerGrid.className = 'roster-player-grid';
            categoryDiv.appendChild(playerGrid);

            playersByPosition.forEach(player => {
                const playerCard = document.createElement('div');
                playerCard.className = `player-card rarity-${player.rarity.toLowerCase()}`; // Adaugă clasa de raritate
                playerGrid.appendChild(playerCard);

                const playerImg = document.createElement('img');
                playerImg.className = 'player-card-img';
                playerImg.src = player.imageUrl || 'img/default-player.png'; // Imagine implicită
                playerImg.alt = player.name;
                playerCard.appendChild(playerImg);

                const playerName = document.createElement('div');
                playerName.className = 'player-card-name';
                playerName.textContent = player.name;
                playerCard.appendChild(playerName);

                const playerPosition = document.createElement('div');
                playerPosition.className = 'player-card-position';
                playerPosition.textContent = `Poziție: ${player.position}`;
                playerCard.appendChild(playerPosition);

                const playerOvr = document.createElement('div');
                playerOvr.className = 'player-card-ovr';
                playerOvr.innerHTML = `OVR: <span>${player.overallRating}</span>`;
                playerCard.appendChild(playerOvr);
            });
        }
    });

    console.log("roster-renderer.js: Lotul de jucători a fost afișat.");
}

// Funcție ajutătoare pentru a obține numele complet al poziției
function getFullPositionName(shortName) {
    switch (shortName) {
        case 'GK': return 'Portari';
        case 'DF': return 'Apărători';
        case 'MF': return 'Mijlocași';
        case 'AT': return 'Atacanți';
        default: return shortName;
    }
}
