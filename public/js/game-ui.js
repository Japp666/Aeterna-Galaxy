// js/game-ui.js - Gestionarea interfeței utilizator a jocului (meniu, tab-uri)

import { loadComponent } from './utils.js';
import { initializeGameState } from './game-state.js';
// Importăm initSetupScreen direct aici pentru a o putea apela la resetare
import { initSetupScreen } from './setup.js'; // NOU: Importăm initSetupScreen

const gameContent = document.getElementById('game-content');
const mainMenu = document.querySelector('.main-menu');
const gameContainer = document.getElementById('game-container');
const setupScreen = document.getElementById('setup-screen');
const resetGameBtn = document.getElementById('reset-game-btn');

// Definim structura meniului (nume afișat și fișier component HTML asociat)
const menuItems = [
    { id: 'dashboard', text: 'Dashboard', component: 'dashboard' },
    { id: 'team', text: 'Echipă', component: 'team' },
    { id: 'matches', text: 'Meciuri', component: 'matches' },
    { id: 'standings', text: 'Clasament', component: 'standings' },
    { id: 'transfers', text: 'Transferuri', component: 'transfers' },
    { id: 'training', text: 'Antrenament', component: 'training' },
    { id: 'finance', text: 'Finanțe', component: 'finance' },
    { id: 'offseason', text: 'Pauză Comp.', component: 'offseason' }
];

/**
 * Generează meniul principal de navigație.
 */
function renderMainMenu() {
    mainMenu.innerHTML = '';
    menuItems.forEach(item => {
        const button = document.createElement('button');
        button.id = `menu-btn-${item.id}`;
        button.classList.add('menu-btn');
        button.textContent = item.text;
        button.dataset.component = item.component;

        button.addEventListener('click', () => {
            displayTab(item.id);
        });
        mainMenu.appendChild(button);
    });
}

/**
 * Afișează conținutul unui anumit tab.
 * @param {string} tabId - ID-ul tab-ului de afișat (ex: 'dashboard', 'team').
 */
export async function displayTab(tabId) {
    document.querySelectorAll('.menu-btn').forEach(btn => {
        btn.classList.remove('active');
    });

    const activeButton = document.getElementById(`menu-btn-${tabId}`);
    if (activeButton) {
        activeButton.classList.add('active');
    }

    const selectedItem = menuItems.find(item => item.id === tabId);
    if (selectedItem && selectedItem.component) {
        const componentHtml = await loadComponent(selectedItem.component);
        gameContent.innerHTML = componentHtml;
        console.log(`Tab-ul "${selectedItem.text}" a fost încărcat.`);
    } else {
        gameContent.innerHTML = `<p>Conținut pentru ${tabId} nu este disponibil încă.</p>`;
        console.warn(`Componenta pentru tab-ul ${tabId} nu a fost găsită.`);
    }
}

/**
 * Inițializează UI-ul principal al jocului.
 * @param {Function} onGameStartCallback - Callback-ul apelat când jocul pornește (pentru a re-inițializa main.js).
 */
export function initGameUI(onGameStartCallback) { // MODIFICAT: primește un callback
    renderMainMenu();

    resetGameBtn.addEventListener('click', () => {
        // Confirmare (opțional, dar recomandat pentru resetare)
        if (!confirm('Ești sigur că vrei să resetezi jocul? Progresul va fi pierdut!')) {
            return; // Anulează resetarea dacă utilizatorul nu confirmă
        }

        localStorage.removeItem('fmStellarLeagueGameState'); // Șterge starea salvată
        // initializeGameState(); // Nu mai e nevoie aici, main.js o va face

        // Afișează ecranul de setup și ascunde containerul jocului
        gameContainer.style.display = 'none';
        setupScreen.style.display = 'flex'; // MODIFICAT: Asigură că setup-screen e flex

        // Re-inițializează logica ecranului de setup
        // Deoarece main.js controlează initSetupScreen, vom apela un refresh al paginii
        // sau vom trimite onGameStartCallback direct către setup.
        // Cea mai simplă abordare pentru o resetare completă e un reload, dar vom încerca fără inițial
        // Alternativa e să pasăm onGameStartCallback către initSetupScreen
        
        // Dacă facem reload, nu mai e nevoie de onGameStartCallback aici
        // window.location.reload(); 
        
        // Pentru o tranziție mai fluidă, fără reload:
        // Re-inițializăm setup-ul cu callback-ul original
        // Trebuie să facem main.js să gestioneze mai bine re-inițializarea
        
        // Momentan, cea mai simplă soluție este să re-inițializăm ecranul de setup cu un callback gol,
        // iar main.js să se ocupe de logica `onGameStarted` în funcție de `gameState.isGameStarted`.
        // Așadar, vom trimite `onGameStartCallback` de la `main.js` la `initSetupScreen`.
        
        // În loc să apelăm `initializeGameState()` aici, care ar reseta și în memorie,
        // vom lăsa `main.js` să facă o reinițializare completă a aplicației.
        // Cel mai simplu mod este să reîmprospătăm pagina.
        window.location.reload();
    });
}
