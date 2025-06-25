// js/pitch-renderer.js - Randarea terenului de fotbal și a jucătorilor

import { getGameState, updateGameState } from './game-state.js';
import { getRarity } from './player-generator.js'; // Aici am corectat importul

// Referințe la elemente DOM
const footballPitch = document.getElementById('football-pitch');
const availablePlayersList = document.getElementById('available-players-list');
const formationSelect = document.getElementById('formation-select');
const mentalitySelect = document.getElementById('mentality-select');

let selectedSlot = null; // Reține slotul de pe teren selectat
let draggingPlayer = null; // Reține jucătorul (cardul din lista) care este târât

// Definiții pentru formații (număr de jucători per linie)
const formations = {
    '4-4-2': { DF: 4, MF: 4, AT: 2, GK: 1 },
    '4-3-3': { DF: 4, MF: 3, AT: 3, GK: 1 },
    '3-5-2': { DF: 3, MF: 5, AT: 2, GK: 1 }
};

/**
 * Inițializează UI-ul tab-ului de echipă: populare select-uri, randare teren.
 */
export function initTeamTab() {
    console.log("pitch-renderer.js: initTeamTab() - Inițializarea tab-ului de echipă.");
    populateFormationSelect();
    populateMentalitySelect();
    renderPitch();
    renderAvailablePlayers();
    addDragDropListeners();
    console.log("pitch-renderer.js: initTeamTab() - Tab-ul de echipă inițializat.");
}

/**
 * Populează dropdown-ul pentru selectarea formației.
 */
function populateFormationSelect() {
    console.log("pitch-renderer.js: populateFormationSelect() - Populez select-ul de formații.");
    formationSelect.innerHTML = ''; // Curăță opțiunile existente
    for (const formationKey in formations) {
        const option = document.createElement('option');
        option.value = formationKey;
        option.textContent = formationKey;
        formationSelect.appendChild(option);
    }
    const gameState = getGameState();
    formationSelect.value = gameState.currentFormation; // Setează formația curentă
    formationSelect.addEventListener('change', (event) => {
        updateGameState({ currentFormation: event.target.value });
        renderPitch(); // Re-randăm terenul la schimbarea formației
        console.log("pitch-renderer.js: Formația schimbată în:", event.target.value);
    });
}

/**
 * Populează dropdown-ul pentru selectarea mentalității.
 */
function populateMentalitySelect() {
    console.log("pitch-renderer.js: populateMentalitySelect() - Populez select-ul de mentalități.");
    const mentalities = ['Defensivă', 'Normală', 'Ofensivă'];
    mentalitySelect.innerHTML = '';
    mentalities.forEach(mentality => {
        const option = document.createElement('option');
        option.value = mentality.toLowerCase();
        option.textContent = mentality;
        mentalitySelect.appendChild(option);
    });
    const gameState = getGameState();
    mentalitySelect.value = gameState.currentMentality;
    mentalitySelect.addEventListener('change', (event) => {
        updateGameState({ currentMentality: event.target.value });
        console.log("pitch-renderer.js: Mentalitatea schimbată în:", event.target.value);
    });
}

/**
 * Randează terenul de fotbal cu sloturile pentru jucători.
 */
export function renderPitch() {
    console.log("pitch-renderer.js: renderPitch() - Se randează terenul.");
    const gameState = getGameState();
    const currentFormation = formations[gameState.currentFormation];

    // Curăță sloturile existente
    document.querySelectorAll('.pitch-zone').forEach(zone => {
        zone.innerHTML = '';
    });

    // Adaugă sloturi goale pentru fiecare poziție conform formației curente
    for (const posType in currentFormation) {
        const zoneElement = document.querySelector(`.pitch-zone[data-position-type="${posType}"]`);
        if (zoneElement) {
            for (let i = 0; i < currentFormation[posType]; i++) {
                const slot = document.createElement('div');
                slot.classList.add('player-slot', 'empty');
                slot.dataset.positionType = posType;
                slot.dataset.slotId = `${posType}${i + 1}`; // Ex: GK1, DF1, MF1, AT1

                const slotText = document.createElement('span');
                slotText.classList.add('player-slot-text');
                slotText.textContent = posType === 'GK' ? 'Portar' : (posType === 'DF' ? 'Fundaș' : (posType === 'MF' ? 'Mijlocaș' : 'Atacant'));
                slot.appendChild(slotText);

                zoneElement.appendChild(slot);
            }
        }
    }

    // Plasează jucătorii existenți din formație în sloturile corespunzătoare
    gameState.teamFormation.forEach(playerInFormation => {
        const slot = document.querySelector(`.player-slot[data-slot-id="${playerInFormation.slotId}"]`);
        if (slot) {
            updateSlotWithPlayer(slot, playerInFormation.player);
        }
    });
    console.log("pitch-renderer.js: Teren randat cu formația:", gameState.currentFormation);
}

