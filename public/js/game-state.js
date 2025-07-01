// public/js/game-state.js - Gestionează starea jocului (salvare/încărcare din Local Storage)

const GAME_STATE_KEY = 'footballManagerGameState';

// Starea inițială a jocului
const initialGameState = {
    isGameStarted: false,
    coach: {
        nickname: '',
        reputation: 0,
        experience: 0
    },
    club: {
        name: '',
        emblemUrl: '',
        funds: 0,
        reputation: 0,
        facilitiesLevel: 0
    },
    players: [],
    currentSeason: 1,
    currentDay: 1,
    currentFormation: '4-4-2', // Formație implicită
    currentMentality: 'balanced', // Mentalitate implicită
    teamFormation: {} // Jucătorii alocați pe poziții pe teren
};

let gameState = loadGameState() || initialGameState;

/**
 * Încarcă starea jocului din Local Storage.
 * @returns {object | null} Starea jocului sau null dacă nu există.
 */
export function loadGameState() {
    try {
        const savedState = localStorage.getItem(GAME_STATE_KEY);
        if (savedState) {
            const parsedState = JSON.parse(savedState);
            // Asigură-te că toate câmpurile necesare există, chiar dacă au fost adăugate ulterior
            return { ...initialGameState, ...parsedState };
        }
    } catch (e) {
        console.error("game-state.js: Eroare la încărcarea stării jocului:", e);
    }
    console.log("game-state.js: Nu s-a găsit stare de joc salvată sau a apărut o eroare la încărcare.");
    return null;
}

/**
 * Salvează starea curentă a jocului în Local Storage.
 */
export function saveGameState() {
    try {
        localStorage.setItem(GAME_STATE_KEY, JSON.stringify(gameState));
        console.log("game-state.js: Stare joc salvată cu succes.");
    } catch (e) {
        console.error("game-state.js: Eroare la salvarea stării jocului:", e);
    }
}

/**
 * Returnează starea curentă a jocului.
 * @returns {object} Starea curentă a jocului.
 */
export function getGameState() {
    return gameState;
}

/**
 * Actualizează o parte din starea jocului și o salvează.
 * @param {object} updates - Un obiect cu proprietățile de actualizat.
 */
export function updateGameState(updates) {
    gameState = { ...gameState, ...updates };
    saveGameState();
    console.log("game-state.js: Stare joc actualizată:", updates);
}

/**
 * Resetează complet starea jocului la valorile inițiale și șterge din Local Storage.
 */
export function resetGameState() {
    console.log("game-state.js: Se resetează starea jocului...");
    localStorage.removeItem(GAME_STATE_KEY);
    gameState = { ...initialGameState }; // Resetăm la o copie a stării inițiale
    console.log("game-state.js: Starea jocului a fost resetată și ștearsă din Local Storage.");
    // Reîncărcăm pagina pentru a asigura o stare curată
    window.location.reload(); 
}

// Asigură-te că starea este salvată la fiecare modificare importantă
// (ex: după setup, după fiecare zi, după transferuri etc.)
