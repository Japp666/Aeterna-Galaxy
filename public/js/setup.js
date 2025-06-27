// public/js/setup.js

import { getGameState, updateGameState, saveGameState } from './game-state.js';
import { startGame } from './main.js';

/**
 * Inițializează ecranul de configurare a jocului.
 * @param {Function} onSetupCompleteCallback - Funcția de apelat după finalizarea configurării.
 */
export function initSetupScreen(onSetupCompleteCallback) { // Am eliminat setupScreenElement ca parametru
    console.log("setup.js: initSetupScreen() - Inițializarea ecranului de configurare.");
    
    // Acum căutăm elementele direct, nu prin intermediul unui parametru
    const setupContainer = document.getElementById('setup-container');
    const startButton = setupContainer ? setupContainer.querySelector('#startButton') : null;
    const clubNameInput = setupContainer ? setupContainer.querySelector('#clubName') : null;
    const coachNicknameInput = setupContainer ? setupContainer.querySelector('#coachNickname') : null;
    const emblemsContainer = setupContainer ? setupContainer.querySelector('#emblemsContainer') : null;
    
    // Verificăm existența tuturor elementelor necesare
    const missingElements = [];
    if (!setupContainer) missingElements.push('#setup-container');
    if (!startButton) missingElements.push('#startButton');
    if (!clubNameInput) missingElements.push('#clubName');
    if (!coachNicknameInput) missingElements.push('#coachNickname');
    if (!emblemsContainer) missingElements.push('#emblemsContainer');

    if (missingElements.length > 0) {
        console.error("setup.js: Un sau mai multe elemente DOM esențiale pentru ecranul de configurare lipsesc:", missingElements.join(', '));
        if (setupContainer) {
            setupContainer.innerHTML = `<p class="error-message">Eroare la încărcarea ecranului de configurare. Elemente lipsă: ${missingElements.join(', ')}.</p>`;
        }
        return;
    }

    // Populează grid-ul cu embleme și adaugă listeneri
    const emblems = [
        // Căi locale către embleme
        { value: 'img/emblema01.png', alt: 'Emblemă 1' },
        { value: 'img/emblema02.png', alt: 'Emblemă 2' },
        { value: 'img/emblema03.png', alt: 'Emblemă 3' },
        { value: 'img/emblema04.png', alt: 'Emblemă 4' },
        { value: 'img/emblema05.png', alt: 'Emblemă 5' },
        { value: 'img/emblema06.png', alt: 'Emblemă 6' },
        { value: 'img/emblema07.png', alt: 'Emblemă 7' },
        { value: 'img/emblema08.png', alt: 'Emblemă 8' },
        { value: 'img/emblema09.png', alt: 'Emblemă 9' },
        { value: 'img/emblema10.png', alt: 'Emblemă 10' }
    ];

    emblemsContainer.innerHTML = '';
    let selectedEmblemValue = ''; // Reține valoarea emblemei selectate

    emblems.forEach((emblem, index) => {
        const img = document.createElement('img');
        img.src = emblem.value;
        img.alt = emblem.alt;
        img.dataset.value = emblem.value; // Stochează valoarea în data-attribute
        
        // Selectează prima emblemă implicit
        if (index === 0) {
            img.classList.add('selected');
            selectedEmblemValue = emblem.value;
            startButton.disabled = false; // Activează butonul de start dacă prima emblemă e selectată implicit
        }

        img.addEventListener('click', () => {
            // Elimină clasa 'selected' de la toate emblemele
            emblemsContainer.querySelectorAll('img').forEach(e => e.classList.remove('selected'));
            // Adaugă clasa 'selected' la emblema curentă
            img.classList.add('selected');
            selectedEmblemValue = img.dataset.value;
            startButton.disabled = false; // Activează butonul de start la selecție
            console.log(`setup.js: Emblemă selectată: ${selectedEmblemValue}`);
        });
        emblemsContainer.appendChild(img);
    });

    // Ascultă evenimentele de input pentru a activa/dezactiva butonul de start
    const checkFormValidity = () => {
        startButton.disabled = !(clubNameInput.value.trim() && coachNicknameInput.value.trim() && selectedEmblemValue);
    };

    clubNameInput.addEventListener('input', checkFormValidity);
    coachNicknameInput.addEventListener('input', checkFormValidity);
    checkFormValidity(); // Verifică inițial la încărcare

    // Listener pentru butonul de start
    startButton.addEventListener('click', (event) => {
        event.preventDefault(); // Oprește trimiterea formularului

        const clubName = clubNameInput.value.trim();
        const coachName = coachNicknameInput.value.trim();

        if (clubName && coachName && selectedEmblemValue) {
            console.log(`setup.js: Configurarea jocului - Nume Club: ${clubName}, Antrenor: ${coachName}, Emblemă: ${selectedEmblemValue}`);
            
            const currentGameState = getGameState();
            const updatedClub = {
                ...currentGameState.club,
                name: clubName,
                emblemUrl: selectedEmblemValue, // Salvează calea locală a emblemei
                funds: currentGameState.club ? currentGameState.club.funds : 10000000,
                reputation: currentGameState.club ? currentGameState.club.reputation : 50,
                facilitiesLevel: currentGameState.club ? currentGameState.club.facilitiesLevel : 1
            };
            const updatedCoach = {
                ...currentGameState.coach,
                nickname: coachName,
                reputation: currentGameState.coach ? currentGameState.coach.reputation : 50,
                experience: currentGameState.coach ? currentGameState.coach.experience : 0
            };

            updateGameState({
                isGameStarted: true,
                club: updatedClub,
                coach: updatedCoach,
                currentSeason: 1,
                currentMatchday: 1,
            });
            
            if (onSetupCompleteCallback) {
                onSetupCompleteCallback();
            }

        } else {
            alert('Te rog completează toate câmpurile: Nume Club, Nume Antrenor și alege o Emblemă.');
            console.warn("setup.js: Toate câmpurile nu sunt completate pentru configurare.");
        }
    });

    console.log("setup.js: Ecran de configurare inițializat.");
}
