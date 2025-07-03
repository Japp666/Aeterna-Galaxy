// js/main.js
import { showTab } from './game-ui.js';
import { setupGame } from './setup.js';
import { gameState } from './game-state.js'; 
import { renderDashboard } from './dashboard-renderer.js';
import { renderRoster } from './roster-renderer.js';
import { renderTeamPage } from './team.js';

document.addEventListener('DOMContentLoaded', () => {
    console.log("main.js: DOM-ul a fost încărcat.");

    const menuLinks = document.querySelectorAll('.game-menu ul li a');
    const gameContent = document.getElementById('game-content');
    
    const tabsConfig = {
        'dashboard': { html: 'dashboard.html', initializer: renderDashboard, rootElementId: 'dashboard-content' },
        'team': { html: 'team.html', initializer: renderTeamPage, rootElementId: 'team-page' },
        'roster': { html: 'roster-tab.html', initializer: renderRoster, rootElementId: 'roster-tab-content' },
        'training': { html: 'training.html', initializer: null, rootElementId: null },
        'finance': { html: 'finance.html', initializer: null, rootElementId: null },
        'matches': { html: 'matches.html', initializer: null, rootElementId: null }, // NOU: Meciuri
        'standings': { html: 'standings.html', initializer: null, rootElementId: null }, // NOU: Clasament
        'transfers': { html: 'transfers.html', initializer: null, rootElementId: null },
        'settings': { html: 'settings.html', initializer: null, rootElementId: null }
    };

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

    setupGame(); 
    
    // Funcție globală apelată de setup.js după ce jocul pornește
    window.startGameUI = () => {
        // Actualizează elementele din header cu starea inițială a jocului
        document.getElementById('header-coach-name').textContent = gameState.coachName;
        document.getElementById('header-club-name').textContent = gameState.clubName;
        document.getElementById('header-club-logo').src = gameState.clubLogo;
        document.getElementById('header-budget').textContent = `Buget: $${gameState.currentBudget.toLocaleString()}`;
        document.getElementById('header-current-date').textContent = `Ziua ${gameState.currentDay}, Sezonul ${gameState.currentSeason}`;
        
        showTab('dashboard', gameContent, tabsConfig.dashboard.html, tabsConfig.dashboard.initializer, tabsConfig.dashboard.rootElementId);
    };
});
