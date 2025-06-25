// js/roster-renderer.js - Randarea listei de jucători în tab-ul Lot

import { getGameState, updateGameState } from './game-state.js';
import { getRarity } from './player-generator.js'; // Aici am corectat importul

const rosterListElement = document.getElementById('roster-list');

/**
 * Inițializează și randează lista completă de jucători din lot.
 */
export function initRosterTab() {
    console.log("roster-renderer.js: initRosterTab() - Inițializarea tab-ului Lot.");
    renderRoster();
    console.log("roster-renderer.js: initRosterTab() - Tab-ul Lot inițializat.");
}

/**
 * Randează toți jucătorii din lot în interfața utilizatorului.
 */
export function renderRoster() {
    console.log("roster-renderer.js: renderRoster() - Se randează lotul de jucători.");
    const gameState = getGameState();
    const players = gameState.players; // Toți jucătorii din lot

    if (!rosterListElement) {
        console.error("roster-renderer.js: Elementul 'roster-list' nu a fost găsit.");
        return;
    }

    rosterListElement.innerHTML = ''; // Curăță lista existentă

    if (players.length === 0) {
        rosterListElement.innerHTML = '<p class="no-players-message">Nu există jucători în lotul tău.</p>';
        console.log("roster-renderer.js: Nu există jucători de randat.");
        return;
    }

    // Creează un div pentru fiecare categorie de poziție
    const categories = {
        'GK': { title: 'Portari', players: [] },
        'DF': { title: 'Fundași', players: [] },
        'MF': { title: 'Mijlocași', players: [] },
        'AT': { title: 'Atacanți', players: [] }
    };

    players.forEach(player => {
        if (categories[player.position]) {
            categories[player.position].players.push(player);
        }
    });

    for (const posType in categories) {
        const category = categories[posType];
        if (category.players.length > 0) {
            const categorySection = document.createElement('div');
            categorySection.classList.add('roster-category');

            const categoryTitle = document.createElement('h3');
            categoryTitle.textContent = category.title;
            categorySection.appendChild(categoryTitle);

            const playerGrid = document.createElement('div');
            playerGrid.classList.add('roster-player-grid');

            // Sortează jucătorii după OVR descrescător
            category.players.sort((a, b) => b.ovr - a.ovr);

            category.players.forEach(player => {
                const playerCard = document.createElement('div');
                playerCard.classList.add('player-card', `rarity-${getRarity(player.ovr)}`); // Aici folosim getRarity
                playerCard.dataset.playerId = player.id;

                playerCard.innerHTML = `
                    <img src="${player.image || 'https://via.placeholder.com/50'}" alt="${player.name}" class="player-card-img">
                    <div class="player-card-info">
                        <p class="player-card-name">${player.name}</p>
                        <p class="player-card-position">${player.position === 'GK' ? 'Portar' : (player.position === 'DF' ? 'Fundaș' : (player.position === 'MF' ? 'Mijlocaș' : 'Atacant'))}</p>
                        <p class="player-card-ovr">OVR: <span>${player.ovr}</span></p>
                    </div>
                `;
                playerGrid.appendChild(playerCard);
            });
            categorySection.appendChild(playerGrid);
            rosterListElement.appendChild(categorySection);
        }
    }
    console.log("roster-renderer.js: Lotul de jucători randat cu succes.");
}

// Nu sunt necesare event listeneri specifici de drag-drop aici,
// deoarece managementul formației se face în `pitch-renderer.js`.