/**
 * Randează lista de jucători disponibili.
 */
export function renderAvailablePlayers() {
    console.log("pitch-renderer.js: renderAvailablePlayers() - Se randează jucătorii disponibili.");
    const gameState = getGameState();
    availablePlayersList.innerHTML = '<h3>Jucători Disponibili</h3>'; // Menținem titlul

    // Filtrăm jucătorii care NU sunt deja în formație
    const playersInFormationIds = new Set(gameState.teamFormation.map(p => p.player.id));
    const availablePlayers = gameState.players.filter(player => !playersInFormationIds.has(player.id));

    if (availablePlayers.length === 0) {
        const noPlayersMsg = document.createElement('p');
        noPlayersMsg.textContent = "Nu mai sunt jucători disponibili în lot.";
        noPlayersMsg.style.textAlign = 'center';
        noPlayersMsg.style.marginTop = '20px';
        availablePlayersList.appendChild(noPlayersMsg);
        return;
    }

    availablePlayers.forEach(player => {
        const playerCard = document.createElement('div');
        playerCard.classList.add('player-card', `rarity-${getRarity(player.ovr)}`); // Folosim getRarity
        playerCard.dataset.playerId = player.id;
        playerCard.draggable = true; // Setăm draggable

        playerCard.innerHTML = `
            <img src="${player.image || 'https://via.placeholder.com/50'}" alt="${player.name}" style="width:50px;height:50px;border-radius:50%;">
            <div class="player-card-info">
                <p class="player-card-name">${player.name}</p>
                <p class="player-card-position">Poziție: ${player.position}</p>
                <p class="player-card-ovr">OVR: ${player.ovr}</p>
            </div>
        `;
        availablePlayersList.appendChild(playerCard);
    });
    console.log("pitch-renderer.js: Jucători disponibili randati. Număr:", availablePlayers.length);
}

/**
 * Adaugă listeneri pentru drag and drop.
 */
