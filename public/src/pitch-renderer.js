// src/pitch-renderer.js

import { FORMATIONS, MENTALITY_ADJUSTMENTS, POSITION_MAP } from './tactics-data.js'; // Calea corectată

// Variabile globale pentru starea jocului, gestionate acum de App.js
let currentAllPlayers = [];
let currentTeamFormation = {};
let currentSaveFormationCallback = null;

// Funcție pentru a seta starea globală (apelată din App.js)
export function setGameStateForRenderer(players, formation, saveCallback) {
    currentAllPlayers = players;
    currentTeamFormation = formation;
    currentSaveFormationCallback = saveCallback;
    console.log("pitch-renderer.js: Starea globală a renderer-ului a fost actualizată.");
}


/**
 * Randează terenul de fotbal cu sloturile pentru jucători conform formației și mentalității.
 * @param {HTMLElement} footballPitchElement - Elementul DOM al terenului de fotbal.
 * @param {string} formationName - Numele formației (ex: '4-4-2').
 * @param {string} mentalityName - Numele mentalității (ex: 'attacking', 'balanced', 'defensive').
 */
export function renderPitch(footballPitchElement, formationName, mentalityName) {
    console.log(`pitch-renderer.js: renderPitch() - Randare teren pentru formația ${formationName} și mentalitatea ${mentalityName}.`);
    footballPitchElement.innerHTML = ''; // Curăță sloturile existente

    const formationDetails = FORMATIONS[formationName];
    const mentalityAdjustment = MENTALITY_ADJUSTMENTS[mentalityName] || { xOffset: 0, yOffset: 0 };

    if (!formationDetails) {
        console.error(`pitch-renderer.js: Formația '${formationName}' nu a fost găsită.`);
        footballPitchElement.innerHTML = `<p class="error-message">Formația '${formationName}' nu este definită.</p>`;
        return;
    }

    // Adaugă slotul pentru portar (GK)
    const gkSlot = document.createElement('div');
    gkSlot.classList.add('player-slot', 'empty');
    gkSlot.dataset.position = 'GK';
    // Poziția portarului este fixă și NU este afectată de ajustarea de mentalitate
    const gkPos = FORMATIONS.GK; 
    gkSlot.style.left = `${gkPos.x}%`; 
    gkSlot.style.top = `${gkPos.y}%`;
    gkSlot.innerHTML = `<div class="player-initials-circle"><span class="player-initials">GK</span></div><span class="player-slot-text">${POSITION_MAP['GK']}</span>`;
    footballPitchElement.appendChild(gkSlot);
    addDragAndDropListeners(gkSlot);

    // Adaugă sloturile pentru ceilalți jucători
    formationDetails.forEach(slot => {
        const playerSlot = document.createElement('div');
        playerSlot.classList.add('player-slot', 'empty');
        playerSlot.dataset.position = slot.pos;

        // Aplică ajustările de mentalitate pentru ceilalți jucători
        playerSlot.style.left = `${slot.x + mentalityAdjustment.xOffset}%`;
        playerSlot.style.top = `${slot.y + mentalityAdjustment.yOffset}%`;

        playerSlot.innerHTML = `
            <div class="player-initials-circle">
                <span class="player-initials">${slot.pos}</span>
                <span class="player-pos-initial">${POSITION_MAP[slot.pos] || ''}</span>
            </div>
            <span class="player-slot-text">${POSITION_MAP[slot.pos] || slot.pos}</span>
        `;
        footballPitchElement.appendChild(playerSlot);
        addDragAndDropListeners(playerSlot);
    });
    console.log(`pitch-renderer.js: Terenul randat cu ${footballPitchElement.querySelectorAll('.player-slot').length} sloturi.`);
}


/**
 * Plasează jucătorii din teamFormation în sloturile de pe teren.
 * @param {HTMLElement} footballPitchElement - Elementul DOM al terenului de fotbal.
 * @param {object} teamFormation - Obiectul teamFormation (formația curentă a echipei).
 * @param {HTMLElement} [availablePlayersListElement] - Elementul listei de jucători disponibili (opțional, pentru actualizare).
 * @param {Array} allPlayers - Toți jucătorii disponibili pentru drag-and-drop.
 * @param {Function} saveTeamFormationCallback - Funcție de callback pentru a salva formația actualizată.
 */
