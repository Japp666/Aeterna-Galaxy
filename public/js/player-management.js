// public/js/player-management.js

import { getGameState } from './game-state.js';

let rosterRootElement; // Elementul rădăcină pentru tab-ul roster
let playerListContainer; // Containerul pentru lista de jucători
let playerDetailsModal; // Modalul pentru detalii jucător
let playerDetailsModalBody; // Corpul modalului unde se afișează detaliile
let closeButton; // Butonul de închidere al modalului

/**
 * Inițializează logica pentru tab-ul de management al jucătorilor (roster).
 * @param {HTMLElement} rootElement - Elementul rădăcină al tab-ului 'roster'.
 */
export function initPlayerManagement(rootElement) {
    console.log("player-management.js: initPlayerManagement() - Se inițializează tab-ul de management al jucătorilor.");
    rosterRootElement = rootElement;
    playerListContainer = rosterRootElement.querySelector('#player-list-container');
    playerDetailsModal = rosterRootElement.querySelector('#player-details-modal');
    playerDetailsModalBody = rosterRootElement.querySelector('#player-details-modal-body');
    closeButton = rosterRootElement.querySelector('.close-button');

    if (!playerListContainer || !playerDetailsModal || !playerDetailsModalBody || !closeButton) {
        console.error("player-management.js: Elemente DOM esențiale pentru managementul jucătorilor lipsesc.");
        rosterRootElement.innerHTML = '<p class="error-message">Eroare la inițializarea tab-ului Jucători: Elemente UI lipsă.</p>';
        return;
    }

    // Adaugă listeneri pentru butoanele de filtrare
    const filterButtons = rosterRootElement.querySelectorAll('.filter-button');
    filterButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            // Elimină clasa 'active' de la toate butoanele
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Adaugă clasa 'active' la butonul curent
            event.target.classList.add('active');

            const position = event.target.dataset.position;
            console.log(`player-management.js: Se filtrează jucătorii după poziția: ${position}`);
            renderPlayerList(position); // Randează lista filtrată
        });
    });

    // Adaugă listener pentru închiderea modalului
    closeButton.addEventListener('click', () => {
        playerDetailsModal.style.display = 'none';
    });

    // Închide modalul dacă se dă click în afara conținutului său
    window.addEventListener('click', (event) => {
        if (event.target === playerDetailsModal) {
            playerDetailsModal.style.display = 'none';
        }
    });

    // Randează lista inițială de jucători (toți)
    renderPlayerList('ALL');
    console.log("player-management.js: Tab-ul de management al jucătorilor a fost inițializat.");
}

/**
 * Randează lista de jucători în containerul specificat.
 * @param {string} filterPosition - Poziția după care se filtrează ('ALL', 'GK', 'DEF', 'MID', 'FWD').
 */
export function renderPlayerList(filterPosition = 'ALL') {
    console.log("player-management.js: renderPlayerList() - Se randează lista de jucători.");
    const gameState = getGameState();
    if (!gameState || !gameState.players) {
        console.error("player-management.js: Starea jocului sau lista de jucători este nedefinită.");
        playerListContainer.innerHTML = '<p class="error-message">Nu s-au putut încărca jucătorii.</p>';
        return;
    }

    let playersToDisplay = gameState.players;

    // Aplică filtrarea
    if (filterPosition !== 'ALL') {
        playersToDisplay = playersToDisplay.filter(player => player.position === filterPosition);
    }

    if (playersToDisplay.length === 0) {
        playerListContainer.innerHTML = '<p class="no-players-message">Nu există jucători pentru această poziție.</p>';
        return;
    }

    let playersHtml = '<div class="player-list-grid">';
    playersToDisplay.forEach(player => {
        // Asigură-te că proprietățile necesare există înainte de a le folosi
        const overall = player.overall || 0;
        const position = player.position || 'N/A';

        playersHtml += `
            <div class="player-card" data-player-id="${player.id}">
                <div class="player-overall">${overall}</div>
                <div class="player-info">
                    <span class="player-name">${player.name || 'N/A'}</span>
                    <span class="player-position">${position}</span>
                </div>
            </div>
        `;
    });
    playersHtml += '</div>';

    playerListContainer.innerHTML = playersHtml;
    console.log(`player-management.js: Lista de jucători a fost randată. ${playersToDisplay.length} jucători afișați.`);

    // Adaugă listeneri de click pentru fiecare jucător
    const playerCards = playerListContainer.querySelectorAll('.player-card');
    playerCards.forEach(card => {
        card.addEventListener('click', (event) => {
            const playerId = event.currentTarget.dataset.playerId;
            handlePlayerSelect(playerId);
        });
    });
}

/**
 * Gestionează selecția unui jucător și afișează detaliile acestuia într-un modal.
 * @param {string} playerId - ID-ul jucătorului selectat.
 */
function handlePlayerSelect(playerId) {
    console.log(`player-management.js: Jucător selectat cu ID: ${playerId}`);
    const gameState = getGameState();
    const selectedPlayer = gameState.players.find(p => p.id === playerId);

    if (selectedPlayer) {
        renderPlayerDetails(selectedPlayer);
        playerDetailsModal.style.display = 'block'; // Afișează modalul
    } else {
        console.error(`player-management.js: Jucătorul cu ID ${playerId} nu a fost găsit.`);
        // Poți afișa un mesaj de eroare în UI aici
    }
}

/**
 * Randează detaliile unui jucător în modal.
 * @param {object} player - Obiectul jucătorului.
 */
function renderPlayerDetails(player) {
    console.log("player-management.js: renderPlayerDetails() - Se randează detaliile jucătorului.");

    // Asigură-te că proprietățile numerice sunt definite și formatează-le
    const salary = (player.salary || 0).toLocaleString('ro-RO') + ' Credite';
    const value = (player.value || 0).toLocaleString('ro-RO') + ' Credite';
    const overall = player.overall || 0;
    const age = player.age || 'N/A';
    const position = player.position || 'N/A';
    const contract = player.contract || 'N/A'; // Presupunem că contractul este un string sau număr de ani

    playerDetailsModalBody.innerHTML = `
        <h3>${player.name || 'N/A'}</h3>
        <p><strong>Overall:</strong> <span class="player-detail-overall">${overall}</span></p>
        <p><strong>Poziție:</strong> ${position}</p>
        <p><strong>Vârstă:</strong> ${age}</p>
        <p><strong>Salariu:</strong> ${salary}</p>
        <p><strong>Valoare:</strong> ${value}</p>
        <p><strong>Contract:</strong> ${contract}</p>
        <p><strong>Atribute:</strong></p>
        <ul>
            <li>Atac: ${player.attributes?.attack || 0}</li>
            <li>Apărare: ${player.attributes?.defense || 0}</li>
            <li>Viteză: ${player.attributes?.speed || 0}</li>
            <li>Rezistență: ${player.attributes?.stamina || 0}</li>
            <li>Tehnică: ${player.attributes?.technique || 0}</li>
            <li>Viziune: ${player.attributes?.vision || 0}</li>
        </ul>
        <!-- Aici poți adăuga mai multe detalii dacă este necesar -->
    `;
    console.log("player-management.js: Detaliile jucătorului au fost randate.");
}
