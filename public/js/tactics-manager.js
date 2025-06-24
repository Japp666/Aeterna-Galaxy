// js/tactics-manager.js - Modul pentru gestionarea tacticilor (formație, mentalitate)

import { getGameState, updateGameState } from './game-state.js';
import { formations } from './pitch-renderer.js';

/**
 * Inițializează selecția de formații și mentalități.
 * @param {Function} onFormationChangeCallback - Funcție de apelat când se schimbă formația.
 * @param {Function} onMentalityChangeCallback - Funcție de apelat când se schimbă mentalitatea.
 */
export function initTacticsControls(onFormationChangeCallback, onMentalityChangeCallback) {
    const formationSelect = document.getElementById('formation-select');
    const mentalitySelect = document.getElementById('mentality-select');

    if (!formationSelect || !mentalitySelect) {
        console.error("Eroare: Elementele de selecție a tacticii (formație/mentalitate) nu au fost găsite în DOM pentru tactics-manager.");
        return;
    }

    const gameState = getGameState();
    // Asigură că aceste proprietăți există în gameState
    if (!gameState.currentFormation) {
        updateGameState({ currentFormation: '4-4-2' }); // Set default if missing
        gameState.currentFormation = '4-4-2'; // Update local gameState object too
    }
    if (!gameState.currentMentality) {
        updateGameState({ currentMentality: 'normal' }); // Set default if missing
        gameState.currentMentality = 'normal'; // Update local gameState object too
    }

    formationSelect.value = gameState.currentFormation;
    mentalitySelect.value = gameState.currentMentality;

    formationSelect.onchange = (e) => {
        const newFormation = e.target.value;
        onFormationChangeCallback(newFormation);
    };

    mentalitySelect.onchange = (e) => {
        const newMentality = e.target.value;
        onMentalityChangeCallback(newMentality);
    };
}

/**
 * Alocă jucătorii la sloturile de pe teren la începutul jocului sau la schimbarea formației.
 * Încearcă să pună jucători pe pozițiile lor primare.
 * @param {string} formationName - Numele formației curente.
 * @param {Array<object>} players - Lista de jucători din gameState.
 * @returns {Array<object>} Lista de jucători actualizată cu alocarea pe teren.
 */
export function allocateInitialPlayersToPitch(formationName, players) {
    const playersCopy = [...players];
    const currentFormation = formations[formationName];

    if (!currentFormation) {
        console.error(`Formația "${formationName}" nu a fost găsită pentru alocare.`);
        return players;
    }

    // Trimitem toți jucătorii care erau pe teren înapoi în bancă, pentru a re-aloca curat
    playersCopy.forEach(p => {
        p.currentSlot = null;
        p.isOnPitch = false;
    });

    const availablePlayers = [...playersCopy];
    let playersOnPitchCount = 0;

    for (const slotId in currentFormation.slots) {
        const slotConfig = currentFormation.slots[slotId];
        let foundPlayerIndex = -1;

        // 1. Căutăm jucători care se potrivesc exact poziției
        foundPlayerIndex = availablePlayers.findIndex(p =>
            !p.isOnPitch && p.position === slotConfig.type
        );

        // 2. Dacă nu găsim un meci perfect, căutăm un jucător de câmp pentru pozițiile de câmp,
        // sau lăsăm gol dacă e portar și nu găsim portar.
        if (foundPlayerIndex === -1 && slotConfig.type !== 'Portar') {
             foundPlayerIndex = availablePlayers.findIndex(p =>
                !p.isOnPitch && p.position !== 'Portar'
            );
        }

        if (foundPlayerIndex !== -1) {
            availablePlayers[foundPlayerIndex].isOnPitch = true;
            availablePlayers[foundPlayerIndex].currentSlot = slotId;
            playersOnPitchCount++;
        }
    }
    return availablePlayers;
}
