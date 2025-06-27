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

    // Începem verificarea elementelor după un timeout mai lung.
    // Aceasta oferă browserului timp suficient să "proceseze" complet innerHTML și să construiască DOM-ul.
    setTimeout(() => {
        console.log("team.js: Verificare elemente DOM după setTimeout.");
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
        console.log("team.js: Starea elementelor: ");
        console.log(" - #formation-buttons:", formationButtonsContainer);
        console.log(" - #mentality-buttons:", mentalityButtonsContainer);
        console.log(" - #football-pitch:", footballPitchElement);
        console.log(" - #available-players-list:", availablePlayersListElement);
        console.log(" - #auto-arrange-players-btn:", autoArrangeButton);


        if (missingElements.length > 0) {
            const errorMessage = `Eroare critică: Nu s-au găsit elementele DOM necesare în tab-ul Echipă: ${missingElements.join(', ')}.`;
            console.error("team.js: " + errorMessage);
            teamContentElement.innerHTML = `<p class="error-message">${errorMessage} Vă rugăm să reîncărcați pagina sau verificați fișierul public/components/team.html.</p>`;
            return; // Oprim execuția dacă lipsesc elemente esențiale
        }

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
    }, 200); // Un delay de 200ms înainte de a începe căutarea
}
