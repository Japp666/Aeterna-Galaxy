// public/js/tactics-manager.js

import { getGameState, saveGameState } from './game-state.js';
import { FORMATIONS, MENTALITY_ADJUSTMENTS, POSITION_MAP } from './tactics-data.js'; // Import nou
import { renderPitch, placePlayersInPitchSlots, renderAvailablePlayers } from './pitch-renderer.js';

let currentTeamContentElement = null; // Stocăm elementul rădăcină al tab-ului Echipă

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
    currentTeamContentElement = footballPitchElement.closest('#team-content'); // Setăm elementul rădăcină

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
    container.innerHTML = ''; // Curăță butoanele existente
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
    container.innerHTML = ''; // Curăță butoanele existente
    const gameState = getGameState();

    Object.keys(MENTALITY_ADJUSTMENTS).forEach(mentalityName => {
        const button = document.createElement('button');
        button.classList.add('btn', 'btn-secondary', 'mentality-button');
        button.textContent = mentalityName.charAt(0).toUpperCase() + mentalityName.slice(1); // Capitalizează
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
            // Când se schimbă formația, echipa se resetează pe teren
            gameState.teamFormation = { GK: null }; // Resetăm toți jucătorii, păstrăm doar slotul de portar
            gameState.availablePlayers.forEach(p => p.onPitch = false); // Marcam toți jucătorii ca fiind disponibili

            saveGameState(gameState);
            
            // Actualizăm starea vizuală a butoanelor
            container.querySelectorAll('.formation-button').forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            // Re-randăm terenul și lista de jucători
            renderPitch(footballPitchElement, gameState.currentFormation, gameState.currentMentality);
            placePlayersInPitchSlots(footballPitchElement, gameState.teamFormation); // Vor fi goale inițial
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

            // Actualizăm starea vizuală a butoanelor
            container.querySelectorAll('.mentality-button').forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            // Re-randăm doar pozițiile jucătorilor pentru a reflecta noua mentalitate
            // Nu este nevoie să resetăm formația, doar să ajustăm vizualizările
            renderPitch(footballPitchElement, gameState.currentFormation, gameState.currentMentality);
            placePlayersInPitchSlots(footballPitchElement, gameState.teamFormation); // Re-plasează jucătorii cu noile ajustări
            console.log(`tactics-manager.js: Mentalitatea schimbată la ${newMentality}. Pozițiile jucătorilor au fost ajustate.`);
        });
    });
}

/**
 * Aranjează automat cei mai buni jucători în formația curentă.
 * @param {HTMLElement} footballPitchElement - Elementul terenului de fotbal.
 * @param {HTMLElement} availablePlayersListElement - Elementul listei de jucători disponibili.
 */
export function autoArrangePlayers(footballPitchElement, availablePlayersListElement) {
    console.log("tactics-manager.js: autoArrangePlayers() - Se încearcă aranjarea automată a jucătorilor.");
    const gameState = getGameState();
    const currentFormationDetails = FORMATIONS[gameState.currentFormation];
    const allPlayers = gameState.players; // Presupunem că getGameState().players este lista completă de jucători

    // Resetăm formația curentă și marcăm toți jucătorii ca fiind disponibili
    gameState.teamFormation = { GK: null }; 
    gameState.availablePlayers = [...allPlayers]; // Copiem toți jucătorii în lista disponibilă
    gameState.availablePlayers.forEach(p => p.onPitch = false);

    // Identifică cel mai bun portar
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

    // Aranjăm ceilalți jucători pe poziții în formația curentă
    currentFormationDetails.filter(slot => slot.pos !== 'GK').forEach(slot => {
        // Găsim cel mai bun jucător disponibil pentru această poziție
        // Aici este o simplificare: ar trebui să țină cont de pozițiile preferate, roluri, etc.
        const bestPlayerForSlot = gameState.availablePlayers
            .filter(player => !player.onPitch && player.positions.includes(slot.pos)) // Verificați dacă poziția este inclusă în array-ul 'positions' al jucătorului
            .sort((a, b) => b.overall - a.overall)[0]; // Sortează după overall (rating general)

        if (bestPlayerForSlot) {
            gameState.teamFormation[slot.pos] = bestPlayerForSlot.id;
            bestPlayerForSlot.onPitch = true;
            gameState.availablePlayers = gameState.availablePlayers.filter(p => p.id !== bestPlayerForSlot.id);
            console.log(`tactics-manager.js: Jucătorul ${bestPlayerForSlot.name} (${bestPlayerForSlot.overall}) plasat pe ${slot.pos}.`);
        } else {
            // Dacă nu găsim un jucător cu poziția exactă, încercăm cel mai bun jucător disponibil.
            // Aceasta este o logică de fallback, poate fi îmbunătățită.
            const nextBestAvailable = gameState.availablePlayers
                .filter(player => !player.onPitch)
                .sort((a, b) => b.overall - a.overall)[0];
            if (nextBestAvailable) {
                gameState.teamFormation[slot.pos] = nextBestAvailable.id;
                nextBestAvailable.onPitch = true;
                gameState.availablePlayers = gameState.availablePlayers.filter(p => p.id !== nextBestAvailable.id);
                console.warn(`tactics-manager.js: Nu s-a găsit jucător specific pentru ${slot.pos}. Plasat ${nextBestAvailable.name} (generalist).`);
            } else {
                gameState.teamFormation[slot.pos] = null; // Asigură-te că slotul e nul dacă nu se găsește jucător
                console.warn(`tactics-manager.js: Nu s-a găsit niciun jucător disponibil pentru slotul ${slot.pos}.`);
            }
        }
    });

    saveGameState(gameState);
    
    // Re-randăm terenul și lista de jucători
    renderPitch(footballPitchElement, gameState.currentFormation, gameState.currentMentality);
    placePlayersInPitchSlots(footballPitchElement, gameState.teamFormation);
    renderAvailablePlayers(availablePlayersListElement);
    console.log("tactics-manager.js: Aranjare automată finalizată. Stare joc și UI actualizate.");
}
