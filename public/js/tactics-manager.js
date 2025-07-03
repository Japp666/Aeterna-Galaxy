// js/tactics-manager.js
import { gameState } from './game-state.js';
import { getAvailableFormations, FORMATIONS } from './tactics-data.js';
import { renderPitch } from './pitch-renderer.js';

/**
 * Inițializează managerul de tactici pentru pagina "Echipa".
 * @param {HTMLElement} teamPageRoot - Elementul rădăcină al paginii de echipă.
 */
export function initTacticsManager(teamPageRoot) {
    console.log("tactics-manager.js: Se inițializează managerul de tactici.");

    const formationSelect = teamPageRoot.querySelector('#formation-select');
    const mentalitySelect = teamPageRoot.querySelector('#mentality-select');
    const pitchArea = teamPageRoot.querySelector('#pitch-area');
    const saveTacticsBtn = teamPageRoot.querySelector('#save-tactics-btn');

    if (!formationSelect || !mentalitySelect || !pitchArea || !saveTacticsBtn) {
        console.error("tactics-manager.js: Elemente DOM necesare pentru tactici lipsesc.");
        return;
    }

    const userTeam = gameState.getUserTeam();
    if (!userTeam) {
        console.error("tactics-manager.js: Echipa utilizatorului nu a fost găsită.");
        return;
    }

    // Populatează dropdown-ul de formații
    getAvailableFormations().forEach(formationKey => {
        const option = document.createElement('option');
        option.value = formationKey;
        option.textContent = formationKey;
        formationSelect.appendChild(option);
    });

    // Setează valorile curente dacă există în gameState
    if (userTeam.tactics) {
        formationSelect.value = userTeam.tactics.formation || '4-4-2';
        mentalitySelect.value = userTeam.tactics.mentality || 'balanced';
    } else {
        // Setează tactici inițiale dacă nu există
        userTeam.tactics = {
            formation: '4-4-2',
            mentality: 'balanced',
            startingXI: {}
        };
        formationSelect.value = '4-4-2';
        mentalitySelect.value = 'balanced';
    }

    // Randează pitch-ul inițial
    renderPitch(pitchArea, userTeam.tactics.formation, userTeam.players);

    // Adaugă event listener pentru schimbarea formației
    formationSelect.addEventListener('change', () => {
        const newFormation = formationSelect.value;
        userTeam.tactics.formation = newFormation;
        // La schimbarea formației, ar putea fi necesară o reasignare parțială sau completă a jucătorilor
        // Pentru simplitate, vom re-randa doar pozițiile.
        // O logică mai complexă ar încerca să păstreze jucătorii pe poziții similare.
        userTeam.tactics.startingXI = {}; // Curățăm formația pentru a permite reasignarea
        renderPitch(pitchArea, newFormation, userTeam.players);
        console.log("tactics-manager.js: Formație schimbată la:", newFormation);
    });

    // Adaugă event listener pentru schimbarea mentalității
    mentalitySelect.addEventListener('change', () => {
        userTeam.tactics.mentality = mentalitySelect.value;
        console.log("tactics-manager.js: Mentalitate schimbată la:", mentalitySelect.value);
    });

    // Adaugă event listener pentru salvarea tacticilor
    saveTacticsBtn.addEventListener('click', () => {
        // Tacticile sunt deja salvate în gameState la fiecare schimbare de dropdown
        // Dar acest buton ar putea fi folosit pentru a confirma sau pentru a declanșa alte acțiuni
        console.log("Tactici salvate (în principiu deja actualizate în gameState):", userTeam.tactics);
        alert("Tacticile au fost salvate!");
    });
}
