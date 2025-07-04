import { startGame } from './main.js';
import { getGameData, updateGameData, saveGameData } from './game-state.js';
import { ALL_TEAMS_NAMES, GAME_DIVISIONS } from './team-data.js';

let setupScreenElement;
let currentStep = 1;

export function initSetupScreen() {
    console.log("setup.js: initSetupScreen() - Inițializarea ecranului de setup.");
    setupScreenElement = document.getElementById('setup-screen');
    if (!setupScreenElement) {
        console.error("setup.js: Elementul #setup-screen nu a fost găsit.");
        return;
    }

    setupScreenElement.innerHTML = `
        <div class="setup-container">
            <h2 id="setup-title">Bun venit în FM Stellar League!</h2>
            <div id="setup-form-step-1" class="setup-step active">
                <h3>Pasul 1: Informații Manager</h3>
                <label for="coachName">Nume Manager:</label>
                <input type="text" id="coachName" placeholder="Introdu numele tău" required>
                <button id="next-step-1">Următorul</button>
            </div>
            <div id="setup-form-step-2" class="setup-step">
                <h3>Pasul 2: Alege-ți Echipa</h3>
                <label for="teamSelect">Selectează Echipa Ta:</label>
                <select id="teamSelect"></select>
                <img id="selectedTeamEmblem" src="" alt="Emblema Echipei Selectate" style="max-width: 100px; max-height: 100px;">
                <button id="next-step-2">Următorul</button>
            </div>
            <div id="setup-form-step-3" class="setup-step">
                <h3>Pasul 3: Confirmare și Start</h3>
                <p>Nume Manager: <span id="confirmCoachName"></span></p>
                <p>Echipa Aleasă: <span id="confirmTeamName"></span></p>
                <img id="confirmTeamEmblem" src="" alt="Emblema Echipei Confirmate" style="max-width: 100px; max-height: 100px;">
                <button id="startGameButton">Start Joc</button>
            </div>
        </div>
    `;

    const coachNameInput = document.getElementById('coachName');
    const teamSelect = document.getElementById('teamSelect');
    const nextStep1Button = document.getElementById('next-step-1');
    const nextStep2Button = document.getElementById('next-step-2');
    const startGameButton = document.getElementById('startGameButton');
    const selectedTeamEmblem = document.getElementById('selectedTeamEmblem');
    const confirmTeamEmblem = document.getElementById('confirmTeamEmblem');
    const confirmCoachName = document.getElementById('confirmCoachName');
    const confirmTeamName = document.getElementById('confirmTeamName');

    populateTeamSelect(teamSelect); // Populate the dropdown for team selection

    // Ascunde emblemele la inițializare pentru a evita erorile de tip "null"
    selectedTeamEmblem.style.display = 'none';
    confirmTeamEmblem.style.display = 'none';

    // Event Listeners for navigation and game start
    nextStep1Button.addEventListener('click', () => {
        if (coachNameInput.value.trim() !== '') {
            confirmCoachName.textContent = coachNameInput.value.trim();
            showStep(2);
        } else {
            alert('Te rog introdu numele managerului.');
        }
    });

    teamSelect.addEventListener('change', () => {
        const selectedTeamId = teamSelect.value;
        const selectedTeam = findTeamById(selectedTeamId);
        if (selectedTeam) {
            confirmTeamName.textContent = selectedTeam.name;
            selectedTeamEmblem.src = selectedTeam.emblemUrl;
            selectedTeamEmblem.style.display = 'block';
        } else {
            // Când opțiunea implicită "Alege o echipă" este selectată sau dacă echipa nu este găsită
            selectedTeamEmblem.src = ''; // Golește sursa
            selectedTeamEmblem.style.display = 'none'; // Ascunde imaginea
            confirmTeamName.textContent = ''; // Golește numele echipei de confirmare
        }
    });

    nextStep2Button.addEventListener('click', () => {
        if (teamSelect.value !== '') {
            const selectedTeamId = teamSelect.value;
            const selectedTeam = findTeamById(selectedTeamId);
            if (selectedTeam) {
                confirmTeamEmblem.src = selectedTeam.emblemUrl;
                confirmTeamEmblem.style.display = 'block'; // Asigură-te că este vizibilă la pasul 3
                showStep(3);
            }
        } else {
            alert('Te rog alege o echipă.');
        }
    });

    startGameButton.addEventListener('click', () => {
        const coachName = coachNameInput.value.trim();
        const selectedTeamId = teamSelect.value;

        if (coachName && selectedTeamId) {
            startGame(coachName, selectedTeamId);
        } else {
            alert('Te rog completează toate informațiile.');
        }
    });

    showStep(1); // Start with the first step
}

function populateTeamSelect(selectElement) {
    // Ensure GAME_DIVISIONS is populated and not empty
    if (!GAME_DIVISIONS || GAME_DIVISIONS.length === 0) {
        console.error("setup.js: GAME_DIVISIONS nu este populat. Nu se pot afișa echipele.");
        return;
    }

    selectElement.innerHTML = '<option value="">Alege o echipă</option>'; // Default option

    GAME_DIVISIONS.forEach(division => {
        const optgroup = document.createElement('optgroup');
        optgroup.label = division.name;
        division.teams.forEach(team => {
            const option = document.createElement('option');
            option.value = team.id;
            option.textContent = team.name;
            optgroup.appendChild(option);
        });
        selectElement.appendChild(optgroup);
    });
}

function showStep(step) {
    document.querySelectorAll('.setup-step').forEach(element => {
        element.classList.remove('active');
    });
    document.getElementById(`setup-form-step-${step}`).classList.add('active');
    currentStep = step;
}

function findTeamById(teamId) {
    for (const division of GAME_DIVISIONS) {
        const team = division.teams.find(t => t.id === teamId);
        if (team) {
            return team;
        }
    }
    return null;
}
