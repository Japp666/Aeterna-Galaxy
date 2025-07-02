// public/js/pitch-renderer.js

import { FORMATIONS, MENTALITY_ADJUSTMENTS, POSITION_MAP } from './tactics-data.js';

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
    // Listenerii de drag-and-drop vor fi adăugați de placePlayersInPitchSlots sau de logica externă
    // addDragAndDropListeners(gkSlot, allPlayers, onFormationChangeCallback); // Nu apelăm aici, ci în placePlayersInPitchSlots

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
        // Listenerii de drag-and-drop vor fi adăugați de placePlayersInPitchSlots sau de logica externă
        // addDragAndDropListeners(playerSlot, allPlayers, onFormationChangeCallback); // Nu apelăm aici
    });
    console.log(`pitch-renderer.js: Terenul randat cu ${footballPitchElement.querySelectorAll('.player-slot').length} sloturi.`);
}


/**
 * Plasează jucătorii din teamFormation în sloturile de pe teren și randează lista de jucători disponibili.
 * Această funcție este acum responsabilă și de adăugarea listenerilor de drag-and-drop.
 * @param {HTMLElement} footballPitchElement - Elementul DOM al terenului de fotbal.
 * @param {object} teamFormation - Obiectul teamFormation (formația curentă a echipei).
 * @param {Array} allPlayers - Toți jucătorii disponibili (incluzând cei de pe teren și de pe bancă).
 * @param {HTMLElement} availablePlayersListElement - Elementul listei de jucători disponibili.
 * @param {Function} onFormationChangeCallback - Funcție de callback pentru a salva formația actualizată.
 */
export function placePlayersInPitchSlots(footballPitchElement, teamFormation, allPlayers, availablePlayersListElement, onFormationChangeCallback) {
    console.log("pitch-renderer.js: placePlayersInPitchSlots() - Se plasează jucătorii pe teren.");
    
    // Curăță toți jucătorii de pe teren inițial și elimină listenerii vechi
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
        // Elimină listenerii de drag-and-drop de pe slotul gol, dacă au existat
        removeDragAndDropListeners(slot);
    });

    // Resetăm starea onPitch pentru toți jucătorii
    allPlayers.forEach(p => p.onPitch = false);

    // Plasează jucătorii conform teamFormation
    for (const pos in teamFormation) {
        const playerId = teamFormation[pos];
        if (playerId) {
            const player = allPlayers.find(p => p.id === playerId);
            const slot = footballPitchElement.querySelector(`.player-slot[data-position="${pos}"]`);

            if (player && slot) {
                slot.classList.remove('empty');
                slot.dataset.playerId = player.id;
                slot.innerHTML = `
                    <div class="player-initials-circle" draggable="true" data-player-id="${player.id}">
                        <span class="player-initials">${player.initials}</span>
                        <span class="player-pos-initial">${player.primaryPosition}</span>
                    </div>
                    <span class="player-slot-text">${player.name} (${player.overall})</span>
                `;
                player.onPitch = true;
                // Adaugă listeneri pentru elementul draggable (cercul cu inițiale)
                addDragAndDropListeners(slot.querySelector('.player-initials-circle'), allPlayers, onFormationChangeCallback);
            } else {
                console.warn(`pitch-renderer.js: Jucătorul cu ID ${playerId} sau slotul pentru poziția ${pos} nu a fost găsit.`);
            }
        }
    }

    // Adaugă listeneri de drop pe toate sloturile (indiferent dacă sunt goale sau ocupate)
    footballPitchElement.querySelectorAll('.player-slot').forEach(slot => {
        addDropTargetListeners(slot, allPlayers, onFormationChangeCallback);
    });

    // Actualizează lista de jucători disponibili
    renderAvailablePlayers(availablePlayersListElement, allPlayers);
    console.log("pitch-renderer.js: Jucători plasați pe teren și lista disponibilă actualizată.");
}

/**
 * Randează lista de jucători disponibili pentru drag-and-drop.
 * Limitează la primii 18 jucători și adaugă un mesaj dacă sunt mai mulți.
 * @param {HTMLElement} container - Elementul DOM al listei de jucători disponibili.
 * @param {Array} allPlayers - Toți jucătorii disponibili (incluzând cei de pe teren și de pe bancă).
 */
