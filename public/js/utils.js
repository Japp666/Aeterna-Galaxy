// js/utils.js - Funcții utilitare generale

/**
 * Salvează starea jocului în localStorage.
 * @param {object} gameState - Obiectul stării jocului.
 */
export function saveGameState(gameState) {
    try {
        const serializedState = JSON.stringify(gameState);
        localStorage.setItem('fmStellarLeagueGameState', serializedState);
        console.log("Stare joc salvată cu succes!");
    } catch (error) {
        console.error("Eroare la salvarea stării jocului:", error);
    }
}

/**
 * Încarcă starea jocului din localStorage.
 * @returns {object|null} Starea jocului încărcată sau null dacă nu există/eroare.
 */
export function loadGameState() {
    try {
        const serializedState = localStorage.getItem('fmStellarLeagueGameState');
        if (serializedState === null) {
            return null; // Nicio stare salvată
        }
        const parsedState = JSON.parse(serializedState);
        console.log("Stare joc încărcată din localStorage.");
        return parsedState;
    } catch (error) {
        console.error("Eroare la încărcarea stării jocului:", error);
        return null;
    }
}

/**
 * Încarcă un component HTML din directorul components/.
 * @param {string} componentName - Numele componentei (fără extensie, ex: 'dashboard').
 * @returns {Promise<string>} Un Promise care se rezolvă cu conținutul HTML al componentei.
 */
export async function loadComponent(componentName) {
    try {
        const response = await fetch(`components/${componentName}.html`);
        if (!response.ok) {
            throw new Error(`Nu s-a putut încărca componenta: ${componentName}. Status: ${response.status}`);
        }
        return await response.text();
    } catch (error) {
        console.error(`Eroare la încărcarea componentei ${componentName}:`, error);
        return `<p>Eroare la încărcarea conținutului.</p>`;
    }
}
