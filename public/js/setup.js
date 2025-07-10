// public/js/setup.js - Modul pentru ecranul de configurare inițială a jocului
import { saveGameState, getGameState, updateGameState } from './game-state.js';
import { loadComponent } from './utils.js';
import { generateInitialPlayers } from './player-generator.js';

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
    return new Promise(async (resolve, reject) => {
        try {
            // Verifică dacă appRootElement există
            if (!appRootElement) {
                throw new Error("Elementul rădăcină al aplicației (#app) nu a fost furnizat.");
            }

            // Așteaptă ca DOM-ul să fie complet încărcat
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', async () => {
                    await initializeSetupContent(appRootElement, resolve, reject);
                }, { once: true });
            } else {
                await initializeSetupContent(appRootElement, resolve, reject);
            }
        } catch (error) {
            console.error("setup.js: Eroare la inițializarea ecranului de setup:", error.message);
            if (appRootElement) {
                appRootElement.innerHTML = `<p class="error-message">Eroare critică: ${error.message}. Vă rugăm să reîncărcați pagina.</p>`;
            }
            reject(error);
        }
    });
}

/**
 * Funcție auxiliară pentru inițializarea conținutului setup-ului după ce DOM-ul este încărcat.
 * @param {HTMLElement} appRootElement - Elementul rădăcină al aplicației.
 * @param {Function} resolve - Funcția de rezolvare a Promise-ului.
 * @param {Function} reject - Funcția de reject a Promise-ului.
 */
async function initializeSetupContent(appRootElement, resolve, reject) {
    try {
        setupContentElement = appRootElement.querySelector('#setup-screen');
        if (!setupContentElement) {
            throw new Error("Elementul #setup-screen nu a fost găsit în DOM.");
        }

        const setupHtml = await loadComponent('components/setup.html');
        setupContentElement.innerHTML = setupHtml;

        // Așteaptă ca elementele formularului să fie disponibile
        const selectors = ['#setupForm', '#coachNickname', '#clubName', '#emblemsContainer', '#startButton'];
        const elements = await waitForElements(setupContentElement, selectors);

        [setupForm, coachNicknameInput, clubNameInput, emblemsContainer, startButton] = elements;

        console.log("setup.js: Toate elementele DOM necesare au fost găsite.");
        renderEmblems(emblemsContainer);
        addSetupEventListeners();
        updateStartButtonState();

        // Pre-populează formularul dacă există date salvate
        const gameState = getGameState();
        if (gameState.coachNickname) coachNicknameInput.value = gameState.coachNickname;
        if (gameState.clubName) clubNameInput.value = gameState.clubName;
        if (gameState.clubEmblem) {
            selectedEmblemPath = gameState.clubEmblem;
            const newSelected = emblemsContainer.querySelector(`img[src*="${selectedEmblemPath}"]`);
            if (newSelected) newSelected.closest('.emblem-item').classList.add('selected');
        }

        resolve();
    } catch (error) {
        console.error("setup.js: Eroare la inițializarea conținutului setup:", error.message);
        appRootElement.innerHTML = `<p class="error-message">Eroare critică: ${error.message}. Vă rugăm să reîncărcați pagina.</p>`;
        reject(error);
    }
}

/**
 * Așteaptă ca mai multe elemente DOM să fie disponibile.
 * @param {HTMLElement} parentElement - Elementul părinte în care se caută.
 * @param {string[]} selectors - Lista de selectoare CSS.
 * @param {number} maxAttempts - Numărul maxim de încercări.
 * @param {number} interval - Intervalul între încercări (ms).
 * @returns {Promise<HTMLElement[]>} Lista de elemente găsite.
 */
function waitForElements(parentElement, selectors, maxAttempts = 200, interval = 50) {
    let attempts = 0;
    return new Promise((resolve, reject) => {
        const check = () => {
            attempts++;
            const foundElements = selectors.map(selector => parentElement.querySelector(selector));
            const allFound = foundElements.every(el => el !== null);
            if (allFound) {
                console.log(`setup.js: Toate elementele DOM necesare au fost găsite după ${attempts} încercări.`);
                resolve(foundElements);
            } else if (attempts < maxAttempts) {
                const missingSelectors = selectors.filter((selector, index) => foundElements[index] === null);
                console.warn(`setup.js: Elementele DOM nu sunt încă disponibile. Încercare ${attempts}/${maxAttempts}. Elemente lipsă: ${missingSelectors.join(', ')}`);
                setTimeout(check, interval);
            } else {
                const missing = selectors.filter((selector, index) => foundElements[index] === null);
                reject(new Error(`Timeout: Nu s-au putut găsi elementele: ${missing.join(', ')} după ${maxAttempts} încercări.`));
            }
        };
        check();
    });
}

/**
 * Randează emblemele disponibile în containerul specificat.
 * @param {HTMLElement} container - Elementul container în care vor fi adăugate emblemele.
 */
function renderEmblems(container) {
    if (!container) {
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
            clubFunds: 5000000, // Buget inițial
            players: generateInitialPlayers(18) // Generează 18 jucători inițiali
        };
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
