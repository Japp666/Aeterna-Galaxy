// js/game-state.js

import { GAME_DIVISIONS } from './team-data.js';

const LOCAL_STORAGE_KEY = 'fmStellarLeagueSave';

// Starea jocului
let gameData = {
    isGameStarted: false,
    currentDay: 1,
    coachName: '',
    selectedTeamId: '',
    divisions: [],
    // Adăugați alte proprietăți necesare, cum ar fi clasamente, rezultate, etc.
};

// Funcție pentru a obține starea jocului
export function getGameData() { // Acum exportă getGameData
    return gameData;
}

// Funcție pentru a actualiza starea jocului
export function updateGameData(newData) { // Acum exportă updateGameData
    Object.assign(gameData, newData);
    saveGameData(); // Salvează imediat după actualizare
}

// Funcție pentru a salva starea jocului în localStorage
export function saveGameData() { // Acum exportă saveGameData
    try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(gameData));
        console.log("game-state.js: Starea jocului salvată cu succes.");
    } catch (e) {
        console.error("game-state.js: Eroare la salvarea stării jocului:", e);
    }
}

// Funcție pentru a încărca starea jocului din localStorage
function loadGameData() {
    try {
        const savedData = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (savedData) {
            const parsedData = JSON.parse(savedData);
            // Validare de bază pentru a evita încărcarea datelor corupte
            if (parsedData && parsedData.isGameStarted !== undefined && parsedData.divisions) {
                gameData = parsedData;
                console.log("game-state.js: Stare de joc salvată încărcată cu succes.");
                return true;
            } else {
                console.warn("game-state.js: Stare de joc salvată coruptă sau incompletă. Se va inițializa o stare nouă.");
                return false;
            }
        }
    } catch (e) {
        console.error("game-state.js: Eroare la încărcarea stării jocului:", e);
    }
    return false;
}

// Inițializarea jocului la încărcare
(function initGameState() {
    // Înainte de a încărca starea, asigură-te că GAME_DIVISIONS este deja populat
    // Acest lucru este important, deoarece gameData.divisions este o copie a GAME_DIVISIONS
    // care provine din team-data.js

    if (!loadGameData()) {
        // Dacă nu există date salvate sau sunt corupte, inițializează o stare nouă
        gameData.isGameStarted = false;
        gameData.currentDay = 1;
        // Asigură-te că GAME_DIVISIONS este disponibil înainte de a-l copia
        if (GAME_DIVISIONS && GAME_DIVISIONS.length > 0) {
            gameData.divisions = JSON.parse(JSON.stringify(GAME_DIVISIONS)); // Copie profundă
            console.log("game-state.js: Diviziile ligii inițializate din team-data.js (stare nouă).");
        } else {
            console.error("game-state.js: Eroare: GAME_DIVISIONS nu este populat. Nu se pot inițializa diviziile.");
            // Poți adăuga aici o logică de fallback sau un mesaj de eroare vizibil utilizatorului
        }
    }
    console.log("game-state.js: Starea jocului inițializată.");
})();
