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
 * Utilizează setInterval pentru a aștepta prezența elementelor DOM necesare.
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

    let checkInterval;
    let attempts = 0;
    const maxAttempts = 100; // Total 5 secunde de așteptare (100 * 50ms)
    const intervalTime = 50; // Verifică la fiecare 50ms

    const checkAndInitialize = () => {
        attempts++;
        console.log(`team.js: Tentativa ${attempts}/${maxAttempts} de a găsi elemente DOM.`);

        const formationButtonsContainer = teamContentElement.querySelector('#formation-buttons');
        const mentalityButtonsContainer = teamContentElement.querySelector('#mentality-buttons');
        const footballPitchElement = teamContentElement.querySelector('#football-pitch');
        const availablePlayersListElement = teamContentElement.querySelector('#available-players-list');
        const autoArrangeButton = teamContentElement.querySelector('#auto-arrange-players-btn'); 

        const missingElements = [];
        if (!formationButtonsContainer) missingElements.push('#formation-buttons');
        if (!mentalityButtonsContainer) missingElements.push('#mentality-buttons');
        if (!footballPitchElement) missingElements.push('#football-pitch');
        if (!availablePlayersListElement) missingElements.push('#available-players-list');
        if (!autoArrangeButton) missingElements.push('#auto-arrange-players-btn');

        // Logăm starea fiecărui element
        console.log("team.js: Starea elementelor la verificare: ");
        console.log(" - #formation-buttons:", formationButtonsContainer);
        console.log(" - #mentality-buttons:", mentalityButtonsContainer);
        console.log(" - #football-pitch:", footballPitchElement);
        console.log(" - #available-players-list:", availablePlayersListElement);
        console.log(" - #auto-arrange-players-btn:", autoArrangeButton);


        if (missingElements.length === 0) {
            // Toate elementele au fost găsite!
            clearInterval(checkInterval); // Oprim intervalul
            console.log("team.js: Toate elementele DOM necesare au fost găsite. Inițializare Tactici.");
            
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
        } else if (attempts >= maxAttempts) {
            // S-a atins numărul maxim de încercări, dar elementele lipsesc în continuare
            clearInterval(checkInterval); // Oprim intervalul
            const errorMessage = `Eroare critică: Nu s-au găsit elementele DOM necesare în tab-ul Echipă după ${maxAttempts} încercări: ${missingElements.join(', ')}.`;
            console.error("team.js: " + errorMessage);
            teamContentElement.innerHTML = `<p class="error-message">${errorMessage} Vă rugăm să reîncărcați pagina sau verificați fișierul public/components/team.html.</p>`;
        }
        // Dacă elemente lipsesc și nu s-a atins maxAttempts, intervalul continuă
    };

    // Pornim intervalul
    checkInterval = setInterval(checkAndInitialize, intervalTime);
}
