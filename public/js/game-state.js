/* public/js/game-state.js */

import { GAME_DIVISIONS } from './team-data.js'; // Importăm diviziile generate

// Cheia sub care vom salva starea jocului în localStorage
const GAME_STATE_STORAGE_KEY = 'fmStellarLeagueGameState';

// Starea inițială a jocului
let gameState = {
    isGameStarted: false, // Va fi true după finalizarea setup-ului
    coach: null, // Detalii despre antrenor (nume, experiență etc.)
    club: null,  // Detalii despre clubul jucătorului (nume, emblemă, buget)
    players: [], // Lotul de jucători al echipei jucătorului
    currentSeason: 1, // Sezonul curent
    currentDay: 1, // Ziua curentă din sezon
    league: { // Structura ligii
        divisions: [], // Aici vom stoca toate diviziile și echipele lor
        // Pot fi adăugate și alte informații despre ligă, ex: nume ligă, reguli
    },
    // Alte date ale jocului, ex: calendar, clasamente, finanțe, etc.
    calendar: [], // Programul de meciuri al întregii ligi
};

/**
 * Încarcă starea jocului din localStorage.
 * @returns {boolean} True dacă starea a fost încărcată cu succes, false altfel.
 */
export function loadGameState() {
    try {
        const savedState = localStorage.getItem(GAME_STATE_STORAGE_KEY);
        if (savedState) {
            gameState = JSON.parse(savedState);
            console.log('game-state.js: Stare de joc salvată încărcată cu succes.');
            // Asigură-te că proprietățile esențiale există, chiar dacă nu erau în salvarea veche
            // Utile pentru compatibilitate ascendentă dacă adaugi noi proprietăți
            gameState.league = gameState.league || { divisions: [] };
            if (!gameState.league.divisions || gameState.league.divisions.length === 0) {
                 // Dacă nu există divizii sau sunt goale, le inițializăm cu GAME_DIVISIONS din team-data.js
                 gameState.league.divisions = GAME_DIVISIONS;
                 console.log('game-state.js: Diviziile ligii inițializate din team-data.js.');
            }
            return true;
        }
    } catch (error) {
        console.error('game-state.js: Eroare la încărcarea stării jocului:', error);
    }
    console.log('game-state.js: Nu s-a găsit stare de joc salvată sau a apărut o eroare la încărcare.');
    // Dacă nu există stare salvată, inițializăm diviziile aici
    gameState.league.divisions = GAME_DIVISIONS;
    console.log('game-state.js: Diviziile ligii inițializate din team-data.js (stare nouă).');
    return false;
}

/**
 * Salvează starea curentă a jocului în localStorage.
 */
export function saveGameState() {
    try {
        localStorage.setItem(GAME_STATE_STORAGE_KEY, JSON.stringify(gameState));
        console.log('game-state.js: Stare joc salvată cu succes.');
    } catch (error) {
        console.error('game-state.js: Eroare la salvarea stării jocului:', error);
    }
}

/**
 * Resetează starea jocului la valorile inițiale.
 * Aceasta va șterge și starea salvată din localStorage.
 */
export function resetGameState() {
    console.log('game-state.js: Resetarea stării jocului...');
    localStorage.removeItem(GAME_STATE_STORAGE_KEY);
    gameState = {
        isGameStarted: false,
        coach: null,
        club: null,
        players: [],
        currentSeason: 1,
        currentDay: 1,
        league: {
            divisions: GAME_DIVISIONS, // Re-inițializăm diviziile și la reset
        },
        calendar: [],
    };
    console.log('game-state.js: Stare joc resetată. localStorage curățat.');
    saveGameState(); // Salvează starea goală/inițială
}


/**
 * Returnează o copie a stării curente a jocului.
 * @returns {object} Copia stării jocului.
 */
export function getGameState() {
    // Returnează o copie pentru a preveni modificări directe din exterior
    return JSON.parse(JSON.stringify(gameState));
}

/**
 * Actualizează o parte din starea jocului.
 * @param {object} updates - Un obiect cu proprietățile de actualizat.
 */
export function updateGameState(updates) {
    gameState = { ...gameState, ...updates };
    console.log('game-state.js: Stare joc actualizată:', gameState);
    saveGameState(); // Salvează imediat după actualizare
}

/**
 * Obține echipa jucătorului din starea jocului.
 * @returns {object|null} Obiectul echipei jucătorului sau null dacă nu este setat.
 */
export function getPlayerClub() {
    return gameState.club;
}

/**
 * Obține lotul de jucători al echipei utilizatorului.
 * @returns {Array<object>} Lotul de jucători.
 */
export function getPlayerRoster() {
    return gameState.players;
}

/**
 * Obține toate diviziile ligii.
 * @returns {Array<object>} Un array cu toate diviziile și echipele lor.
 */
export function getLeagueDivisions() {
    return gameState.league.divisions;
}

/**
 * Obține o divizie specifică după ID-ul său.
 * @param {string} divisionId - ID-ul diviziei (ex: 'division_1').
 * @returns {object|undefined} Obiectul diviziei sau undefined dacă nu este găsită.
 */
export function getDivisionById(divisionId) {
    return gameState.league.divisions.find(div => div.id === divisionId);
}

// Exportăm și funcția de inițializare a stării jocului la prima încărcare a modulului
// Această linie este crucială pentru a asigura că starea este populată
// fie din localStorage, fie cu datele inițiale (inclusiv GAME_DIVISIONS).
loadGameState();
