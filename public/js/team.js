// js/team.js
import { gameState } from './game-state.js';
import { initTacticsManager } from './tactics-manager.js';

/**
 * Randează conținutul paginii "Echipa".
 * @param {HTMLElement} teamPageRoot - Elementul rădăcină al paginii de echipă (div#team-page).
 */
export function renderTeamPage(teamPageRoot) {
    console.log("team.js: Se randează pagina echipei.");

    if (!teamPageRoot) {
        console.error("team.js: Elementul rădăcină al paginii de echipă nu a fost furnizat.");
        return;
    }

    const userTeam = gameState.getUserTeam();
    const userDivision = gameState.getUserDivision();

    if (userTeam && userDivision) {
        teamPageRoot.querySelector('#my-team-name').textContent = userTeam.name;
        teamPageRoot.querySelector('#my-team-division').textContent = userDivision.name;
        teamPageRoot.querySelector('#my-team-coach').textContent = gameState.coachName;

        // Inițializează managerul de tactici pentru această pagină
        initTacticsManager(teamPageRoot);
    } else {
        console.error("team.js: Echipa sau divizia utilizatorului nu a putut fi încărcată.");
        teamPageRoot.innerHTML = '<p class="error-message">Nu s-au putut încărca detaliile echipei.</p>';
    }
}
