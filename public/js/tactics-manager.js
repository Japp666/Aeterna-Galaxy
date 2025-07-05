// public/js/tactics-manager.js

import { getGameState, updateGameState, saveGameState } from './game-state.js';
import { FORMATIONS, MENTALITY_ADJUSTMENTS, POSITION_MAP } from './tactics-data.js';
import { renderPitch, placePlayersInPitchSlots, renderAvailablePlayers } from './pitch-renderer.js';

let currentFootballPitchElement = null; 
let currentAvailablePlayersListElement = null; 

/**
 * Inițializează managerul de tactici: randează butoanele de formație și mentalitate,
 * și adaugă listeneri pentru ele.
 * @param {HTMLElement} formationButtonsContainer - Containerul pentru butoanele de formație.
 * @param {HTMLElement} mentalityButtonsContainer - Containerul pentru butoanele de mentalitate.
 * @param {HTMLElement} footballPitchElement - Elementul terenului de fotbal.
 * @param {HTMLElement} availablePlayersListElement - Elementul listei de jucători disponibili.
 */
export function initTacticsManager(formationButtonsContainer, mentalityButtonsContainer, footballPitchElement, availablePlayersListElement) {
    console.log("tactics-manager.js: initTacticsManager() - Inițializarea managerului de tactici.");
    currentFootballPitchElement = footballPitchElement; 
    currentAvailablePlayersListElement = availablePlayersListElement; 

    renderFormationButtons(formationButtonsContainer);
    renderMentalityButtons(mentalityButtonsContainer);
    addFormationButtonListeners(formationButtonsContainer); 
    addMentalityButtonListeners(mentalityButtonsContainer); 

    // Adaugă listener pentru butonul "Auto"
    const autoArrangeButton = mentalityButtonsContainer.querySelector('#auto-arrange-players-btn');
    if (autoArrangeButton) {
        autoArrangeButton.addEventListener('click', () => {
            autoArrangePlayers(); // Apelăm funcția de aranjare automată
        });
    }

    // Randăm terenul și jucătorii inițial
    const gameState = getGameState();
    renderPitch(currentFootballPitchElement, gameState.currentFormation, gameState.currentMentality);
    // Pasăm toate datele necesare și callback-ul de salvare
    placePlayersInPitchSlots(
        currentFootballPitchElement, 
        gameState.teamFormation, 
        gameState.players, 
        currentAvailablePlayersListElement, 
        handleFormationChange // Funcția de callback pentru a salva modificările
    );
    console.log("tactics-manager.js: Manager de tactici inițializat.");
}

/**
 * Funcție de callback pentru a gestiona modificările formației de pe teren.
 * Aceasta va fi apelată de pitch-renderer.js la fiecare acțiune de drag-and-drop.
 * @param {string} draggedPlayerId - ID-ul jucătorului tras.
 * @param {string} targetPosition - Poziția slotului țintă (ex: 'ST', 'CM').
 */
function handleFormationChange(draggedPlayerId, targetPosition) {
    console.log(`tactics-manager.js: handleFormationChange() - Jucătorul ${draggedPlayerId} a fost mutat pe ${targetPosition}.`);
    let gameState = getGameState();
    let currentTeamFormation = { ...gameState.teamFormation }; // Copiem formația curentă

    const allPlayers = gameState.players;
    const playerBeingDragged = allPlayers.find(p => p.id === draggedPlayerId);

    if (!playerBeingDragged) {
        console.error(`tactics-manager.js: Jucătorul cu ID ${draggedPlayerId} nu a fost găsit.`);
        return;
    }

    // Găsim poziția veche a jucătorului tras, dacă există
    const oldPositionOfDraggedPlayer = Object.keys(currentTeamFormation).find(key => currentTeamFormation[key] === draggedPlayerId);

    // Verificăm dacă slotul țintă este deja ocupat
    let existingPlayerInTargetSlotId = null;
    for (const pos in currentTeamFormation) {
        if (currentTeamFormation[pos] === targetPosition) { // Căutăm ID-ul jucătorului care este deja pe poziția țintă
            existingPlayerInTargetSlotId = currentTeamFormation[pos];
            break;
        }
    }

    // Logica de swap sau plasare
    if (existingPlayerInTargetSlotId) {
        // Slotul țintă este ocupat. Efectuăm un swap.
        const playerInTargetSlot = allPlayers.find(p => p.id === existingPlayerInTargetSlotId);

        if (oldPositionOfDraggedPlayer) {
            // Jucătorul tras era deja pe teren. Swap între două poziții de pe teren.
            currentTeamFormation[oldPositionOfDraggedPlayer] = existingPlayerInTargetSlotId; // Jucătorul din slotul țintă merge pe vechea poziție a jucătorului tras
            playerInTargetSlot.onPitch = true; // Rămâne pe teren
        } else {
            // Jucătorul tras vine de pe bancă. Jucătorul din slotul țintă merge pe bancă.
            playerInTargetSlot.onPitch = false;
        }
        currentTeamFormation[targetPosition] = draggedPlayerId; // Jucătorul tras ocupă noul slot
        playerBeingDragged.onPitch = true; // Marchează jucătorul tras ca fiind pe teren
        console.log(`tactics-manager.js: SWAP: ${playerBeingDragged.name} pe ${targetPosition}, ${playerInTargetSlot.name} pe ${oldPositionOfDraggedPlayer || 'bancă'}.`);

    } else {
        // Slotul țintă este gol. Doar plasăm jucătorul.
        if (oldPositionOfDraggedPlayer) {
            // Jucătorul tras era deja pe teren, îl mutăm
            currentTeamFormation[oldPositionOfDraggedPlayer] = null; // Eliberează vechiul slot
        }
        currentTeamFormation[targetPosition] = draggedPlayerId; // Jucătorul tras ocupă noul slot
        playerBeingDragged.onPitch = true; // Marchează jucătorul tras ca fiind pe teren
        console.log(`tactics-manager.js: PLASARE: ${playerBeingDragged.name} pe ${targetPosition}.`);
    }

    // Actualizăm starea jocului cu noua formație și jucătorii actualizați (onPitch)
    updateGameState({
        teamFormation: currentTeamFormation,
        players: allPlayers // Actualizăm întreaga listă de jucători pentru a reflecta starea 'onPitch'
    });
    
    // Re-randare pentru a reflecta schimbările
    renderPitch(currentFootballPitchElement, gameState.currentFormation, gameState.currentMentality);
    placePlayersInPitchSlots(
        currentFootballPitchElement, 
        getGameState().teamFormation, // Folosim starea actualizată
        getGameState().players,       // Folosim starea actualizată
        currentAvailablePlayersListElement, 
        handleFormationChange // Pasăm din nou callback-ul
    );
    console.log("tactics-manager.js: Stare joc și UI actualizate după mutare.");
}


