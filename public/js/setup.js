// js/setup.js - Logica pentru ecranul de setup

import { updateGameState, getGameState } from './game-state.js';

const EMBL_URLS = [
    'https://i.postimg.cc/mkB8cRGQ/01.png',
    'https://i.postimg.cc/hjFCBTyZ/02.png',
    'https://i.postimg.cc/QMK6w0bW/03.png',
    'https://i.postimg.cc/TwrtY1Bd/04.png',
    'https://i.postimg.cc/vThXfjQC/05.png',
    'https://i.postimg.cc/bY9m7GQL/06.png',
    'https://i.postimg.cc/jdqMtscT/07.png',
    'https://i.postimg.cc/ncd0L6SD/08.png',
    'https://i.postimg.cc/zGVpH04P/09.png',
    'https://i.postimg.cc/4xqP6pg4/10.png'
];

let selectedEmblemUrl = null; // Variabilă pentru a ține minte URL-ul emblemei selectate

// Referințe la elementele DOM
const coachNicknameInput = document.getElementById('coach-nickname');
const clubNameInput = document.getElementById('club-name');
const emblemsGrid = document.getElementById('emblems-grid');
const startGameBtn = document.getElementById('start-game-btn');
const setupScreen = document.getElementById('setup-screen');
const gameContainer = document.getElementById('game-container'); // Containerul principal al jocului

/**
 * Generează și afișează cardurile cu embleme.
 */
function renderEmblems() {
    emblemsGrid.innerHTML = ''; // Curăță grid-ul înainte de a adăuga noi embleme
    EMBL_URLS.forEach(url => {
        const emblemCard = document.createElement('div');
        emblemCard.classList.add('emblem-card');

        const img = document.createElement('img');
        img.src = url;
        img.alt = 'Emblema clubului';

        emblemCard.appendChild(img);
        emblemsGrid.appendChild(emblemCard);

        emblemCard.addEventListener('click', () => {
            // Elimină clasa 'selected' de la toate cardurile
            document.querySelectorAll('.emblem-card').forEach(card => {
                card.classList.remove('selected');
            });
            // Adaugă clasa 'selected' doar cardului curent
            emblemCard.classList.add('selected');
            selectedEmblemUrl = url; // Setează URL-ul emblemei selectate
            checkFormValidity();
        });
    });
}

/**
 * Verifică dacă toate câmpurile sunt completate și o emblemă este selectată.
 * Activează/dezactivează butonul "START JOC".
 */
function checkFormValidity() {
    const isNicknameValid = coachNicknameInput.value.trim() !== '';
    const isClubNameValid = clubNameInput.value.trim() !== '';
    const isEmblemSelected = selectedEmblemUrl !== null;

    if (isNicknameValid && isClubNameValid && isEmblemSelected) {
        startGameBtn.disabled = false;
    } else {
        startGameBtn.disabled = true;
    }
}

/**
 * Inițializează ecranul de setup.
 */
export function initSetupScreen(onGameStartCallback) {
    renderEmblems(); // Afișează emblemele

    // Adaugă evenimente pentru validarea input-urilor
    coachNicknameInput.addEventListener('input', checkFormValidity);
    clubNameInput.addEventListener('input', checkFormValidity);

    // Gestionează click-ul pe butonul "START JOC"
    startGameBtn.addEventListener('click', () => {
        if (!startGameBtn.disabled) {
            // Salvează datele în starea jocului
            updateGameState({
                isGameStarted: true,
                coach: { nickname: coachNicknameInput.value.trim() },
                club: {
                    ...getGameState().club, // Păstrează proprietățile existente ale clubului (fonduri, energie)
                    name: clubNameInput.value.trim(),
                    emblemUrl: selectedEmblemUrl
                }
            });

            // Ascunde ecranul de setup și arată containerul jocului
            setupScreen.style.display = 'none';
            gameContainer.style.display = 'block';

            // Apelez un callback pentru a inițializa jocul principal
            if (onGameStartCallback) {
                onGameStartCallback();
            }
        }
    });

    // Verifică validitatea inițială în caz că browser-ul reține valorile
    checkFormValidity();
}
