// public/js/tactics-manager.js - Logică pentru gestionarea tacticilor (formații și mentalitate)

import { getGameState, updateGameState } from './game-state.js';
// LINIUA MODIFICATĂ: Am importat renderAvailablePlayers de la pitch-renderer.js
import { renderPitch, placePlayersInPitchSlots, renderAvailablePlayers, formations } from './pitch-renderer.js'; 

// Referințele la elemente DOM sunt preluate în initTacticsManager
let formationSelectElement = null;
let mentalitySelectElement = null;
let footballPitchElement = null;
let availablePlayersListElement = null; // Pentru a le pasa la pitch-renderer.js

/**
 * Inițializează managerul de tactici.
 * Populează dropdown-urile și adaugă event listeneri.
 */
export function initTacticsManager(formationSelect, mentalitySelect, footballPitch, availablePlayersList) {
    console.log("tactics-manager.js: initTacticsManager() - Inițializarea managerului de tactici.");
    
    // Asignăm elementele la variabilele globale locale
    formationSelectElement = formationSelect;
    mentalitySelectElement = mentalitySelect;
    footballPitchElement = footballPitch;
    availablePlayersListElement = availablePlayersList;

    if (!formationSelectElement || !mentalitySelectElement || !footballPitchElement || !availablePlayersListElement) {
        console.error("tactics-manager.js: Nu s-au primit toate elementele necesare pentru inițializare.");
        return;
    }

    populateFormationSelect();
    populateMentalitySelect();
    addEventListeners();
    console.log("tactics-manager.js: Manager de tactici inițializat.");
}

/**
 * Populează dropdown-ul pentru selectarea formației.
 */
function populateFormationSelect() {
    console.log("tactics-manager.js: populateFormationSelect() - Populez select-ul de formații.");
    if (!formationSelectElement) {
        console.error("tactics-manager.js: Elementul formationSelectElement nu a fost găsit.");
        return;
    }
    formationSelectElement.innerHTML = ''; // Curăță opțiunile existente

    for (const formationKey in formations) { // Folosim 'formations' importat
        const option = document.createElement('option');
        option.value = formationKey;
        option.textContent = formationKey;
        formationSelectElement.appendChild(option);
    }
    const gameState = getGameState();
    formationSelectElement.value = gameState.currentFormation; // Setează formația curentă
    console.log("tactics-manager.js: Select-ul de formații populat.");
}

/**
 * Populează dropdown-ul pentru selectarea mentalității.
 */
function populateMentalitySelect() {
    console.log("tactics-manager.js: populateMentalitySelect() - Populez select-ul de mentalități.");
    if (!mentalitySelectElement) {
        console.error("tactics-manager.js: Elementul mentalitySelectElement nu a fost găsit.");
        return;
    }
    const mentalities = ['Defensivă', 'Normală', 'Ofensivă'];
    mentalitySelectElement.innerHTML = '';
    mentalities.forEach(mentality => {
        const option = document.createElement('option');
        option.value = mentality.toLowerCase();
        option.textContent = mentality;
        mentalitySelectElement.appendChild(option);
    });
    const gameState = getGameState();
    mentalitySelectElement.value = gameState.currentMentality;
    console.log("tactics-manager.js: Select-ul de mentalități populat.");
}

/**
 * Adaugă event listeneri pentru schimbările în select-uri.
 */
function addEventListeners() {
    if (formationSelectElement) {
        formationSelectElement.addEventListener('change', (event) => {
            console.log("tactics-manager.js: Schimbare formație în:", event.target.value);
            updateGameState({ currentFormation: event.target.value });
            
            // Re-randăm terenul cu noua formație
            if (footballPitchElement) {
                renderPitch(footballPitchElement, getGameState().currentFormation);
                placePlayersInPitchSlots(footballPitchElement, getGameState().teamFormation);
                // Apelul corectat al funcției renderAvailablePlayers
                renderAvailablePlayers(availablePlayersListElement); 
            }
        });
    }

    if (mentalitySelectElement) {
        mentalitySelectElement.addEventListener('change', (event) => {
            console.log("tactics-manager.js: Schimbare mentalitate în:", event.target.value);
            updateGameState({ currentMentality: event.target.value });
            // Nu este necesară o randare a terenului pentru mentalitate, doar actualizarea stării
        });
    }
    console.log("tactics-manager.js: Event listeneri adăugați.");
}
