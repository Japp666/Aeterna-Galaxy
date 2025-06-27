// public/js/game-state.js

// Cheia sub care este stocată starea jocului în localStorage
const GAME_STATE_STORAGE_KEY = 'footballManagerGameState';

// Starea inițială a jocului
const initialGameState = {
    isGameStarted: false,
    clubName: '',
    coachName: '',
    teamEmblem: '',
    budget: 10000000, // Exemplu de buget inițial
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
    players: [
        // Exemplu de jucători (veți popula cu mai mulți jucători reali)
        { id: 'p001', name: 'Alin Poenaru', initials: 'AP', overall: 78, position: 'GK', positions: ['GK'], value: 500000, onPitch: false },
        { id: 'p002', name: 'Andrei Mihai', initials: 'AM', overall: 85, position: 'ST', positions: ['ST', 'LS', 'RS'], value: 12000000, onPitch: false },
        { id: 'p003', name: 'Cristi Popa', initials: 'CP', overall: 82, position: 'CB', positions: ['LCB', 'RCB', 'CB'], value: 8000000, onPitch: false },
        { id: 'p004', name: 'Dan Stan', initials: 'DS', overall: 80, position: 'CM', positions: ['LCM', 'RCM', 'CM', 'CDM'], value: 7000000, onPitch: false },
        { id: 'p005', name: 'Elena Radu', initials: 'ER', overall: 75, position: 'LB', positions: ['LB', 'LWB'], value: 4000000, onPitch: false },
        { id: 'p006', name: 'Florin Gheorghe', initials: 'FG', overall: 83, position: 'RM', positions: ['RM', 'RW'], value: 9000000, onPitch: false },
        { id: 'p007', name: 'Gabriel Ion', initials: 'GI', overall: 79, position: 'RB', positions: ['RB', 'RWB'], value: 4500000, onPitch: false },
        { id: 'p008', name: 'Horia Vasile', initials: 'HV', overall: 81, position: 'LM', positions: ['LM', 'LW'], value: 7500000, onPitch: false },
        { id: 'p009', name: 'Ion Popescu', initials: 'IP', overall: 84, position: 'CM', positions: ['CM', 'LCM', 'RCM', 'CAM'], value: 10000000, onPitch: false },
        { id: 'p010', name: 'Julia Ionescu', initials: 'JI', overall: 76, position: 'CB', positions: ['LCB', 'RCB', 'CB'], value: 6000000, onPitch: false },
        { id: 'p011', name: 'Mihai Dedu', initials: 'MD', overall: 80, position: 'ST', positions: ['ST', 'LS', 'RS'], value: 9500000, onPitch: false },
        { id: 'p012', name: 'Nicolae Dumitrescu', initials: 'ND', overall: 77, position: 'CM', positions: ['CM', 'CDM'], value: 5500000, onPitch: false },
        { id: 'p013', name: 'Octavian Mircea', initials: 'OM', overall: 74, position: 'LB', positions: ['LB'], value: 3500000, onPitch: false },
        { id: 'p014', name: 'Petru Cosmin', initials: 'PC', overall: 79, position: 'RM', positions: ['RM'], value: 6500000, onPitch: false },
        { id: 'p015', name: 'Rareș Stancu', initials: 'RS', overall: 78, position: 'RB', positions: ['RB'], value: 4200000, onPitch: false },
        { id: 'p016', name: 'Sergiu Ticu', initials: 'ST', overall: 86, position: 'ST', positions: ['ST', 'LS', 'RS'], value: 15000000, onPitch: false },
        { id: 'p017', name: 'Tudor Grigorescu', initials: 'TG', overall: 75, position: 'CB', positions: ['LCB', 'RCB', 'CB'], value: 3800000, onPitch: false },
        { id: 'p018', name: 'Vlad Popescu', initials: 'VP', overall: 81, position: 'CM', positions: ['CM', 'CAM'], value: 8800000, onPitch: false },
        { id: 'p019', name: 'Zamfir Gheorghe', initials: 'ZG', overall: 72, position: 'LM', positions: ['LM'], value: 3000000, onPitch: false },
        { id: 'p020', name: 'Alexandru Dinu', initials: 'AD', overall: 80, position: 'GK', positions: ['GK'], value: 600000, onPitch: false }
    ],
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
            currentGameState = { ...initialGameState, ...currentGameState };

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
            currentGameState.availablePlayers = [...currentGameState.players];
            saveGameState(currentGameState); // Save the fresh state
            return currentGameState;
        }
    } else {
        // Inițializează starea jocului și salvează în localStorage
        currentGameState = JSON.parse(JSON.stringify(initialGameState));
        currentGameState.availablePlayers = [...currentGameState.players]; 
        console.log("game-state.js: Stare inițială a jocului inițializată.");
        saveGameState(currentGameState);
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
    Object.assign(gameState, updates); // Actualizează proprietățile
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
