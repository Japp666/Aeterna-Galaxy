// js/roster-renderer.js
import { gameState } from './game-state.js';

const playerDetailsModal = document.getElementById('player-details-modal');
const closeButton = playerDetailsModal ? playerDetailsModal.querySelector('.close-button') : null;

if (closeButton) {
    closeButton.addEventListener('click', () => {
        playerDetailsModal.classList.remove('active');
    });
}

// Închide modalul dacă se face click în afara lui
window.addEventListener('click', (event) => {
    if (event.target === playerDetailsModal) {
        playerDetailsModal.classList.remove('active');
    }
});

/**
 * Deschide modalul cu detaliile jucătorului.
 * @param {Object} player - Obiectul jucătorului.
 */
export function openPlayerDetailsModal(player) {
    if (!playerDetailsModal) {
        console.error("Modalul de detalii jucător nu a fost găsit.");
        return;
    }

    // Actualizează conținutul modalului
    playerDetailsModal.querySelector('#modal-player-name').textContent = player.fullName;
    playerDetailsModal.querySelector('#modal-player-age').textContent = player.age;
    playerDetailsModal.querySelector('#modal-player-position').textContent = player.position;
    playerDetailsModal.querySelector('#modal-player-ovr').textContent = player.overallRating;
    playerDetailsModal.querySelector('#modal-player-potential').textContent = player.potential;
    playerDetailsModal.querySelector('#modal-player-rarity').textContent = player.rarity;

    // Atribute
    playerDetailsModal.querySelector('#modal-attr-defense').textContent = player.attributes.defense;
    playerDetailsModal.querySelector('#modal-attr-offense').textContent = player.attributes.offense;
    playerDetailsModal.querySelector('#modal-attr-physical').textContent = player.attributes.physical;
    playerDetailsModal.querySelector('#modal-attr-technique').textContent = player.attributes.technique;
    playerDetailsModal.querySelector('#modal-attr-speed').textContent = player.attributes.speed;
    playerDetailsModal.querySelector('#modal-attr-stamina').textContent = player.attributes.stamina;

    playerDetailsModal.classList.add('active');
}

/**
 * Generează HTML-ul pentru rating-ul cu steluțe.
 * @param {number} ovr - Overall Rating al jucătorului.
 * @returns {string} HTML-ul cu steluțe.
 */
function generateStarRating(ovr) {
    const maxStars = 5;
    const filledStars = Math.min(maxStars, Math.floor(ovr / 20)); // OVR 0-100 -> 0-5 stele
    let html = `<div class="player-rating">${ovr} `;
    for (let i = 0; i < maxStars; i++) {
        if (i < filledStars) {
            html += `<i class="fas fa-star star"></i>`;
        } else {
            html += `<i class="far fa-star star-empty"></i>`;
        }
    }
    html += `</div>`;
    return html;
}

/**
 * Randează tabelul cu lotul de jucători.
 * @param {HTMLElement} rosterRootElement - Elementul rădăcină al tab-ului lot (div#roster-tab-content).
 */
export function renderRoster(rosterRootElement) {
    console.log("roster-renderer.js: Se randează lotul de jucători.");

    if (!rosterRootElement) {
        console.error("roster-renderer.js: Elementul rădăcină al lotului nu a fost furnizat.");
        return;
    }

    const rosterTableBody = rosterRootElement.querySelector('#roster-table tbody');
    const sortBySelect = rosterRootElement.querySelector('#sort-by');
    const filterPositionSelect = rosterRootElement.querySelector('#filter-position');

    if (!rosterTableBody || !sortBySelect || !filterPositionSelect) {
        console.error("Elemente HTML necesare pentru randarea lotului nu au fost găsite.");
        return;
    }

    const userTeam = gameState.getUserTeam();
    if (!userTeam) {
        console.error("Echipa utilizatorului nu a fost găsită în gameState.");
        rosterTableBody.innerHTML = '<tr><td colspan="7">Echipa nu a fost găsită.</td></tr>';
        return;
    }

    let playersToDisplay = [...userTeam.players]; // Lucrează pe o copie

    // Aplică filtrarea
    const filterPosition = filterPositionSelect.value;
    if (filterPosition !== 'all') {
        playersToDisplay = playersToDisplay.filter(player => player.position === filterPosition);
    }

    // Aplică sortarea
    const sortBy = sortBySelect.value;
    playersToDisplay.sort((a, b) => {
        if (sortBy === 'ovr') {
            return b.overallRating - a.overallRating; // Descrescător
        } else if (sortBy === 'name') {
            return a.fullName.localeCompare(b.fullName);
        } else if (sortBy === 'age') {
            return a.age - b.age;
        } else if (sortBy === 'position') {
            return a.position.localeCompare(b.position);
        }
        return 0;
    });

    rosterTableBody.innerHTML = ''; // Curăță tabelul înainte de a randa

    playersToDisplay.forEach((player, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${player.fullName}</td>
            <td>${player.position}</td>
            <td>${player.age}</td>
            <td>${generateStarRating(player.overallRating)}</td>
            <td>${player.potential}</td>
            <td>${player.rarity}</td>
        `;
        row.addEventListener('click', () => openPlayerDetailsModal(player));
        rosterTableBody.appendChild(row);
    });

    // Adaugă event listeners pentru sortare și filtrare
    sortBySelect.onchange = () => renderRoster(rosterRootElement);
    filterPositionSelect.onchange = () => renderRoster(rosterRootElement);
}
