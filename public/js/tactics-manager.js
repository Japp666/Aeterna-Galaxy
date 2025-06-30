// public/js/tactics-manager.js

import { getGameState, saveGameState } from './game-state.js';
import { FORMATIONS, MENTALITY_ADJUSTMENTS, POSITION_MAP } from './tactics-data.js';
import { renderPitch, placePlayersInPitchSlots, renderAvailablePlayers } from './pitch-renderer.js';

let currentTeamContentElement = null;
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
    currentTeamContentElement = footballPitchElement.closest('#team-content');
    currentFootballPitchElement = footballPitchElement; 
    currentAvailablePlayersListElement = availablePlayersListElement; 

    renderFormationButtons(formationButtonsContainer);
    renderMentalityButtons(mentalityButtonsContainer);
    addFormationButtonListeners(formationButtonsContainer); 
    addMentalityButtonListeners(mentalityButtonsContainer); 

    console.log("tactics-manager.js: Manager de tactici inițializat.");
}

/**
 * Randare butoanele de formație.
 * @param {HTMLElement} container - Elementul container pentru butoanele de formație.
 */
function renderFormationButtons(container) {
    container.innerHTML = '';
    const gameState = getGameState();

    // Filtrează 'GK' deoarece este o poziție, nu o formație tactică principală
    Object.keys(FORMATIONS).filter(key => key !== 'GK').forEach(formationName => {
        const button = document.createElement('button');
        button.classList.add('btn', 'formation-button'); // Asigură clasele CSS
        button.textContent = formationName;
        button.dataset.formation = formationName;

        if (gameState.currentFormation === formationName) {
            button.classList.add('active'); // Aplică clasa 'active' dacă este formația curentă
        }
        container.appendChild(button);
    });
    console.log("tactics-manager.js: Butoane de formație randate.");
    console.log(`tactics-manager.js: Număr de butoane de formație randate: ${container.querySelectorAll('.formation-button').length}`);
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
        button.classList.add('btn', 'mentality-button'); // Asigură clasele CSS
        button.textContent = mentalityName.charAt(0).toUpperCase() + mentalityName.slice(1);
        button.dataset.mentality = mentalityName;

        if (gameState.currentMentality === mentalityName) {
            button.classList.add('active'); // Aplică clasa 'active' dacă este mentalitatea curentă
        }
        container.appendChild(button);
    });
    console.log("tactics-manager.js: Butoane de mentalitate randate.");
    console.log(`tactics-manager.js: Număr de butoane de mentalitate randate: ${container.querySelectorAll('.mentality-button').length}`);
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
            gameState.teamFormation = { GK: null }; 
            gameState.players.forEach(p => p.onPitch = false); // Resetează jucătorii de pe teren
            saveGameState(gameState);
            
            // Actualizează clasa 'active' pentru butoanele de formație
            container.querySelectorAll('.formation-button').forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            renderPitch(currentFootballPitchElement, gameState.currentFormation, gameState.currentMentality);
            placePlayersInPitchSlots(currentFootballPitchElement, gameState.teamFormation, currentAvailablePlayersListElement); 
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
            saveGameState(gameState);

            // Actualizează clasa 'active' pentru butoanele de mentalitate
            container.querySelectorAll('.mentality-button').forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            renderPitch(currentFootballPitchElement, gameState.currentFormation, gameState.currentMentality);
            placePlayersInPitchSlots(currentFootballPitchElement, gameState.teamFormation, currentAvailablePlayersListElement); 
            console.log(`tactics-manager.js: Mentalitatea schimbată la ${newMentality}. Pozițiile jucătorilor au fost ajustate.`);
        });
    });
}

/**
 * Aranjează automat cei mai buni jucători disponibili pe pozițiile formației curente.
 * @param {HTMLElement} footballPitchElement - Elementul DOM al terenului de fotbal.
 * @param {HTMLElement} availablePlayersListElement - Elementul listei de jucători disponibili.
 */
export function autoArrangePlayers(footballPitchElement, availablePlayersListElement) {
    console.log("tactics-manager.js: autoArrangePlayers() - Se încearcă aranjarea automată a jucătorilor.");
    const gameState = getGameState();
    const currentFormationDetails = FORMATIONS[gameState.currentFormation];
    const allPlayers = gameState.players;

    gameState.teamFormation = { GK: null }; 
    allPlayers.forEach(p => p.onPitch = false); 

    const bestGK = allPlayers
        .filter(player => !player.onPitch && player.playablePositions && player.playablePositions.includes('GK')) 
        .sort((a, b) => b.overall - a.overall)[0];

    if (bestGK) {
        gameState.teamFormation.GK = bestGK.id;
        bestGK.onPitch = true;
        console.log(`tactics-manager.js: Portarul ${bestGK.name} (${bestGK.overall}) a fost plasat.`);
    } else {
        console.warn("tactics-manager.js: Nu s-a găsit un portar disponibil.");
    }

    currentFormationDetails.filter(slot => slot.pos !== 'GK').forEach(slot => {
        const bestPlayerForSlot = allPlayers
            .filter(player => !player.onPitch && player.playablePositions && player.playablePositions.includes(slot.pos)) 
            .sort((a, b) => b.overall - a.overall)[0];

        if (bestPlayerForSlot) {
            gameState.teamFormation[slot.pos] = bestPlayerForSlot.id;
            bestPlayerForSlot.onPitch = true;
            console.log(`tactics-manager.js: Jucătorul ${bestPlayerForSlot.name} (${bestPlayerForSlot.overall}) plasat pe ${slot.pos}.`);
        } else {
            const nextBestAvailable = allPlayers
                .filter(player => !player.onPitch)
                .sort((a, b) => b.overall - a.overall)[0];
            if (nextBestAvailable) {
                gameState.teamFormation[slot.pos] = nextBestAvailable.id;
                nextBestAvailable.onPitch = true;
                console.warn(`tactics-manager.js: Nu s-a găsit jucător specific pentru ${slot.pos}. Plasat ${nextBestAvailable.name} (generalist).`);
            } else {
                gameState.teamFormation[slot.pos] = null;
                console.warn(`tactics-manager.js: Nu s-a găsit niciun jucător disponibil pentru slotul ${slot.pos}.`);
            }
        }
    });

    saveGameState(gameState);
    
    renderPitch(footballPitchElement, gameState.currentFormation, gameState.currentMentality);
    placePlayersInPitchSlots(footballPitchElement, gameState.teamFormation, availablePlayersListElement); 
    console.log("tactics-manager.js: Aranjare automată finalizată. Stare joc și UI actualizate.");
}
