/* public/js/setup.js */

import { updateHeaderClubEmblem, updateHeaderClubName } from './game-ui.js';
import { generateNewTeam } from './team.js';
import { saveGameState } from './game-state.js';

let selectedEmblemId = 1; // Default emblem

// Funcție pentru randarea selecției de embleme
export function renderEmblemSelection(containerId = 'emblemsContainer') {
    const container = document.getElementById(containerId);
    if (!container) {
        console.error(`setup.js: Containerul cu ID-ul '${containerId}' nu a fost găsit.`);
        return;
    }
    container.innerHTML = ''; // Curăță containerul existent

    for (let i = 1; i <= 10; i++) {
        const img = document.createElement('img');
        img.src = `../img/emblema${String(i).padStart(2, '0')}.png`; // CALEA CORECTATĂ
        img.alt = `Emblema ${i}`;
        img.classList.add('emblem-option');
        if (i === selectedEmblemId) {
            img.classList.add('selected');
        }
        img.dataset.emblemId = i;
        img.addEventListener('click', () => {
            selectEmblem(i);
        });
        container.appendChild(img);
    }
}

// Funcție pentru selectarea unei embleme
function selectEmblem(emblemId) {
    selectedEmblemId = emblemId;
    const emblems = document.querySelectorAll('.emblem-option');
    emblems.forEach(img => {
        img.classList.remove('selected');
        if (parseInt(img.dataset.emblemId) === emblemId) {
            img.classList.add('selected');
        }
    });
    console.log(`setup.js: Emblema selectată: ${emblemId}`);
    // Actualizează emblema în header imediat ce este selectată
    updateHeaderClubEmblem(emblemId);
}

// Funcție pentru configurarea echipei la finalul ecranului de setup
export function setupClub() {
    const clubNameInput = document.getElementById('clubNameInput');
    const clubName = clubNameInput.value.trim();

    if (!clubName) {
        alert('Te rog introdu un nume pentru club!');
        return false;
    }

    const newTeam = generateNewTeam(clubName, selectedEmblemId);
    saveGameState(newTeam); // Salvează starea inițială a jocului
    console.log('setup.js: Club configurat:', newTeam);

    // Actualizează numele și emblema în header
    updateHeaderClubName(clubName);
    updateHeaderClubEmblem(selectedEmblemId);

    return true; // Indicăm succesul configurării
}

// La încărcarea DOM-ului, randăm emblemele
document.addEventListener('DOMContentLoaded', () => {
    // Verifică dacă suntem pe pagina de setup înainte de a randa emblemele
    if (document.getElementById('setupClubForm')) { // Presupunând că setup.html are un element cu acest ID
        renderEmblemSelection();
    }
});