export function renderAvailablePlayers(container, allPlayers) {
    console.log("pitch-renderer.js: renderAvailablePlayers() - Se randează jucătorii disponibili.");
    
    const availablePlayers = allPlayers
                                .filter(p => !p.onPitch)
                                .sort((a, b) => b.overall - a.overall); // Folosim overall

    container.innerHTML = ''; // Curăță conținutul existent

    if (availablePlayers.length === 0) {
        container.innerHTML = '<p class="no-players-message">Toți jucătorii sunt pe teren!</p>';
        return;
    }

    const playersGrid = document.createElement('div');
    playersGrid.classList.add('available-players-grid');
    container.appendChild(playersGrid);

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
                <span class="player-pos-initial">${player.position}</span>
            </div>
            <strong>${player.name}</strong>
            <span>OVR: ${player.overall}</span>
            <span>${player.playablePositions.map(pos => POSITION_MAP[pos] || pos).join(', ')}</span>
        `;
        playersGrid.appendChild(playerItem);
        // Adaugă listeneri pentru elementul draggable (cardul jucătorului)
        addDragAndDropListeners(playerItem, allPlayers, (newFormation) => {
            // Nu facem nimic aici, salvarea se face la drop pe teren
        });
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
 * Adaugă listeneri pentru evenimentele dragstart și dragend.
 * @param {HTMLElement} element - Elementul DOM căruia i se adaugă listenerii.
 * @param {Array} allPlayers - Toți jucătorii.
 * @param {Function} onFormationChangeCallback - Callback la schimbarea formației.
 */
function addDragAndDropListeners(element, allPlayers, onFormationChangeCallback) {
    // Asigură-te că nu adaugi de mai multe ori
    if (element._hasDragListeners) return;

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
    element._hasDragListeners = true;
}

/**
 * Adaugă listeneri pentru evenimentele dragover, dragleave și drop pe o țintă de drop.
 * @param {HTMLElement} element - Elementul DOM care este o țintă de drop (player-slot).
 * @param {Array} allPlayers - Toți jucătorii.
 * @param {Function} onFormationChangeCallback - Callback la schimbarea formației.
 */
function addDropTargetListeners(element, allPlayers, onFormationChangeCallback) {
    // Asigură-te că nu adaugi de mai multe ori
    if (element._hasDropListeners) return;

    element.addEventListener('dragover', (e) => {
        e.preventDefault(); // Permite drop-ul
        e.dataTransfer.dropEffect = 'move';
        element.classList.add('drag-over'); // Adaugă clasă pentru hover efect
    });

    element.addEventListener('dragleave', () => {
        element.classList.remove('drag-over'); // Elimină clasa la ieșire
    });

    element.addEventListener('drop', (e) => {
        e.preventDefault();
        element.classList.remove('drag-over'); // Elimină clasa la drop

        const draggedPlayerId = e.dataTransfer.getData('text/plain');
        const targetSlot = element; // Elementul curent este slotul țintă
        const targetPosition = targetSlot.dataset.position;

        let currentTeamFormation = {}; // Va fi populată cu formația curentă
        // Trebuie să obținem formația curentă din game-state prin callback-ul de salvare,
        // sau să presupunem că onFormationChangeCallback va gestiona tot.
        // Pentru simplitate, vom lăsa callback-ul să gestioneze întreaga logică de actualizare a stării.

        // Înainte de a apela callback-ul, trebuie să construim noua formație
        // Aici este o logică simplificată de swap/plasare
        const newTeamFormation = {}; // Construim o nouă formație bazată pe cea veche și mutare
        // Reconstruim newTeamFormation din allPlayers și teamFormation curentă
        // Aceasta este o logică mai complexă care ar trebui să fie în tactics-manager.js
        // sau să se bazeze pe o funcție mai inteligentă de la onFormationChangeCallback.

        // Pentru moment, vom trimite doar ID-ul jucătorului și poziția țintă
        // Logica complexă de swap/eliberare va fi gestionată de onFormationChangeCallback
        // care are acces la starea globală a jocului.
        if (onFormationChangeCallback) {
            onFormationChangeCallback(draggedPlayerId, targetPosition);
        }
        console.log(`pitch-renderer.js: Drop: Jucătorul ${draggedPlayerId} pe poziția ${targetPosition}.`);
    });
    element._hasDropListeners = true;
}

/**
 * Elimină listenerii de drag-and-drop de pe un element.
 * Utile pentru a preveni adăugarea multiplă.
 * @param {HTMLElement} element - Elementul DOM.
 */
function removeDragAndDropListeners(element) {
    if (element._hasDragListeners) {
        element.removeEventListener('dragstart', element._dragstartHandler);
        element.removeEventListener('dragend', element._dragendHandler);
        delete element._hasDragListeners;
        delete element._dragstartHandler;
        delete element._dragendHandler;
    }
    if (element._hasDropListeners) {
        element.removeEventListener('dragover', element._dragoverHandler);
        element.removeEventListener('dragleave', element._dragleaveHandler);
        element.removeEventListener('drop', element._dropHandler);
        delete element._hasDropListeners;
        delete element._dragoverHandler;
        delete element._dragleaveHandler;
        delete element._dropHandler;
    }
}
