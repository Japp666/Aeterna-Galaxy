// js/tactics-manager.js - Logică pentru gestionarea tacticilor (formații și mentalitate)

import { getGameState, updateGameState } from './game-state.js';
import { renderPitch, formations } from './pitch-renderer.js'; // Import formations de aici

const formationSelect = document.getElementById('formation-select');
const mentalitySelect = document.getElementById('mentality-select');

/**
 * Inițializează managerul de tactici.
 * Populează dropdown-urile și adaugă event listeneri.
 */
export function initTacticsManager() {
    console.log("tactics-manager.js: initTacticsManager() - Inițializarea managerului de tactici.");
    populateFormationSelect();
    populateMentalitySelect();
    addEventListeners();
    console.log("tactics-manager.js: initTacticsManager() - Manager de tactici inițializat.");
}

/**
 * Populează dropdown-ul pentru selectarea formației.
 */
function populateFormationSelect() {
    console.log("tactics-manager.js: populateFormationSelect() - Populez select-ul de formații.");
    if (!formationSelect) {
        console.error("tactics-manager.js: Elementul formation-select nu a fost găsit.");
        return;
    }
    formationSelect.innerHTML = ''; // Curăță opțiunile existente

    for (const formationKey in formations) { // Folosim 'formations' importat
        const option = document.createElement('option');
        option.value = formationKey;
        option.textContent = formationKey;
        formationSelect.appendChild(option);
    }
    const gameState = getGameState();
    formationSelect.value = gameState.currentFormation; // Setează formația curentă
    console.log("tactics-manager.js: Select-ul de formații populat.");
}

/**
 * Populează dropdown-ul pentru selectarea mentalității.
 */
function populateMentalitySelect() {
    console.log("tactics-manager.js: populateMentalitySelect() - Populez select-ul de mentalități.");
    if (!mentalitySelect) {
        console.error("tactics-manager.js: Elementul mentality-select nu a fost găsit.");
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
    console.log("tactics-manager.js: Select-ul de mentalități populat.");
}

/**
 * Adaugă event listeneri pentru schimbările în select-uri.
 */
function addEventListeners() {
    if (formationSelect) {
        formationSelect.addEventListener('change', (event) => {
            console.log("tactics-manager.js: Schimbare formație în:", event.target.value);
            updateGameState({ currentFormation: event.target.value });
            renderPitch(); // Re-randăm terenul la schimbarea formației
        });
    }

    if (mentalitySelect) {
        mentalitySelect.addEventListener('change', (event) => {
            console.log("tactics-manager.js: Schimbare mentalitate în:", event.target.value);
            updateGameState({ currentMentality: event.target.value });
            // Nu este necesară o randare a terenului pentru mentalitate, doar actualizarea stării
        });
    }
    console.log("tactics-manager.js: Event listeneri adăugați.");
}
