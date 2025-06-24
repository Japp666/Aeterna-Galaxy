// js/setup.js - Logica pentru ecranul de setup (nume antrenor, club, embleme)

import { getGameState, updateGameState } from './game-state.js';

const coachNicknameInput = document.getElementById('coach-nickname');
const clubNameInput = document.getElementById('club-name');
const startGameBtn = document.getElementById('start-game-btn');
const emblemsGrid = document.getElementById('emblems-grid');

// Lista de URL-uri pentru embleme (exemplu)
const emblemUrls = [
    'assets/emblems/emblem1.png',
    'assets/emblems/emblem2.png',
    'assets/emblems/emblem3.png',
    'assets/emblems/emblem4.png',
    'assets/emblems/emblem5.png',
    'assets/emblems/emblem6.png',
    'assets/emblems/emblem7.png',
    'assets/emblems/emblem8.png',
];

let selectedEmblemUrl = ''; // Variabilă pentru a stoca emblema selectată

/**
 * Generează grid-ul de embleme și adaugă evenimente de click.
 */
function renderEmblems() {
    emblemsGrid.innerHTML = ''; // Curăță grid-ul la re-randare (pentru reset)
    emblemUrls.forEach(url => {
        const emblemCard = document.createElement('div');
        emblemCard.classList.add('emblem-card');

        const img = document.createElement('img');
        img.src = url;
        img.alt = 'Club Emblem';

        emblemCard.appendChild(img);

        emblemCard.addEventListener('click', () => {
            // Elimină clasa 'selected' de la toate emblemele
            document.querySelectorAll('.emblem-card').forEach(card => {
                card.classList.remove('selected');
            });
            // Adaugă clasa 'selected' la emblema curentă
            emblemCard.classList.add('selected');
            selectedEmblemUrl = url;
            checkFormValidity();
        });
        emblemsGrid.appendChild(emblemCard);
    });
}

/**
 * Verifică dacă toate câmpurile sunt completate și o emblemă este selectată.
 * Activează/dezactivează butonul de start.
 */
function checkFormValidity() {
    const isFormValid = coachNicknameInput.value.trim() !== '' &&
                        clubNameInput.value.trim() !== '' &&
                        selectedEmblemUrl !== '';
    startGameBtn.disabled = !isFormValid;
}

/**
 * Inițializează ecranul de setup: randare embleme, adăugare event listeners.
 * @param {Function} onSetupCompleteCallback - Funcția de apelat după ce setup-ul este completat și jocul pornește.
 */
export function initSetupScreen(onSetupCompleteCallback) {
    renderEmblems(); // Randăm emblemele la inițializare

    // Adăugăm event listeners pentru input-uri pentru a verifica validitatea
    coachNicknameInput.addEventListener('input', checkFormValidity);
    clubNameInput.addEventListener('input', checkFormValidity);

    startGameBtn.addEventListener('click', () => {
        if (startGameBtn.disabled) return;

        // Salvează starea jocului
        updateGameState({
            isGameStarted: true,
            coach: { nickname: coachNicknameInput.value.trim() },
            club: {
                name: clubNameInput.value.trim(),
                emblemUrl: selectedEmblemUrl,
                funds: getGameState().club.funds, // Păstrăm fondurile inițiale
                energy: getGameState().club.energy // Păstrăm energia inițială
            }
        });

        // Curățăm câmpurile și selectarea pentru o eventuală resetare
        coachNicknameInput.value = '';
        clubNameInput.value = '';
        selectedEmblemUrl = '';
        document.querySelectorAll('.emblem-card').forEach(card => {
            card.classList.remove('selected');
        });
        startGameBtn.disabled = true; // Dezactivăm butonul

        // Apelăm callback-ul pentru a porni jocul principal
        if (onSetupCompleteCallback) {
            onSetupCompleteCallback();
        }
    });

    // Inițial verificăm validitatea pentru cazul în care userul revine la setup
    checkFormValidity();
}
