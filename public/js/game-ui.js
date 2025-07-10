// public/js/game-ui.js
import { initializeSetupScreen } from './setup.js';
import { initTeamTab } from './team.js';
import { initializeDashboard } from './dashboard-renderer.js';
import { getGameState } from './game-state.js';

export async function initializeGameUI() {
    console.log("game-ui.js: Inițializare UI joc...");
    const appRootElement = document.getElementById('app');
    if (!appRootElement) {
        console.error("game-ui.js: Elementul #app nu a fost găsit în DOM.");
        document.body.innerHTML = `<p class="error-message">Eroare critică: Elementul #app nu a fost găsit. Vă rugăm să reîncărcați pagina.</p>`;
        return;
    }

    const gameState = getGameState();
    if (!gameState.isGameStarted) {
        console.log("game-ui.js: Nu există stare de joc salvată. Se afișează ecranul de setup.");
        await initializeSetupScreen(appRootElement);
        return;
    }

    // Ascunde ecranul de setup și afișează ecranul de joc
    const setupScreen = appRootElement.querySelector('#setup-screen');
    const gameScreen = appRootElement.querySelector('#game-screen');
    if (setupScreen && gameScreen) {
        setupScreen.classList.add('hidden');
        gameScreen.classList.remove('hidden');
    } else {
        console.error("game-ui.js: Ecranul de setup sau joc nu a fost găsit.");
        appRootElement.innerHTML = `<p class="error-message">Eroare critică: Ecranul de setup sau joc nu a fost găsit. Vă rugăm să reîncărcați pagina.</p>`;
        return;
    }

    // Actualizează informațiile din header
    const headerClubEmblem = document.getElementById('header-club-emblem');
    const dashboardClubName = document.getElementById('dashboard-club-name');
    const dashboardClubFunds = document.getElementById('dashboard-club-funds');
    const dashboardCurrentDay = document.getElementById('dashboard-current-day');
    const dashboardCurrentSeason = document.getElementById('dashboard-current-season');
    const dashboardCoachNickname = document.getElementById('dashboard-coach-nickname');

    if (headerClubEmblem) headerClubEmblem.src = gameState.clubEmblem || '';
    if (dashboardClubName) dashboardClubName.textContent = gameState.clubName || 'Nume Club';
    if (dashboardClubFunds) dashboardClubFunds.textContent = `${(gameState.clubFunds || 0).toLocaleString('ro-RO')} €`;
    if (dashboardCurrentDay) dashboardCurrentDay.textContent = `Ziua ${gameState.currentDay || 1}`;
    if (dashboardCurrentSeason) dashboardCurrentSeason.textContent = `Sezonul ${gameState.currentSeason || 1}`;
    if (dashboardCoachNickname) dashboardCoachNickname.textContent = gameState.coachNickname || 'Nume Antrenor';

    // Inițializează tab-ul dashboard implicit
    await initializeDashboard(document.getElementById('dashboard-tab'));

    // Adaugă listeneri pentru tab-uri
    const mainMenu = document.getElementById('main-menu');
    if (mainMenu) {
        mainMenu.addEventListener('click', async (event) => {
            event.preventDefault();
            const targetTab = event.target.dataset.tab;
            if (!targetTab) return;

            const tabs = document.querySelectorAll('.tab-content');
            tabs.forEach(tab => tab.classList.add('hidden'));
            const activeTab = document.getElementById(`${targetTab}-tab`);
            if (activeTab) activeTab.classList.remove('hidden');

            const menuItems = mainMenu.querySelectorAll('a');
            menuItems.forEach(item => item.classList.remove('active'));
            event.target.classList.add('active');

            if (targetTab === 'team') {
                await initTeamTab(document.getElementById('team-tab'));
            } else if (targetTab === 'dashboard') {
                await initializeDashboard(document.getElementById('dashboard-tab'));
            }
            // Adaugă alte tab-uri aici când vor fi implementate
        });
    }
}
