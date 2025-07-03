/* public/js/game-state.js */

const GAME_STATE_KEY = 'fm_stellar_league_game_state';

// Funcție pentru salvarea stării jocului
export function saveGameState(state) { // Adăugat 'export'
    try {
        localStorage.setItem(GAME_STATE_KEY, JSON.stringify(state));
        console.log('game-state.js: Starea jocului a fost salvată.');
    } catch (e) {
        console.error('game-state.js: Eroare la salvarea stării jocului:', e);
    }
}

// Funcție pentru încărcarea stării jocului
export function loadGameState() { // Adăugat 'export'
    try {
        const storedState = localStorage.getItem(GAME_STATE_KEY);
        if (storedState) {
            console.log('game-state.js: Starea jocului a fost încărcată.');
            return JSON.parse(storedState);
        }
    } catch (e) {
        console.error('game-state.js: Eroare la încărcarea stării jocului:', e);
        return null;
    }
    return null;
}
