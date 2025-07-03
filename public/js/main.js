// js/main.js
import { showTab } from './game-ui.js';
import { setupGame } from './setup.js';
import { gameState } from './game-state.js'; // Importă starea jocului
import { renderDashboard } from './dashboard-renderer.js';
import { renderRoster } from './roster-renderer.js';
import { renderTeamPage } from './team.js'; // Asumăm că team.js are o funcție de randare

document.addEventListener('DOMContentLoaded', () => {
    console.log("main.js: DOM-ul a fost încărcat.");

    // Găsim butoanele de navigare și containerul de conținut al jocului
    const menuLinks = document.querySelectorAll('.game-menu ul li a');
    const gameContent = document.getElementById('game-content');
    
    // Obiect de mapare pentru tab-uri: [nume tab]: { html: 'cale/fisier.html', initializer: functie_initializare, rootElementId: 'id_element_radacina_al_tabului' }
    const tabsConfig = {
        'dashboard': { html: 'dashboard.html', initializer: renderDashboard, rootElementId: 'dashboard-content' },
        'team': { html: 'team.html', initializer: renderTeamPage, rootElementId: 'team-page' },
        'roster': { html: 'roster-tab.html', initializer: renderRoster, rootElementId: 'roster-tab-content' },
        'training': { html: 'training.html', initializer: null, rootElementId: null }, // Under Construction
        'finance': { html: 'finance.html', initializer: null, rootElementId: null }, // Under Construction
        'matches': { html: 'matches.html', initializer: null, rootElementId: null }, // NOU: Meciuri
        'standings': { html: 'standings.html', initializer: null, rootElementId: null }, // NOU: Clasament
        'transfers': { html: 'transfers.html', initializer: null, rootElementId: null }, // Under Construction
        'settings': { html: 'settings.html', initializer: null, rootElementId: null } // Under Construction
    };

    // Inițializează handlerii pentru navigarea între tab-uri
    menuLinks.forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault();
            const tabName = event.target.dataset.tab;
            console.log(`main.js: Click pe tab-ul: ${tabName}`);
            
            const tabInfo = tabsConfig[tabName];
            if (tabInfo) {
                showTab(tabName, gameContent, tabInfo.html, tabInfo.initializer, tabInfo.rootElementId);
            } else {
                gameContent.innerHTML = `<p class="error-message">Tab-ul '${tabName}' nu este configurat.</p>`;
                console.error(`main.js: Eroare: Tab-ul '${tabName}' nu este configurat în tabsConfig.`);
            }
        });
    });

    // Inițializează logica ecranului de setup
    setupGame(); 
    
    // Afișează tab-ul "Dashboard" la pornirea jocului (după ce setup-ul este completat)
    // Această funcție va fi apelată din setup.js după ce jocul pornește
    window.startGameUI = () => {
        showTab('dashboard', gameContent, tabsConfig.dashboard.html, tabsConfig.dashboard.initializer, tabsConfig.dashboard.rootElementId);
    };

    // DEBUG: Pentru testare rapidă, decomentează linia de mai jos
    // Dacă vrei să sari peste ecranul de setup pentru a testa direct UI-ul jocului
    /*
    const setupScreen = document.getElementById('setup-screen');
    const gameScreen = document.getElementById('game-screen');
    setupScreen.classList.remove('active');
    setupScreen.classList.add('hidden');
    gameScreen.classList.remove('hidden');
    gameScreen.classList.add('active');

    // Inițializează game state cu date de test pentru a afișa header-ul
    gameState.initGame("Test Coach", "Test Club", "assets/logos/logo_1.png"); // Exemplu logo
    // Asigură-te că aceste elemente există în HTML-ul tău pentru a fi actualizate
    document.getElementById('header-coach-name').textContent = gameState.coachName;
    document.getElementById('header-club-name').textContent = gameState.clubName;
    document.getElementById('header-club-logo').src = gameState.clubLogo;
    document.getElementById('header-budget').textContent = `Buget: $${gameState.currentBudget.toLocaleString()}`;
    document.getElementById('header-current-date').textContent = `Ziua ${gameState.currentDay}, Sezonul ${gameState.currentSeason}`;


    window.startGameUI(); // Apelăm funcția de inițializare a UI-ului de joc
    */
});
