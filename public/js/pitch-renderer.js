// js/pitch-renderer.js - Randarea terenului de fotbal și a jucătorilor

import { getGameState, updateGameState } from './game-state.js';
import { getRarity } from './player-generator.js';

// Referințe la elemente DOM
const footballPitch = document.getElementById('football-pitch');
const availablePlayersList = document.getElementById('available-players-list');
const formationSelect = document.getElementById('formation-select');
const mentalitySelect = document.getElementById('mentality-select');

let selectedSlot = null; // Reține slotul de pe teren selectat
let draggingPlayer = null; // Reține jucătorul (cardul din lista) care este târât

// Definiții pentru formații (număr de jucători per linie)
export const formations = { // Am adăugat 'export' aici!
    '4-4-2': { DF: 4, MF: 4, AT: 2, GK: 1 },
    '4-3-3': { DF: 4, MF: 3, AT: 3, GK: 1 },
    '3-5-2': { DF: 3, MF: 5, AT: 2, GK: 1 }
};

/**
 * Inițializează UI-ul tab-ului de echipă: populare select-uri, randare teren.
 */
export function initTeamTab() { // NOTA: Aceasta functie e importata in team.js si apelata de acolo. Nu ar trebui sa fie apelata direct.
    console.log("pitch-renderer.js: initTeamTab() - Inițializarea tab-ului de echipă.");
    // populateFormationSelect(); // Mutat in tactics-manager
    // populateMentalitySelect(); // Mutat in tactics-manager
    renderPitch();
    renderAvailablePlayers();
    addDragDropListeners();
    console.log("pitch-renderer.js: initTeamTab() - Tab-ul de echipă inițializat.");
}

/**
 * Populează dropdown-ul pentru selectarea formației.
 * (Păstrată aici, dar ar trebui să fie apelată din tactics-manager.js dacă acolo e logica de control)
 */
function populateFormationSelect() {
    console.log("pitch-renderer.js: populateFormationSelect() - Populez select-ul de formații.");
    if (!formationSelect) { // Added null check
        console.error("pitch-renderer.js: Elementul formation-select nu a fost găsit.");
        return;
    }
    formationSelect.innerHTML = ''; // Curăță opțiunile existente
    for (const formationKey in formations) {
        const option = document.createElement('option');
        option.value = formationKey;
        option.textContent = formationKey;
        formationSelect.appendChild(option);
    }
    const gameState = getGameState();
    formationSelect.value = gameState.currentFormation; // Setează formația curentă
    // Listenerul a fost mutat în tactics-manager.js pentru a evita duplicarea
}

/**
 * Populează dropdown-ul pentru selectarea mentalității.
 * (Păstrată aici, dar ar trebui să fie apelată din tactics-manager.js dacă acolo e logica de control)
 */
function populateMentalitySelect() {
    console.log("pitch-renderer.js: populateMentalitySelect() - Populez select-ul de mentalități.");
    if (!mentalitySelect) { // Added null check
        console.error("pitch-renderer.js: Elementul mentality-select nu a fost găsit.");
        return;
    }
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
    // Listenerul a fost mutat în tactics-manager.js pentru a evita duplicarea
}

/**
 * Randează terenul de fotbal cu sloturile pentru jucători.
 */
export function renderPitch() {
    console.log("pitch-renderer.js: renderPitch() - Se randează terenul.");
    const gameState = getGameState();
    const currentFormation = formations[gameState.currentFormation];

    if (!footballPitch) {
        console.error("pitch-renderer.js: Elementul 'football-pitch' nu a fost găsit.");
        return;
    }

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
    // ATENȚIE: Aici era eroarea `forEach` pe `undefined`. Ne-am asigurat că `teamFormation` este întotdeauna un array.
    if (gameState.teamFormation && Array.isArray(gameState.teamFormation)) {
        gameState.teamFormation.forEach(playerInFormation => {
            const slot = document.querySelector(`.player-slot[data-slot-id="${playerInFormation.slotId}"]`);
            if (slot && playerInFormation.player) { // Verifică și playerInFormation.player să existe
                updateSlotWithPlayer(slot, playerInFormation.player);
            }
        });
    } else {
        console.warn("pitch-renderer.js: gameState.teamFormation este undefined sau nu este un array. Nu se pot plasa jucători în formație.");
    }
    
    console.log("pitch-renderer.js: Teren randat cu formația:", gameState.currentFormation);
}

/**
 * Randează lista de jucători disponibili.
 */
