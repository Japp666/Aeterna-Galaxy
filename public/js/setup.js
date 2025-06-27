// public/js/setup.js

import { getGameState, updateGameState, saveGameState } from './game-state.js';
import { startGame } from './main.js';

// Starea inițială a jocului din game-state.js, necesară pentru repopularea jucătorilor
// Aceasta ar trebui importată, dar pentru a evita importuri circulare sau dependențe complexe
// voi folosi o structură minimă similară aici, sau voi presupune că `getGameState` o oferă.
// Pentru contextul actual, o vom prelua din game-state direct.

/**
 * Inițializează ecranul de configurare a jocului.
 * @param {HTMLElement} setupScreenElement - Elementul DOM al ecranului de setup (div-ul #setup-screen).
 * @param {Function} onSetupCompleteCallback - Funcția de apelat după finalizarea configurării.
 */
export function initSetupScreen(setupScreenElement, onSetupCompleteCallback) {
    console.log("setup.js: initSetupScreen() - Inițializarea ecranului de configurare.");
    
    // Asigură-te că setupScreenElement este valid
    if (!setupScreenElement) {
        console.error("setup.js: Elementul DOM pentru ecranul de configurare nu a fost furnizat.");
        return;
    }

    // Acum căutăm elementele *în interiorul* setupScreenElement
    const setupContainer = setupScreenElement.querySelector('#setup-container');
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
        // Aici poți afișa un mesaj de eroare vizibil utilizatorului
        setupScreenElement.innerHTML = `<p class="error-message">Eroare la încărcarea ecranului de configurare. Elemente lipsă: ${missingElements.join(', ')}.</p>`;
        return;
    }

    // Populează grid-ul cu embleme și adaugă listeneri
    const emblems = [
        { value: 'https://i.postimg.cc/jdqMtscT/07.png', alt: 'Emblemă 1' },
        { value: 'https://i.postimg.cc/k47tXhJc/08.png', alt: 'Emblemă 2' },
        { value: 'https://i.postimg.cc/hGv5b8rN/09.png', alt: 'Emblemă 3' },
        { value: 'https://i.postimg.cc/CLWjP3yC/10.png', alt: 'Emblemă 4' },
        { value: 'https://i.postimg.cc/d0rG010x/11.png', alt: 'Emblemă 5' },
        { value: 'https://i.postimg.cc/prgQd6yP/12.png', alt: 'Emblemă 6' },
        // Adaugă mai multe embleme aici
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
    // Nu mai este necesar un listener direct pe emblemă pentru validare,
    // deoarece "selectedEmblemValue" este actualizat la click.
    checkFormValidity(); // Verifică inițial la încărcare

    // Listener pentru butonul de start
    startButton.addEventListener('click', (event) => {
        event.preventDefault(); // Oprește trimiterea formularului

        const clubName = clubNameInput.value.trim();
        const coachName = coachNicknameInput.value.trim();
        // selectedEmblemValue este deja actualizat de listenerii de click pe embleme

        if (clubName && coachName && selectedEmblemValue) {
            console.log(`setup.js: Configurarea jocului - Nume Club: ${clubName}, Antrenor: ${coachName}, Emblemă: ${selectedEmblemValue}`);
            
            // Verificăm dacă există deja un 'club' și 'coach' în gameState sau le creăm
            const currentGameState = getGameState();
            const updatedClub = {
                ...currentGameState.club, // Păstrează alte proprietăți existente ale clubului
                name: clubName,
                emblemUrl: selectedEmblemValue,
                funds: currentGameState.club ? currentGameState.club.funds : 10000000, // Menține fondurile sau setează inițial
                reputation: currentGameState.club ? currentGameState.club.reputation : 50,
                facilitiesLevel: currentGameState.club ? currentGameState.club.facilitiesLevel : 1
            };
            const updatedCoach = {
                ...currentGameState.coach, // Păstrează alte proprietăți existente ale antrenorului
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
                // `players` și `availablePlayers` sunt gestionate în `onSetupCompleteCallback`
            });
            
            // Apelăm callback-ul pentru a continua cu jocul
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
