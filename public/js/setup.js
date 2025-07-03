// js/setup.js
import { gameState } from './game-state.js';

// Liste de logo-uri disponibile
const LOGO_PATHS = [
    "assets/logos/logo_1.png",
    "assets/logos/logo_2.png",
    "assets/logos/logo_3.png",
    "assets/logos/logo_4.png",
    "assets/logos/logo_5.png",
    "assets/logos/logo_6.png",
    "assets/logos/logo_7.png",
    "assets/logos/logo_8.png",
    "assets/logos/logo_9.png",
    "assets/logos/logo_10.png"
];

let selectedLogoPath = ''; // Variabila pentru a stoca logo-ul selectat

/**
 * Inițializează logica pentru ecranul de setup.
 */
export function setupGame() {
    console.log("setup.js: Se inițializează ecranul de setup.");

    const setupScreen = document.getElementById('setup-screen');
    const gameScreen = document.getElementById('game-screen');
    const coachNameInput = document.getElementById('coach-name');
    const clubNameInput = document.getElementById('club-name');
    const logoSelectionGrid = document.getElementById('logo-selection');
    const startGameBtn = document.getElementById('start-game-btn');

    if (!setupScreen || !gameScreen || !coachNameInput || !clubNameInput || !logoSelectionGrid || !startGameBtn) {
        console.error("setup.js: Unul sau mai multe elemente DOM necesare pentru setup lipsesc.");
        return;
    }

    // Generează grid-ul de selecție a logo-ului
    LOGO_PATHS.forEach(path => {
        const logoItem = document.createElement('div');
        logoItem.classList.add('logo-item');
        
        const img = document.createElement('img');
        img.src = path;
        img.alt = "Club Logo";
        logoItem.appendChild(img);

        logoItem.addEventListener('click', () => {
            // Elimină clasa 'selected' de la toate logo-urile
            document.querySelectorAll('.logo-item').forEach(item => {
                item.classList.remove('selected');
            });
            // Adaugă clasa 'selected' la logo-ul curent
            logoItem.classList.add('selected');
            selectedLogoPath = path;
            console.log("setup.js: Logo selectat:", selectedLogoPath);
        });
        logoSelectionGrid.appendChild(logoItem);
    });

    // Adaugă event listener pentru butonul de start
    startGameBtn.addEventListener('click', () => {
        const coachName = coachNameInput.value.trim();
        const clubName = clubNameInput.value.trim();

        // Validare
        if (!coachName) {
            alert("Te rog introdu numele antrenorului!");
            return;
        }
        if (!clubName) {
            alert("Te rog introdu numele clubului!");
            return;
        }
        if (!selectedLogoPath) {
            alert("Te rog alege o emblemă pentru club!");
            return;
        }

        console.log("setup.js: Date de setup valide. Se inițializează jocul.");
        
        // Inițializează starea jocului cu datele introduse de utilizator
        gameState.initGame(coachName, clubName, selectedLogoPath);

        // Trece la ecranul de joc
        setupScreen.classList.remove('active');
        setupScreen.classList.add('hidden');
        gameScreen.classList.remove('hidden');
        gameScreen.classList.add('active');

        // Inițializează UI-ul principal al jocului după ce setup-ul e gata
        // Apelăm funcția globală expusă de main.js
        if (window.startGameUI) {
            window.startGameUI();
        } else {
            console.error("setup.js: Functia window.startGameUI nu a fost definita.");
        }
    });
}
