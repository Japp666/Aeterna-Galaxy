// public/js/pitch-renderer.js - Randarea terenului de fotbal și a jucătorilor

import { getGameState, saveGameState } from './game-state.js';
import { FORMATIONS, MENTALITY_ADJUSTMENTS, POSITION_MAP } from './tactics-data.js';

let currentFootballPitchElement = null;
let currentAvailablePlayersListElement = null; // Va fi setat la primul apel la renderAvailablePlayers

/**
 * Randează terenul de fotbal cu sloturile pentru jucători.
 * @param {HTMLElement} footballPitchElement - Elementul DOM al terenului de fotbal.
 * @param {string} currentFormation - Formația curentă a echipei (ex: '4-4-2').
 * @param {string} currentMentality - Mentalitatea curentă a echipei (ex: 'attacking').
 */
export function renderPitch(footballPitchElement, currentFormation, currentMentality) {
    console.log(`pitch-renderer.js: renderPitch() - Randare teren pentru formația ${currentFormation} și mentalitatea ${currentMentality}.`);
    currentFootballPitchElement = footballPitchElement;

    footballPitchElement.querySelectorAll('.player-slot').forEach(slot => slot.remove());

    const formationPositions = FORMATIONS[currentFormation];
    const mentalityAdjustment = MENTALITY_ADJUSTMENTS[currentMentality];

    const gkPosition = FORMATIONS.GK;
    const gkSlot = createPlayerSlot('GK', gkPosition.x, gkPosition.y, 'GK', null);
    footballPitchElement.appendChild(gkSlot);

    formationPositions.forEach(posData => {
        const adjustedX = posData.x + mentalityAdjustment.xOffset;
        const adjustedY = posData.y + mentalityAdjustment.yOffset;

        const slot = createPlayerSlot(posData.pos, adjustedX, adjustedY, posData.pos, null);
        footballPitchElement.appendChild(slot);
    });
    console.log("pitch-renderer.js: Sloturi de jucători randate pe teren.");
}

/**
 * Creează un slot HTML pentru un jucător pe teren.
 */
function createPlayerSlot(positionId, xPercent, yPercent, shortPosName, player) {
    const slot = document.createElement('div');
    slot.classList.add('player-slot');
    slot.dataset.positionId = positionId;
    slot.dataset.shortPos = shortPosName;

    slot.style.left = `${xPercent}%`;
    slot.style.top = `${yPercent}%`;
    slot.style.transform = `translate(-50%, -50%)`;

    let slotContent = '';

    if (player) {
        slot.classList.remove('empty');
        slot.draggable = true;
        slot.dataset.playerId = player.id;
        slotContent = `
            <div class="player-initials-circle">
                <span class="player-initials">${player.initials}</span>
                <span class="player-pos-initial">${shortPosName}</span>
            </div>
            <span class="player-slot-text">${player.name} (${player.ovr})</span>
        `;
    } else {
        slot.classList.add('empty');
        slot.draggable = false;
        delete slot.dataset.playerId;
        slotContent = `<span class="player-pos-text">${shortPosName}</span>`;
    }
    slot.innerHTML = slotContent;

    addDragAndDropListeners(slot);

    return slot;
}

/**
 * Populează sloturile de pe teren cu jucătorii din formația curentă a echipei.
 * @param {HTMLElement} footballPitchElement - Elementul terenului de fotbal.
 * @param {Object} teamFormation - Obiect care mapează pozițiile la ID-urile jucătorilor.
 * @param {HTMLElement} availablePlayersListElement - Elementul listei de jucători disponibili. (NOU)
 */