export function placePlayersInPitchSlots(footballPitchElement, teamFormation, availablePlayersListElement = null, allPlayers = [], saveTeamFormationCallback = null) {
    console.log("pitch-renderer.js: placePlayersInPitchSlots() - Se plasează jucătorii pe teren.");
    
    // Actualizăm variabilele globale ale renderer-ului
    setGameStateForRenderer(allPlayers, teamFormation, saveTeamFormationCallback);

    // Curăță toți jucătorii de pe teren inițial
    footballPitchElement.querySelectorAll('.player-slot').forEach(slot => {
        slot.classList.add('empty');
        slot.dataset.playerId = ''; // Elimină ID-ul jucătorului asociat
        slot.innerHTML = `
            <div class="player-initials-circle">
                <span class="player-initials">${slot.dataset.position}</span>
                <span class="player-pos-initial">${POSITION_MAP[slot.dataset.position] || ''}</span>
            </div>
            <span class="player-slot-text">${POSITION_MAP[slot.dataset.position] || slot.dataset.position}</span>
        `;
    });

    // Resetăm starea onPitch pentru toți jucătorii (în lista locală a renderer-ului)
    currentAllPlayers.forEach(p => p.onPitch = false);

    // Plasează jucătorii conform teamFormation
    for (const pos in teamFormation) {
        const playerId = teamFormation[pos];
        if (playerId) {
            const player = currentAllPlayers.find(p => p.id === playerId);
            const slot = footballPitchElement.querySelector(`.player-slot[data-position="${pos}"]`);

            if (player && slot) {
                slot.classList.remove('empty');
                slot.dataset.playerId = player.id;
                slot.innerHTML = `
                    <div class="player-initials-circle" draggable="true" data-player-id="${player.id}">
                        <span class="player-initials">${player.initials}</span>
                        <span class="player-pos-initial">${player.primaryPosition}</span>
                    </div>
                    <span class="player-slot-text">${player.name} (${player.overallRating})</span>
                `;
                player.onPitch = true;
                addDragAndDropListeners(slot.querySelector('.player-initials-circle')); // Adaugă listeneri pentru elementul draggable
            } else {
                console.warn(`pitch-renderer.js: Jucătorul cu ID ${playerId} sau slotul pentru poziția ${pos} nu a fost găsit.`);
            }
        }
    }

    // Actualizează lista de jucători disponibili dacă elementul este furnizat
    if (availablePlayersListElement) {
        renderAvailablePlayers(availablePlayersListElement);
    }
    console.log("pitch-renderer.js: Jucători plasați pe teren și lista disponibilă actualizată.");
}

/**
 * Randează lista de jucători disponibili pentru drag-and-drop.
 * Limitează la primii 18 jucători și adaugă un mesaj dacă sunt mai mulți.
 * @param {HTMLElement} container - Elementul DOM al listei de jucători disponibili.
 */
export function renderAvailablePlayers(container) {
    console.log("pitch-renderer.js: renderAvailablePlayers() - Se randează jucătorii disponibili.");
    // Folosim currentAllPlayers care este actualizat de App.js
    const availablePlayers = currentAllPlayers
                                .filter(p => !p.onPitch)
                                .sort((a, b) => b.overallRating - a.overallRating); // Folosim overallRating

    const playersGrid = document.createElement('div');
    playersGrid.classList.add('available-players-grid');
    container.innerHTML = ''; // Curăță conținutul existent
    container.appendChild(playersGrid);

    if (availablePlayers.length === 0) {
        playersGrid.innerHTML = '<p class="no-players-message">Toți jucătorii sunt pe teren!</p>';
        return;
    }

    // Limitează la primii 18 jucători pentru afișare compactă
    const playersToDisplay = availablePlayers.slice(0, 18);
    const hasMorePlayers = availablePlayers.length > 18;

    playersToDisplay.forEach(player => {
        const playerItem = document.createElement('div');
        playerItem.classList.add('available-player-item');
        playerItem.dataset.playerId = player.id;
        playerItem.draggable = true; // Face elementul draggable

        playerItem.innerHTML = `
            <div class="player-initials-circle">
                <span class="player-initials">${player.initials}</span>
                <span class="player-pos-initial">${player.primaryPosition}</span>
            </div>
            <strong>${player.name}</strong>
            <span>OVR: ${player.overallRating}</span>
            <span>${player.secondaryPositions.map(pos => POSITION_MAP[pos] || pos).join(', ')}</span>
        `;
        playersGrid.appendChild(playerItem);
        addDragAndDropListeners(playerItem);
    });

    if (hasMorePlayers) {
        const morePlayersMessage = document.createElement('p');
        morePlayersMessage.classList.add('no-players-message');
        morePlayersMessage.textContent = `+${availablePlayers.length - 18} jucători disponibili...`;
        container.appendChild(morePlayersMessage);
    }

    console.log(`pitch-renderer.js: ${playersToDisplay.length} jucători disponibili randati (din total ${availablePlayers.length}).`);
}

/**
 * Adaugă listeneri pentru funcționalitatea de drag and drop.
 * @param {HTMLElement} element - Elementul DOM căruia i se adaugă listenerii.
 */
