// setup.js
import { updateGameState, getGameState } from './game-state.js';
import { displayGameScreen } from './game-ui.js';
import { generateInitialPlayers } from './player-generator.js';

export function initializeSetupScreen(rootElement) {
    console.log("setup.js: Inițializare ecran de setup...");

    const setupForm = rootElement.querySelector('#setupForm');
    const clubNameInput = rootElement.querySelector('#clubName');
    const coachNicknameInput = rootElement.querySelector('#coachNickname');
    const emblemSelector = rootElement.querySelector('#emblemSelector');
    const selectedEmblemImage = rootElement.querySelector('#selectedEmblemImage');
    const generateTeamButton = rootElement.querySelector('#generateTeam');
    const resetGameButton = rootElement.querySelector('#resetGame');

    const totalEmblems = 20; // Numărul total de embleme disponibile
    const emblemsPath = '../public/img/emblems/'; // Calea către directorul cu embleme

    // Generează opțiunile de selecție pentru embleme
    for (let i = 1; i <= totalEmblems; i++) {
        const option = document.createElement('option');
        option.value = `emblema${String(i).padStart(2, '0')}.png`;
        option.textContent = `Emblema ${i}`;
        emblemSelector.appendChild(option);
    }

    // Actualizează imaginea emblemei selectate
    emblemSelector.addEventListener('change', () => {
        const selectedEmblem = emblemSelector.value;
        if (selectedEmblem) {
            selectedEmblemImage.src = `${emblemsPath}${selectedEmblem}`;
            console.log(`setup.js: Emblema selectată: ${selectedEmblemImage.src}`);
        } else {
            selectedEmblemImage.src = ''; // Clear if no selection
        }
    });

    // Inițializează valorile din local storage, dacă există
    const currentGameState = getGameState();
    if (currentGameState.clubName) {
        clubNameInput.value = currentGameState.clubName;
    }
    if (currentGameState.coachNickname) {
        coachNicknameInput.value = currentGameState.coachNickname;
    }
    if (currentGameState.clubEmblem) {
        // Presupunem că `clubEmblem` salvează doar numele fișierului emblemei (ex: 'emblema05.png')
        selectedEmblemImage.src = `${emblemsPath}${currentGameState.clubEmblem}`;
        emblemSelector.value = currentGameState.clubEmblem;
    }

    setupForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const clubName = clubNameInput.value.trim();
        const coachNickname = coachNicknameInput.value.trim();
        const clubEmblem = emblemSelector.value; // Numele fișierului emblemei selectate

        if (!clubName || !coachNickname || !clubEmblem) {
            alert('Te rog completează toate câmpurile: Nume Club, Nume Antrenor și selectează o Emblema.');
            return;
        }

        // Generează jucătorii inițiali doar dacă nu există deja
        let players = currentGameState.players;
        if (!players || players.length === 0) {
            players = generateInitialPlayers();
        }

        updateGameState({
            clubName,
            coachNickname,
            clubEmblem, // Salvează numele fișierului emblemei
            players: players,
            currentDay: 1,
            currentSeason: 1,
            clubFunds: 10000000, // Capital inițial
            currentFormation: '4-4-2', // Formația inițială
            currentMentality: 'balanced', // Mentalitatea inițială
            teamFormation: {} // Va fi populat de managerul de tactici
        });

        displayGameScreen();
    });

    // Adaugă event listener pentru butonul de resetare
    if (resetGameButton) {
        resetGameButton.addEventListener('click', () => {
            if (confirm('Ești sigur că vrei să resetezi jocul? Toate progresele vor fi pierdute!')) {
                updateGameState({
                    clubName: '',
                    coachNickname: '',
                    clubEmblem: '',
                    players: [],
                    currentDay: 1,
                    currentSeason: 1,
                    clubFunds: 10000000,
                    currentFormation: '4-4-2',
                    currentMentality: 'balanced',
                    teamFormation: {}
                });
                // Reîncarcă ecranul de setup pentru a afișa valorile resetate
                clubNameInput.value = '';
                coachNicknameInput.value = '';
                emblemSelector.value = ''; // Resetează selecția
                selectedEmblemImage.src = ''; // Șterge imaginea
                console.log("setup.js: Jocul a fost resetat.");
            }
        });
    }
}
