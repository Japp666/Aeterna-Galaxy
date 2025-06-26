// public/js/team.js - Logica pentru tab-ul "Echipă" (Tactici și Formație)

import { initTacticsManager, autoArrangePlayers } from './tactics-manager.js'; 
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
        return `<p class="error-message">Eroare la încărcarea Tab-ului Echipă: ${error.message}</p>`;
    }
}

/**
 * Inițializează logica specifică tab-ului "Echipă".
 * Include o logică de polling pentru a asigura că elementele DOM sunt disponibile.
 * @param {HTMLElement} teamContentElement - Elementul rădăcină al tab-ului "Echipă" (#team-content).
 */
export function initTeamTab(teamContentElement) { 
    console.log("team.js: initTeamTab() - Începerea inițializării logicii tab-ului Echipă.");

    if (!teamContentElement) {
        console.error("team.js: Elementul rădăcină al tab-ului Echipă (teamContentElement) nu a fost furnizat.");
        const gameContent = document.getElementById('game-content');
        if (gameContent) {
            gameContent.innerHTML = `<p class="error-message">Eroare la inițializarea tab-ului Echipă: Elementul principal nu a fost găsit. Vă rugăm să reîncărcați pagina.</p>`;
        }
        return;
    }

    const maxPollAttempts = 50; // Încercări maxime (ex: 5 secunde la 100ms interval, sau 2.5s la 50ms)
    const pollInterval = 50; // Interval de verificare în milisecunde

    let currentAttempt = 0;

    const checkElementsAndInitialize = () => {
        const formationButtonsContainer = teamContentElement.querySelector('#formation-buttons');
        const mentalityButtonsContainer = teamContentElement.querySelector('#mentality-buttons');
        const footballPitchElement = teamContentElement.querySelector('#football-pitch');
        const availablePlayersListElement = teamContentElement.querySelector('#available-players-list');
        const autoArrangeButton = teamContentElement.querySelector('#auto-arrange-players-btn');

        if (formationButtonsContainer && mentalityButtonsContainer && footballPitchElement && availablePlayersListElement && autoArrangeButton) {
            console.log("team.js: Toate elementele DOM necesare au fost găsite după " + currentAttempt + " încercări.");
            
            // Inițializează managerul de tactici
            initTacticsManager(formationButtonsContainer, mentalityButtonsContainer, footballPitchElement, availablePlayersListElement);

            // Adaugă event listener pentru butonul de aranjare automată
            autoArrangeButton.addEventListener('click', () => {
                const gameState = getGameState();
                autoArrangePlayers(footballPitchElement, availablePlayersListElement, gameState.currentFormation, gameState.currentMentality);
            });

            // Asigură-te că terenul și jucătorii sunt randati la inițializarea tab-ului
            const gameState = getGameState();
            renderPitch(footballPitchElement, gameState.currentFormation, gameState.currentMentality); 
            placePlayersInPitchSlots(footballPitchElement, getGameState().teamFormation);
            renderAvailablePlayers(availablePlayersListElement);

            console.log("team.js: Logica tab-ului Echipă inițializată.");

        } else if (currentAttempt < maxPollAttempts) {
            currentAttempt++;
            console.warn(`team.js: Elementele DOM pentru tab-ul Echipă nu sunt încă disponibile. Încercare ${currentAttempt}/${maxPollAttempts}. Elemente lipsă:`);
            if (!formationButtonsContainer) console.warn(" - #formation-buttons");
            if (!mentalityButtonsContainer) console.warn(" - #mentality-buttons");
            if (!footballPitchElement) console.warn(" - #football-pitch");
            if (!availablePlayersListElement) console.warn(" - #available-players-list");
            if (!autoArrangeButton) console.warn(" - #auto-arrange-players-btn");

            setTimeout(checkElementsAndInitialize, pollInterval);
        } else {
            console.error("team.js: Eroare critică: Elementele DOM necesare pentru tab-ul Echipă nu au putut fi găsite după multiple încercări. Verificati team.html.");
            teamContentElement.innerHTML = `<p class="error-message">Eroare la inițializarea tab-ului Echipă: Unul sau mai multe elemente UI lipsesc. Vă rugăm să reîncărcați pagina sau verificați HTML-ul.</p>`;
        }
    };

    // Pornește polling-ul
    checkElementsAndInitialize();
}
