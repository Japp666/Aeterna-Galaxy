// js/game-state.js - Gestionarea stării globale a jocului

import { saveGameState, loadGameState } from './utils.js';

let gameState = {
    isGameStarted: false,
    coach: {
        nickname: ''
    },
    club: {
        name: '',
        emblemUrl: '',
        funds: 1000000, // Exemplu: fonduri inițiale
        energy: 100 // Exemplu: energie pentru activități
    },
    currentSeason: 1,
    currentDay: 1, // Pentru a urmări progresul în sezon/zi
    // Adaugă aici alte proprietăți inițiale ale stării jocului
    // ex: players: [], leagueStandings: [], facilities: {}
};

/**
 * Inițializează starea jocului. Încearcă să încarce o stare salvată; dacă nu există, folosește starea implicită.
 */
export function initializeGameState() {
    const loadedState = loadGameState();
    if (loadedState) {
        gameState = loadedState;
        console.log("Stare joc încărcată:", gameState);
    } else {
        console.log("Nicio stare salvată găsită. Se inițializează stare nouă.");
        // Aici poți adăuga logica pentru a genera jucători inițiali etc.
    }
    return gameState;
}

/**
 * Obține starea curentă a jocului.
 * @returns {object} Starea jocului.
 */
export function getGameState() {
    return gameState;
}

/**
 * Actualizează o parte din starea jocului și o salvează.
 * @param {object} updates - Un obiect cu proprietăți de actualizat în gameState.
 */
export function updateGameState(updates) {
    gameState = { ...gameState, ...updates };
    saveGameState(gameState);
    console.log("Stare joc actualizată:", gameState);
}

// Exemple de funcții de manipulare a stării specifice jocului
export function addFunds(amount) {
    updateGameState({ club: { ...gameState.club, funds: gameState.club.funds + amount } });
}

export function deductFunds(amount) {
    updateGameState({ club: { ...gameState.club, funds: gameState.club.funds - amount } });
}

export function useEnergy(amount) {
    updateGameState({ club: { ...gameState.club, energy: Math.max(0, gameState.club.energy - amount) } });
}
