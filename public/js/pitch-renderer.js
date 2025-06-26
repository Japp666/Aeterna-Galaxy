// public/js/pitch-renderer.js - Randarea terenului de fotbal și a jucătorilor

import { getGameState, updateGameState } from './game-state.js';
import { getRarity } from './player-generator.js'; // Importăm getRarity pentru raritate

// Definiții pentru formații și pozițiile lor aproximative pe teren (în procente)
export const formations = {
    '4-4-2': { // Echilibrat
        DF: 4, MF: 4, AT: 2, GK: 1,
        layout: {
            GK: [{ top: '90%', left: '50%' }],
            DF: [{ top: '75%', left: '15%' }, { top: '70%', left: '35%' }, { top: '70%', left: '65%' }, { top: '75%', left: '85%' }],
            MF: [{ top: '45%', left: '15%' }, { top: '40%', left: '35%' }, { top: '40%', left: '65%' }, { top: '45%', left: '85%' }],
            AT: [{ top: '15%', left: '40%' }, { top: '15%', left: '60%' }]
        }
    },
    '4-3-3': { // Ofensiv
        DF: 4, MF: 3, AT: 3, GK: 1,
        layout: {
            GK: [{ top: '90%', left: '50%' }],
            DF: [{ top: '75%', left: '15%' }, { top: '70%', left: '35%' }, { top: '70%', left: '65%' }, { top: '75%', left: '85%' }],
            MF: [{ top: '50%', left: '30%' }, { top: '45%', left: '50%' }, { top: '50%', left: '70%' }],
            AT: [{ top: '20%', left: '20%' }, { top: '10%', left: '50%' }, { top: '20%', left: '80%' }]
        }
    },
    '3-5-2': { // Mijlociu aglomerat
        DF: 3, MF: 5, AT: 2, GK: 1,
        layout: {
            GK: [{ top: '90%', left: '50%' }],
            DF: [{ top: '78%', left: '25%' }, { top: '75%', left: '50%' }, { top: '78%', left: '75%' }],
            MF: [{ top: '55%', left: '10%' }, { top: '45%', left: '30%' }, { top: '35%', left: '50%' }, { top: '45%', left: '70%' }, { top: '55%', left: '90%' }],
            AT: [{ top: '15%', left: '40%' }, { top: '15%', left: '60%' }]
        }
    },
    '5-3-2': { // Defensiv
        DF: 5, MF: 3, AT: 2, GK: 1,
        layout: {
            GK: [{ top: '90%', left: '50%' }],
            DF: [{ top: '80%', left: '10%' }, { top: '75%', left: '30%' }, { top: '70%', left: '50%' }, { top: '75%', left: '70%' }, { top: '80%', left: '90%' }],
            MF: [{ top: '45%', left: '30%' }, { top: '40%', left: '50%' }, { top: '45%', left: '70%' }],
            AT: [{ top: '15%', left: '40%' }, { top: '15%', left: '60%' }]
        }
    },
    '4-2-3-1': { // Agresiv, cu mijlocaș ofensiv
        DF: 4, MF: 3, AT: 1, GK: 1, // 2 defensive MF, 1 attacking MF
        layout: {
            GK: [{ top: '90%', left: '50%' }],
            DF: [{ top: '75%', left: '15%' }, { top: '70%', left: '35%' }, { top: '70%', left: '65%' }, { top: '75%', left: '85%' }],
            MF: [ { top: '55%', left: '30%' }, { top: '55%', left: '70%'}, { top: '35%', left: '50%' } ], // Două DM, un CAM
            AT: [{ top: '10%', left: '50%' }]
        }
    },
    '4-1-2-1-2': { // Diamant, posesie
        DF: 4, MF: 4, AT: 2, GK: 1, // 1 DM, 2 central MF, 1 AM, 2 ST
        layout: {
            GK: [{ top: '90%', left: '50%' }],
            DF: [{ top: '75%', left: '15%' }, { top: '70%', left: '35%' }, { top: '70%', left: '65%' }, { top: '75%', left: '85%' }],
            MF: [{ top: '60%', left: '50%' }, { top: '40%', left: '30%' }, { top: '40%', left: '70%' }, { top: '25%', left: '50%' }],
            AT: [{ top: '10%', left: '40%' }, { top: '10%', left: '60%' }]
        }
    }
};

