/* public/js/roster-renderer.js */

import { loadGameState } from './game-state.js'; // Importă loadGameState
import { getStars } from './player-generator.js';

const rosterTableBody = document.getElementById('roster-table-body');
const playerDetailsModal = document.getElementById('player-details-modal');
const playerDetailsCloseBtn = document.getElementById('player-details-close-btn');

// Asumând că aceste elemente există în player-details-modal.html sau direct în index.html
const modalPlayerName = document.getElementById('modal-player-name');
const playerModalImage = document.querySelector('.player-modal-image');
const playerModalInitials = document.querySelector('.player-modal-initials');
const playerModalOVR = document.querySelector('.player-modal-ovr');
const playerStarsRating = document.querySelector('.player-stars-rating');
const modalPlayerAge = document.getElementById('modal-player-age');
const modalPlayerPosition = document.getElementById('modal-player-position');
const modalPlayerTeam = document.getElementById('modal-player-team');
const modalPlayerRarity = document.getElementById('modal-player-rarity');
const modalPlayerPotential = document.getElementById('modal-player-potential');

// Funcție pentru a actualiza dinamic atributele în modal
function updateAttributeDisplay(attributeId, value) {
    const element = document.getElementById(attributeId);
    if (element) {
        element.textContent = value;
    }
}

/**
 * Randează lotul echipei în tabel.
 */
export function renderRoster() {
    console.log("roster-renderer.js: Se randează lotul echipei.");
    rosterTableBody.innerHTML = ''; // Golește rândurile existente

    const gameState = loadGameState(); // Încarcă starea jocului aici

    if (!gameState || !gameState.players || gameState.players.length === 0) {
        rosterTableBody.innerHTML = '<tr><td colspan="5">Lotul echipei este gol.</td></tr>';
        console.log("roster-renderer.js: Lotul echipei este gol sau gameState nu este disponibil.");
        return;
    }

    gameState.players.forEach(player => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${player.initials}</td>
            <td>${player.name}</td>
            <td>${player.playablePositions[0]}</td>
            <td>${player.ovr}</td>
            <td class="player-stars">${'⭐'.repeat(getStars(player.ovr))}</td>
        `;
        row.dataset.playerId = player.id; // Adaugă data-playerId pentru delegarea evenimentelor
        row.addEventListener('click', () => showPlayerDetails(player, gameState.club.name)); // Trece numele clubului pentru afișare
        rosterTableBody.appendChild(row);
    });
    console.log(`roster-renderer.js: Au fost randați ${gameState.players.length} jucători.`);
}

/**
 * Afișează modalul cu detaliile jucătorului.
 * @param {object} player - Obiectul jucătorului de afișat.
 * @param {string} clubName - Numele clubului.
 */
function showPlayerDetails(player, clubName) {
    if (!playerDetailsModal) {
        console.error("roster-renderer.js: Elementul modal de detalii jucător nu a fost găsit.");
        return;
    }

    modalPlayerName.textContent = player.name;
    playerModalImage.src = player.image || 'https://placehold.co/120x180/3a4a5d/ffffff?text=Jucator'; // Placeholder dacă nu există imagine
    playerModalInitials.textContent = player.initials;
    playerModalOVR.textContent = `OVR ${player.ovr}`;

    // Randează steluțele
    playerStarsRating.innerHTML = '⭐'.repeat(getStars(player.ovr));

    modalPlayerAge.textContent = player.age;
    modalPlayerPosition.textContent = player.playablePositions.join(', '); // Unește pozițiile multiple
    modalPlayerTeam.textContent = clubName;
    modalPlayerRarity.textContent = player.rarity;
    // Adaugă clasa corespunzătoare pentru stilizarea rarității
    modalPlayerRarity.className = `player-rarity-tag player-rarity-${player.rarity.toLowerCase().replace(' ', '-')}`;

    modalPlayerPotential.textContent = player.potential;
    // Adaugă clasa corespunzătoare pentru stilizarea potențialului
    modalPlayerPotential.className = `player-potential-tag player-potential-${player.potential.toLowerCase().replace(' ', '-')}`;

    // Actualizează atributele
    if (player.attributes) {
        for (const category in player.attributes) {
            for (const attr in player.attributes[category]) {
                updateAttributeDisplay(`attr-${attr}`, player.attributes[category][attr]);
            }
        }
    }

    playerDetailsModal.style.display = 'block'; // Afișează modalul
    playerDetailsModal.setAttribute('aria-hidden', 'false');
}

// Listener pentru butonul de închidere al modalului de detalii jucător
if (playerDetailsCloseBtn) {
    playerDetailsCloseBtn.addEventListener('click', () => {
        if (playerDetailsModal) {
            playerDetailsModal.style.display = 'none'; // Ascunde modalul
            playerDetailsModal.setAttribute('aria-hidden', 'true');
        }
    });
}

// Închide modalul la click în afara lui
window.addEventListener('click', (event) => {
    if (event.target === playerDetailsModal) {
        playerDetailsModal.style.display = 'none';
        playerDetailsModal.setAttribute('aria-hidden', 'true');
    }
});