function addDragAndDropListeners(element) {
    // Listener pentru elementul care este tras (jucătorul)
    if (element.draggable) {
        element.addEventListener('dragstart', (e) => {
            const playerId = e.target.dataset.playerId || e.target.closest('[data-player-id]').dataset.playerId;
            e.dataTransfer.setData('text/plain', playerId);
            e.dataTransfer.effectAllowed = 'move';
            e.target.classList.add('dragging'); // Adaugă o clasă pentru stilizare la drag
            console.log(`pitch-renderer.js: Dragstart pentru jucătorul: ${playerId}`);
        });

        element.addEventListener('dragend', (e) => {
            e.target.classList.remove('dragging'); // Elimină clasa la finalul drag-ului
            console.log(`pitch-renderer.js: Dragend.`);
        });
    }

    // Listeneri pentru sloturile de pe teren (zonele de drop)
    if (element.classList.contains('player-slot')) {
        element.addEventListener('dragover', (e) => {
            e.preventDefault(); // Permite drop-ul
            e.dataTransfer.dropEffect = 'move';
            e.target.classList.add('drag-over'); // Adaugă clasă pentru hover efect
        });

        element.addEventListener('dragleave', (e) => {
            e.target.classList.remove('drag-over'); // Elimină clasa la ieșire
        });

        element.addEventListener('drop', (e) => {
            e.preventDefault();
            e.target.classList.remove('drag-over'); // Elimină clasa la drop

            const draggedPlayerId = e.dataTransfer.getData('text/plain');
            const targetSlot = e.target.closest('.player-slot'); // Asigură-te că target-ul este slotul

            if (!targetSlot) {
                console.warn("pitch-renderer.js: Drop target nu este un slot valid.");
                return;
            }

            const targetPosition = targetSlot.dataset.position;

            // Folosim starea globală a renderer-ului
            const allPlayers = currentAllPlayers;
            const teamFormation = { ...currentTeamFormation }; // Facem o copie pentru a o modifica

            const playerBeingDragged = allPlayers.find(p => p.id === draggedPlayerId);

            if (!playerBeingDragged) {
                console.error(`pitch-renderer.js: Jucătorul cu ID ${draggedPlayerId} nu a fost găsit.`);
                return;
            }

            // Verifică dacă slotul țintă este deja ocupat
            const existingPlayerInSlotId = targetSlot.dataset.playerId;
            let playerToSwapOut = null;
            if (existingPlayerInSlotId) {
                playerToSwapOut = allPlayers.find(p => p.id === existingPlayerInSlotId);
            }

            // Logică de swap sau plasare
            if (playerToSwapOut) {
                // Swap: jucătorul tras ia locul celui existent, cel existent merge înapoi în lista de disponibili
                const oldPositionOfDraggedPlayer = Object.keys(teamFormation).find(key => teamFormation[key] === draggedPlayerId);

                if (oldPositionOfDraggedPlayer) {
                    // Mutați jucătorul existent înapoi în lista de disponibili
                    playerToSwapOut.onPitch = false;
                    teamFormation[targetPosition] = draggedPlayerId; // Jucătorul tras ocupă noul slot
                    teamFormation[oldPositionOfDraggedPlayer] = null; // Eliberează vechiul slot
                } else {
                    // Jucătorul tras vine din lista de disponibili și înlocuiește un jucător de pe teren
                    playerToSwapOut.onPitch = false;
                    teamFormation[targetPosition] = draggedPlayerId;
                }
                playerBeingDragged.onPitch = true; // Marchează jucătorul tras ca fiind pe teren
                console.log(`pitch-renderer.js: Swap: Jucătorul ${playerBeingDragged.name} a fost mutat pe ${targetPosition}, ${playerToSwapOut.name} a fost eliberat.`);

            } else {
                // Doar plasare: slotul țintă este gol
                const oldPositionOfDraggedPlayer = Object.keys(teamFormation).find(key => teamFormation[key] === draggedPlayerId);

                if (oldPositionOfDraggedPlayer) {
                    // Jucătorul tras era deja pe teren, îl mutăm
                    teamFormation[oldPositionOfDraggedPlayer] = null; // Eliberează vechiul slot
                    teamFormation[targetPosition] = draggedPlayerId; // Jucătorul tras ocupă noul slot
                    playerBeingDragged.onPitch = true;
                    console.log(`pitch-renderer.js: Mutare: Jucătorul ${playerBeingDragged.name} a fost mutat de la ${oldPositionOfDraggedPlayer} la ${targetPosition}.`);
                } else {
                    // Jucătorul tras vine din lista de disponibili
                    teamFormation[targetPosition] = draggedPlayerId;
                    playerBeingDragged.onPitch = true;
                    console.log(`pitch-renderer.js: Plasare: Jucătorul ${playerBeingDragged.name} a fost plasat pe ${targetPosition}.`);
                }
            }

            // Apelăm callback-ul pentru a salva formația actualizată în Firestore via App.js
            if (currentSaveFormationCallback) {
                currentSaveFormationCallback(teamFormation);
            }

            // Re-randare pentru a reflecta schimbările
            const footballPitchElement = document.getElementById('football-pitch');
            const availablePlayersListElement = document.getElementById('available-players-list');
            // Re-apelăm placePlayersInPitchSlots cu noile date
            placePlayersInPitchSlots(footballPitchElement, teamFormation, availablePlayersListElement, allPlayers, currentSaveFormationCallback);
        });
    }
}