/**
 * Randare butoanele de formație.
 * @param {HTMLElement} container - Elementul container pentru butoanele de formație.
 */
function renderFormationButtons(container) {
    container.innerHTML = '';
    const gameState = getGameState();

    Object.keys(FORMATIONS).filter(key => key !== 'GK').forEach(formationName => {
        const button = document.createElement('button');
        button.classList.add('btn', 'formation-button'); 
        button.textContent = formationName;
        button.dataset.formation = formationName;

        if (gameState.currentFormation === formationName) {
            button.classList.add('active');
        }
        container.appendChild(button);
    });
    console.log("tactics-manager.js: Butoane de formație randate.");
}

/**
 * Randare butoanele de mentalitate.
 * @param {HTMLElement} container - Elementul container pentru butoanele de mentalitate.
 */
function renderMentalityButtons(container) {
    // Păstrăm butonul "Auto" dacă există deja în HTML
    const autoButton = container.querySelector('#auto-arrange-players-btn');
    container.innerHTML = ''; // Curățăm doar butoanele de mentalitate
    if (autoButton) {
        container.appendChild(autoButton); // Re-adaugăm butonul "Auto"
    }

    const gameState = getGameState();

    Object.keys(MENTALITY_ADJUSTMENTS).forEach(mentalityName => {
        const button = document.createElement('button');
        button.classList.add('btn', 'mentality-button'); 
        button.textContent = mentalityName.charAt(0).toUpperCase() + mentalityName.slice(1);
        button.dataset.mentality = mentalityName;

        // Inserăm butoanele de mentalitate înainte de butonul "Auto" dacă acesta există
        if (autoButton) {
            container.insertBefore(button, autoButton);
        } else {
            container.appendChild(button);
        }

        if (gameState.currentMentality === mentalityName) {
            button.classList.add('active');
        }
    });
    console.log("tactics-manager.js: Butoane de mentalitate randate.");
}

/**
 * Adaugă listeneri la butoanele de formație.
 * @param {HTMLElement} container - Containerul butoanelor de formație.
 */
function addFormationButtonListeners(container) {
    container.querySelectorAll('.formation-button').forEach(button => {
        button.addEventListener('click', () => {
            const newFormation = button.dataset.formation;
            const gameState = getGameState();

            if (gameState.currentFormation === newFormation) {
                console.log(`tactics-manager.js: Formația ${newFormation} este deja activă.`);
                return;
            }

            console.log(`tactics-manager.js: Schimbare formație la: ${newFormation}`);
            gameState.currentFormation = newFormation;
            gameState.teamFormation = { GK: null }; // Resetăm formația de pe teren la schimbarea formației
            gameState.players.forEach(p => p.onPitch = false); // Toți jucătorii pe bancă
            updateGameState(gameState); // Salvăm starea actualizată
            
            container.querySelectorAll('.formation-button').forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            renderPitch(currentFootballPitchElement, gameState.currentFormation, gameState.currentMentality);
            placePlayersInPitchSlots(
                currentFootballPitchElement, 
                getGameState().teamFormation, 
                getGameState().players, 
                currentAvailablePlayersListElement, 
                handleFormationChange
            ); 
            console.log(`tactics-manager.js: Formația schimbată la ${newFormation}. Terenul și lista de jucători au fost actualizate.`);
        });
    });
}

