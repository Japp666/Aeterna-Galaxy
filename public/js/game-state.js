/* public/js/game-state.js */

const GAME_STATE_KEY = 'fm_stellar_league_game_state';

export function saveGameState(state) {
    try {
        localStorage.setItem(GAME_STATE_KEY, JSON.stringify(state));
        console.log('game-state.js: Starea jocului a fost salvată.');
    } catch (e) {
        console.error('game-state.js: Eroare la salvarea stării jocului:', e);
    }
}

export function loadGameState() {
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
