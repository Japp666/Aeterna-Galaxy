// public/js/setup.js

import { getGameState, updateGameState } from './game-state.js';

let selectedEmblemUrl = ''; // Variabila pentru a stoca emblema selectată
let onSetupCompleteCallback = null; // Callback pentru a notifica main.js

// Asigură-te că aceste căi sunt valide și că imaginile există!
const emblemUrls = [
    'img/emblems/emblem1.png',
    'img/emblems/emblem2.png',
    'img/emblems/emblem3.png',
    'img/emblems/emblem4.png',
    'img/emblems/emblem5.png',
    'img/emblems/emblem6.png',
    'img/emblems/emblem7.png',
    'img/emblems/emblem8.png',
    'img/emblems/emblem9.png',
    'img/emblems/emblem10.png'
];

/**
 * Inițializează ecranul de setup: randare embleme, adăugare event listeners.
 * Această funcție este apelată DOAR DUPĂ ce setup.html a fost injectat în DOM.
 * @param {Function} callback - Funcția de apelat după ce setup-ul este completat și jocul pornește.
 */
export function initSetupScreen(callback) {
    console.log("setup.js: initSetupScreen() - Inițializarea ecranului de setup.");
    onSetupCompleteCallback = callback;

    const gameState = getGameState();
    const setupCurrentSeason = document.getElementById('setup-current-season');
    const setupCurrentDay = document.getElementById('setup-current-day');

    if (setupCurrentSeason) setupCurrentSeason.textContent = gameState.currentSeason;
    if (setupCurrentDay) setupCurrentDay.textContent = gameState.currentDay;

    renderEmblems();
    addEventListeners(); // Adaugă listeneri după ce DOM-ul e gata
    checkFormValidity(); // Verifică validitatea inițială
    console.log("setup.js: initSetupScreen() - Finalizare inițializare.");
}

/**
 * Generează grid-ul de embleme și adaugă evenimente de click.
 */
function renderEmblems() {
    console.log("setup.js: renderEmblems() - Se randează emblemele.");
    const emblemsContainer = document.getElementById('emblems-container'); // Acum ar trebui să fie găsit!
    
    if (!emblemsContainer) {
        console.error("setup.js: Elementul '#emblems-container' nu a fost găsit în DOM. Nu se pot randa emblemele.");
        return; 
    }

    emblemsContainer.innerHTML = ''; // Curățăm containerul

    emblemUrls.forEach(url => {
        const emblemCard = document.createElement('div');
        emblemCard.classList.add('emblem-card');

        const img = document.createElement('img');
        img.src = url;
        img.alt = 'Club Emblem';

        img.onerror = function() {
            console.warn(`setup.js: Eroare la încărcarea imaginii: ${this.src}. Asigură-te că imaginile sunt accesibile. Folosesc un placeholder generic.`);
            this.src = 'https://via.placeholder.com/50/CCCCCC/FFFFFF?text=IMG'; // Fallback
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
        emblemsContainer.appendChild(emblemCard);
    });
    console.log("setup.js: Emblemele au fost randate.");
}

/**
 * Verifică dacă toate câmpurile sunt completate și o emblemă este selectată.
 * Activează/dezactivează butonul de start.
 */
function checkFormValidity() {
    const coachNicknameInput = document.getElementById('coach-nickname');
    const clubNameInput = document.getElementById('club-name');
    const startGameBtn = document.getElementById('start-game-btn');

    if (!coachNicknameInput || !clubNameInput || !startGameBtn) {
        console.warn("setup.js: Nu s-au găsit toate elementele formularului pentru validare.");
        return;
    }

    const isFormValid = coachNicknameInput.value.trim() !== '' &&
                        clubNameInput.value.trim() !== '' &&
                        selectedEmblemUrl !== '';
    startGameBtn.disabled = !isFormValid;
    console.log(`setup.js: checkFormValidity() - Formular valid: ${isFormValid}. Buton Start: ${startGameBtn.disabled ? 'dezactivat' : 'activat'}`);
}

/**
 * Adaugă listeneri pentru câmpurile de input și butonul de start.
 */
function addEventListeners() {
    const coachNicknameInput = document.getElementById('coach-nickname');
    const clubNameInput = document.getElementById('club-name');
    const startGameBtn = document.getElementById('start-game-btn');

    if (coachNicknameInput) coachNicknameInput.addEventListener('input', checkFormValidity);
    if (clubNameInput) clubNameInput.addEventListener('input', checkFormValidity);

    if (startGameBtn && !startGameBtn._hasClickListener) { // Evită adăugarea multiplă de listeneri
        startGameBtn.addEventListener('click', handleStartGame);
        startGameBtn._hasClickListener = true; // Marchează că listener-ul a fost adăugat
    }
}

/**
 * Gestionează logica la apăsarea butonului "START JOC".
 */
function handleStartGame() {
    console.log("setup.js: handleStartGame() - Butonul 'START JOC' a fost apăsat.");
    const coachNicknameInput = document.getElementById('coach-nickname');
    const clubNameInput = document.getElementById('club-name');
    const startGameBtn = document.getElementById('start-game-btn');

    if (startGameBtn && startGameBtn.disabled) {
        console.warn("setup.js: Butonul Start este dezactivat, ignor click-ul.");
        return;
    }

    const coachNickname = coachNicknameInput ? coachNicknameInput.value.trim() : '';
    const clubName = clubNameInput ? clubNameInput.value.trim() : '';

    if (!coachNickname || !clubName || !selectedEmblemUrl) {
        alert('Te rog completează toate câmpurile și alege o emblemă!');
        console.warn("setup.js: Date setup incomplete.");
        return;
    }

    const currentGameState = getGameState();
    updateGameState({
        isGameStarted: true,
        coach: { nickname: coachNickname },
        club: {
            name: clubName,
            emblemUrl: selectedEmblemUrl,
            funds: 1000000, // Suma inițială
            energy: 100
        },
        // Păstrează formația și mentalitatea implicită dacă nu sunt setate deja
        currentFormation: currentGameState.currentFormation || '4-4-2',
        currentMentality: currentGameState.currentMentality || 'normal'
    });
    console.log("setup.js: Stare joc actualizată după START JOC:", getGameState());

    // Curățăm câmpurile și selectarea pentru o eventuală resetare
    if (coachNicknameInput) coachNicknameInput.value = '';
    if (clubNameInput) clubNameInput.value = '';
    selectedEmblemUrl = '';
    document.querySelectorAll('.emblem-card').forEach(card => {
        card.classList.remove('selected');
    });
    if (startGameBtn) startGameBtn.disabled = true;
    console.log("setup.js: Câmpuri resetate și buton dezactivat.");

    if (onSetupCompleteCallback) {
        onSetupCompleteCallback(); // Aici se face trecerea efectivă la ecranul de joc
    } else {
        console.error("setup.js: Eroare: onSetupCompleteCallback este NULL sau UNDEFINED!");
    }
    console.log("setup.js: Logica click-ului pe START JOC a fost finalizată.");
}
