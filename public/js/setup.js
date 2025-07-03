// public/js/setup.js - Logica pentru ecranul de setup al jocului

import { getGameState, updateGameState, saveGameState } from './game-state.js';
import { generateInitialPlayers } from './player-generator.js';

let onSetupCompleteCallback = null; // Callback pentru a anunța main.js că setup-ul e gata

/**
 * Inițializează ecranul de setup.
 * @param {function} callback - Funcția de apelat după finalizarea setup-ului.
 */
export function initSetupScreen(callback) {
    console.log("setup.js: initSetupScreen() - Inițializarea ecranului de setup.");
    onSetupCompleteCallback = callback;

    const setupForm = document.getElementById('setupForm');
    const coachNicknameInput = document.getElementById('coachNickname');
    const clubNameInput = document.getElementById('clubName');
    const emblemsContainer = document.getElementById('emblemsContainer');
    const startButton = document.getElementById('startButton');
    const currentSeasonSpan = document.getElementById('setup-current-season');
    const currentDaySpan = document.getElementById('setup-current-day');

    if (!setupForm || !coachNicknameInput || !clubNameInput || !emblemsContainer || !startButton || !currentSeasonSpan || !currentDaySpan) {
        console.error("setup.js: Unul sau mai multe elemente DOM necesare pentru setup nu au fost găsite.");
        // Poți afișa un mesaj de eroare pe ecran dacă elementele lipsesc
        return;
    }

    const gameState = getGameState();
    currentSeasonSpan.textContent = gameState.currentSeason;
    currentDaySpan.textContent = gameState.currentDay;

    let selectedEmblem = gameState.club.emblemUrl || ''; // Păstrează emblema selectată dacă există

    // Generează emblemele
    emblemsContainer.innerHTML = '';
    for (let i = 1; i <= 10; i++) {
        const img = document.createElement('img');
        img.src = `img/emblema${String(i).padStart(2, '0')}.png`;
        img.alt = `Emblema ${i}`;
        img.dataset.emblemUrl = img.src;
        img.classList.add('emblem-option');
        if (img.src === selectedEmblem) {
            img.classList.add('selected');
        }
        img.addEventListener('click', () => {
            // Elimină clasa 'selected' de la toate emblemele
            emblemsContainer.querySelectorAll('.emblem-option').forEach(el => el.classList.remove('selected'));
            // Adaugă clasa 'selected' la emblema curentă
            img.classList.add('selected');
            selectedEmblem = img.dataset.emblemUrl;
            checkFormValidity();
        });
        emblemsContainer.appendChild(img);
    }

    // Funcție pentru a verifica validitatea formularului și a activa butonul de start
    const checkFormValidity = () => {
        const isCoachNicknameValid = coachNicknameInput.value.trim().length > 0;
        const isClubNameValid = clubNameInput.value.trim().length > 0;
        const isEmblemSelected = selectedEmblem !== '';

        if (isCoachNicknameValid && isClubNameValid && isEmblemSelected) {
            startButton.disabled = false;
        } else {
            startButton.disabled = true;
        }
    };

    // Adaugă listeneri pentru evenimente de input
    coachNicknameInput.addEventListener('input', checkFormValidity);
    clubNameInput.addEventListener('input', checkFormValidity);

    // Verifică validitatea la inițializare (în cazul în care există date pre-existente)
    checkFormValidity();

    // Listener pentru trimiterea formularului
    setupForm.addEventListener('submit', (event) => {
        event.preventDefault(); // Oprește reîncărcarea paginii

        const coachNickname = coachNicknameInput.value.trim();
        const clubName = clubNameInput.value.trim();

        if (coachNickname && clubName && selectedEmblem) {
            const initialPlayers = generateInitialPlayers(25); // Generează 25 de jucători inițiali

            updateGameState({
                isGameStarted: true,
                coach: {
                    nickname: coachNickname,
                    reputation: 50, // Reputație inițială
                    experience: 0
                },
                club: {
                    name: clubName,
                    emblemUrl: selectedEmblem,
                    funds: 10000000, // Buget inițial: 10,000,000 €
                    reputation: 50,
                    facilitiesLevel: 1
                },
                players: initialPlayers, // Adaugă jucătorii generați
                currentSeason: 1,
                currentDay: 1,
                currentFormation: '4-4-2', // Formație implicită
                currentMentality: 'balanced', // Mentalitate implicită
                teamFormation: {} // Formația de pe teren este inițial goală
            });
            saveGameState();
            console.log("setup.js: Jocul a fost pornit cu succes! Starea salvată.");
            
            if (onSetupCompleteCallback) {
                onSetupCompleteCallback(); // Apelează callback-ul pentru a trece la ecranul de joc
            }
        } else {
            // Aceasta ar trebui să fie acoperită de butonul disabled, dar este o verificare de siguranță
            console.warn("setup.js: Formular incomplet. Vă rugăm să completați toate câmpurile și să alegeți o emblemă.");
        }
    });

    console.log("setup.js: Ecranul de setup inițializat complet.");
}