/**
 * Randează terenul de fotbal cu sloturile pentru jucători.
 */
export function renderPitch(pitchElement, currentFormationName) {
    console.log("pitch-renderer.js: renderPitch() - Se randează terenul.");
    const formationConfig = formations[currentFormationName];

    if (!pitchElement || !formationConfig) {
        console.error("pitch-renderer.js: Elementul 'football-pitch' sau configurația formației nu a fost furnizată sau este invalidă.");
        return;
    }

    pitchElement.innerHTML = ''; // Curățăm conținutul existent al terenului
    pitchElement.style.position = 'relative'; // Asigură că poziționarea absolută funcționează

    // Adăugăm sloturi goale conform layout-ului formației
    for (const posType in formationConfig.layout) {
        formationConfig.layout[posType].forEach((coords, index) => {
            const slot = document.createElement('div');
            slot.classList.add('player-slot', 'empty');
            slot.dataset.positionType = posType;
            slot.dataset.slotId = `${posType}${index + 1}`;
            slot.style.position = 'absolute'; // Poziționare absolută pe teren
            slot.style.top = coords.top;
            slot.style.left = coords.left;
            slot.style.transform = 'translate(-50%, -50%)'; // Centrează slotul pe coordonate

            const slotText = document.createElement('span');
            slotText.classList.add('player-slot-text');
            slotText.textContent = posType; // Afișăm doar tipul de poziție
            slot.appendChild(slotText);

            pitchElement.appendChild(slot);
        });
    }
    console.log("pitch-renderer.js: Teren randat cu formația:", currentFormationName);
}

/**
 * Plasează jucătorii din formația salvată în sloturile de pe teren.
 */
