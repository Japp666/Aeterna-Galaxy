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
 * Utility function to wait for multiple DOM elements to be available.
 * This function polls the DOM at a given interval until all specified elements are found
 * or a maximum number of attempts is reached.
 * @param {HTMLElement} parentElement - The parent element to query within (e.g., the tab's root element).
 * @param {string[]} selectors - An array of CSS selectors (ideally IDs prefixed with #).
 * @param {number} maxAttempts - Maximum number of polling attempts.
 * @param {number} interval - Interval between attempts in milliseconds.
 * @returns {Promise<HTMLElement[]>} A promise that resolves with an array of found elements, or rejects if timeout.
 */
function waitForElements(parentElement, selectors, maxAttempts = 100, interval = 50) { 
    let attempts = 0;
    return new Promise((resolve, reject) => {
        const check = () => {
            attempts++;
            const foundElements = selectors.map(selector => {
                if (selector.startsWith('#')) {
                    // Try getElementById on document, as parentElement might still be in flux
                    return document.getElementById(selector.substring(1));
                } else {
                    // For other selectors, query within the parentElement
                    return parentElement.querySelector(selector);
                }
            });
            const allFound = foundElements.every(el => el !== null);

            if (allFound) {
                console.log(`team.js: Toate elementele DOM necesare au fost găsite după ${attempts} încercări.`);
                resolve(foundElements);
            } else if (attempts < maxAttempts) {
                const missingSelectors = selectors.filter((selector, index) => foundElements[index] === null);
                console.warn(`team.js: Elementele DOM pentru tab-ul Echipă nu sunt încă disponibile. Încercare ${attempts}/${maxAttempts}. Elemente lipsă: ${missingSelectors.join(', ')}`);
                // Use requestAnimationFrame for next check if available, fallback to setTimeout
                (window.requestAnimationFrame ? requestAnimationFrame : setTimeout)(check, interval); 
            } else {
                const missing = selectors.filter((selector, index) => foundElements[index] === null);
                reject(new Error(`Timeout: Nu s-au putut găsi elementele: ${missing.join(', ')} după ${maxAttempts} încercări.`));
            }
        };
        // Start the first check immediately
        check(); 
    });
}

/**
 * Inițializează logica specifică tab-ului "Echipă".
 * @param {HTMLElement} teamContentElement - Elementul rădăcină al tab-ului "Echipă" (#team-content).
 * @param {HTMLElement | null} externalAutoArrangeButton - Referința la butonul de aranjare automată, dacă este furnizată extern.
 */
export async function initTeamTab(teamContentElement, externalAutoArrangeButton = null) { // Make it async and accept external button
    console.log("team.js: initTeamTab() - Începerea inițializării logicii tab-ului Echipă.");

    if (!teamContentElement) {
        console.error("team.js: Elementul rădăcină al tab-ului Echipă (teamContentElement) nu a fost furnizat.");
        const gameContent = document.getElementById('game-content');
        if (gameContent) {
            gameContent.innerHTML = `<p class="error-message">Eroare la inițializarea tab-ului Echipă: Elementul principal nu a fost găsit. Vă rugăm să reîncărcați pagina.</p>`;
        }
        return;
    }

    try {
        const selectorsToWaitFor = [
            '#formation-buttons',
            '#mentality-buttons',
            '#football-pitch',
            '#available-players-list'
            // #auto-arrange-players-btn is now potentially passed directly
        ];

        let foundElements = await waitForElements(teamContentElement, selectorsToWaitFor);
        
        // Add autoArrangeButton to foundElements if it was passed externally
        let autoArrangeButton = externalAutoArrangeButton;
        if (!autoArrangeButton) {
            // If not passed, try to find it with polling as a fallback
            console.warn("team.js: Butonul auto-arrange nu a fost furnizat extern. Se încearcă găsirea lui intern.");
            autoArrangeButton = await waitForElements(teamContentElement, ['#auto-arrange-players-btn'])[0];
            if (!autoArrangeButton) {
                throw new Error("Butonul #auto-arrange-players-btn nu a putut fi găsit nici intern, nici extern.");
            }
        }

        const [formationButtonsContainer, mentalityButtonsContainer, footballPitchElement, availablePlayersListElement] = foundElements;

        console.log("team.js: Toate elementele DOM necesare au fost găsite.");
        
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

    } catch (error) {
        console.error("team.js: Eroare critică la inițializarea tab-ului Echipă: " + error.message);
        teamContentElement.innerHTML = `<p class="error-message">Eroare la inițializarea tab-ului Echipă: ${error.message}. Vă rugăm să reîncărcați pagina sau verificați HTML-ul.</p>`;
    }
}
