// public/js/setup.js

import { getGameState, updateGameState, saveGameState } from './game-state.js'; // Adaugă updateGameState
import { startGame } from './main.js';

/**
 * Inițializează ecranul de configurare a jocului.
 */
export function initSetupScreen() {
    console.log("setup.js: initSetupScreen() - Inițializarea ecranului de configurare.");
    const setupScreen = document.getElementById('setup-screen');
    const startButton = document.getElementById('start-game-button');
    const clubNameInput = document.getElementById('club-name-input');
    const coachNameInput = document.getElementById('coach-name-input');
    const emblemSelect = document.getElementById('emblem-select');
    const selectedEmblemImg = document.getElementById('selected-emblem-img');

    if (!setupScreen || !startButton || !clubNameInput || !coachNameInput || !emblemSelect || !selectedEmblemImg) {
        console.error("setup.js: Un sau mai multe elemente DOM esențiale pentru ecranul de configurare lipsesc.");
        return;
    }

    // Populează select-ul cu embleme
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

    emblemSelect.innerHTML = '';
    emblems.forEach(emblem => {
        const option = document.createElement('option');
        option.value = emblem.value;
        option.textContent = emblem.text;
        emblemSelect.appendChild(option);
    });

    // Actualizează imaginea emblemei la selectarea unei opțiuni
    emblemSelect.addEventListener('change', () => {
        selectedEmblemImg.src = emblemSelect.value;
        console.log(`setup.js: Emblemă selectată: ${emblemSelect.value}`);
    });

    // Setează emblema inițială
    if (emblems.length > 0) {
        selectedEmblemImg.src = emblems[0].value;
    }

    startButton.addEventListener('click', () => {
        const clubName = clubNameInput.value.trim();
        const coachName = coachNameInput.value.trim();
        const teamEmblem = emblemSelect.value;

        if (clubName && coachName && teamEmblem) {
            console.log(`setup.js: Configurarea jocului - Nume Club: ${clubName}, Antrenor: ${coachName}, Emblemă: ${teamEmblem}`);
            
            // Folosește updateGameState pentru a actualiza proprietățile necesare
            updateGameState({
                isGameStarted: true,
                clubName: clubName,
                coachName: coachName,
                teamEmblem: teamEmblem,
                currentSeason: 1,
                currentMatchday: 1,
                // Lăsăm `players` și `availablePlayers` să fie gestionate de `game-state.js` la prima încărcare
                // sau le vom inițializa explicit aici dacă nu există (logică deja în getGameState)
            });

            // Asigură-te că starea cu jucători este re-verificată/reîncărcată după actualizarea inițială
            // Pentru a ne asigura că `availablePlayers` este populat dacă nu a fost încă
            const gameStateAfterSetup = getGameState(); // Reîncarcă starea proaspătă
            if (!gameStateAfterSetup.players || gameStateAfterSetup.players.length === 0) {
                 // Această ramură ar trebui atinsă doar dacă inițializarea de bază a eșuat
                 // sau dacă localStorage a fost gol și nu a populat `players` corect
                 updateGameState({ players: initialGameState.players }); // Force-populare
                 console.warn("setup.js: Jucători repopulați din initialGameState după setup.");
            }
            if (!gameStateAfterSetup.availablePlayers || gameStateAfterSetup.availablePlayers.length === 0) {
                 updateGameState({ availablePlayers: [...gameStateAfterSetup.players] });
                 console.warn("setup.js: Available players repopulați după setup.");
            }
             
            startGame(); // Pornim jocul după configurare
        } else {
            alert('Te rog completează toate câmpurile: Nume Club, Nume Antrenor și Emblemă.');
            console.warn("setup.js: Toate câmpurile nu sunt completate pentru configurare.");
        }
    });
    console.log("setup.js: Ecran de configurare inițializat.");
}
