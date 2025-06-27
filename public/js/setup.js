// public/js/setup.js

import { getGameState, updateGameState, saveGameState } from './game-state.js';
import { startGame } from './main.js'; // Acum importă startGame

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
    const emblems = [
        { value: 'https://i.postimg.cc/jdqMtscT/07.png', text: 'Emblemă 1' },
        { value: 'https://i.postimg.cc/k47tXhJc/08.png', text: 'Emblemă 2' },
        { value: 'https://i.postimg.cc/hGv5b8rN/09.png', text: 'Emblemă 3' },
        // Adaugă mai multe embleme aici
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
            
            updateGameState({
                isGameStarted: true,
                clubName: clubName,
                coachName: coachName,
                teamEmblem: teamEmblem,
                currentSeason: 1,
                currentMatchday: 1,
            });

            const gameStateAfterSetup = getGameState();
            if (!gameStateAfterSetup.players || gameStateAfterSetup.players.length === 0) {
                 updateGameState({ players: initialGameState.players });
                 console.warn("setup.js: Jucători repopulați din initialGameState după setup.");
            }
            if (!gameStateAfterSetup.availablePlayers || gameStateAfterSetup.availablePlayers.length === 0) {
                 updateGameState({ availablePlayers: [...gameStateAfterSetup.players] });
                 console.warn("setup.js: Available players repopulați după setup.");
            }
             
            startGame();
        } else {
            alert('Te rog completează toate câmpurile: Nume Club, Nume Antrenor și Emblemă.');
            console.warn("setup.js: Toate câmpurile nu sunt completate pentru configurare.");
        }
    });
    console.log("setup.js: Ecran de configurare inițializat.");
}
