// public/js/pitch-renderer.js - Randarea terenului de fotbal și a jucătorilor

import { getGameState, updateGameState } from './game-state.js';
import { getRarity } from './player-generator.js'; 
import { formations } from './formations-data.js'; // Importăm formațiile din noul fișier

/**
 * Randează terenul de fotbal cu sloturile pentru jucători.
 * @param {HTMLElement} pitchElement - Elementul DOM al terenului.
 * @param {string} currentFormationName - Numele formației curente.
 * @param {string} currentMentality - Mentalitatea curentă ('normal', 'attacking', 'defensive').
 */
export function renderPitch(pitchElement, currentFormationName, currentMentality = 'normal') {
    console.log(`pitch-renderer.js: renderPitch() - Se randează terenul cu formația ${currentFormationName} și mentalitatea ${currentMentality}.`);
    const formationConfig = formations[currentFormationName];

    if (!pitchElement || !formationConfig) {
        console.error("pitch-renderer.js: Elementul 'football-pitch' sau configurația formației nu a fost furnizată sau este invalidă.");
        return;
    }

    // Păstrăm liniile randate din HTML, doar curățăm și recreăm sloturile de jucători
    // Selectăm doar div-urile cu clasa .player-slot pentru a nu șterge liniile
    pitchElement.querySelectorAll('.player-slot').forEach(slot => slot.remove());

    // Obținem offset-urile bazate pe mentalitate, cu fallback la normal dacă nu există
    const offsets = formationConfig.mentality_offsets[currentMentality] || formationConfig.mentality_offsets.normal || { GK: 0, DF: 0, MF: 0, AT: 0 };

    // Adăugăm sloturi goale conform layout-ului formației
    // Ordinea sloturilor de la AT la GK (stânga la dreapta pe teren)
    const positionGroupOrder = ['AT', 'MF', 'DF', 'GK']; 

    positionGroupOrder.forEach(posGroup => { // Iterăm prin grupurile mari de poziții (AT, MF, DF, GK)
        if (formationConfig.layout[posGroup]) { // Verificăm dacă există poziții pentru acest grup
            formationConfig.layout[posGroup].forEach((coords, index) => {
                const slot = document.createElement('div');
                slot.classList.add('player-slot', 'empty');
                slot.dataset.positionType = posGroup; // Poziție generală (AT, MF, DF, GK)
                slot.dataset.detailedPosition = coords.type; // Poziție detaliată (ST, MC, DC etc.)
                slot.dataset.slotId = `${posGroup}${index + 1}`; // ID unic pentru slot
                
                // Aplicăm offset-ul bazat pe mentalitate la poziția 'left'
                let finalLeft = parseFloat(coords.left); // Convertim "XX%" la număr
                const offset = offsets[posGroup] || 0; // Ia offset-ul pentru grupul curent
                finalLeft += offset; // Adaugă offset-ul

                slot.style.position = 'absolute'; // Poziționare absolută pe teren
                slot.style.top = coords.top;
                slot.style.left = `${finalLeft}%`; // Aplică poziția ajustată
                slot.style.transform = 'translate(-50%, -50%)'; // Centrează slotul pe coordonate

                const slotText = document.createElement('span');
                slotText.classList.add('player-slot-text');
                slotText.textContent = coords.type || posGroup; // Afișăm poziția detaliată, dacă există
                slot.appendChild(slotText);

                pitchElement.appendChild(slot);
            });
        }
    });
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
        slot.innerHTML = `<span class="player-slot-text">${slot.dataset.detailedPosition || slot.dataset.positionType}</span>`; 
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
                <span class="player-pos-initial">${player.detailedPosition || player.position}</span> <!-- Afișăm poziția detaliată -->
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
            event.preventDefault(); // Permite drop
            const slot = event.target.closest('.player-slot');
            const draggedPlayerId = event.dataTransfer.getData('text/plain');
            const gameState = getGameState();
            const draggedPlayer = gameState.players.find(p => p.id === draggedPlayerId);

            // Verifică compatibilitatea poziției detaliate sau generale
            if (slot && draggedPlayer) {
                const slotDetailedPos = slot.dataset.detailedPosition; 
                const playerGeneralPos = draggedPlayer.position; 
                const playerDetailedPos = draggedPlayer.detailedPosition;
                
                let isCompatible = false;
                // 1. Potrivire exactă a poziției detaliate a jucătorului cu slotul detaliat
                if (slotDetailedPos === playerDetailedPos) {
                    isCompatible = true; 
                } 
                // 2. Poziție generală a jucătorului cu slot specific compatibil (fallback)
                else if (playerGeneralPos === 'DF' && ['DL', 'DC', 'DR', 'SW'].includes(slotDetailedPos)) {
                    isCompatible = true; 
                } else if (playerGeneralPos === 'MF' && ['ML', 'MC', 'MR', 'DM', 'AM', 'LWB', 'RWB'].includes(slotDetailedPos)) {
                    isCompatible = true; 
                } else if (playerGeneralPos === 'AT' && ['ST', 'LW', 'RW'].includes(slotDetailedPos)) {
                    isCompatible = true; 
                } else if (playerGeneralPos === 'GK' && slotDetailedPos === 'GK') {
                    isCompatible = true;
                }
                
                if (isCompatible) {
                    slot.classList.add('drag-over');
                } else {
                    slot.classList.remove('drag-over'); // Nu este compatibil
                }
            } else {
                if (slot) slot.classList.remove('drag-over');
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

                let isCompatible = false;
                if (targetSlot && player) {
                    const slotDetailedPos = targetSlot.dataset.detailedPosition;
                    const playerGeneralPos = player.position;
                    const playerDetailedPos = player.detailedPosition;

                    if (slotDetailedPos === playerDetailedPos) {
                        isCompatible = true; 
                    } else if (playerGeneralPos === 'DF' && ['DL', 'DC', 'DR', 'SW'].includes(slotDetailedPos)) {
                        isCompatible = true; 
                    } else if (playerGeneralPos === 'MF' && ['ML', 'MC', 'MR', 'DM', 'AM', 'LWB', 'RWB'].includes(slotDetailedPos)) {
                        isCompatible = true; 
                    } else if (playerGeneralPos === 'AT' && ['ST', 'LW', 'RW'].includes(slotDetailedPos)) {
                        isCompatible = true; 
                    } else if (playerGeneralPos === 'GK' && slotDetailedPos === 'GK') {
                        isCompatible = true;
                    }
                }
                

                if (targetSlot && player && isCompatible) {
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
                    renderPitch(footballPitchElement, gameState.currentFormation, gameState.currentMentality);
                    placePlayersInPitchSlots(footballPitchElement, getGameState().teamFormation);
                    renderAvailablePlayers(availablePlayersListElement);
                } else {
                    console.warn("pitch-renderer.js: Drop invalid: jucătorul nu se potrivește poziției slotului sau nu este un jucător valid/compatibil.");
                    if (targetSlot) {
                         targetSlot.classList.remove('drag-over');
                    }
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
                    
                    renderPitch(footballPitchElement, gameState.currentFormation, gameState.currentMentality);
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
            <span class="player-pos-initial">${player.detailedPosition || player.position}</span>
        </div>
        <span class="player-slot-text">${player.name.split(' ')[0]}</span>
    `;
    slotElement.dataset.playerId = player.id;
    console.log(`pitch-renderer.js: Slot ${slotElement.dataset.slotId} actualizat cu jucătorul ${player.name}`);
}
