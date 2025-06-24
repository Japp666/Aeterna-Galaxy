// js/setup.js - Logica pentru ecranul de setup (nume antrenor, club, embleme)

import { getGameState, updateGameState } from './game-state.js';

const coachNicknameInput = document.getElementById('coach-nickname');
const clubNameInput = document.getElementById('club-name');
const startGameBtn = document.getElementById('start-game-btn');
const emblemsGrid = document.getElementById('emblems-grid');

const emblemUrls = [
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

let selectedEmblemUrl = '';

/**
 * Generează grid-ul de embleme și adaugă evenimente de click.
 */
function renderEmblems() {
    console.log("setup.js: renderEmblems() - Se randează emblemele.");
    emblemsGrid.innerHTML = '';
    emblemUrls.forEach(url => {
        const emblemCard = document.createElement('div');
        emblemCard.classList.add('emblem-card');

        const img = document.createElement('img');
        img.src = url;
        img.alt = 'Club Emblem';

        img.onerror = function() {
            console.warn(`setup.js: Eroare la încărcarea imaginii: ${this.src}.`);
            this.style.display = 'none';
            const placeholderText = document.createElement('span');
            placeholderText.textContent = 'IMG';
            emblemCard.appendChild(placeholderText);
        };

        emblemCard.appendChild(img);

        emblemCard.addEventListener('click', () => {
            console.log("setup.js: Click pe emblemă:", url);
            document.querySelectorAll('.emblem-card').forEach(card => {
                card.classList.remove('selected');
            });
            emblemCard.classList.add('selected');
            selectedEmblemUrl = url;
            checkFormValidity();
        });
        emblemsGrid.appendChild(emblemCard);
    });
    console.log("setup.js: renderEmblems() - Embleme randate.");
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
    console.log(`setup.js: checkFormValidity() - Formular valid: ${isFormValid}. Buton Start: ${startGameBtn.disabled ? 'dezactivat' : 'activat'}`);
}

/**
 * Inițializează ecranul de setup: randare embleme, adăugare event listeners.
 * @param {Function} onSetupCompleteCallback - Funcția de apelat după ce setup-ul este completat și jocul pornește.
 */
export function initSetupScreen(onSetupCompleteCallback) {
    console.log("setup.js: initSetupScreen() - Inițializarea ecranului de setup.");
    renderEmblems();

    coachNicknameInput.addEventListener('input', checkFormValidity);
    clubNameInput.addEventListener('input', checkFormValidity);
    console.log("setup.js: initSetupScreen() - Event listeners pentru input-uri adăugați.");

    startGameBtn.addEventListener('click', () => {
        console.log("setup.js: Click pe butonul START JOC.");
        if (startGameBtn.disabled) {
            console.warn("setup.js: Butonul Start este dezactivat, ignor click-ul.");
            return;
        }

        const currentGameState = getGameState(); // Ia starea curentă pentru a păstra fondurile/energia
        console.log("setup.js: Stare joc înainte de update (pentru fonduri/energie):", currentGameState);

        // Salvează starea jocului
        updateGameState({
            isGameStarted: true,
            coach: { nickname: coachNicknameInput.value.trim() },
            club: {
                name: clubNameInput.value.trim(),
                emblemUrl: selectedEmblemUrl,
                funds: currentGameState.club.funds,
                energy: currentGameState.club.energy
            }
        });
        console.log("setup.js: Stare joc actualizată după START JOC. isGameStarted ar trebui să fie TRUE acum.");
        console.log("setup.js: Stare joc salvată:", getGameState());


        // Curățăm câmpurile și selectarea pentru o eventuală resetare
        coachNicknameInput.value = '';
        clubNameInput.value = '';
        selectedEmblemUrl = '';
        document.querySelectorAll('.emblem-card').forEach(card => {
            card.classList.remove('selected');
        });
        startGameBtn.disabled = true; // Dezactivăm butonul
        console.log("setup.js: Câmpuri resetate și buton dezactivat.");

        // Apelăm callback-ul pentru a porni jocul principal
        if (onSetupCompleteCallback) {
            console.log("setup.js: Apelând onSetupCompleteCallback...");
            onSetupCompleteCallback();
        } else {
            console.error("setup.js: Eroare: onSetupCompleteCallback este NULL sau UNDEFINED!");
        }
        console.log("setup.js: Logica click-ului pe START JOC a fost finalizată.");
    });

    checkFormValidity(); // Inițial verificăm validitatea la încărcare
    console.log("setup.js: initSetupScreen() - Finalizare inițializare.");
}
