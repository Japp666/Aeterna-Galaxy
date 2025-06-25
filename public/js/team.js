// js/team.js - Logica specifică pentru tab-ul "Echipă" (care include terenul de fotbal)

import { getGameState } from './game-state.js';
import { renderPitch, renderAvailablePlayers } from './pitch-renderer.js';
import { initTacticsManager } from './tactics-manager.js';


/**
 * Încarcă conținutul HTML pentru tab-ul "Echipă".
 * @returns {Promise<string>} HTML-ul tab-ului.
 */
export async function loadTeamTabContent() {
    console.log("team.js: Se încarcă conținutul HTML pentru tab-ul Echipă...");
    try {
        const response = await fetch('components/team-tab.html');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const html = await response.text();
        console.log("team.js: Conținutul HTML pentru tab-ul Echipă a fost încărcat.");
        return html;
    } catch (error) {
        console.error("team.js: Eroare la încărcarea conținutului HTML pentru tab-ul Echipă:", error);
        return `<p class="error-message">Eroare la încărcarea tab-ului Echipă: ${error.message}</p>`;
    }
}

/**
 * Inițializează logica specifică pentru tab-ul "Echipă" după ce conținutul HTML este încărcat.
 */
export function initTeamTab() {
    console.log("team.js: Inițializare tab 'Echipă'...");

    // Inițializează managerul de tactici (populează dropdown-urile de formație/mentalitate și adaugă listeneri)
    initTacticsManager();

    // Randează terenul de fotbal și jucătorii disponibili
    renderPitch();
    renderAvailablePlayers();

    const gameState = getGameState();

    // Verifică dacă formația este goală și alocă jucători dacă este cazul (doar la prima vizită sau dacă se resetează)
    // Logica de alocare inițială a fost mutată în game-state.js / player-generator.js la crearea jucătorilor.
    // Aici doar ne asigurăm că `teamFormation` este populat la pornirea jocului dacă nu e deja.
    if (gameState.teamFormation.length === 0 && gameState.players.length > 0) {
        console.log("team.js: Alocare inițială a jucătorilor pe teren (dacă formația e goală)...");
        // Aceasta este logica simplificată pentru a umple formația inițial.
        // Va lua primii jucători disponibili pentru fiecare poziție necesară.
        const formationConfig = renderPitch.formations[gameState.currentFormation]; // Folosim formațiile exportate de pitch-renderer
        const newTeamFormation = [];
        const usedPlayerIds = new Set();

        for (const posType in formationConfig) {
            const requiredCount = formationConfig[posType];
            let allocatedCount = 0;
            for (const player of gameState.players) {
                if (allocatedCount >= requiredCount) break;
                if (!usedPlayerIds.has(player.id) && player.position === posType) {
                    // Caută primul slot liber de acel tip în formația curentă
                    const slotId = `${posType}${allocatedCount + 1}`;
                    newTeamFormation.push({ playerId: player.id, slotId: slotId, player: player });
                    usedPlayerIds.add(player.id);
                    allocatedCount++;
                }
            }
        }
        updateGameState({ teamFormation: newTeamFormation });
        console.log("team.js: Jucători alocați inițial:", newTeamFormation);
        renderPitch(); // Re-randăm terenul după alocarea inițială
        renderAvailablePlayers(); // Re-randăm lista de jucători disponibili
    }


    console.log("team.js: Tab-ul 'Echipă' inițializat.");
}