/**
 * Adaugă listeneri la butoanele de mentalitate.
 * @param {HTMLElement} container - Containerul butoanelor de mentalitate.
 */
function addMentalityButtonListeners(container) {
    container.querySelectorAll('.mentality-button').forEach(button => {
        button.addEventListener('click', () => {
            const newMentality = button.dataset.mentality;
            const gameState = getGameState();

            if (gameState.currentMentality === newMentality) {
                console.log(`tactics-manager.js: Mentalitatea ${newMentality} este deja activă.`);
                return;
            }

            console.log(`tactics-manager.js: Schimbare mentalitate la: ${newMentality}`);
            gameState.currentMentality = newMentality;
            updateGameState(gameState); // Salvăm starea actualizată

            container.querySelectorAll('.mentality-button').forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            renderPitch(currentFootballPitchElement, gameState.currentFormation, gameState.currentMentality);
            placePlayersInPitchSlots(
                currentFootballPitchElement, 
                getGameState().teamFormation, 
                getGameState().players, 
                currentAvailablePlayersListElement, 
                handleFormationChange
            ); 
            console.log(`tactics-manager.js: Mentalitatea schimbată la ${newMentality}. Pozițiile jucătorilor au fost ajustate.`);
        });
    });
}

/**
 * Aranjează automat cei mai buni jucători disponibili pe pozițiile formației curente.
 */
export function autoArrangePlayers() {
    console.log("tactics-manager.js: autoArrangePlayers() - Se încearcă aranjarea automată a jucătorilor.");
    let gameState = getGameState();
    const currentFormationDetails = FORMATIONS[gameState.currentFormation];
    let allPlayers = [...gameState.players]; // Copiem jucătorii pentru a-i modifica

    // Resetăm starea onPitch pentru toți jucătorii și formația de pe teren
    allPlayers.forEach(p => p.onPitch = false);
    let newTeamFormation = {};

    // Plasează portarul
    const bestGK = allPlayers
        .filter(player => player.playablePositions && player.playablePositions.includes('GK') && !player.onPitch) 
        .sort((a, b) => b.overall - a.overall)[0];

    if (bestGK) {
        newTeamFormation.GK = bestGK.id;
        bestGK.onPitch = true;
        console.log(`tactics-manager.js: Portarul ${bestGK.name} (${bestGK.overall}) a fost plasat.`);
    } else {
        console.warn("tactics-manager.js: Nu s-a găsit un portar disponibil.");
    }

    // Încercăm să plasăm jucători pe poziții specifice formației
    currentFormationDetails.filter(slot => slot.pos !== 'GK').forEach(slot => {
        // Caută cel mai bun jucător disponibil pentru acea poziție exactă
        const bestPlayerForSlot = allPlayers
            .filter(player => !player.onPitch && player.playablePositions && player.playablePositions.includes(slot.pos)) 
            .sort((a, b) => b.overall - a.overall)[0];

        if (bestPlayerForSlot) {
            newTeamFormation[slot.pos] = bestPlayerForSlot.id;
            bestPlayerForSlot.onPitch = true;
            console.log(`tactics-manager.js: Jucătorul ${bestPlayerForSlot.name} (${bestPlayerForSlot.overall}) plasat pe ${slot.pos}.`);
        } else {
            // Dacă nu găsim un jucător pentru poziția exactă, caută cel mai bun jucător disponibil general
            const nextBestAvailable = allPlayers
                .filter(player => !player.onPitch)
                .sort((a, b) => b.overall - a.overall)[0];
            if (nextBestAvailable) {
                newTeamFormation[slot.pos] = nextBestAvailable.id;
                nextBestAvailable.onPitch = true;
                console.warn(`tactics-manager.js: Nu s-a găsit jucător specific pentru ${slot.pos}. Plasat ${nextBestAvailable.name} (generalist).`);
            } else {
                newTeamFormation[slot.pos] = null;
                console.warn(`tactics-manager.js: Nu s-a găsit niciun jucător disponibil pentru slotul ${slot.pos}.`);
            }
        }
    });

    // Actualizăm starea jocului cu noua formație și jucătorii actualizați (onPitch)
    updateGameState({
        teamFormation: newTeamFormation,
        players: allPlayers
    });
    
    // Re-randare UI
    renderPitch(currentFootballPitchElement, gameState.currentFormation, gameState.currentMentality);
    placePlayersInPitchSlots(
        currentFootballPitchElement, 
        getGameState().teamFormation, 
        getGameState().players, 
        currentAvailablePlayersListElement, 
        handleFormationChange
    ); 
    console.log("tactics-manager.js: Aranjare automată finalizată. Stare joc și UI actualizate.");
}
