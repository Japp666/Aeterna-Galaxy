// public/js/setup.js - Modul pentru ecranul de configurare inițială a jocului
import { saveGameState, getGameState, updateGameState } from './game-state.js';
import { loadComponent } from './utils.js';

let setupContentElement; // Elementul în care va fi încărcat setup.html
let setupForm; // Formularul de setup
let coachNicknameInput;
let clubNameInput;
let emblemsContainer;
let startButton;
let selectedEmblemPath = ''; // Calea către emblema selectată

// Lista de embleme disponibile (căi relative la public/img/emblems/)
const EMBLEMS = [
    'emblema01.png', 'emblema02.png', 'emblema03.png', 'emblema04.png', 'emblema05.png',
    'emblema06.png', 'emblema07.png', 'emblema08.png', 'emblema09.png', 'emblema10.png',
    'emblema11.png', 'emblema12.png', 'emblema13.png', 'emblema14.png', 'emblema15.png',
    'emblema16.png', 'emblema17.png', 'emblema18.png', 'emblema19.png', 'emblema20.png'
];

/**
 * Inițializează ecranul de setup.
 * Încarcă conținutul HTML al setup.html și adaugă listeneri.
 * @param {HTMLElement} appRootElement - Elementul rădăcină al aplicației (#app).
 */
export async function initializeSetupScreen(appRootElement) {
    console.log("setup.js: Inițializare ecran de setup...");
    try {
        const setupHtml = await loadComponent('components/setup.html');
        setupContentElement = appRootElement.querySelector('#setup-screen');
        if (setupContentElement) {
            setupContentElement.innerHTML = setupHtml;

            // Obține referințe către elementele DOM după ce HTML-ul este încărcat
            setupForm = document.getElementById('setupForm');
            coachNicknameInput = document.getElementById('coachNickname');
            clubNameInput = document.getElementById('clubName');
            emblemsContainer = document.getElementById('emblemsContainer');
            startButton = document.getElementById('startButton');

            // Asigură-te că toate elementele cheie sunt găsite
            if (!setupForm || !coachNicknameInput || !clubNameInput || !emblemsContainer || !startButton) {
                throw new Error("Unul sau mai multe elemente DOM esențiale pentru setup nu au fost găsite.");
            }
            console.log("setup.js: Valoarea lui emblemsContainer înainte de renderEmblems:", emblemsContainer); // Linia adăugată pentru debug
            
            renderEmblems(emblemsContainer);
            addSetupEventListeners();
            updateStartButtonState(); // Setează starea inițială a butonului START JOC

            // Pre-populează formularul dacă există date salvate
            const gameState = getGameState();
            if (gameState.coachNickname) {
                coachNicknameInput.value = gameState.coachNickname;
            }
            if (gameState.clubName) {
                clubNameInput.value = gameState.clubName;
            }
            if (gameState.clubEmblem) {
                selectedEmblemPath = gameState.clubEmblem;
                // Aici ar trebui să actualizezi vizual emblema selectată
                const currentSelected = emblemsContainer.querySelector('.emblem-item.selected');
                if (currentSelected) {
                    currentSelected.classList.remove('selected');
                }
                const newSelected = emblemsContainer.querySelector(`img[src*="${selectedEmblemPath}"]`).closest('.emblem-item');
                if (newSelected) {
                    newSelected.classList.add('selected');
                }
            }

        } else {
            throw new Error("Elementul #setup-screen nu a fost găsit în DOM.");
        }
    } catch (error) {
        console.error("setup.js: Eroare la inițializarea ecranului de setup: " + error.message);
        // Poți afișa un mesaj de eroare în UI dacă este necesar
        if (appRootElement) {
            appRootElement.innerHTML = `<p class="error-message">Eroare critică: ${error.message}. Vă rugăm să reîncărcați pagina.</p>`;
        }
    }
}

/**
 * Randează emblemele disponibile în containerul specificat.
 * @param {HTMLElement} container - Elementul container în care vor fi adăugate emblemele.
 */
function renderEmblems(container) {
    if (!container) { // Verificare defensivă adăugată
        console.error("renderEmblems: Containerul pentru embleme este null sau nedefinit.");
        return; 
    }

    container.innerHTML = ''; // Golește containerul existent
    EMBLEMS.forEach(emblem => {
        const emblemItem = document.createElement('div');
        emblemItem.classList.add('emblem-item');
        if (`img/emblems/${emblem}` === selectedEmblemPath) {
            emblemItem.classList.add('selected');
        }

        const img = document.createElement('img');
        img.src = `img/emblems/${emblem}`;
        img.alt = `Emblemă ${emblem}`;
        img.dataset.path = `img/emblems/${emblem}`; // Stocăm calea completă pentru selecție

        emblemItem.appendChild(img);
        container.appendChild(emblemItem);
    });
}

/**
 * Adaugă listeneri de evenimente pentru formularul de setup și butoane.
 */
function addSetupEventListeners() {
    // Listeneri pentru input-urile de text
    coachNicknameInput.addEventListener('input', updateStartButtonState);
    clubNameInput.addEventListener('input', updateStartButtonState);

    // Listener pentru selecția emblemei
    emblemsContainer.addEventListener('click', (event) => {
        const clickedEmblem = event.target.closest('.emblem-item');
        if (clickedEmblem) {
            // Elimină clasa 'selected' de la emblema anterior selectată
            const currentSelected = emblemsContainer.querySelector('.emblem-item.selected');
            if (currentSelected) {
                currentSelected.classList.remove('selected');
            }
            // Adaugă clasa 'selected' la emblema curentă
            clickedEmblem.classList.add('selected');
            selectedEmblemPath = clickedEmblem.querySelector('img').dataset.path;
            updateStartButtonState();
        }
    });

    // Listener pentru trimiterea formularului
    setupForm.addEventListener('submit', (event) => {
        event.preventDefault(); // Previne reîncărcarea paginii
        if (startButton.disabled) {
            console.warn("setup.js: Butonul de start este dezactivat. Verifică toate câmpurile.");
            return;
        }

        const newGameState = {
            ...getGameState(), // Păstrează starea existentă
            coachNickname: coachNicknameInput.value.trim(),
            clubName: clubNameInput.value.trim(),
            clubEmblem: selectedEmblemPath,
            isGameStarted: true, // Marchează jocul ca pornit
            currentDay: 1,
            currentSeason: 1,
            clubFunds: 5000000, // Exemplu: buget inițial
            players: [] // Jucătorii vor fi generați ulterior
        };

        // Generează jucători inițiali
        // newGameState.players = generateInitialPlayers(18); // Generează 18 jucători inițiali
        // TODO: Aici ar trebui să apelezi o funcție din player-generator.js pentru a genera jucători reali.

        saveGameState(newGameState);
        console.log("setup.js: Stare joc salvată și joc pornit!", newGameState);
        // Redirecționează către ecranul principal al jocului
        window.location.reload(); // Simplu, dar eficient pentru a reîncărca UI-ul
    });
}

/**
 * Actualizează starea butonului de start (activat/dezactivat)
 * în funcție de completarea câmpurilor și selecția emblemei.
 */
function updateStartButtonState() {
    const isFormFilled = coachNicknameInput.value.trim() !== '' &&
                         clubNameInput.value.trim() !== '' &&
                         selectedEmblemPath !== '';
    startButton.disabled = !isFormFilled;
}
