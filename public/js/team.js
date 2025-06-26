// public/js/team.js - Logica pentru tab-ul "Echipă" (Tactici și Formație)

import { initTacticsManager } from './tactics-manager.js';
import { renderPitch, placePlayersInPitchSlots, renderAvailablePlayers } from './pitch-renderer.js';
import { getGameState } from './game-state.js';

/**
 * Încarcă conținutul HTML pentru tab-ul "Echipă".
 * @returns {Promise<string>} Conținutul HTML al componentei.
 */
export async function loadTeamTabContent() {
    console.log("team.js: loadTeamTabContent() - Se încarcă conținutul HTML pentru tab-ul Echipă.");
    try {
        const response = await fetch('components/team.html');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const html = await response.text();
        console.log("team.js: Conținutul HTML pentru tab-ul Echipă a fost încărcat.");
        return html;
    } catch (error) {
        console.error("team.js: Eroare la încărcarea conținutului team.html:", error);
        return `<p class="error-message">Eroare la încărcarea Tab-ului Echipă: ${error.message}</p`;
    }
}

/**
 * Inițializează logica specifică tab-ului "Echipă".
 * @param {HTMLElement} teamContentElement - Elementul rădăcină al tab-ului "Echipă" (#team-content).
 */
export function initTeamTab(teamContentElement) { // <--- MODIFICARE AICI: ACCEPTĂ direct elementul rădăcină al tab-ului
    console.log("team.js: initTeamTab() - Inițializarea logicii tab-ului Echipă.");

    if (!teamContentElement) {
        console.error("team.js: Elementul rădăcină al tab-ului Echipă (teamContentElement) nu a fost furnizat.");
        // Afișează un mesaj de eroare vizibil utilizatorului în locul tab-ului
        const gameContent = document.getElementById('game-content');
        if (gameContent) {
            gameContent.innerHTML = `<p class="error-message">Eroare la inițializarea tab-ului Echipă: Elementul principal nu a fost găsit. Vă rugăm să reîncărcați pagina.</p>`;
        }
        return;
    }

    // Obține referințele la elementele DOM din team.html, căutând în interiorul teamContentElement
    const formationButtonsContainer = teamContentElement.querySelector('#formation-buttons');
    const mentalityButtonsContainer = teamContentElement.querySelector('#mentality-buttons');
    const footballPitchElement = teamContentElement.querySelector('#football-pitch');
    const availablePlayersListElement = teamContentElement.querySelector('#available-players-list');

    if (!formationButtonsContainer || !mentalityButtonsContainer || !footballPitchElement || !availablePlayersListElement) {
        console.error("team.js: Nu s-au găsit toate elementele DOM necesare în teamContentElement pentru inițializarea tab-ului Echipă.");
        // Afișează un mesaj de eroare vizibil utilizatorului în interiorul tab-ului
        teamContentElement.innerHTML = `<p class="error-message">Eroare la inițializarea tab-ului Echipă: Unul sau mai multe elemente UI lipsesc. Verificați HTML-ul.</p>`;
        return;
    }

    // Inițializează managerul de tactici, transmițându-i elementele necesare
    initTacticsManager(formationButtonsContainer, mentalityButtonsContainer, footballPitchElement, availablePlayersListElement);

    // Asigură-te că terenul și jucătorii sunt randati la inițializarea tab-ului
    const gameState = getGameState();
    renderPitch(footballPitchElement, gameState.currentFormation);
    placePlayersInPitchSlots(footballPitchElement, gameState.teamFormation);
    renderAvailablePlayers(availablePlayersListElement);

    console.log("team.js: Logica tab-ului Echipă inițializată.");
}