function addDragDropListeners() {
    console.log("pitch-renderer.js: addDragDropListeners() - Se adaugă listeneri pentru drag&drop.");

    // Drag start pe un jucător din listă
    availablePlayersList.addEventListener('dragstart', (event) => {
        const playerCard = event.target.closest('.player-card');
        if (playerCard) {
            draggingPlayer = playerCard;
            event.dataTransfer.setData('text/plain', playerCard.dataset.playerId);
            playerCard.classList.add('dragging');
            console.log("pitch-renderer.js: Dragstart pe jucător:", playerCard.dataset.playerId);
        }
    });

    // Drag end pe un jucător din listă (pentru curățare clasă dragging)
    availablePlayersList.addEventListener('dragend', (event) => {
        const playerCard = event.target.closest('.player-card');
        if (playerCard) {
            playerCard.classList.remove('dragging');
            draggingPlayer = null;
            console.log("pitch-renderer.js: Dragend pe jucător.");
        }
    });

    // Drag over pe un slot de pe teren
    footballPitch.addEventListener('dragover', (event) => {
        const slot = event.target.closest('.player-slot');
        if (slot && draggingPlayer && slot.dataset.positionType === draggingPlayer.querySelector('.player-card-position').textContent.split(': ')[1]) {
            event.preventDefault(); // Permite drop-ul
            slot.classList.add('drag-over');
            // console.log("pitch-renderer.js: Dragover pe slot:", slot.dataset.slotId);
        }
    });

    // Drag leave de pe un slot de pe teren
    footballPitch.addEventListener('dragleave', (event) => {
        const slot = event.target.closest('.player-slot');
        if (slot) {
            slot.classList.remove('drag-over');
            // console.log("pitch-renderer.js: Dragleave de pe slot:", slot.dataset.slotId);
        }
    });

    // Drop pe un slot de pe teren
    footballPitch.addEventListener('drop', (event) => {
        event.preventDefault();
        const targetSlot = event.target.closest('.player-slot');
        if (targetSlot && draggingPlayer) {
            targetSlot.classList.remove('drag-over');

            const playerId = draggingPlayer.dataset.playerId;
            const gameState = getGameState();
            const player = gameState.players.find(p => p.id === playerId);

            if (player && targetSlot.dataset.positionType === player.position) {
                console.log(`pitch-renderer.js: Drop jucător ${player.name} în slot ${targetSlot.dataset.slotId}`);

                // Verifică dacă slotul este deja ocupat
                const existingPlayerInSlot = gameState.teamFormation.find(item => item.slotId === targetSlot.dataset.slotId);

                // Actualizează starea jocului
                let newTeamFormation = [...gameState.teamFormation];

                if (existingPlayerInSlot) {
                    // Dacă slotul este ocupat, scoate jucătorul vechi de pe teren
                    newTeamFormation = newTeamFormation.filter(item => item.slotId !== targetSlot.dataset.slotId);
                }

                // Adaugă jucătorul nou în slot
                newTeamFormation.push({ playerId: player.id, slotId: targetSlot.dataset.slotId, player: player });

                updateGameState({ teamFormation: newTeamFormation });
                console.log("pitch-renderer.js: Stare joc actualizată după drop.");

                renderPitch(); // Re-randăm terenul pentru a actualiza vizual
                renderAvailablePlayers(); // Re-randăm lista de jucători disponibili
            } else {
                console.warn("pitch-renderer.js: Drop invalid: jucătorul nu se potrivește poziției slotului sau nu este un jucător valid.");
            }
            draggingPlayer = null; // Resetăm jucătorul târât
        }
    });

    // Click pe un slot populat (pentru a-l scoate de pe teren)
    footballPitch.addEventListener('click', (event) => {
        const slot = event.target.closest('.player-slot');
        if (slot && !slot.classList.contains('empty')) {
            console.log("pitch-renderer.js: Click pe slot populat:", slot.dataset.slotId);
            const gameState = getGameState();
            const playerInSlot = gameState.teamFormation.find(item => item.slotId === slot.dataset.slotId);

            if (playerInSlot) {
                // Scoate jucătorul din formație
                const newTeamFormation = gameState.teamFormation.filter(item => item.slotId !== slot.dataset.slotId);
                updateGameState({ teamFormation: newTeamFormation });
                console.log("pitch-renderer.js: Jucător scos din formație. Stare actualizată.");
                renderPitch();
                renderAvailablePlayers();
            }
        }
    });
}

/**
 * Actualizează un slot de pe teren cu informațiile unui jucător.
 * @param {HTMLElement} slotElement - Elementul DOM al slotului.
 * @param {object} player - Obiectul jucător de adăugat.
 */
function updateSlotWithPlayer(slotElement, player) {
    slotElement.classList.remove('empty');
    slotElement.classList.add(`rarity-${getRarity(player.ovr)}`); // Folosim getRarity
    slotElement.innerHTML = `
        <img src="${player.image || 'https://via.placeholder.com/50'}" alt="${player.name}">
        <span class="player-slot-text">${player.name.split(' ')[0]}</span>
    `;
    slotElement.dataset.playerId = player.id; // Adăugăm ID-ul jucătorului pe slot
    console.log(`pitch-renderer.js: Slot ${slotElement.dataset.slotId} actualizat cu jucătorul ${player.name}`);
}
