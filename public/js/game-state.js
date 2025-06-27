// public/js/game-state.js

// Cheia sub care este stocată starea jocului în localStorage
const GAME_STATE_STORAGE_KEY = 'footballManagerGameState';

// Starea inițială a jocului
const initialGameState = {
    isGameStarted: false,
    club: { // Detalii club
        name: '',
        emblemUrl: '',
        funds: 10000000,
        reputation: 50,
        facilitiesLevel: 1
    },
    coach: { // Detalii antrenor
        nickname: '',
        reputation: 50,
        experience: 0
    },
    currentSeason: 1,
    currentMatchday: 1,
    currentFormation: '4-4-2', // Formația implicită
    currentMentality: 'balanced', // Mentalitatea implicită
    // teamFormation va mapa pozițiile la ID-urile jucătorilor alocați
    teamFormation: {
        GK: null,
        LB: null, LCB: null, RCB: null, RB: null, // 4 defenders (example for 4-4-2)
        LM: null, LCM: null, RCM: null, RM: null, // 4 midfielders
        LS: null, RS: null // 2 forwards
    },
    // Lista de jucători, cu informații complete și o proprietate 'onPitch'
    players: [], // Lăsăm gol, va fi populată la primul setup sau încărcată din storage
    availablePlayers: [] // Jucători care nu sunt pe teren, disponibili pentru selecție
};

let currentGameState = null;

/**
 * Încarcă starea jocului din localStorage sau inițializează o stare nouă.
 * @returns {Object} Obiectul stării jocului.
 */
export function getGameState() {
    if (currentGameState) {
        return currentGameState;
    }

    const storedState = localStorage.getItem(GAME_STATE_STORAGE_KEY);
    if (storedState) {
        try {
            currentGameState = JSON.parse(storedState);
            console.log("game-state.js: Stare joc încărcată din localStorage.");
            
            // Asigură-te că proprietățile esențiale există (pentru compatibilitate cu stări vechi)
            // Creează o stare nouă, combinând initialGameState cu starea încărcată
            currentGameState = {
                ...initialGameState,
                ...currentGameState,
                club: { ...initialGameState.club, ...(currentGameState.club || {}) },
                coach: { ...initialGameState.coach, ...(currentGameState.coach || {}) },
            };

            // Asigură-te că 'onPitch' este actualizat bazat pe teamFormation
            currentGameState.players.forEach(p => {
                p.onPitch = Object.values(currentGameState.teamFormation).includes(p.id);
            });
            currentGameState.availablePlayers = currentGameState.players.filter(p => !p.onPitch);

            return currentGameState;
        } catch (e) {
            console.error("game-state.js: Eroare la parsarea stării jocului din localStorage:", e);
            // Fallback to initial state if parsing fails
            currentGameState = JSON.parse(JSON.stringify(initialGameState));
            currentGameState.availablePlayers = [...currentGameState.players]; // Populate availablePlayers initially
            saveGameState(currentGameState); // Save the fresh state
            return currentGameState;
        }
    } else {
        // Inițializează starea jocului și salvează în localStorage
        currentGameState = JSON.parse(JSON.stringify(initialGameState));
        currentGameState.availablePlayers = [...currentGameState.players]; 
        console.log("game-state.js: Stare inițială a jocului inițializată.");
        saveGameState(currentGameState); // Save the initial state
        return currentGameState;
    }
}

/**
 * Salvează starea curentă a jocului în localStorage.
 * @param {Object} state - Obiectul stării jocului de salvat.
 */
export function saveGameState(state) {
    try {
        localStorage.setItem(GAME_STATE_STORAGE_KEY, JSON.stringify(state));
        currentGameState = state;
        console.log("game-state.js: Stare joc salvată în localStorage.");
    } catch (e) {
        console.error("game-state.js: Eroare la salvarea stării jocului în localStorage:", e);
    }
}

/**
 * Actualizează o parte din starea jocului și o salvează.
 * @param {Object} updates - Un obiect cu proprietăți de actualizat în starea jocului.
 */
export function updateGameState(updates) {
    const gameState = getGameState(); // Obține starea curentă
    
    // Extinde logică pentru a gestiona actualizări imbricate (ex: club, coach)
    for (const key in updates) {
        if (typeof gameState[key] === 'object' && gameState[key] !== null &&
            !Array.isArray(gameState[key]) && typeof updates[key] === 'object' && updates[key] !== null) {
            // Dacă proprietatea este un obiect și nu un array, face merge recursiv
            Object.assign(gameState[key], updates[key]);
        } else {
            // Altfel, actualizează direct proprietatea
            gameState[key] = updates[key];
        }
    }
    
    saveGameState(gameState); // Salvează starea actualizată
    console.log("game-state.js: Stare joc actualizată cu:", updates);
}

/**
 * Resetează starea jocului la valorile inițiale și șterge din localStorage.
 */
export function resetGameState() {
    localStorage.removeItem(GAME_STATE_STORAGE_KEY);
    currentGameState = null;
    getGameState();
    console.log("game-state.js: Stare joc resetată la valorile implicite.");
}
