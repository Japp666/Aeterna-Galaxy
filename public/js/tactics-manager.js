// public/js/tactics-manager.js

import { getGameState, saveGameState } from './game-state.js';
import { FORMATIONS, MENTALITY_ADJUSTMENTS, POSITION_MAP } from './tactics-data.js';
import { renderPitch, placePlayersInPitchSlots, renderAvailablePlayers } from './pitch-renderer.js';

let currentTeamContentElement = null;

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
    currentTeamContentElement = footballPitchElement.closest('#team-content');

    renderFormationButtons(formationButtonsContainer);
    renderMentalityButtons(mentalityButtonsContainer);
    addFormationButtonListeners(formationButtonsContainer, footballPitchElement, availablePlayersListElement);
    addMentalityButtonListeners(mentalityButtonsContainer, footballPitchElement, availablePlayersListElement);

    console.log("tactics-manager.js: Manager de tactici inițializat.");
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
        button.classList.add('btn', 'btn-secondary', 'formation-button');
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
    container.innerHTML = '';
    const gameState = getGameState();

    Object.keys(MENTALITY_ADJUSTMENTS).forEach(mentalityName => {
        const button = document.createElement('button');
        button.classList.add('btn', 'btn-secondary', 'mentality-button');
        button.textContent = mentalityName.charAt(0).toUpperCase() + mentalityName.slice(1);
        button.dataset.mentality = mentalityName;

        if (gameState.currentMentality === mentalityName) {
            button.classList.add('active');
        }
        container.appendChild(button);
    });
    console.log("tactics-manager.js: Butoane de mentalitate randate.");
}

/**
 * Adaugă listeneri la butoanele de formație.
 * @param {HTMLElement} container - Containerul butoanelor de formație.
 * @param {HTMLElement} footballPitchElement - Elementul terenului de fotbal.
 * @param {HTMLElement} availablePlayersListElement - Elementul listei de jucători disponibili.
 */
function addFormationButtonListeners(container, footballPitchElement, availablePlayersListElement) {
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
            gameState.teamFormation = { GK: null };
            gameState.availablePlayers.forEach(p => p.onPitch = false);

            saveGameState(gameState);
            
            container.querySelectorAll('.formation-button').forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            renderPitch(footballPitchElement, gameState.currentFormation, gameState.currentMentality);
            placePlayersInPitchSlots(footballPitchElement, gameState.teamFormation);
            renderAvailablePlayers(availablePlayersListElement);
            console.log(`tactics-manager.js: Formația schimbată la ${newFormation}. Terenul și lista de jucători au fost actualizate.`);
        });
    });
}

/**
 * Adaugă listeneri la butoanele de mentalitate.
 * @param {HTMLElement} container - Containerul butoanelor de mentalitate.
 * @param {HTMLElement} footballPitchElement - Elementul terenului de fotbal.
 * @param {HTMLElement} availablePlayersListElement - Elementul listei de jucători disponibili.
 */
function addMentalityButtonListeners(container, footballPitchElement, availablePlayersListElement) {
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
            saveGameState(gameState);

            container.querySelectorAll('.mentality-button').forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            renderPitch(footballPitchElement, gameState.currentFormation, gameState.currentMentality);
            placePlayersInPitchSlots(footballPitchElement, gameState.teamFormation);
            console.log(`tactics-manager.js: Mentalitatea schimbată la ${newMentality}. Pozițiile jucătorilor au fost ajustate.`);
        });
    });
}

export function autoArrangePlayers(footballPitchElement, availablePlayersListElement) {
    console.log("tactics-manager.js: autoArrangePlayers() - Se încearcă aranjarea automată a jucătorilor.");
    const gameState = getGameState();
    const currentFormationDetails = FORMATIONS[gameState.currentFormation];
    const allPlayers = gameState.players;

    gameState.teamFormation = { GK: null }; 
    gameState.availablePlayers = [...allPlayers];
    gameState.availablePlayers.forEach(p => p.onPitch = false);

    const bestGK = gameState.availablePlayers
        .filter(player => player.position === 'GK')
        .sort((a, b) => b.overall - a.overall)[0];

    if (bestGK) {
        gameState.teamFormation.GK = bestGK.id;
        bestGK.onPitch = true;
        gameState.availablePlayers = gameState.availablePlayers.filter(p => p.id !== bestGK.id);
        console.log(`tactics-manager.js: Portarul ${bestGK.name} (${bestGK.overall}) a fost plasat.`);
    } else {
        console.warn("tactics-manager.js: Nu s-a găsit un portar disponibil.");
    }

    currentFormationDetails.filter(slot => slot.pos !== 'GK').forEach(slot => {
        const bestPlayerForSlot = gameState.availablePlayers
            .filter(player => !player.onPitch && player.positions.includes(slot.pos))
            .sort((a, b) => b.overall - a.overall)[0];

        if (bestPlayerForSlot) {
            gameState.teamFormation[slot.pos] = bestPlayerForSlot.id;
            bestPlayerForSlot.onPitch = true;
            gameState.availablePlayers = gameState.availablePlayers.filter(p => p.id !== bestPlayerForSlot.id);
            console.log(`tactics-manager.js: Jucătorul ${bestPlayerForSlot.name} (${bestPlayerForSlot.overall}) plasat pe ${slot.pos}.`);
        } else {
            const nextBestAvailable = gameState.availablePlayers
                .filter(player => !player.onPitch)
                .sort((a, b) => b.overall - a.overall)[0];
            if (nextBestAvailable) {
                gameState.teamFormation[slot.pos] = nextBestAvailable.id;
                nextBestAvailable.onPitch = true;
                gameState.availablePlayers = gameState.availablePlayers.filter(p => p.id !== nextBestAvailable.id);
                console.warn(`tactics-manager.js: Nu s-a găsit jucător specific pentru ${slot.pos}. Plasat ${nextBestAvailable.name} (generalist).`);
            } else {
                gameState.teamFormation[slot.pos] = null;
                console.warn(`tactics-manager.js: Nu s-a găsit niciun jucător disponibil pentru slotul ${slot.pos}.`);
            }
        }
    });

    saveGameState(gameState);
    
    renderPitch(footballPitchElement, gameState.currentFormation, gameState.currentMentality);
    placePlayersInPitchSlots(footballPitchElement, gameState.teamFormation);
    renderAvailablePlayers(availablePlayersListElement);
    console.log("tactics-manager.js: Aranjare automată finalizată. Stare joc și UI actualizate.");
}
