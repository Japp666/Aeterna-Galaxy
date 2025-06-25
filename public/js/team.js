// js/team.js - Logica specifică pentru tab-ul "Echipă" (care include terenul de fotbal)

import { getGameState, updateGameState } from './game-state.js';
import { renderPitch, renderAvailablePlayers, formations } from './pitch-renderer.js'; // Import 'formations'
import { initTacticsManager } from './tactics-manager.js';


/**
 * Încarcă conținutul HTML pentru tab-ul "Echipă".
 * @returns {Promise<string>} HTML-ul tab-ului.
 */
export async function loadTeamTabContent() {
    console.log("team.js: Se încarcă conținutul HTML pentru tab-ul Echipă...");
    try {
        const response = await fetch('components/team.html'); // Asigură-te că numele fișierului este corect
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
    // Acum folosim o logică simplificată care populează sloturile de start.
    if (gameState.teamFormation.length === 0 && gameState.players.length > 0) {
        console.log("team.js: Formația este goală și există jucători. Se încearcă alocarea inițială.");
        const currentFormationName = gameState.currentFormation;
        const formationConfig = formations[currentFormationName]; // Folosim 'formations' importat

        const newTeamFormation = [];
        const availablePlayers = [...gameState.players]; // Copie pentru a manipula
        const usedPlayerIds = new Set();

        if (!formationConfig) {
            console.error(`team.js: Configurația pentru formația ${currentFormationName} nu a fost găsită.`);
            return;
        }

        // Alocă Portarul
        let gk = availablePlayers.find(p => p.position === 'GK' && !usedPlayerIds.has(p.id));
        if (gk) {
            newTeamFormation.push({ playerId: gk.id, slotId: 'GK1', player: gk });
            usedPlayerIds.add(gk.id);
        } else {
            console.warn("team.js: Nu s-a găsit portar disponibil pentru alocarea inițială.");
        }

        // Alocă Fundași
        let dfCount = 0;
        for (let i = 0; i < formationConfig.DF; i++) {
            let df = availablePlayers.find(p => p.position === 'DF' && !usedPlayerIds.has(p.id));
            if (df) {
                newTeamFormation.push({ playerId: df.id, slotId: `DF${i + 1}`, player: df });
                usedPlayerIds.add(df.id);
                dfCount++;
            } else {
                console.warn(`team.js: Nu s-a găsit fundaș disponibil pentru slotul DF${i + 1}.`);
                // Încercăm un jucător de câmp dacă nu găsim fundaș pur
                let fieldPlayer = availablePlayers.find(p => p.position !== 'GK' && !usedPlayerIds.has(p.id));
                 if (fieldPlayer) {
                    newTeamFormation.push({ playerId: fieldPlayer.id, slotId: `DF${i + 1}`, player: fieldPlayer });
                    usedPlayerIds.add(fieldPlayer.id);
                    dfCount++;
                }
            }
        }

        // Alocă Mijlocași
        let mfCount = 0;
        for (let i = 0; i < formationConfig.MF; i++) {
            let mf = availablePlayers.find(p => p.position === 'MF' && !usedPlayerIds.has(p.id));
            if (mf) {
                newTeamFormation.push({ playerId: mf.id, slotId: `MF${i + 1}`, player: mf });
                usedPlayerIds.add(mf.id);
                mfCount++;
            } else {
                 console.warn(`team.js: Nu s-a găsit mijlocaș disponibil pentru slotul MF${i + 1}.`);
                let fieldPlayer = availablePlayers.find(p => p.position !== 'GK' && !usedPlayerIds.has(p.id));
                 if (fieldPlayer) {
                    newTeamFormation.push({ playerId: fieldPlayer.id, slotId: `MF${i + 1}`, player: fieldPlayer });
                    usedPlayerIds.add(fieldPlayer.id);
                    mfCount++;
                }
            }
        }

        // Alocă Atacanți
        let atCount = 0;
        for (let i = 0; i < formationConfig.AT; i++) {
            let at = availablePlayers.find(p => p.position === 'AT' && !usedPlayerIds.has(p.id));
            if (at) {
                newTeamFormation.push({ playerId: at.id, slotId: `AT${i + 1}`, player: at });
                usedPlayerIds.add(at.id);
                atCount++;
            } else {
                console.warn(`team.js: Nu s-a găsit atacant disponibil pentru slotul AT${i + 1}.`);
                let fieldPlayer = availablePlayers.find(p => p.position !== 'GK' && !usedPlayerIds.has(p.id));
                 if (fieldPlayer) {
                    newTeamFormation.push({ playerId: fieldPlayer.id, slotId: `AT${i + 1}`, player: fieldPlayer });
                    usedPlayerIds.add(fieldPlayer.id);
                    atCount++;
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