export function placePlayersInPitchSlots(pitchElement, teamFormation) {
    console.log("pitch-renderer.js: placePlayersInPitchSlots() - Se plasează jucătorii în sloturi.");
    if (!pitchElement) return;

    // Curățăm toate sloturile de pe teren pentru a le repopula
    pitchElement.querySelectorAll('.player-slot').forEach(slot => {
        slot.classList.add('empty');
        slot.classList.remove('rarity-normal', 'rarity-rare', 'rarity-very-rare', 'rarity-legendary', 'rarity-superstar');
        // Păstrăm poziția și transformarea, doar golim conținutul
        slot.innerHTML = `<span class="player-slot-text">${slot.dataset.positionType}</span>`; 
        delete slot.dataset.playerId; 
    });

    if (teamFormation && Array.isArray(teamFormation)) {
        teamFormation.forEach(playerInFormation => {
            // Căutăm slotul după slotId
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

    availablePlayersListElement.innerHTML = '<h3>Jucători Disponibili</h3>';

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

    // Gridul pentru jucătorii disponibili
    const playersGrid = document.createElement('div');
    playersGrid.classList.add('available-players-grid');
    availablePlayersListElement.appendChild(playersGrid);


    availablePlayers.forEach(player => {
        const playerCard = document.createElement('div');
        playerCard.classList.add('player-card', `rarity-${getRarity(player.ovr)}`);
        playerCard.dataset.playerId = player.id;
        playerCard.draggable = true;

        playerCard.innerHTML = `
            <div class="player-initials-circle">
                <span class="player-initials">${player.initials}</span>
                <span class="player-pos-initial">${player.position}</span>
            </div>
            <div class="player-card-info">
                <p class="player-card-name">${player.name}</p>
                <p class="player-card-ovr">OVR: <span>${player.ovr}</span></p>
                <span class="player-card-rarity">${player.rarity.toUpperCase()}</span>
                <p class="player-card-potential">Potențial: ${player.potential.toUpperCase()}</p>
            </div>
        `;
        playersGrid.appendChild(playerCard); // Adaugă la gridul de jucători
    });
    console.log("pitch-renderer.js: Jucători disponibili randati. Număr:", availablePlayers.length);
}

/**
 * Adaugă listeneri pentru drag and drop.
 * Această funcție ar trebui apelată o singură dată la inițializarea tab-ului Team.
 */
export function addDragDropListeners(footballPitchElement, availablePlayersListElement) {
    console.log("pitch-renderer.js: addDragDropListeners() - Se adaugă listeneri pentru drag&drop.");

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

        availablePlayersListElement.addEventListener('dragend', (event) => {
            const playerCard = event.target.closest('.player-card');
            if (playerCard) {
                playerCard.classList.remove('dragging');
                console.log("pitch-renderer.js: Dragend pe jucător.");
            }
        });
    }

    if (footballPitchElement) {
        footballPitchElement.addEventListener('dragover', (event) => {
            const slot = event.target.closest('.player-slot');
            const draggedPlayerId = event.dataTransfer.getData('text/plain');
            const gameState = getGameState();
            const draggedPlayer = gameState.players.find(p => p.id === draggedPlayerId);

            if (slot && draggedPlayer && slot.dataset.positionType === draggedPlayer.position) {
                event.preventDefault();
                slot.classList.add('drag-over');
            }
        });

        footballPitchElement.addEventListener('dragleave', (event) => {
            const slot = event.target.closest('.player-slot');
            if (slot) {
                slot.classList.remove('drag-over');
            }
        });

        if (!footballPitchElement._hasDropListener) {
            footballPitchElement.addEventListener('drop', (event) => {
                event.preventDefault();
                const targetSlot = event.target.closest('.player-slot');
                const playerId = event.dataTransfer.getData('text/plain');
                let gameState = getGameState();
                const player = gameState.players.find(p => p.id === playerId);

                if (targetSlot && player && targetSlot.dataset.positionType === player.position) {
                    targetSlot.classList.remove('drag-over');

                    console.log(`pitch-renderer.js: Drop jucător ${player.name} în slot ${targetSlot.dataset.slotId}`);

                    // Verifică dacă slotul este deja ocupat de un alt jucător
                    const existingPlayerInSlotIndex = gameState.teamFormation.findIndex(item => item.slotId === targetSlot.dataset.slotId);
                    if (existingPlayerInSlotIndex !== -1) {
                        // Scoate jucătorul existent din slot
                        gameState.teamFormation.splice(existingPlayerInSlotIndex, 1);
                    }

                    // Scoate jucătorul nou dacă este deja în formație pe un alt slot
                    let newTeamFormation = gameState.teamFormation.filter(item => item.playerId !== player.id);
                    
                    // Adaugă jucătorul nou în slotul țintă
                    newTeamFormation.push({ playerId: player.id, slotId: targetSlot.dataset.slotId, player: player });

                    updateGameState({ teamFormation: newTeamFormation });
                    console.log("pitch-renderer.js: Stare joc actualizată după drop.");

                    // Re-randăm complet terenul și lista de jucători disponibili
                    renderPitch(footballPitchElement, gameState.currentFormation);
                    placePlayersInPitchSlots(footballPitchElement, getGameState().teamFormation);
                    renderAvailablePlayers(availablePlayersListElement);
                } else {
                    console.warn("pitch-renderer.js: Drop invalid: jucătorul nu se potrivește poziției slotului sau nu este un jucător valid.");
                }
            });
            footballPitchElement._hasDropListener = true;
        }

        if (!footballPitchElement._hasClickListener) {
            footballPitchElement.addEventListener('click', (event) => {
                const slot = event.target.closest('.player-slot');
                if (slot && !slot.classList.contains('empty') && slot.dataset.playerId) {
                    console.log("pitch-renderer.js: Click pe slot populat:", slot.dataset.slotId);
                    const gameState = getGameState();
                    const playerInSlotId = slot.dataset.playerId;

                    const newTeamFormation = gameState.teamFormation.filter(item => item.playerId !== playerInSlotId);
                    updateGameState({ teamFormation: newTeamFormation });
                    console.log("pitch-renderer.js: Jucător scos din formație. Stare actualizată.");
                    
                    renderPitch(footballPitchElement, gameState.currentFormation);
                    placePlayersInPitchSlots(footballPitchElement, getGameState().teamFormation);
                    renderAvailablePlayers(availablePlayersListElement);
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
        <div class="player-initials-circle">
            <span class="player-initials">${player.initials}</span>
            <span class="player-pos-initial">${player.position}</span>
        </div>
        <span class="player-slot-text">${player.name.split(' ')[0]}</span>
    `;
    slotElement.dataset.playerId = player.id;
    console.log(`pitch-renderer.js: Slot ${slotElement.dataset.slotId} actualizat cu jucătorul ${player.name}`);
}
