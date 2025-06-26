// public/js/tactics-manager.js - Logică pentru gestionarea tacticilor (formații și mentalitate)

import { getGameState, updateGameState } from './game-state.js';
import { renderPitch, placePlayersInPitchSlots, renderAvailablePlayers, formations, addDragDropListeners } from './pitch-renderer.js'; 

// Referințele la elemente DOM sunt preluate în initTacticsManager
let formationButtonsContainer = null;
let mentalityButtonsContainer = null;
let footballPitchElement = null;
let availablePlayersListElement = null;

/**
 * Inițializează managerul de tactici.
 * Populează butoanele și adaugă event listeneri.
 * @param {HTMLElement} formationBtns - Containerul pentru butoanele de formație.
 * @param {HTMLElement} mentalityBtns - Containerul pentru butoanele de mentalitate.
 * @param {HTMLElement} pitch - Elementul terenului de fotbal.
 * @param {HTMLElement} availablePlayers - Containerul jucătorilor disponibili.
 */
export function initTacticsManager(formationBtns, mentalityBtns, pitch, availablePlayers) {
    console.log("tactics-manager.js: initTacticsManager() - Inițializarea managerului de tactici.");
    
    // Asignăm elementele la variabilele globale locale
    formationButtonsContainer = formationBtns;
    mentalityButtonsContainer = mentalityBtns;
    footballPitchElement = pitch;
    availablePlayersListElement = availablePlayers;

    if (!formationButtonsContainer || !mentalityButtonsContainer || !footballPitchElement || !availablePlayersListElement) {
        console.error("tactics-manager.js: Nu s-au primit toate elementele necesare pentru inițializare.");
        return;
    }

    const gameState = getGameState();

    // Rendăm terenul inițial cu formația curentă a jocului
    renderPitch(footballPitchElement, gameState.currentFormation);
    placePlayersInPitchSlots(footballPitchElement, gameState.teamFormation);
    renderAvailablePlayers(availablePlayersListElement); // Rendăm jucătorii disponibili

    populateFormationButtons(gameState.currentFormation);
    populateMentalityButtons(gameState.currentMentality);
    addEventListeners();
    addDragDropListeners(footballPitchElement, availablePlayersListElement); // Adaugă listeneri de D&D
    console.log("tactics-manager.js: Manager de tactici inițializat.");
}

/**
 * Populează containerul pentru butoanele de formație.
 * @param {string} currentFormation - Formația curentă.
 */
function populateFormationButtons(currentFormation) {
    console.log("tactics-manager.js: populateFormationButtons() - Populez butoanele de formații.");
    if (!formationButtonsContainer) {
        console.error("tactics-manager.js: Elementul formationButtonsContainer nu a fost găsit.");
        return;
    }
    formationButtonsContainer.innerHTML = ''; // Curăță butoanele existente

    for (const formationKey in formations) {
        const button = document.createElement('button');
        button.classList.add('btn', 'btn-tactics'); // Clase generice pentru butoane
        button.dataset.formation = formationKey;
        button.textContent = formationKey;
        if (formationKey === currentFormation) {
            button.classList.add('active'); // Marcam butonul activ
        }
        formationButtonsContainer.appendChild(button);
    }
    console.log("tactics-manager.js: Butoane de formații populate.");
}

/**
 * Populează containerul pentru butoanele de mentalitate.
 * @param {string} currentMentality - Mentalitatea curentă.
 */
function populateMentalityButtons(currentMentality) {
    console.log("tactics-manager.js: populateMentalityButtons() - Populez butoanele de mentalități.");
    if (!mentalityButtonsContainer) {
        console.error("tactics-manager.js: Elementul mentalityButtonsContainer nu a fost găsit.");
        return;
    }
    const mentalities = ['Defensivă', 'Normală', 'Ofensivă'];
    mentalityButtonsContainer.innerHTML = '';
    mentalities.forEach(mentality => { // Fost: 'mentalties' -> Corectat: 'mentalities'
        const button = document.createElement('button');
        button.classList.add('btn', 'btn-tactics');
        button.dataset.mentality = mentality.toLowerCase();
        button.textContent = mentality;
        if (mentality.toLowerCase() === currentMentality) {
            button.classList.add('active');
        }
        mentalityButtonsContainer.appendChild(button);
    });
    console.log("tactics-manager.js: Butoane de mentalități populate.");
}

/**
 * Adaugă event listeneri pentru click-urile pe butoane.
 */
function addEventListeners() {
    if (formationButtonsContainer) {
        formationButtonsContainer.addEventListener('click', (event) => {
            const clickedButton = event.target.closest('.btn-tactics');
            if (clickedButton && clickedButton.dataset.formation) {
                const newFormation = clickedButton.dataset.formation;
                console.log("tactics-manager.js: Schimbare formație în:", newFormation);
                updateGameState({ currentFormation: newFormation });

                // Actualizăm clasa 'active' pentru butoanele de formație
                formationButtonsContainer.querySelectorAll('.btn-tactics').forEach(btn => {
                    btn.classList.remove('active');
                });
                clickedButton.classList.add('active');
                
                // Re-randăm terenul cu noua formație
                if (footballPitchElement) {
                    renderPitch(footballPitchElement, getGameState().currentFormation);
                    // Resetăm formația de jucători pe teren la schimbarea formației pentru a nu avea poziții greșite
                    updateGameState({ teamFormation: [] }); 
                    placePlayersInPitchSlots(footballPitchElement, getGameState().teamFormation);
                    renderAvailablePlayers(availablePlayersListElement); 
                }
            }
        });
    }

    if (mentalityButtonsContainer) {
        mentalityButtonsContainer.addEventListener('click', (event) => {
            const clickedButton = event.target.closest('.btn-tactics');
            if (clickedButton && clickedButton.dataset.mentality) {
                const newMentality = clickedButton.dataset.mentality;
                console.log("tactics-manager.js: Schimbare mentalitate în:", newMentality);
                updateGameState({ currentMentality: newMentality });

                // Actualizăm clasa 'active' pentru butoanele de mentalitate
                mentalityButtonsContainer.querySelectorAll('.btn-tactics').forEach(btn => {
                    btn.classList.remove('active');
                });
                clickedButton.classList.add('active');
            }
        });
    }
    console.log("tactics-manager.js: Event listeneri adăugați pentru butoane.");
}
