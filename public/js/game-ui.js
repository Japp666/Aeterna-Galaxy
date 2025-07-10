// public/js/game-ui.js - Logica generală a interfeței utilizatorului jocului
import { getGameState } from './game-state.js';
import { initializeSetupScreen } from './setup.js';
import { loadTeamTabContent, initTeamTab } from './team.js';
import { loadComponent } from './utils.js';
import { initializeRoster } from './roster-renderer.js';
import { initializeDashboard } from './dashboard-renderer.js';

export async function initializeGameUI() {
    console.log("game-ui.js: Inițializare UI joc...");
    const appRootElement = document.getElementById('app');
    const setupScreen = document.getElementById('setup-screen');
    const gameScreen = document.getElementById('game-screen');

    if (!appRootElement || !setupScreen || !gameScreen) {
        console.error("game-ui.js: Elementele DOM esențiale (#app, #setup-screen, #game-screen) nu au fost găsite.");
        appRootElement.innerHTML = `<p class="error-message">Eroare critică: Elementele DOM esențiale nu au fost găsite. Vă rugăm să reîncărcați pagina.</p>`;
        return;
    }

    const gameState = getGameState();
    if (!gameState.isGameStarted) {
        // Afișează ecranul de setup și ascunde ecranul de joc
        setupScreen.classList.remove('hidden');
        gameScreen.classList.add('hidden');
        await initializeSetupScreen(appRootElement);
    } else {
        // Afișează ecranul de joc și ascunde ecranul de setup
        setupScreen.classList.add('hidden');
        gameScreen.classList.remove('hidden');
        gameScreen.style.display = 'block'; // Forțează afișarea
        await initializeGameScreen();
    }

    // Adaugă listener pentru evenimentul gameStarted
    window.addEventListener('gameStarted', async () => {
        console.log("game-ui.js: Eveniment gameStarted primit. Reinițializare UI...");
        setupScreen.classList.add('hidden');
        gameScreen.classList.remove('hidden');
        gameScreen.style.display = 'block';
        await initializeGameScreen();
    });
}

async function initializeGameScreen() {
    console.log("game-ui.js: Inițializare ecran joc...");
    const gameContent = document.getElementById('game-content');
    if (!gameContent) {
        console.error("game-ui.js: Elementul #game-content nu a fost găsit.");
        return;
    }

    // Inițializează header-ul
    updateHeader();

    // Adaugă listeneri pentru tab-urile din meniu
    const menuLinks = document.querySelectorAll('#main-menu a');
    menuLinks.forEach(link => {
        link.addEventListener('click', async (event) => {
            event.preventDefault();
            const tabId = link.dataset.tab + '-tab';
            await switchTab(tabId);
            menuLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
        });
    });

    // Inițializează tab-ul implicit (dashboard)
    await switchTab('dashboard-tab');
}

function updateHeader() {
    const gameState = getGameState();
    const clubEmblem = document.getElementById('header-club-emblem');
    const clubName = document.getElementById('dashboard-club-name');
    const coachNickname = document.getElementById('dashboard-coach-nickname');
    const clubFunds = document.getElementById('dashboard-club-funds');
    const currentDay = document.getElementById('dashboard-current-day');
    const currentSeason = document.getElementById('dashboard-current-season');

    if (clubEmblem) clubEmblem.src = gameState.clubEmblem || '';
    if (clubName) clubName.textContent = gameState.clubName || 'Nume Club';
    if (coachNickname) coachNickname.textContent = gameState.coachNickname || 'Nume Antrenor';
    if (clubFunds) clubFunds.textContent = `${(gameState.clubFunds || 0).toLocaleString('ro-RO')} €`;
    if (currentDay) currentDay.textContent = `Ziua ${gameState.currentDay || 1}`;
    if (currentSeason) currentSeason.textContent = `Sezon ${gameState.currentSeason || 1}`;
}

async function switchTab(tabId) {
    console.log(`game-ui.js: Comutare la tab-ul ${tabId}`);
    const tabContent = document.getElementById(tabId);
    if (!tabContent) {
        console.error(`game-ui.js: Tab-ul ${tabId} nu a fost găsit.`);
        return;
    }

    // Ascunde toate tab-urile
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
        tab.classList.add('hidden');
    });

    // Afișează tab-ul selectat
    tabContent.classList.remove('hidden');
    tabContent.classList.add('active');

    // Încarcă conținutul specific tab-ului
    if (tabId === 'dashboard-tab') {
        const dashboardContent = await loadComponent('components/dashboard.html');
        tabContent.innerHTML = dashboardContent;
        initializeDashboard(tabContent);
    } else if (tabId === 'team-tab') {
        const teamContent = await loadTeamTabContent();
        tabContent.innerHTML = teamContent;
        await initTeamTab(tabContent);
    } else if (tabId === 'roster-tab') {
        const rosterContent = await loadComponent('components/roster-tab.html');
        tabContent.innerHTML = rosterContent;
        initializeRoster(tabContent);
    } else {
        // Pentru alte tab-uri, încarcă conținutul HTML corespunzător
        const componentName = tabId.replace('-tab', '');
        const componentContent = await loadComponent(`components/${componentName}.html`);
        tabContent.innerHTML = componentContent;
    }
}