export function placePlayersInPitchSlots(footballPitchElement, teamFormation, availablePlayersListElement) {
    const gameState = getGameState();
    const allSlots = footballPitchElement.querySelectorAll('.player-slot');

    allSlots.forEach(slot => {
        const positionId = slot.dataset.positionId;
        const playerIdInSlot = teamFormation[positionId];
        const player = playerIdInSlot ? gameState.players.find(p => p.id === playerIdInSlot) : null;

        let slotContent = '';
        if (player) {
            slot.classList.remove('empty');
            slot.draggable = true;
            slot.dataset.playerId = player.id;
            slotContent = `
                <div class="player-initials-circle">
                    <span class="player-initials">${player.initials}</span>
                    <span class="player-pos-initial">${slot.dataset.shortPos}</span>
                </div>
                <span class="player-slot-text">${player.name} (${player.ovr})</span>
            `;
            const playerInState = gameState.players.find(p => p.id === player.id);
            if (playerInState) playerInState.onPitch = true;
        } else {
            slot.classList.add('empty');
            slot.draggable = false;
            delete slot.dataset.playerId;
            slotContent = `<span class="player-pos-text">${slot.dataset.shortPos}</span>`;
        }
        slot.innerHTML = slotContent;
        addDragAndDropListeners(slot);
    });
    saveGameState(gameState);
    renderAvailablePlayers(availablePlayersListElement); // Folosește parametrul primit
    console.log("pitch-renderer.js: Jucătorii plasați în sloturi.");
}

/**
 * Randează lista de jucători disponibili pentru a fi drag-and-drop-uiți.
 * @param {HTMLElement} container - Elementul container pentru lista de jucători disponibili.
 */
export function renderAvailablePlayers(container) {
    if (!container) {
        console.warn("pitch-renderer.js: Elementul container pentru lista de jucători disponibili nu a fost găsit! (undefined)");
        return;
    }
    console.log("pitch-renderer.js: renderAvailablePlayers() - Randare jucători disponibili.");
    currentAvailablePlayersListElement = container; // Set global reference
    container.innerHTML = '';
    const gameState = getGameState();

    const availablePlayers = gameState.players.filter(player => !player.onPitch);

    availablePlayers.forEach(player => {
        const playerDiv = document.createElement('div');
        playerDiv.classList.add('available-player-item');
        playerDiv.draggable = true;
        playerDiv.dataset.playerId = player.id;

        playerDiv.innerHTML = `
            <div class="player-info">
                <span class="player-name">${player.name}</span>
                <span class="player-overall">OVR: ${player.ovr}</span>
            </div>
            <div class="player-details">
                <span class="player-pos">${player.position}</span>
                <span class="player-value">€${player.value ? player.value.toLocaleString() : 'N/A'}</span>
            </div>
        `;
        addDragAndDropListeners(playerDiv);
        container.appendChild(playerDiv);
    });
    console.log("pitch-renderer.js: Jucători disponibili randati.");
}

/**
 * Adaugă listeneri pentru drag & drop pe elementul dat.
 */
function addDragAndDropListeners(element) {
    element.addEventListener('dragstart', handleDragStart);
    element.addEventListener('dragover', handleDragOver);
    element.addEventListener('dragleave', handleDragLeave);
    element.addEventListener('drop', handleDrop);
    element.addEventListener('dragend', handleDragEnd);
}

let draggedPlayerId = null;
let sourceSlotPositionId = null;

function handleDragStart(event) {
    draggedPlayerId = event.target.dataset.playerId;
    const parentSlot = event.target.closest('.player-slot');
    if (parentSlot) {
        sourceSlotPositionId = parentSlot.dataset.positionId;
        console.log(`pitch-renderer.js: Drag start de la slot: ${sourceSlotPositionId}, Jucător: ${draggedPlayerId}`);
    } else {
        sourceSlotPositionId = null;
        console.log(`pitch-renderer.js: Drag start din lista disponibilă. Jucător: ${draggedPlayerId}`);
    }
    event.dataTransfer.setData('text/plain', draggedPlayerId);
    event.dataTransfer.effectAllowed = 'move';
}

function handleDragOver(event) {
    event.preventDefault();
    if (event.target.classList.contains('player-slot') || event.target.closest('.player-slot')) {
        const targetSlot = event.target.classList.contains('player-slot') ? event.target : event.target.closest('.player-slot');
        if (targetSlot) {
            targetSlot.classList.add('drag-over');
            event.dataTransfer.dropEffect = 'move';
        }
    }
}

