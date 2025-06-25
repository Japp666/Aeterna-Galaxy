// js/game-state.js - Gestionarea stării jocului (salvare/încărcare din Local Storage)

const GAME_STATE_KEY = 'footballManagerGameState';

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
                club: gameState.club || { name: 'Echipa Mea', emblemUrl: 'https://i.postimg.cc/ncd0L6SD/08.png', funds: 1000000, energy: 100 },
                players: gameState.players || [],
                teamFormation: gameState.teamFormation || [], // ASIGURĂ-TE CĂ ACESTA ESTE UN ARRAY GOL
                currentSeason: gameState.currentSeason || 1,
                currentDay: gameState.currentDay || 1,
                currentFormation: gameState.currentFormation || '4-4-2', // Valoare default
                currentMentality: gameState.currentMentality || 'normal', // Valoare default
                // Adaugă alte proprietăți default aici, pe măsură ce le folosești
            };
        } catch (e) {
            console.error("game-state.js: Eroare la parsarea stării salvate din Local Storage:", e);
            // În caz de eroare, returnează o stare inițială curată
            return createInitialGameState();
        }
    }
    console.log("game-state.js: Nicio stare joc salvată, se creează una nouă.");
    return createInitialGameState();
}

/**
 * Creează o stare inițială a jocului.
 * @returns {object} Starea inițială a jocului.
 */
function createInitialGameState() {
    return {
        isGameStarted: false,
        coach: { nickname: 'Antrenor Nou' },
        club: { name: 'Echipa Mea', emblemUrl: 'https://i.postimg.cc/ncd0L6SD/08.png', funds: 1000000, energy: 100 },
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
    currentState = { ...currentState, ...newState }; // Combină starea existentă cu cea nouă

    try {
        localStorage.setItem(GAME_STATE_KEY, JSON.stringify(currentState));
        console.log("game-state.js: Stare joc salvată cu succes!");
        console.log("game-state.js: Stare joc actualizată:", currentState); // Log detaliat
    } catch (e) {
        console.error("game-state.js: Eroare la salvarea stării în Local Storage:", e);
        alert("Eroare la salvarea jocului. Spațiul de stocare ar putea fi plin sau indisponibil.");
    }
}

/**
 * Inițializează starea jocului la pornirea aplicației.
 * Aceasta va încărca o stare existentă sau va crea una nouă.
 * @returns {object} Starea jocului încărcată sau inițializată.
 */
export function initializeGameState() {
    return getGameState();
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
