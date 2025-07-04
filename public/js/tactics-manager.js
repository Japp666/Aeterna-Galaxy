// js/tactics-manager.js
import { getGameData } from './game-state.js'; // Schimbat 'getGameState' în 'getGameData'

export function initTacticsManager(rootElement) {
    console.log("tactics-manager.js: initTacticsManager() - Se inițializează managerul de tactici.");
    if (!rootElement) {
        console.error("tactics-manager.js: Elementul rădăcină pentru tactici nu a fost furnizat.");
        return;
    }

    const gameData = getGameData();
    const selectedTeamId = gameData.selectedTeamId;
    const team = gameData.divisions.flatMap(d => d.teams).find(t => t.id === selectedTeamId);

    if (!team) {
        rootElement.innerHTML = `<p class="error-message">Eroare: Echipa selectată nu a fost găsită pentru gestionarea tacticilor.</p>`;
        console.error("tactics-manager.js: Echipa selectată nu a fost găsită în datele jocului pentru tactici.");
        return;
    }

    rootElement.innerHTML = `
        <h2>Tactici pentru ${team.name}</h2>
        <div class="tactics-settings">
            <h3>Formație</h3>
            <select id="formationSelect">
                <option value="4-3-3">4-3-3</option>
                <option value="4-4-2">4-4-2</option>
                <option value="3-5-2">3-5-2</option>
                <option value="4-2-3-1">4-2-3-1</option>
                </select>

            <h3>Mentalitate</h3>
            <select id="mentalitySelect">
                <option value="attacking">Ofensivă</option>
                <option value="balanced">Echilibrată</option>
                <option value="defensive">Defensivă</option>
            </select>

            <h3>Instrucțiuni Echipă</h3>
            <textarea id="teamInstructions" rows="5" placeholder="Adaugă instrucțiuni specifice echipei..."></textarea>

            <button id="saveTacticsBtn">Salvează Tactici</button>
        </div>
        <div class="pitch-representation">
            <p>Reprezentarea vizuală a terenului (în lucru)</p>
        </div>
    `;

    console.log("tactics-manager.js: Managerul de tactici a fost randat cu succes.");

    // Adaugă event listener pentru salvarea tacticilor (placeholder)
    const saveTacticsBtn = rootElement.querySelector('#saveTacticsBtn');
    if (saveTacticsBtn) {
        saveTacticsBtn.addEventListener('click', () => {
            const formation = rootElement.querySelector('#formationSelect').value;
            const mentality = rootElement.querySelector('#mentalitySelect').value;
            const instructions = rootElement.querySelector('#teamInstructions').value;

            console.log("tactics-manager.js: Tactici salvate:", { formation, mentality, instructions });
            // Aici vei implementa logica de salvare a tacticilor în gameData
            // team.tactics = { formation, mentality, instructions };
            // updateGameData({ divisions: gameData.divisions });
            alert("Tactici salvate (funcționalitate completă în lucru)!");
        });
    }
}
