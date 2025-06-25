// public/js/setup.js

import { getGameState, updateGameState } from './game-state.js';
import { generateInitialPlayers } from './player-generator.js';

let setupCompleteCallback = null;
let selectedEmblemUrl = ''; // Va stoca URL-ul emblemei selectate

// Lista de adrese URL externe pentru embleme
const externalEmblemUrls = [
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

export function initSetupScreen(callback) {
    console.log("setup.js: initSetupScreen() - Inițializarea ecranului de setup.");
    setupCompleteCallback = callback;
    renderEmblems(); // Randăm emblemele la inițializare
    addFormListeners();
    checkFormValidity(); // Verificăm validitatea la inițializare
    console.log("setup.js: initSetupScreen() - Finalizare inițializare.");
}

function addFormListeners() {
    const setupForm = document.getElementById('setupForm');
    if (setupForm) {
        setupForm.addEventListener('input', checkFormValidity);
        setupForm.addEventListener('change', checkFormValidity); // Pentru selecții radio/checkbox
        setupForm.addEventListener('submit', handleSetupSubmit);
    } else {
        console.error("setup.js: Elementul #setupForm nu a fost găsit.");
    }
}

function renderEmblems() {
    console.log("setup.js: renderEmblems() - Se randează emblemele.");
    const emblemsContainer = document.getElementById('emblemsContainer');
    if (!emblemsContainer) {
        console.error("setup.js: Elementul #emblemsContainer nu a fost găsit.");
        return;
    }
    emblemsContainer.innerHTML = ''; // Curăță orice conținut existent

    // Folosim adresele URL externe furnizate
    externalEmblemUrls.forEach((url, index) => {
        const img = document.createElement('img');
        img.src = url; // Acum folosim direct URL-ul extern
        img.alt = `Emblemă ${index + 1}`;
        img.dataset.emblemId = index + 1; // Pentru a identifica emblema selectată

        img.onerror = () => {
            console.error(`setup.js: Eroare la încărcarea imaginii: ${img.src}. Asigură-te că imaginile sunt accesibile. Folosesc un placeholder generic.`);
            // Folosim un placeholder generic, dacă nici URL-ul original nu funcționează.
            // Puteți schimba acest URL de placeholder dacă doriți unul mai fiabil.
            img.src = `https://via.placeholder.com/50/CCCCCC/FFFFFF?text=IMG:${index + 1}`;
            img.onerror = null; // Previne bucla infinită dacă placeholder-ul eșuează și el
        };

        emblemsContainer.appendChild(img);
    });

    console.log("setup.js: Emblemele au fost randate.");
    addEmblemSelectionListener();
}


function addEmblemSelectionListener() {
    const emblemsContainer = document.getElementById('emblemsContainer');
    if (emblemsContainer) {
        emblemsContainer.addEventListener('click', (event) => {
            const clickedEmblem = event.target.closest('img[data-emblem-id]');
            if (clickedEmblem) {
                // Elimină clasa 'selected' de la toate emblemele
                document.querySelectorAll('.emblem-selection img').forEach(img => {
                    img.classList.remove('selected');
                });

                // Adaugă clasa 'selected' la emblema dată click
                clickedEmblem.classList.add('selected');
                selectedEmblemUrl = clickedEmblem.src; // Salvează URL-ul imaginii selectate
                console.log(`setup.js: Emblemă selectată: ID ${clickedEmblem.dataset.emblemId}, URL: ${selectedEmblemUrl}`);
                checkFormValidity();
            }
        });
    } else {
        console.error("setup.js: Elementul #emblemsContainer nu a fost găsit pentru adăugarea listener-ului.");
    }
}

function checkFormValidity() {
    const clubName = document.getElementById('clubName').value.trim();
    const coachNickname = document.getElementById('coachNickname').value.trim();
    const startButton = document.getElementById('startButton');

    const isValid = clubName !== '' && coachNickname !== '' && selectedEmblemUrl !== '';
    startButton.disabled = !isValid;

    console.log(`setup.js: checkFormValidity() - Formular valid: ${isValid}. Buton Start: ${isValid ? 'activat' : 'dezactivat'}`);
}

function handleSetupSubmit(event) {
    event.preventDefault(); // Oprește reîncărcarea paginii

    console.log("setup.js: handleSetupSubmit() - Formularul de setup a fost trimis.");

    const clubName = document.getElementById('clubName').value.trim();
    const coachNickname = document.getElementById('coachNickname').value.trim();

    if (!clubName || !coachNickname || !selectedEmblemUrl) {
        console.error("setup.js: Datele formularului sunt incomplete sau emblema nu este selectată.");
        return;
    }

    const initialFunds = 10000000; // Fonduri inițiale

    // Creăm starea inițială a jocului
    const newGameState = {
        isGameStarted: true,
        club: {
            name: clubName,
            emblemUrl: selectedEmblemUrl, // Salvăm URL-ul complet al emblemei
            funds: initialFunds,
            reputation: 50,
            facilitiesLevel: 1
        },
        coach: {
            nickname: coachNickname,
            reputation: 50,
            experience: 0
        },
        currentSeason: 1,
        currentDay: 1,
        players: [], // Vor fi generați ulterior în main.js
        currentFormation: '4-4-2', // Default
        currentMentality: 'normal' // Default
    };

    updateGameState(newGameState); // Salvează noua stare în localStorage

    console.log("setup.js: Stare joc inițială salvată:", getGameState());

    if (setupCompleteCallback) {
        setupCompleteCallback(); // Apelăm callback-ul pentru a trece la ecranul de joc
    }
}
