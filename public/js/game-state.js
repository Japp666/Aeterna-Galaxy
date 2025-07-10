// game-state.js
export const gameState = {
    currentDay: 1,
    currentSeason: 1,
    clubName: '',
    coachNickname: '',
    clubFunds: 0,
    players: [],
    clubEmblem: '', // Numele fișierului emblemei
    currentFormation: '4-4-2',
    currentMentality: 'balanced',
    teamFormation: {} // Va fi populat de managerul de tactici
};

export function loadGameState() {
    try {
        const savedState = localStorage.getItem('fmStellarLeagueGameState');
        if (savedState) {
            Object.assign(gameState, JSON.parse(savedState));
            console.log("game-state.js: Stare de joc încărcată cu succes.");
        } else {
            console.log("game-state.js: Nu s-a găsit stare de joc salvată sau a apărut o eroare la încărcare.");
            // Inițializează starea implicită dacă nu există stare salvată
            resetGameState();
        }
    } catch (error) {
        console.error("game-state.js: Eroare la încărcarea stării de joc:", error);
        console.log("game-state.js: Resetare stare de joc din cauza erorii de încărcare.");
        resetGameState(); // Resetăm la o stare validă în caz de eroare
    }
}

export function saveGameState() {
    try {
        localStorage.setItem('fmStellarLeagueGameState', JSON.stringify(gameState));
        console.log("game-state.js: Stare de joc salvată cu succes.");
    } catch (error) {
        console.error("game-state.js: Eroare la salvarea stării de joc:", error);
    }
}

export function updateGameState(newData) {
    Object.assign(gameState, newData);
    saveGameState();
}

export function getGameState() {
    return gameState;
}

export function resetGameState() {
    Object.assign(gameState, {
        currentDay: 1,
        currentSeason: 1,
        clubName: '',
        coachNickname: '',
        clubFunds: 10000000, // Reinițializează fondurile la reset
        players: [],
        clubEmblem: '',
        currentFormation: '4-4-2',
        currentMentality: 'balanced',
        teamFormation: {}
    });
    saveGameState();
}

// Încarcă starea jocului la inițializarea modulului
loadGameState();