function handleDragLeave(event) {
    if (event.target.classList.contains('player-slot') || event.target.closest('.player-slot')) {
        const targetSlot = event.target.classList.contains('player-slot') ? event.target : event.target.closest('.player-slot');
        if (targetSlot) {
            targetSlot.classList.remove('drag-over');
        }
    }
}

function handleDrop(event) {
    event.preventDefault();
    if (event.target.classList.contains('player-slot') || event.target.closest('.player-slot')) {
        const targetSlot = event.target.classList.contains('player-slot') ? event.target : event.target.closest('.player-slot');
        targetSlot.classList.remove('drag-over');

        const gameState = getGameState();
        const currentFormationDetails = FORMATIONS[gameState.currentFormation];
        const allPlayers = gameState.players;

        if (!draggedPlayerId) {
            console.warn("pitch-renderer.js: Nu s-a putut drop-ui: ID jucător lipsă.");
            return;
        }

        const playerToMove = allPlayers.find(p => p.id === draggedPlayerId);
        const targetSlotPositionId = targetSlot.dataset.positionId;

        if (!playerToMove || !targetSlotPositionId) {
            console.error("pitch-renderer.js: Drop invalid: Jucător sau slot țintă necunoscut.");
            return;
        }

        const currentPlayerInTargetSlotId = gameState.teamFormation[targetSlotPositionId];
        console.log(`pitch-renderer.js: Drop detectat. Jucător: ${playerToMove.name}, Slot țintă: ${targetSlotPositionId}, Jucător curent în slotul țintă: ${currentPlayerInTargetSlotId}`);

        if (sourceSlotPositionId) {
            gameState.teamFormation[sourceSlotPositionId] = null;
            console.log(`pitch-renderer.js: Jucător ${playerToMove.name} scos din slotul sursă ${sourceSlotPositionId}.`);
        } else {
            playerToMove.onPitch = true;
            console.log(`pitch-renderer.js: Jucător ${playerToMove.name} marcat ca fiind pe teren.`);
        }

        gameState.teamFormation[targetSlotPositionId] = playerToMove.id;
        console.log(`pitch-renderer.js: Jucător ${playerToMove.name} plasat în slotul țintă ${targetSlotPositionId}.`);

        if (currentPlayerInTargetSlotId) {
            const playerRemovedFromTargetSlot = allPlayers.find(p => p.id === currentPlayerInTargetSlotId);
            if (playerRemovedFromTargetSlot && playerRemovedFromTargetSlot.id !== playerToMove.id) {
                if (sourceSlotPositionId) {
                    gameState.teamFormation[sourceSlotPositionId] = playerRemovedFromTargetSlot.id;
                    playerRemovedFromTargetSlot.onPitch = true;
                    console.log(`pitch-renderer.js: Jucătorul ${playerRemovedFromTargetSlot.name} mutat înapoi în slotul sursă ${sourceSlotPositionId}.`);
                } else {
                    playerRemovedFromTargetSlot.onPitch = false;
                    console.log(`pitch-renderer.js: Jucătorul ${playerRemovedFromTargetSlot.name} scos din slotul țintă, acum disponibil.`);
                }
            }
        }

        saveGameState(gameState);
        // Asigurați-vă că lista de jucători disponibili există înainte de a apela renderAvailablePlayers
        if (currentAvailablePlayersListElement) {
            renderAvailablePlayers(currentAvailablePlayersListElement);
            placePlayersInPitchSlots(currentFootballPitchElement, gameState.teamFormation, currentAvailablePlayersListElement);
        } else {
            console.warn("pitch-renderer.js: currentAvailablePlayersListElement este undefined la handleDrop.");
        }
        console.log("pitch-renderer.js: Drop finalizat. Stare joc și UI actualizate.");
    }
}

function handleDragEnd(event) {
    draggedPlayerId = null;
    sourceSlotPositionId = null;
    console.log("pitch-renderer.js: Drag end.");
}
