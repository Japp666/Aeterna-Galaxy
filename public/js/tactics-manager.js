// public/js/tactics-manager.js

import { getGameState, updateGameState, saveGameState } from './game-state.js';
import { FORMATIONS, MENTALITY_ADJUSTMENTS, POSITION_MAP } from './tactics-data.js';
import { renderPitch, placePlayersInPitchSlots, renderAvailablePlayers } from './pitch-renderer.js';

let currentFootballPitchElement = null;
let currentAvailablePlayersListElement = null;

export function initTacticsManager(formationButtonsContainer, mentalityButtonsContainer, footballPitchElement, availablePlayersListElement) {
    console.log("tactics-manager.js: initTacticsManager() - Inițializarea managerului de tactici.");

    currentFootballPitchElement = footballPitchElement;
    currentAvailablePlayersListElement = availablePlayersListElement;

    renderFormationButtons(formationButtonsContainer);
    renderMentalityButtons(mentalityButtonsContainer);
    addFormationButtonListeners(formationButtonsContainer);
    addMentalityButtonListeners(mentalityButtonsContainer);

    const autoArrangeButton = mentalityButtonsContainer.querySelector('#auto-arrange-players-btn');
    if (autoArrangeButton) {
        autoArrangeButton.addEventListener('click', () => {
            autoArrangePlayers();
        });
    }

    const gameState = getGameState();
    renderPitch(currentFootballPitchElement, gameState.currentFormation, gameState.currentMentality);
    placePlayersInPitchSlots(
        currentFootballPitchElement,
        gameState.teamFormation,
        gameState.players,
        currentAvailablePlayersListElement,
        handleFormationChange
    );

    console.log("tactics-manager.js: Manager de tactici inițializat.");
}

function handleFormationChange(draggedPlayerId, targetPosition) {
    console.log(`tactics-manager.js: handleFormationChange() - Jucătorul ${draggedPlayerId} a fost mutat pe ${targetPosition}.`);

    let gameState = getGameState();
    let currentTeamFormation = { ...gameState.teamFormation };
    const allPlayers = gameState.players;
    const playerBeingDragged = allPlayers.find(p => p.id === draggedPlayerId);

    if (!playerBeingDragged) {
        console.error(`tactics-manager.js: Jucătorul cu ID ${draggedPlayerId} nu a fost găsit.`);
        return;
    }

    const oldPositionOfDraggedPlayer = Object.keys(currentTeamFormation).find(key => currentTeamFormation[key] === draggedPlayerId);

    let existingPlayerInTargetSlotId = null;
    for (const pos in currentTeamFormation) {
        if (pos === targetPosition) {
            existingPlayerInTargetSlotId = currentTeamFormation[pos];
            break;
        }
    }

    if (oldPositionOfDraggedPlayer) {
        delete currentTeamFormation[oldPositionOfDraggedPlayer];
    }

    currentTeamFormation[targetPosition] = draggedPlayerId;
    playerBeingDragged.onPitch = true;
    console.log(`tactics-manager.js: PLASARE: ${playerBeingDragged.name} pe ${targetPosition}.`);

    updateGameState({
        teamFormation: currentTeamFormation,
        players: allPlayers
    });

    renderPitch(currentFootballPitchElement, gameState.currentFormation, gameState.currentMentality);
    placePlayersInPitchSlots(
        currentFootballPitchElement,
        getGameState().teamFormation,
        getGameState().players,
        currentAvailablePlayersListElement,
        handleFormationChange
    );

    console.log("tactics-manager.js: Stare joc și UI actualizate după mutare.");
}

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

function renderMentalityButtons(container) {
    const autoButton = container.querySelector('#auto-arrange-players-btn');
    container.innerHTML = '';
    if (autoButton) {
        container.appendChild(autoButton);
    }

    const gameState = getGameState();

    Object.keys(MENTALITY_ADJUSTMENTS).forEach(mentalityName => {
        const button = document.createElement('button');
        button.classList.add('btn', 'mentality-button');
        button.textContent = mentalityName.charAt(0).toUpperCase() + mentalityName.slice(1);
        button.dataset.mentality = mentalityName;

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

function addFormationButtonListeners(container) {
    container.querySelectorAll('.formation-button').forEach(button => {
        button.addEventListener('click', () => {
            const selectedFormation = button.dataset.formation;
            console.log(`tactics-manager.js: Formație selectată: ${selectedFormation}`);

            updateGameState({
                currentFormation: selectedFormation,
                teamFormation: {}
            });

            renderPitch(currentFootballPitchElement, selectedFormation, getGameState().currentMentality);
            placePlayersInPitchSlots(
                currentFootballPitchElement,
                {},
                getGameState().players,
                currentAvailablePlayersListElement,
                handleFormationChange
            );

            container.querySelectorAll('.formation-button').forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
        });
    });
}

function addMentalityButtonListeners(container) {
    container.querySelectorAll('.mentality-button').forEach(button => {
        button.addEventListener('click', () => {
            const selectedMentality = button.dataset.mentality;
            console.log(`tactics-manager.js: Mentalitate selectată: ${selectedMentality}`);

            updateGameState({
                currentMentality: selectedMentality
            });

            renderPitch(currentFootballPitchElement, getGameState().currentFormation, selectedMentality);
            placePlayersInPitchSlots(
                currentFootballPitchElement,
                getGameState().teamFormation,
                getGameState().players,
                currentAvailablePlayersListElement,
                handleFormationChange
            );

            container.querySelectorAll('.mentality-button').forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
        });
    });
}

export function autoArrangePlayers() {
    console.log("tactics-manager.js: autoArrangePlayers() - Aranjare automată a jucătorilor.");
    const gameState = getGameState();
    const formation = FORMATIONS[gameState.currentFormation];
    if (!formation) return;

    const allPlayers = [...gameState.players].map(p => ({ ...p, onPitch: false }));
    const newTeamFormation = {};

    formation.forEach(slot => {
        const bestPlayerForSlot = allPlayers
            .filter(player => !player.onPitch && player.playablePositions && player.playablePositions.includes(slot.pos))
            .sort((a, b) => b.overall - a.overall)[0];

        if (bestPlayerForSlot) {
            newTeamFormation[slot.pos] = bestPlayerForSlot.id;
            bestPlayerForSlot.onPitch = true;
            console.log(`tactics-manager.js: Jucătorul ${bestPlayerForSlot.name} (${bestPlayerForSlot.overall}) plasat pe ${slot.pos}.`);
        } else {
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

    updateGameState({
        teamFormation: newTeamFormation,
        players: allPlayers
    });

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

// ✅ FUNCȚIE NOUĂ necesară pentru game-ui.js
export function initializeTeamTactics() {
    console.log("tactics-manager.js: initializeTeamTactics() - Inițializăm tactici implicite pentru tabul 'Echipă'");

    const gameState = getGameState();

    renderPitch(currentFootballPitchElement, gameState.currentFormation, gameState.currentMentality);

    placePlayersInPitchSlots(
        currentFootballPitchElement,
        gameState.teamFormation,
        gameState.players,
        currentAvailablePlayersListElement,
        handleFormationChange
    );
}
