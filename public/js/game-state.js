// js/game-state.js - Gestionarea stării globale a jocului

import { saveGameState, loadGameState } from './utils.js';

// Starea inițială default a jocului
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
    players: [], // ASIGURĂ-TE CĂ ACESTA ESTE UN ARRAY GOL DEFAULT
    currentSeason: 1,
    currentDay: 1,
    currentFormation: '4-4-2', // Setează o formație default la inițializare
    currentMentality: 'normal' // Setează o mentalitate default la inițializare
};

/**
 * Inițializează starea jocului. Încearcă să încarce o stare salvată; dacă nu există, folosește starea implicită.
 */
export function initializeGameState() {
    const loadedState = loadGameState();
    if (loadedState) {
        // Asigură-te că proprietatea players există și este un array, chiar dacă era veche și lipsea
        if (!loadedState.players) {
            loadedState.players = [];
        }
        // Asigură-te că formația și mentalitatea sunt setate, chiar dacă lipsesc din starea veche
        if (!loadedState.currentFormation) {
            loadedState.currentFormation = '4-4-2';
        }
        if (!loadedState.currentMentality) {
            loadedState.currentMentality = 'normal';
        }
        gameState = loadedState;
        console.log("Stare joc încărcată:", gameState);
    } else {
        console.log("Nicio stare salvată găsită. Se inițializează stare nouă.");
        // Folosim gameState-ul default definit mai sus, care are deja players: [], currentFormation, currentMentality
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
    // Folosim o copie profundă pentru a asigura imutabilitatea pentru nested objects (club, coach, etc.)
    // Sau pur și simplu ne bazăm pe shallow merge dacă structurile sunt simple.
    // Pentru nested objects, ar fi: club: { ...gameState.club, ...updates.club }
    // Dar pentru simplitate acum, un shallow merge este suficient pentru majoritatea cazurilor
    // și actualizăm obiectul complet.
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
