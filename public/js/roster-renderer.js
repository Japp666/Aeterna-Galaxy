// public/js/roster-renderer.js

import { getGameState } from './game-state.js';
import { getRarity } from './player-generator.js'; // Importăm getRarity

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
    const rosterTableBody = document.getElementById('roster-table-body'); // Noul element pentru corpul tabelului
    const playerDetailsModal = document.getElementById('player-details-modal');
    const modalCloseButton = document.getElementById('player-details-close-btn');

    if (!rosterTableBody) {
        console.error("roster-renderer.js: Elementul '#roster-table-body' nu a fost găsit în DOM.");
        const gameContent = document.getElementById('game-content');
        if(gameContent) {
            gameContent.innerHTML = `<p class="error-message">Eroare la inițializarea Lotului: Elementul principal (tabel) nu a fost găsit.</p>`;
        }
        return;
    }
    // Asigură-te că modalul există și că-l poți închide
    if (playerDetailsModal && modalCloseButton) {
        modalCloseButton.addEventListener('click', () => {
            playerDetailsModal.style.display = 'none';
            playerDetailsModal.setAttribute('aria-hidden', 'true');
        });
        // Închide modalul la click în afara lui
        playerDetailsModal.addEventListener('click', (event) => {
            if (event.target === playerDetailsModal) {
                playerDetailsModal.style.display = 'none';
                playerDetailsModal.setAttribute('aria-hidden', 'true');
            }
        });
    }

    rosterTableBody.innerHTML = ''; // Curățăm orice conținut existent

    const positions = ['GK', 'DF', 'MF', 'AT']; // Ordinea pozițiilor pentru sortare/grupare

    // Sortăm jucătorii după poziție și apoi după OVR descrescător
    const sortedPlayers = [...gameState.players].sort((a, b) => {
        const posOrder = { 'GK': 1, 'DF': 2, 'MF': 3, 'AT': 4 };
        if (posOrder[a.position] !== posOrder[b.position]) {
            return posOrder[a.position] - posOrder[b.position];
        }
        return b.ovr - a.ovr; // OVR descrescător în cadrul poziției
    });


    if (sortedPlayers.length === 0) {
        const noPlayersRow = document.createElement('tr');
        noPlayersRow.innerHTML = `<td colspan="6" class="no-players-message">Nu există jucători în lot.</td>`;
        rosterTableBody.appendChild(noPlayersRow);
        return;
    }

    sortedPlayers.forEach(player => {
        const playerRow = document.createElement('tr');
        playerRow.classList.add(`rarity-${player.rarity.toLowerCase()}`); // Adaugă clasa de raritate rândului
        playerRow.dataset.playerId = player.id;
        playerRow.setAttribute('role', 'button');
        playerRow.setAttribute('tabindex', '0');

        // Adăugăm listener de click pentru a deschide modalul
        playerRow.addEventListener('click', () => showPlayerDetails(player));

        playerRow.innerHTML = `
            <td>
                <div class="player-initials-circle-roster-table">
                    <span class="player-initials-roster">${player.initials}</span>
                    <span class="player-pos-initial-roster">${player.position}</span>
                </div>
            </td>
            <td>${player.name}</td>
            <td>${player.position}</td>
            <td><span class="ovr-value">${player.ovr}</span></td>
            <td><span class="player-rarity-tag rarity-${player.rarity.toLowerCase()}">${player.rarity.toUpperCase()}</span></td>
            <td><span class="player-potential-tag rarity-${player.potential.toLowerCase()}">${player.potential.toUpperCase()}</span></td>
        `;
        rosterTableBody.appendChild(playerRow);
    });

    console.log("roster-renderer.js: Lotul de jucători a fost afișat în tabel.");
}

/**
 * Afișează un modal cu detaliile complete ale jucătorului.
 * @param {object} player - Obiectul jucător de afișat.
 */
function showPlayerDetails(player) {
    const modal = document.getElementById('player-details-modal');
    const content = document.getElementById('player-details-content');

    if (!modal || !content) {
        console.error("roster-renderer.js: Elementele modalului nu au fost găsite.");
        return;
    }

    // Populează conținutul modalului
    content.innerHTML = `
        <div class="modal-header">
            <h3>${player.name}</h3>
            <span class="modal-rarity rarity-${player.rarity}">${player.rarity.toUpperCase()}</span>
        </div>
        <div class="modal-body">
            <div class="player-details-overview">
                <div class="player-initials-circle-modal">
                    <span class="player-initials-modal">${player.initials}</span>
                    <span class="player-pos-modal">${player.position}</span>
                </div>
                <div class="player-basic-info">
                    <p><strong>Vârstă:</strong> ${player.age} ani</p>
                    <p><strong>OVR:</strong> <span class="ovr-value">${player.ovr}</span></p>
                    <p><strong>Potențial:</strong> <span class="potential-value rarity-${player.potential}">${player.potential.toUpperCase()}</span></p>
                </div>
            </div>
            <h4>Atribute:</h4>
            <div class="player-attributes-grid">
                <p><strong>Viteză:</strong> <span>${player.speed}</span></p>
                <p><strong>Atac:</strong> <span>${player.attack}</span></p>
                <p><strong>Rezistență:</strong> <span>${player.stamina}</span></p>
                <p><strong>Înălțime:</strong> <span>${player.height} cm</span></p>
                <p><strong>Greutate:</strong> <span>${player.weight} kg</span></p>
                <!-- Adaugă alte atribute aici -->
            </div>
            <!-- Potențial loc pentru istoric, contract, etc. -->
        </div>
    `;

    modal.style.display = 'flex'; // Afișează modalul
    modal.setAttribute('aria-hidden', 'false');
    modal.focus(); // Mută focusul pe modal
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
