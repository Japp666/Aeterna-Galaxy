// public/js/pitch-renderer.js - Randarea terenului de fotbal și a jucătorilor

import { getGameState, updateGameState } from './game-state.js';
import { getRarity } from './player-generator.js';

// Referințe la elemente DOM (nu globale, sunt preluate local de team.js)
// const footballPitch = document.getElementById('football-pitch');
// const availablePlayersList = document.getElementById('available-players-list');
// const formationSelect = document.getElementById('formation-select');
// const mentalitySelect = document.getElementById('mentality-select');

// Definiții pentru formații (număr de jucători per linie)
export const formations = { // Am adăugat 'export' aici!
    '4-4-2': { DF: 4, MF: 4, AT: 2, GK: 1 },
    '4-3-3': { DF: 4, MF: 3, AT: 3, GK: 1 },
    '3-5-2': { DF: 3, MF: 5, AT: 2, GK: 1 },
    '5-3-2': { DF: 5, MF: 3, AT: 2, GK: 1 } // Adăugat 5-3-2
};

/**
 * Randează terenul de fotbal cu sloturile pentru jucători.
 */
export function renderPitch(pitchElement, currentFormationName) { // Acum primește elementul terenului și numele formației
    console.log("pitch-renderer.js: renderPitch() - Se randează terenul.");
    const currentFormation = formations[currentFormationName];

    if (!pitchElement) {
        console.error("pitch-renderer.js: Elementul 'football-pitch' nu a fost furnizat.");
        return;
    }

    // Curăță sloturile existente
    pitchElement.querySelectorAll('.pitch-zone').forEach(zone => {
        zone.innerHTML = '';
    });

    // Adaugă sloturi goale pentru fiecare poziție conform formației curente
    for (const posType in currentFormation) {
        const zoneElement = pitchElement.querySelector(`.pitch-zone[data-position-type="${posType}"]`);
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
    console.log("pitch-renderer.js: Teren randat cu formația:", currentFormationName);
}

/**
 * Plasează jucătorii din formația salvată în sloturile de pe teren.
 */
export function placePlayersInPitchSlots(pitchElement, teamFormation) {
    console.log("pitch-renderer.js: placePlayersInPitchSlots() - Se plasează jucătorii în sloturi.");
    if (!pitchElement) return;

    if (teamFormation && Array.isArray(teamFormation)) {
        teamFormation.forEach(playerInFormation => {
            const slot = pitchElement.querySelector(`.player-slot[data-slot-id="${playerInFormation.slotId}"]`);
            if (slot && playerInFormation.player) {
                updateSlotWithPlayer(slot, playerInFormation.player);
            }
        });
    } else {
        console.warn("pitch-renderer.js: teamFormation este undefined sau nu este un array. Nu se pot plasa jucători în formație.");
    }
}

/**
 * Randează lista de jucători disponibili.
 */
export function renderAvailablePlayers(availablePlayersListElement) {
    console.log("pitch-renderer.js: renderAvailablePlayers() - Se randează jucătorii disponibili.");
    const gameState = getGameState();
    
    if (!availablePlayersListElement) {
        console.error("pitch-renderer.js: Elementul 'available-players-list' nu a fost găsit.");
        return;
    }

    availablePlayersListElement.innerHTML = '<h3>Jucători Disponibili</h3>'; // Menținem titlul

    // Filtrăm jucătorii care NU sunt deja în formație
    const playersInFormationIds = new Set(gameState.teamFormation.map(p => p.player ? p.player.id : null).filter(Boolean));
    const availablePlayers = gameState.players.filter(player => !playersInFormationIds.has(player.id));

    if (availablePlayers.length === 0) {
        const noPlayersMsg = document.createElement('p');
        noPlayersMsg.textContent = "Nu mai sunt jucători disponibili în lot.";
        noPlayersMsg.style.textAlign = 'center';
        noPlayersMsg.style.marginTop = '20px';
        availablePlayersListElement.appendChild(noPlayersMsg);
        return;
    }

    availablePlayers.forEach(player => {
        const playerCard = document.createElement('div');
        playerCard.classList.add('player-card', `rarity-${getRarity(player.ovr)}`); // Folosim getRarity
        playerCard.dataset.playerId = player.id;
        playerCard.draggable = true; // Setăm draggable

        playerCard.innerHTML = `
            <img src="${player.image || `img/players/player${Math.floor(Math.random() * 10) + 1}.png`}" alt="${player.name}" style="width:50px;height:50px;border-radius:50%;">
            <div class="player-card-info">
                <p class="player-card-name">${player.name}</p>
                <p class="player-card-position">Poziție: ${player.position}</p>
                <p class="player-card-ovr">OVR: ${player.ovr}</p>
            </div>
        `;
        availablePlayersListElement.appendChild(playerCard);
    });
    console.log("pitch-renderer.js: Jucători disponibili randati. Număr:", availablePlayers.length);
}

/**
 * Adaugă listeneri pentru drag and drop.
 * Această funcție ar trebui apelată o singură dată la inițializarea tab-ului Team.
 */
export function addDragDropListeners(footballPitchElement, availablePlayersListElement) {
    console.log("pitch-renderer.js: addDragDropListeners() - Se adaugă listeneri pentru drag&drop.");

    // Drag start pe un jucător din listă
    if (availablePlayersListElement) {
        availablePlayersListElement.addEventListener('dragstart', (event) => {
            const playerCard = event.target.closest('.player-card');
            if (playerCard) {
                const playerId = playerCard.dataset.playerId;
                event.dataTransfer.setData('text/plain', playerId);
                playerCard.classList.add('dragging');
                console.log("pitch-renderer.js: Dragstart pe jucător:", playerId);
            }
        });

        // Drag end pe un jucător din listă (pentru curățare clasă dragging)
        availablePlayersListElement.addEventListener('dragend', (event) => {
            const playerCard = event.target.closest('.player-card');
            if (playerCard) {
                playerCard.classList.remove('dragging');
                console.log("pitch-renderer.js: Dragend pe jucător.");
            }
        });
    }

    // Drag over pe un slot de pe teren
    if (footballPitchElement) {
        footballPitchElement.addEventListener('dragover', (event) => {
            const slot = event.target.closest('.player-slot');
            const draggedPlayerId = event.dataTransfer.getData('text/plain');
            const gameState = getGameState();
            const draggedPlayer = gameState.players.find(p => p.id === draggedPlayerId);

            if (slot && draggedPlayer && slot.dataset.positionType === draggedPlayer.position) {
                event.preventDefault(); // Permite drop-ul
                slot.classList.add('drag-over');
            }
        });

        // Drag leave de pe un slot de pe teren
        footballPitchElement.addEventListener('dragleave', (event) => {
            const slot = event.target.closest('.player-slot');
            if (slot) {
                slot.classList.remove('drag-over');
            }
        });

        // Drop pe un slot de pe teren
        if (!footballPitchElement._hasDropListener) { // Adăugat verificare pentru a nu adăuga multiplu
            footballPitchElement.addEventListener('drop', (event) => {
                event.preventDefault();
                const targetSlot = event.target.closest('.player-slot');
                const playerId = event.dataTransfer.getData('text/plain');
                let gameState = getGameState();
                const player = gameState.players.find(p => p.id === playerId);

                if (targetSlot && player && targetSlot.dataset.positionType === player.position) {
                    targetSlot.classList.remove('drag-over');

                    console.log(`pitch-renderer.js: Drop jucător ${player.name} în slot ${targetSlot.dataset.slotId}`);

                    // Scoate jucătorul dacă este deja în formație pe un alt slot
                    let newTeamFormation = gameState.teamFormation.filter(item => item.playerId !== player.id);

                    // Dacă slotul țintă era ocupat, jucătorul de acolo devine disponibil
                    const existingPlayerInTargetSlot = gameState.teamFormation.find(item => item.slotId === targetSlot.dataset.slotId);
                    if (existingPlayerInTargetSlot) {
                        // Nu facem nimic special aici, doar il ignoram din noua formație
                        // va fi adăugat înapoi la lista de jucători disponibili la re-randare
                        console.log(`Jucătorul ${existingPlayerInTargetSlot.player.name} a fost scos din slotul ${existingPlayerInTargetSlot.slotId}.`);
                    }

                    // Adaugă jucătorul nou în slotul țintă
                    newTeamFormation.push({ playerId: player.id, slotId: targetSlot.dataset.slotId, player: player });

                    updateGameState({ teamFormation: newTeamFormation });
                    console.log("pitch-renderer.js: Stare joc actualizată după drop.");

                    renderPitch(footballPitchElement, gameState.currentFormation); // Re-randăm terenul
                    placePlayersInPitchSlots(footballPitchElement, getGameState().teamFormation); // Plasează jucătorii actualizați
                    renderAvailablePlayers(availablePlayersListElement); // Re-randăm lista de jucători disponibili
                } else {
                    console.warn("pitch-renderer.js: Drop invalid: jucătorul nu se potrivește poziției slotului sau nu este un jucător valid.");
                }
            });
            footballPitchElement._hasDropListener = true;
        }

        // Click pe un slot populat (pentru a-l scoate de pe teren)
        if (!footballPitchElement._hasClickListener) { // Adăugat verificare pentru a nu adăuga multiplu
            footballPitchElement.addEventListener('click', (event) => {
                const slot = event.target.closest('.player-slot');
                if (slot && !slot.classList.contains('empty') && slot.dataset.playerId) {
                    console.log("pitch-renderer.js: Click pe slot populat:", slot.dataset.slotId);
                    const gameState = getGameState();
                    const playerInSlotId = slot.dataset.playerId;

                    // Scoate jucătorul din formație
                    const newTeamFormation = gameState.teamFormation.filter(item => item.playerId !== playerInSlotId);
                    updateGameState({ teamFormation: newTeamFormation });
                    console.log("pitch-renderer.js: Jucător scos din formație. Stare actualizată.");
                    
                    renderPitch(footballPitchElement, gameState.currentFormation); // Re-randăm terenul
                    placePlayersInPitchSlots(footballPitchElement, getGameState().teamFormation); // Plasează jucătorii actualizați
                    renderAvailablePlayers(availablePlayersListElement); // Re-randăm lista de jucători disponibili
                }
            });
            footballPitchElement._hasClickListener = true;
        }
    }
}

/**
 * Actualizează un slot de pe teren cu informațiile unui jucător.
 * @param {HTMLElement} slotElement - Elementul DOM al slotului.
 * @param {object} player - Obiectul jucător de adăugat.
 */
function updateSlotWithPlayer(slotElement, player) {
    slotElement.classList.remove('empty');
    slotElement.classList.add(`rarity-${getRarity(player.ovr)}`);
    slotElement.innerHTML = `
        <img src="${player.image || `img/players/player${Math.floor(Math.random() * 10) + 1}.png`}" alt="${player.name}">
        <span class="player-slot-text">${player.name.split(' ')[0]}</span>
    `;
    slotElement.dataset.playerId = player.id;
    console.log(`pitch-renderer.js: Slot ${slotElement.dataset.slotId} actualizat cu jucătorul ${player.name}`);
}
