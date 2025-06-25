// public/js/game-state.js

const GAME_STATE_KEY = 'galacticFootballManagerGameState';

/**
 * Obține starea curentă a jocului.
 * Dacă nu există o stare salvată, returnează o stare inițială.
 * @returns {object} Starea jocului.
 */
export function getGameState() {
    const savedState = localStorage.getItem(GAME_STATE_KEY);
    if (savedState) {
        try {
            const gameState = JSON.parse(savedState);
            console.log("game-state.js: Stare joc încărcată din localStorage.");
            // Asigură-te că toate proprietățile necesare există, chiar dacă au fost adăugate ulterior
            return {
                isGameStarted: gameState.isGameStarted || false,
                coach: gameState.coach || { nickname: 'Antrenor Nou' },
                club: gameState.club || { name: 'Echipa Mea', emblemUrl: '', funds: 10000000, energy: 100, reputation: 50, facilitiesLevel: 1 }, // Setăm emblemUrl la gol default
                players: gameState.players || [],
                teamFormation: gameState.teamFormation || [],
                currentSeason: gameState.currentSeason || 1,
                currentDay: gameState.currentDay || 1,
                currentFormation: gameState.currentFormation || '4-4-2',
                currentMentality: gameState.currentMentality || 'normal',
                // Adaugă alte proprietăți default aici, pe măsură ce le folosești
            };
        } catch (e) {
            console.error("game-state.js: Eroare la parsarea stării salvate din Local Storage:", e);
            // În caz de eroare, returnează o stare inițială curată
            return createInitialGameState();
        }
    }
    console.log("game-state.js: Nici o stare joc salvată, se creează una nouă.");
    const initialState = createInitialGameState();
    // Salvează starea inițială la prima creare
    try {
        localStorage.setItem(GAME_STATE_KEY, JSON.stringify(initialState));
        console.log("game-state.js: Stare joc inițială salvată.");
    } catch (e) {
        console.error("game-state.js: Eroare la salvarea stării inițiale în Local Storage:", e);
        // Nu folosi alert() în producție, folosește un mesaj custom UI
    }
    return initialState;
}

/**
 * Creează o stare inițială a jocului.
 * @returns {object} Starea inițială a jocului.
 */
function createInitialGameState() {
    return {
        isGameStarted: false,
        coach: { nickname: 'Antrenor Nou', reputation: 50, experience: 0 },
        club: { name: 'Echipa Mea', emblemUrl: '', funds: 10000000, energy: 100, reputation: 50, facilitiesLevel: 1 }, // Emblemă inițială goală
        players: [], // Lotul de jucători
        teamFormation: [], // Jucătorii aflați în formația curentă - Inițializat ca array gol
        currentSeason: 1,
        currentDay: 1,
        currentFormation: '4-4-2', // Formație default
        currentMentality: 'normal', // Mentalitate default
    };
}

/**
 * Actualizează starea jocului și o salvează în Local Storage.
 * @param {object} newState - Un obiect cu proprietățile de actualizat.
 */
export function updateGameState(newState) {
    let currentState = getGameState(); // Preia starea curentă pentru a o actualiza
    // Combină starea existentă cu cea nouă, asigurând imutabilitatea
    currentState = { 
        ...currentState, 
        coach: { ...currentState.coach, ...newState.coach },
        club: { ...currentState.club, ...newState.club },
        ...newState 
    }; 

    try {
        localStorage.setItem(GAME_STATE_KEY, JSON.stringify(currentState));
        console.log("game-state.js: Stare joc salvată cu succes!");
        console.log("game-state.js: Stare joc actualizată:", currentState); // Log detaliat
    } catch (e) {
        console.error("game-state.js: Eroare la salvarea stării în Local Storage:", e);
        // Nu folosi alert() în producție, folosește un mesaj custom UI
    }
}

/**
 * Resetează complet starea jocului, ștergând datele salvate.
 */
export function resetGameState() {
    localStorage.removeItem(GAME_STATE_KEY);
    console.warn("game-state.js: Starea jocului a fost resetată complet!");
    // După reset, reîncărcăm pagina pentru o stare curată
    window.location.reload();
}
