// public/js/pitch-renderer.js - Randarea terenului de fotbal și a jucătorilor

import { getGameState, saveGameState } from './game-state.js';
import { FORMATIONS, MENTALITY_ADJUSTMENTS, POSITION_MAP } from './tactics-data.js';

let currentFootballPitchElement = null;
let currentAvailablePlayersListElement = null;

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
 * Creează un element DOM pentru un slot de jucător pe teren.
 * @param {string} positionId - ID-ul unic pentru poziție (ex: 'GK', 'CB1', 'CM2').
 * @param {number} xPercent - Poziția X procentuală pe teren (0-100).
 * @param {number} yPercent - Poziția Y procentuală pe teren (0-100).
 * @param {string} shortPosName - Numele scurt al poziției (ex: 'GK', 'CB', 'CM').
 * @param {Object|null} player - Obiectul jucătorului asociat slotului, sau null dacă este gol.
 * @returns {HTMLElement} Elementul div al slotului.
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
            <span class="player-slot-text">${player.name} (${player.overall})</span>
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
 */
export function placePlayersInPitchSlots(footballPitchElement, teamFormation) {
    console.log("pitch-renderer.js: placePlayersInPitchSlots() - Se plasează jucătorii în sloturi.");
    const gameState = getGameState();
    const allPlayers = gameState.players;

    footballPitchElement.querySelectorAll('.player-slot').forEach(slot => {
        const positionId = slot.dataset.positionId;
        const shortPosName = slot.dataset.shortPos;

        const playerIdInSlot = teamFormation[positionId];
        const player = playerIdInSlot ? allPlayers.find(p => p.id === playerIdInSlot) : null;

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
                <span class="player-slot-text">${player.name} (${player.overall})</span>
            `;
            const playerInState = gameState.players.find(p => p.id === player.id);
            if (playerInState) playerInState.onPitch = true;
        } else {
            slot.classList.add('empty');
            slot.draggable = false;
            delete slot.dataset.playerId;
            slotContent = `<span class="player-pos-text">${shortPosName}</span>`;
        }
        slot.innerHTML = slotContent;
    });
    saveGameState(gameState);
    renderAvailablePlayers(currentAvailablePlayersListElement);
    console.log("pitch-renderer.js: Jucătorii plasați în sloturi.");
}

/**
 * Randează lista de jucători disponibili pentru a fi drag-and-drop-uiți.
 * @param {HTMLElement} container - Elementul container pentru lista de jucători disponibili.
 */
export function renderAvailablePlayers(container) {
    console.log("pitch-renderer.js: renderAvailablePlayers() - Randare jucători disponibili.");
    currentAvailablePlayersListElement = container;
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
                <span class="player-overall">OVR: ${player.overall}</span>
            </div>
            <div class="player-details">
                <span class="player-pos">${player.positions.map(pos => POSITION_MAP[pos] || pos).join(', ')}</span>
                <span class="player-value">€${player.value.toLocaleString()}</span>
            </div>
        `;
        addDragAndDropListeners(playerDiv);
        container.appendChild(playerDiv);
    });
    console.log("pitch-renderer.js: Jucători disponibili randati.");
}

/**
 * Adaugă listenerii de drag-and-drop la un element.
 * @param {HTMLElement} element - Elementul căruia i se adaugă listenerii (slot sau jucător).
 */
function addDragAndDropListeners(element) {
    element.removeEventListener('dragstart', handleDragStart);
    element.removeEventListener('dragover', handleDragOver);
    element.removeEventListener('dragleave', handleDragLeave);
    element.removeEventListener('drop', handleDrop);
    element.removeEventListener('dragend', handleDragEnd);

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
        renderPitch(currentFootballPitchElement, gameState.currentFormation, gameState.currentMentality);
        placePlayersInPitchSlots(currentFootballPitchElement, gameState.teamFormation);
        renderAvailablePlayers(currentAvailablePlayersListElement);
        console.log("pitch-renderer.js: Drop finalizat. Stare joc și UI actualizate.");

    }
}

function handleDragEnd(event) {
    draggedPlayerId = null;
    sourceSlotPositionId = null;
    console.log("pitch-renderer.js: Drag end.");
}
