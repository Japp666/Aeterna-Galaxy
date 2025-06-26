// public/js/setup.js

import { getGameState, updateGameState } from './game-state.js';

let selectedEmblem = '';
let onSetupCompleteCallback = null;

const EMBLEM_PATHS = [
    "https://i.postimg.cc/mkB8cRGQ/01.png",
    "https://i.postimg.cc/hjFCBTyZ/02.png",
    "https://i.postimg.cc/QMK6w0bW/03.png",
    "https://i.postimg.cc/TwrtY1Bd/04.png",
    "https://i.postimg.cc/vThXfjQC/05.png",
    "https://i.postimg.cc/bY9m7GQL/06.png",
    "https://i.postimg.cc/jdqMtscT/07.png",
    "https://i.postimg.cc/ncd0L6SD/08.png",
    "https://i.postimg.cc/zGVpH04P/09.png",
    "https://i.postimg.cc/4xqP6pg4/10.png"
];

/**
 * Inițializează ecranul de setup al jocului.
 * @param {function} callback - Funcția de apelat după finalizarea setup-ului.
 */
export function initSetupScreen(callback) {
    console.log("setup.js: Inițializare ecran setup");
    onSetupCompleteCallback = callback;

    const setupForm = document.getElementById('setupForm');
    const coachNicknameInput = document.getElementById('coachNickname');
    const clubNameInput = document.getElementById('clubName');
    const emblemsContainer = document.getElementById('emblemsContainer');
    const startButton = document.getElementById('startButton');
    const currentSeasonDisplay = document.getElementById('setup-current-season');
    const currentDayDisplay = document.getElementById('setup-current-day');

    // Asigură-te că toate elementele există înainte de a interacționa cu ele
    if (!setupForm || !coachNicknameInput || !clubNameInput || !emblemsContainer || !startButton || !currentSeasonDisplay || !currentDayDisplay) {
        console.error("setup.js: Unul sau mai multe elemente DOM necesare pentru setup nu au fost găsite. Verifică setup.html.");
        // Poți afișa un mesaj de eroare în UI aici
        return; 
    }

    // Afișează sezonul și ziua curente (inițial, din gameState default)
    const gameState = getGameState();
    currentSeasonDisplay.textContent = gameState.currentSeason;
    currentDayDisplay.textContent = gameState.currentDay;

    // Populează emblemele
    emblemsContainer.innerHTML = ''; // Curăță orice conținut vechi
    EMBLEM_PATHS.forEach(path => {
        const img = document.createElement('img');
        img.src = path;
        img.alt = `Emblemă Club ${path.split('/').pop().replace('.png', '')}`;
        img.dataset.emblemPath = path;
        emblemsContainer.appendChild(img);

        img.addEventListener('click', () => {
            // Elimină clasa 'selected' de la toate emblemele
            emblemsContainer.querySelectorAll('img').forEach(e => e.classList.remove('selected'));
            // Adaugă clasa 'selected' la emblema curentă
            img.classList.add('selected');
            selectedEmblem = path;
            checkFormValidity();
        });
    });

    // Ascultă evenimentele de input pentru a activa/dezactiva butonul de start
    coachNicknameInput.addEventListener('input', checkFormValidity);
    clubNameInput.addEventListener('input', checkFormValidity);

    // Gestionează trimiterea formularului
    setupForm.addEventListener('submit', (event) => { // <--- LINIA 55 ESTE PROBABIL AICI
        event.preventDefault(); // Oprește reîncărcarea paginii

        const coachNickname = coachNicknameInput.value.trim();
        const clubName = clubNameInput.value.trim();

        if (coachNickname && clubName && selectedEmblem) {
            console.log("setup.js: Date setup valide. Se actualizează starea jocului.");
            updateGameState({
                isGameStarted: true,
                coach: { nickname: coachNickname },
                club: { name: clubName, emblemUrl: selectedEmblem },
                currentSeason: 1, // Reset la start joc nou
                currentDay: 1     // Reset la start joc nou
            });
            console.log("setup.js: Stare joc actualizată cu datele de setup.");
            if (onSetupCompleteCallback) {
                onSetupCompleteCallback(); // Apelăm callback-ul pentru a porni jocul
            }
        } else {
            console.warn("setup.js: Formular incomplet. Te rog completează toate câmpurile și alege o emblemă.");
            // Aici poți afișa un mesaj de eroare vizibil utilizatorului
        }
    });

    // Verifică validitatea formularului la inițializare (în cazul în care starea este salvată)
    checkFormValidity();
    console.log("setup.js: Setup screen listeners adăugați.");
}

/**
 * Verifică dacă formularul este valid și activează/dezactivează butonul de start.
 */
function checkFormValidity() {
    const coachNicknameInput = document.getElementById('coachNickname');
    const clubNameInput = document.getElementById('clubName');
    const startButton = document.getElementById('startButton');

    if (coachNicknameInput && clubNameInput && startButton) { // Defensive check
        const isFormValid = coachNicknameInput.value.trim() !== '' && 
                            clubNameInput.value.trim() !== '' && 
                            selectedEmblem !== '';
        startButton.disabled = !isFormValid;
    }
}