export function renderAvailablePlayers() {
    console.log("pitch-renderer.js: renderAvailablePlayers() - Se randează jucătorii disponibili.");
    const gameState = getGameState();
    
    if (!availablePlayersList) {
        console.error("pitch-renderer.js: Elementul 'available-players-list' nu a fost găsit.");
        return;
    }

    availablePlayersList.innerHTML = '<h3>Jucători Disponibili</h3>'; // Menținem titlul

    // Filtrăm jucătorii care NU sunt deja în formație
    const playersInFormationIds = new Set(gameState.teamFormation.map(p => p.player ? p.player.id : null).filter(Boolean)); // Adăugat verificare p.player
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
            <img src="${player.image || `https://picsum.photos/seed/${player.id}/50/50`}" alt="${player.name}" style="width:50px;height:50px;border-radius:50%;">
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
    if (availablePlayersList) {
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
    }


    // Drag over pe un slot de pe teren
    if (footballPitch) {
        footballPitch.addEventListener('dragover', (event) => {
            const slot = event.target.closest('.player-slot');
            if (slot && draggingPlayer) {
                // Verificăm poziția jucătorului târât și tipul slotului
                const draggedPlayerPositionElement = draggingPlayer.querySelector('.player-card-position');
                if (draggedPlayerPositionElement) { // Adăugat verificare aici
                    const draggedPlayerPosition = draggedPlayerPositionElement.textContent.split(': ')[1];
                    if (slot.dataset.positionType === draggedPlayerPosition) {
                        event.preventDefault(); // Permite drop-ul
                        slot.classList.add('drag-over');
                    }
                }
            }
        });

        // Drag leave de pe un slot de pe teren
        footballPitch.addEventListener('dragleave', (event) => {
            const slot = event.target.closest('.player-slot');
            if (slot) {
                slot.classList.remove('drag-over');
            }
        });

        // Drop pe un slot de pe teren
        footballPitch.addEventListener('drop', (event) => {
            event.preventDefault();
            const targetSlot = event.target.closest('.player-slot');
            if (targetSlot && draggingPlayer) {
                targetSlot.classList.remove('drag-over');

                const playerId = draggingPlayer.dataset.playerId;
                let gameState = getGameState(); // Declarați cu let pentru a permite reatribuirea
                const player = gameState.players.find(p => p.id === playerId);

                if (player && targetSlot.dataset.positionType === player.position) {
                    console.log(`pitch-renderer.js: Drop jucător ${player.name} în slot ${targetSlot.dataset.slotId}`);

                    // Verifică dacă slotul este deja ocupat
                    const existingPlayerInSlotIndex = gameState.teamFormation.findIndex(item => item.slotId === targetSlot.dataset.slotId);
                    const existingPlayerWithSameIdInFormation = gameState.teamFormation.find(item => item.playerId === player.id);


                    // Dacă jucătorul este deja în formație pe un alt slot, scoate-l de acolo
                    if (existingPlayerWithSameIdInFormation) {
                        console.log(`Jucătorul ${player.name} este deja în formație pe slotul ${existingPlayerWithSameIdInFormation.slotId}. Îl mut.`);
                        // Scoate-l din vechiul slot
                        let tempFormation = gameState.teamFormation.filter(item => item.playerId !== player.id);
                        updateGameState({ teamFormation: tempFormation }); // Actualizează temporar
                        gameState = getGameState(); // Reîncărcăm gameState pentru a fi siguri că avem cea mai nouă stare
                    }

                    // Actualizează starea jocului
                    let newTeamFormation = [...gameState.teamFormation];

                    if (existingPlayerInSlotIndex !== -1) {
                        // Dacă slotul este ocupat, înlocuiește jucătorul vechi cu cel nou
                        newTeamFormation[existingPlayerInSlotIndex] = { playerId: player.id, slotId: targetSlot.dataset.slotId, player: player };
                    } else {
                        // Dacă slotul este liber, adaugă jucătorul nou
                        newTeamFormation.push({ playerId: player.id, slotId: targetSlot.dataset.slotId, player: player });
                    }

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
            if (slot && !slot.classList.contains('empty') && slot.dataset.playerId) { // Asigură-te că are un jucător
                console.log("pitch-renderer.js: Click pe slot populat:", slot.dataset.slotId);
                const gameState = getGameState();
                const playerInSlotId = slot.dataset.playerId;

                // Scoate jucătorul din formație
                const newTeamFormation = gameState.teamFormation.filter(item => item.playerId !== playerInSlotId);
                updateGameState({ teamFormation: newTeamFormation });
                console.log("pitch-renderer.js: Jucător scos din formație. Stare actualizată.");
                renderPitch();
                renderAvailablePlayers();
            }
        });
    }
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
        <img src="${player.image || `https://picsum.photos/seed/${player.id}/50/50`}" alt="${player.name}">
        <span class="player-slot-text">${player.name.split(' ')[0]}</span>
    `;
    slotElement.dataset.playerId = player.id; // Adăugăm ID-ul jucătorului pe slot
    console.log(`pitch-renderer.js: Slot ${slotElement.dataset.slotId} actualizat cu jucătorul ${player.name}`);
}
