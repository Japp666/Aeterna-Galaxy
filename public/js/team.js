// public/js/team.js - Logica pentru tab-ul "Echipă" (Tactici și Formație)

import { initTacticsManager, autoArrangePlayers } from './tactics-manager.js'; 
import { renderPitch, placePlayersInPitchSlots, renderAvailablePlayers } from './pitch-renderer.js';
import { getGameState } from './game-state.js'; // Asigură-te că game-state.js este importat

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
 * Această funcție încearcă să găsească elementele necesare. Dacă nu le găsește,
 * se reapelează după un scurt delay, până la un număr maxim de încercări.
 * @param {HTMLElement} teamContentElement - Elementul rădăcină al tab-ului "Echipă" (#team-content).
 * @param {number} [retries=0] - Numărul curent al tentativelor de reîncercare.
 */
export function initTeamTab(teamContentElement, retries = 0) { 
    const maxRetries = 20; // Număr maxim de reîncercări (20 * 100ms = 2 secunde total)
    const retryDelay = 100; // Delay între reîncercări în ms

    console.log(`team.js: initTeamTab() - Tentativa ${retries + 1}. Începerea inițializării logicii tab-ului Echipă.`);

    if (!teamContentElement) {
        console.error("team.js: Elementul rădăcină al tab-ului Echipă (teamContentElement) nu a fost furnizat sau a dispărut.");
        const gameContent = document.getElementById('game-content');
        if (gameContent) {
            gameContent.innerHTML = `<p class="error-message">Eroare la inițializarea tab-ului Echipă: Elementul principal nu a fost găsit. Vă rugăm să reîncărcați pagina.</p>`;
        }
        return;
    }

    // Căutăm direct elementele esențiale în cadrul teamContentElement
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

    if (missingElements.length > 0) {
        // Dacă lipsesc elemente și nu am depășit numărul maxim de reîncercări, reîncercăm
        if (retries < maxRetries) {
            console.warn(`team.js: Încă lipsesc elemente. Elemente lipsă: ${missingElements.join(', ')}. Reîncercare în ${retryDelay}ms.`);
            setTimeout(() => initTeamTab(teamContentElement, retries + 1), retryDelay);
        } else {
            // S-a depășit numărul maxim de reîncercări, raportăm eroare finală
            const errorMessage = `Eroare critică: Nu s-au găsit elementele DOM necesare în tab-ul Echipă după ${maxRetries} încercări: ${missingElements.join(', ')}.`;
            console.error("team.js: " + errorMessage);
            teamContentElement.innerHTML = `<p class="error-message">${errorMessage} Vă rugăm să reîncărcați pagina și verificați fișierul public/components/team.html pentru integritate.</p>`;
        }
        return; // Oprim execuția curentă
    }

    // Dacă ajungem aici, TOATE elementele au fost găsite!
    console.log("team.js: Toate elementele DOM necesare au fost găsite. Inițializare Tactici.");
    
    // Inițializează managerul de tactici
    initTacticsManager(formationButtonsContainer, mentalityButtonsContainer, footballPitchElement, availablePlayersListElement);

    // Adaugă event listener pentru butonul de aranjare automată
    autoArrangeButton.addEventListener('click', () => {
        // Apelăm autoArrangePlayers, care acum primește direct elementele, nu și gameState
        autoArrangePlayers(footballPitchElement, availablePlayersListElement); 
    });

    // Asigură-te că terenul și jucătorii sunt randati la inițializarea tab-ului
    const gameState = getGameState();
    renderPitch(footballPitchElement, gameState.currentFormation, gameState.currentMentality); 
    placePlayersInPitchSlots(footballPitchElement, gameState.teamFormation);
    renderAvailablePlayers(availablePlayersListElement);

    console.log("team.js: Logica tab-ului Echipă inițializată.");
}
