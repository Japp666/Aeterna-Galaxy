// js/utils.js - Funcții utilitare generice

/**
 * Încarcă un component HTML din directorul 'components/'.
 * @param {string} componentName - Numele fișierului componentului (fără extensie .html).
 * @returns {Promise<string>} O promisiune care se rezolvă cu conținutul HTML al componentului.
 */
export async function loadComponent(componentName) {
    try {
        const response = await fetch(`components/${componentName}.html`);
        if (!response.ok) {
            throw new Error(`Eroare la încărcarea componentei ${componentName}: ${response.statusText}`);
        }
        return await response.text();
    } catch (error) {
        console.error("Eroare la încărcarea componentei:", error);
        return `<p style="color: red;">Eroare la încărcarea conținutului: ${componentName}</p>`;
    }
}

/**
 * Salvează starea jocului în localStorage.
 * @param {object} gameState - Obiectul cu starea curentă a jocului.
 */
export function saveGameState(gameState) {
    try {
        localStorage.setItem('fmStellarLeagueGameState', JSON.stringify(gameState));
        console.log("Starea jocului salvată.");
    } catch (e) {
        console.error("Eroare la salvarea stării jocului:", e);
    }
}

/**
 * Încarcă starea jocului din localStorage.
 * @returns {object|null} Obiectul cu starea jocului sau null dacă nu există.
 */
export function loadGameState() {
    try {
        const savedState = localStorage.getItem('fmStellarLeagueGameState');
        return savedState ? JSON.parse(savedState) : null;
    } catch (e) {
        console.error("Eroare la încărcarea stării jocului:", e);
        return null;
    }
}
